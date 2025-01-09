import { BaseError, ValidationError, APIError } from '../errors/index.js';
import { Logger } from '../../logger.js';

export function errorHandler(err, req, res, next) {
    // Log error with request context
    Logger.error('Request error:', {
        error: err,
        requestId: req.id,
        path: req.path,
        method: req.method
    });

    // Handle known errors
    if (err instanceof BaseError) {
        return res.status(err.status).json({
            error: err.toJSON(),
            requestId: req.id
        });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: {
                name: 'ValidationError',
                message: err.message,
                details: err.details
            },
            requestId: req.id
        });
    }

    // Handle unknown errors
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(500).json({
        error: {
            name: 'InternalServerError',
            message: isProduction ? 'An unexpected error occurred' : err.message,
            requestId: req.id
        }
    });
} 