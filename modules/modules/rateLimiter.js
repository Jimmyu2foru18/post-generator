export class RateLimiter {
    constructor(config) {
        this.limits = {
            ...defaultLimits,
            ...config
        };
        this.requestCounts = new Map();
        this.timeWindows = new Map();
        this.burstAllowance = new Map(); // Track burst allowances
        this.lastResetTime = new Map(); // Track last reset times
    }

    async checkLimit(apiName, options = {}) {
        const limit = this.limits[apiName] || this.limits.default;
        const now = Date.now();
        const windowKey = `${apiName}-${Math.floor(now / limit.windowMs)}`;
        
        // Initialize or get current window count
        let count = this.requestCounts.get(windowKey) || 0;
        
        // Track window timestamp
        if (!this.timeWindows.has(windowKey)) {
            this.timeWindows.set(windowKey, now);
        }

        // Check for burst allowance
        const burstKey = `${apiName}-burst`;
        const burstAllowed = this.burstAllowance.get(burstKey) || 0;
        const effectiveLimit = limit.maxRequests + burstAllowed;
        
        if (count >= effectiveLimit) {
            const timeToWait = this.calculateTimeToWait(apiName);
            if (options.throwOnLimit !== false) {
                throw new RateLimitError(
                    apiName, 
                    timeToWait,
                    this.getDetailedLimitInfo(apiName)
                );
            }
            return false;
        }

        // Update count
        this.requestCounts.set(windowKey, count + 1);
        
        // Cleanup old windows
        this.cleanup();
        
        return true;
    }

    calculateTimeToWait(apiName) {
        const limit = this.limits[apiName] || this.limits.default;
        const now = Date.now();
        const windowStart = Math.floor(now / limit.windowMs) * limit.windowMs;
        return (windowStart + limit.windowMs) - now;
    }

    cleanup() {
        const now = Date.now();
        const cleanupAge = 24 * 60 * 60 * 1000; // 24 hours

        for (const [key, timestamp] of this.timeWindows.entries()) {
            if (now - timestamp > cleanupAge) {
                this.timeWindows.delete(key);
                this.requestCounts.delete(key);
            }
        }

        // Cleanup burst allowances older than 1 hour
        for (const [key, timestamp] of this.lastResetTime.entries()) {
            if (now - timestamp > 60 * 60 * 1000) {
                this.burstAllowance.delete(key);
                this.lastResetTime.delete(key);
            }
        }
    }

    getCurrentUsage(apiName) {
        const now = Date.now();
        const limit = this.limits[apiName] || this.limits.default;
        const windowKey = `${apiName}-${Math.floor(now / limit.windowMs)}`;
        const burstKey = `${apiName}-burst`;
        const currentCount = this.requestCounts.get(windowKey) || 0;
        const burstAllowed = this.burstAllowance.get(burstKey) || 0;

        return {
            currentCount,
            limit: limit.maxRequests,
            windowMs: limit.windowMs,
            remaining: (limit.maxRequests + burstAllowed) - currentCount,
            burstAllowance: burstAllowed,
            windowStart: this.timeWindows.get(windowKey),
            windowEnd: this.timeWindows.get(windowKey) + limit.windowMs,
            isLimited: currentCount >= (limit.maxRequests + burstAllowed)
        };
    }

    resetLimits(apiName) {
        const now = Date.now();
        for (const [key] of this.requestCounts.entries()) {
            if (key.startsWith(apiName + '-')) {
                this.requestCounts.delete(key);
                this.timeWindows.delete(key);
            }
        }
        this.lastResetTime.set(apiName, now);
    }

    // New methods for enhanced functionality
    
    addBurstAllowance(apiName, amount) {
        const burstKey = `${apiName}-burst`;
        const currentBurst = this.burstAllowance.get(burstKey) || 0;
        this.burstAllowance.set(burstKey, currentBurst + amount);
        this.lastResetTime.set(burstKey, Date.now());
    }

    getDetailedLimitInfo(apiName) {
        const usage = this.getCurrentUsage(apiName);
        const limit = this.limits[apiName] || this.limits.default;
        return {
            ...usage,
            resetIn: this.calculateTimeToWait(apiName),
            limitPeriod: this.formatTimeWindow(limit.windowMs),
            nextReset: new Date(usage.windowEnd).toISOString()
        };
    }

    formatTimeWindow(ms) {
        if (ms >= 86400000) return `${ms / 86400000} days`;
        if (ms >= 3600000) return `${ms / 3600000} hours`;
        if (ms >= 60000) return `${ms / 60000} minutes`;
        return `${ms / 1000} seconds`;
    }
}

const defaultLimits = {
    default: { maxRequests: 60, windowMs: 60000 }, // 60 requests per minute
    'newsapi': { maxRequests: 100, windowMs: 86400000 }, // 100 requests per day
    'gnews': { maxRequests: 100, windowMs: 86400000 }, // 100 requests per day
    'wikipedia': { maxRequests: 200, windowMs: 60000 }, // 200 requests per minute
    'arxiv': { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
    'semanticScholar': { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
    'crossref': { maxRequests: 50, windowMs: 60000 }, // 50 requests per minute
    'worldBank': { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
    'openai': { maxRequests: 3500, windowMs: 60000 }, // 3500 requests per minute
    'googleSearch': { maxRequests: 100, windowMs: 86400000 } // 100 requests per day
};

export class RateLimitError extends Error {
    constructor(apiName, timeToWait, details = null) {
        const formattedWait = timeToWait > 1000 ? 
            `${Math.ceil(timeToWait / 1000)} seconds` : 
            `${timeToWait}ms`;
            
        super(`Rate limit exceeded for ${apiName}. Try again in ${formattedWait}`);
        this.name = 'RateLimitError';
        this.apiName = apiName;
        this.timeToWait = timeToWait;
        this.details = details;
        this.timestamp = Date.now();
    }

    getRetryAfter() {
        return Math.ceil(this.timeToWait / 1000);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            apiName: this.apiName,
            timeToWait: this.timeToWait,
            retryAfter: this.getRetryAfter(),
            details: this.details,
            timestamp: this.timestamp
        };
    }
}

export { defaultLimits }; 