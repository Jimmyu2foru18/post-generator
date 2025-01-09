export class BaseError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = this.constructor.name;
        this.code = options.code || 'UNKNOWN_ERROR';
        this.status = options.status || 500;
        this.details = options.details || {};
        this.timestamp = Date.now();
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            status: this.status,
            details: this.details,
            timestamp: this.timestamp
        };
    }
}

export class ValidationError extends BaseError {
    constructor(message, details = {}) {
        super(message, {
            code: 'VALIDATION_ERROR',
            status: 400,
            details
        });
    }
}

export class APIError extends BaseError {
    constructor(message, details = {}) {
        super(message, {
            code: 'API_ERROR',
            status: 503,
            details
        });
    }
}

export class RateLimitError extends BaseError {
    constructor(message, details = {}) {
        super(message, {
            code: 'RATE_LIMIT_ERROR',
            status: 429,
            details
        });
    }
} 