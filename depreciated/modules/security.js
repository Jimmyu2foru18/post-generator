import Redis from 'ioredis';

export class SecurityManager {
    constructor() {
        this.requestLog = new Map();
        this.blacklist = new Set();
        this.limits = {
            maxRequestsPerMinute: 10,
            maxTopicLength: 200,
            maxContextLength: 500,
            minTopicLength: 3,
            maxFailedAttempts: 5,
            lockoutDuration: 3600000, // 1 hour in milliseconds
            bannedWords: new Set(['hack', 'exploit', 'crack', 'spam']),
            suspiciousPatterns: [
                /[<>{}]/g,                 // HTML/Script injection
                /(\w)\1{4,}/g,            // Character repetition
                /(https?:\/\/)/gi,        // URLs
                /[^\x20-\x7E\s]/g,        // Non-printable characters
                /(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})/g,  // Credit card patterns
                /(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)/gi, // SQL keywords
                /(\b\d{9}\b|\b\d{3}-\d{2}-\d{4}\b)/g,  // SSN patterns
                /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g // Email patterns
            ]
        };

        // New properties
        this.failedAttempts = new Map();
        this.lockoutTimes = new Map();
        this.ipGeolocation = new Map();
        this.suspiciousIPs = new Set();

        this.redis = new Redis(process.env.REDIS_URL);
        this.rateLimitPrefix = 'ratelimit:';
    }

    validateRequest(topic, context = '', ip = '') {
        // Check blacklist
        if (this.blacklist.has(ip)) {
            throw new Error('Access denied');
        }

        // Rate limiting
        if (this._isRateLimited(ip)) {
            throw new Error('Too many requests. Please try again later.');
        }

        // Input validation
        this._validateInput(topic, context);

        // Log request
        this._logRequest(ip);

        return true;
    }

    _isRateLimited(ip) {
        const now = Date.now();
        const userRequests = this.requestLog.get(ip) || [];
        
        // Clean old requests
        const recentRequests = userRequests.filter(
            time => now - time < 60000 // 1 minute
        );
        
        this.requestLog.set(ip, recentRequests);
        
        return recentRequests.length >= this.limits.maxRequestsPerMinute;
    }

    _validateInput(topic, context) {
        // Length checks
        if (topic.length > this.limits.maxTopicLength) {
            throw new Error('Topic is too long');
        }
        if (topic.length < this.limits.minTopicLength) {
            throw new Error('Topic is too short');
        }
        if (context.length > this.limits.maxContextLength) {
            throw new Error('Context is too long');
        }

        // Content checks
        const combinedText = `${topic} ${context}`.toLowerCase();
        
        // Check for banned words
        for (const word of this.limits.bannedWords) {
            if (combinedText.includes(word)) {
                throw new Error('Invalid content detected');
            }
        }

        // Check for suspicious patterns
        for (const pattern of this.limits.suspiciousPatterns) {
            if (pattern.test(combinedText)) {
                throw new Error('Invalid content pattern detected');
            }
        }
    }

    _logRequest(ip) {
        const userRequests = this.requestLog.get(ip) || [];
        userRequests.push(Date.now());
        this.requestLog.set(ip, userRequests);
    }

    addToBlacklist(ip) {
        this.blacklist.add(ip);
    }

    removeFromBlacklist(ip) {
        this.blacklist.delete(ip);
    }

    isBlacklisted(ip) {
        return this.blacklist.has(ip);
    }

    updateLimits(newLimits) {
        this.limits = {
            ...this.limits,
            ...newLimits
        };
    }

    addBannedWord(word) {
        this.limits.bannedWords.add(word.toLowerCase());
    }

    removeBannedWord(word) {
        this.limits.bannedWords.delete(word.toLowerCase());
    }

    addSuspiciousPattern(pattern) {
        if (pattern instanceof RegExp) {
            this.limits.suspiciousPatterns.push(pattern);
        } else {
            throw new Error('Pattern must be a RegExp instance');
        }
    }

    cleanupRequestLog(maxAge = 3600000) { // Default 1 hour
        const now = Date.now();
        for (const [ip, requests] of this.requestLog.entries()) {
            const validRequests = requests.filter(time => now - time < maxAge);
            if (validRequests.length === 0) {
                this.requestLog.delete(ip);
            } else {
                this.requestLog.set(ip, validRequests);
            }
        }
    }

    getRequestStats(ip) {
        const requests = this.requestLog.get(ip) || [];
        const now = Date.now();
        const recentRequests = requests.filter(time => now - time < 60000);
        
        return {
            totalRequests: requests.length,
            recentRequests: recentRequests.length,
            remainingRequests: Math.max(0, this.limits.maxRequestsPerMinute - recentRequests.length),
            isRateLimited: this._isRateLimited(ip),
            isBlacklisted: this.blacklist.has(ip)
        };
    }

    async validateRequestEnhanced(topic, context = '', ip = '', userAgent = '') {
        // Check for lockout
        if (this._isLockedOut(ip)) {
            throw new Error('Account is temporarily locked. Please try again later.');
        }

        try {
            // Perform basic validation
            await this.validateRequest(topic, context, ip);
            
            // Additional checks
            this._validateUserAgent(userAgent);
            await this._checkIPReputation(ip);
            
            // Reset failed attempts on successful validation
            this.failedAttempts.delete(ip);
            
            return true;
        } catch (error) {
            this._handleFailedAttempt(ip);
            throw error;
        }
    }

    _handleFailedAttempt(ip) {
        const attempts = (this.failedAttempts.get(ip) || 0) + 1;
        this.failedAttempts.set(ip, attempts);

        if (attempts >= this.limits.maxFailedAttempts) {
            this._lockoutIP(ip);
        }
    }

    _lockoutIP(ip) {
        this.lockoutTimes.set(ip, Date.now());
        this.suspiciousIPs.add(ip);
    }

    _isLockedOut(ip) {
        const lockoutTime = this.lockoutTimes.get(ip);
        if (!lockoutTime) return false;

        const timePassed = Date.now() - lockoutTime;
        if (timePassed >= this.limits.lockoutDuration) {
            this.lockoutTimes.delete(ip);
            return false;
        }
        return true;
    }

    _validateUserAgent(userAgent) {
        if (!userAgent) {
            throw new Error('User agent is required');
        }

        const suspiciousUserAgents = [
            /bot/i,
            /crawler/i,
            /spider/i,
            /curl/i,
            /postman/i
        ];

        for (const pattern of suspiciousUserAgents) {
            if (pattern.test(userAgent)) {
                throw new Error('Suspicious user agent detected');
            }
        }
    }

    async _checkIPReputation(ip) {
        // This would typically integrate with an IP reputation service
        // For now, we'll just check our internal lists
        if (this.suspiciousIPs.has(ip)) {
            throw new Error('IP has suspicious activity history');
        }
    }

    setIPGeolocation(ip, data) {
        this.ipGeolocation.set(ip, {
            country: data.country,
            city: data.city,
            timestamp: Date.now()
        });
    }

    getSecurityReport() {
        return {
            totalBlacklisted: this.blacklist.size,
            totalSuspiciousIPs: this.suspiciousIPs.size,
            currentlyLockedOut: Array.from(this.lockoutTimes.keys()),
            bannedWordsCount: this.limits.bannedWords.size,
            suspiciousPatternsCount: this.limits.suspiciousPatterns.length,
            activeRequestLogs: this.requestLog.size
        };
    }

    exportSecurityLogs() {
        return {
            blacklist: Array.from(this.blacklist),
            suspiciousIPs: Array.from(this.suspiciousIPs),
            lockouts: Object.fromEntries(this.lockoutTimes),
            failedAttempts: Object.fromEntries(this.failedAttempts),
            geolocation: Object.fromEntries(this.ipGeolocation)
        };
    }

    // Add method to clear old data
    cleanup() {
        const now = Date.now();
        
        // Clean up lockouts
        for (const [ip, time] of this.lockoutTimes.entries()) {
            if (now - time >= this.limits.lockoutDuration) {
                this.lockoutTimes.delete(ip);
            }
        }

        // Clean up failed attempts
        for (const [ip, attempts] of this.failedAttempts.entries()) {
            if (!this._isLockedOut(ip)) {
                this.failedAttempts.delete(ip);
            }
        }

        // Clean up request logs
        this.cleanupRequestLog();

        // Clean up old geolocation data (older than 24 hours)
        for (const [ip, data] of this.ipGeolocation.entries()) {
            if (now - data.timestamp > 86400000) {
                this.ipGeolocation.delete(ip);
            }
        }
    }

    async checkRateLimit(ip) {
        const key = `${this.rateLimitPrefix}${ip}`;
        const now = Date.now();
        const windowSize = 60000; // 1 minute

        try {
            const multi = this.redis.multi();
            multi.zremrangebyscore(key, 0, now - windowSize);
            multi.zadd(key, now, now.toString());
            multi.zcard(key);
            multi.expire(key, 60);

            const results = await multi.exec();
            const requestCount = results[2][1];

            if (requestCount > this.limits.maxRequestsPerMinute) {
                throw new Error('Rate limit exceeded');
            }

            return true;
        } catch (error) {
            Logger.error('Rate limit check failed:', error);
            throw error;
        }
    }
} 