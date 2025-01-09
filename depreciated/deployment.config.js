export const deploymentConfig = {
    environment: process.env.NODE_ENV || 'development',
    api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
        key: process.env.API_KEY || 'development-key'
    },
    features: {
        useMockApi: process.env.USE_MOCK_API === 'true' || true,
        enableLogging: true,
        enableMetrics: true
    }
}; 