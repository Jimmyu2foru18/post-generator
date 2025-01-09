export const config = {
    version: '1.0.0',
    validation: {
        minConfidence: 0.7,
        maxRetries: 2,
        timeout: 10000
    },
    features: {
        enableSentimentAnalysis: true,
        enableEntityRecognition: true,
        enableAbusePrevention: true
    },
    api: {
        baseUrl: process.env.API_BASE_URL,
        timeout: 30000,
        retryAttempts: 3,
        retryDelay: 1000
    },
    security: {
        rateLimiting: {
            enabled: process.env.ENABLE_RATE_LIMITING === 'true',
            maxRequests: parseInt(process.env.MAX_REQUESTS_PER_MINUTE, 10) || 100,
            windowMs: 60 * 1000
        },
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST']
        }
    },
    cache: {
        enabled: true,
        duration: parseInt(process.env.CACHE_DURATION, 10) || 3600,
        maxSize: 1000
    }
}; 