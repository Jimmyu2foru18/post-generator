export class ContentGenerator {
    constructor() {
        this.topics = {
            technology: ['AI', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'IoT'],
            business: ['Strategy', 'Innovation', 'Leadership', 'Marketing', 'Finance'],
            science: ['Research', 'Discovery', 'Analysis', 'Methodology', 'Data']
        };
        this.rateLimiter = new RateLimiter({
            maxRequests: 100,
            windowMs: 60000
        });
        this.retryConfig = {
            maxRetries: 3,
            baseDelay: 1000,
            maxDelay: 5000
        };
    }

    async generateContent(topic, context = '') {
        let attempts = 0;
        while (attempts < this.retryConfig.maxRetries) {
            try {
                await this.rateLimiter.checkLimit('content_generation');
                return await this._generateWithRetry(topic, context);
            } catch (error) {
                attempts++;
                if (attempts === this.retryConfig.maxRetries) {
                    throw error;
                }
                await this._wait(this._getRetryDelay(attempts));
            }
        }
    }

    _getRetryDelay(attempt) {
        return Math.min(
            this.retryConfig.baseDelay * Math.pow(2, attempt),
            this.retryConfig.maxDelay
        );
    }

    _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
} 