import { RateLimiter } from './rateLimiter.js';
import { APIError } from './errors.js';

export class APIClient {
    constructor() {
        this.rateLimiter = new RateLimiter();
        this.cache = new Map();
        this.retryConfig = {
            maxRetries: 3,
            baseDelay: 1000,
            maxDelay: 10000
        };
    }

    async fetch(apiName, endpoint, options = {}) {
        try {
            const cacheKey = this.generateCacheKey(apiName, endpoint, options);
            
            // Check cache first
            const cachedResponse = await this.checkCache(cacheKey);
            if (cachedResponse) return cachedResponse;

            // Rate limit check
            await this.rateLimiter.checkLimit(apiName);
            
            const response = await this.makeRequest(apiName, endpoint, options);
            await this.cacheResponse(cacheKey, response);
            
            return response;
        } catch (error) {
            throw this.handleError(error, apiName, endpoint);
        }
    }

    handleError(error, apiName, endpoint) {
        if (error.name === 'RateLimitError') {
            return new APIError(`Rate limit exceeded for ${apiName}`, {
                code: 'RATE_LIMIT_ERROR',
                context: { apiName, endpoint },
                recoverable: true,
                retryAfter: error.timeToWait
            });
        }

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return new APIError('Network error', {
                code: 'NETWORK_ERROR',
                context: { apiName, endpoint },
                recoverable: true
            });
        }

        if (error instanceof APIError) {
            return error;
        }

        return new APIError('Unexpected API error', {
            code: 'UNEXPECTED_ERROR',
            context: { 
                apiName, 
                endpoint,
                originalError: error.message 
            },
            recoverable: false
        });
    }

    async makeRequest(apiName, endpoint, options, retryCount = 0) {
        try {
            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    ...options.headers,
                    'User-Agent': 'PostGenerator/1.0'
                }
            });

            if (!response.ok) {
                throw new APIError('HTTP request failed', {
                    code: 'HTTP_ERROR',
                    statusCode: response.status,
                    endpoint,
                    context: { 
                        status: response.status,
                        statusText: response.statusText
                    }
                });
            }

            return await response.json();
        } catch (error) {
            if (retryCount < this.retryConfig.maxRetries) {
                await this.delay(this.calculateRetryDelay(retryCount));
                return this.makeRequest(apiName, endpoint, options, retryCount + 1);
            }
            throw error;
        }
    }

    calculateRetryDelay(retryCount) {
        const delay = Math.min(
            this.retryConfig.baseDelay * Math.pow(2, retryCount),
            this.retryConfig.maxDelay
        );
        return delay + Math.random() * 1000; // Add jitter
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateCacheKey(apiName, endpoint, options) {
        return `${apiName}-${endpoint}-${JSON.stringify(options)}`;
    }

    async checkCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (this.isCacheExpired(cached)) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    isCacheExpired(cached) {
        const now = Date.now();
        const cacheDuration = 5 * 60 * 1000; // 5 minutes
        return (now - cached.timestamp) > cacheDuration;
    }

    cacheResponse(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
} 