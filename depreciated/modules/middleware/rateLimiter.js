import rateLimit from 'express-rate-limit';
import { RateLimitError } from '../errors/index.js';
import { Logger } from '../../logger.js';

export function createRateLimiter(options = {}) {
    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
        max: options.max || 100,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res, next) => {
            const error = new RateLimitError('Too many requests', {
                retryAfter: res.getHeader('Retry-After'),
                limit: res.getHeader('X-RateLimit-Limit'),
                remaining: res.getHeader('X-RateLimit-Remaining')
            });

            Logger.warn('Rate limit exceeded:', {
                ip: req.ip,
                path: req.path,
                requestId: req.id
            });

            next(error);
        },
        skip: (req) => {
            // Skip rate limiting for health checks
            return req.path === '/health';
        }
    });
} 