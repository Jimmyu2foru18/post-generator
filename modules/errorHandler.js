export class ErrorHandler {
    static errorTypes = {
        VALIDATION: 'ValidationError',
        SECURITY: 'SecurityError',
        NOT_FOUND: 'NotFoundError',
        DATABASE: 'DatabaseError',
        RATE_LIMIT: 'RateLimitError',
        NETWORK: 'NetworkError',
        AUTHENTICATION: 'AuthenticationError',
        AUTHORIZATION: 'AuthorizationError'
    };

    static handle(error, context = {}) {
        console.error('Error occurred:', error, context);
        
        // Log additional context if available
        if (Object.keys(context).length > 0) {
            console.error('Error context:', context);
        }

        switch (error.name) {
            case this.errorTypes.VALIDATION:
                return {
                    status: 400,
                    message: error.message,
                    details: error.details
                };
            
            case this.errorTypes.SECURITY:
                return {
                    status: 403,
                    message: 'Access denied',
                    details: error.details
                };
            
            case this.errorTypes.NOT_FOUND:
                return {
                    status: 404,
                    message: error.message || 'Resource not found',
                    details: error.details
                };
            
            case this.errorTypes.DATABASE:
                return {
                    status: 503,
                    message: 'Database operation failed',
                    details: process.env.NODE_ENV === 'development' ? error.details : undefined
                };
            
            case this.errorTypes.RATE_LIMIT:
                return {
                    status: 429,
                    message: 'Too many requests',
                    details: error.details
                };
            
            case this.errorTypes.NETWORK:
                return {
                    status: 503,
                    message: 'Network error occurred',
                    details: process.env.NODE_ENV === 'development' ? error.details : undefined
                };
            
            case this.errorTypes.AUTHENTICATION:
                return {
                    status: 401,
                    message: 'Authentication required',
                    details: error.details
                };
            
            case this.errorTypes.AUTHORIZATION:
                return {
                    status: 403,
                    message: 'Unauthorized access',
                    details: error.details
                };
            
            default:
                return {
                    status: 500,
                    message: 'An unexpected error occurred',
                    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
                };
        }
    }

    static createError(type, message, details = {}) {
        const error = new Error(message);
        error.name = type;
        error.details = details;
        return error;
    }

    static isOperationalError(error) {
        return Object.values(this.errorTypes).includes(error.name);
    }

    static logError(error, context = {}) {
        const timestamp = new Date().toISOString();
        const errorLog = {
            timestamp,
            name: error.name,
            message: error.message,
            stack: error.stack,
            context
        };

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Detailed Error Log:', JSON.stringify(errorLog, null, 2));
        }

        // Here you could add additional logging logic
        // e.g., logging to a file or external service
        return errorLog;
    }
} 