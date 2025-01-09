import Joi from 'joi';
import { ValidationError } from '../errors/index.js';

const schemas = {
    generatePost: Joi.object({
        topic: Joi.string().min(3).max(200).required(),
        options: Joi.object({
            tone: Joi.string().valid('formal', 'casual', 'professional', 'friendly'),
            length: Joi.number().min(100).max(5000),
            userContext: Joi.string()
        })
    }),
    // Add more schemas as needed
};

export function validateRequest(schemaName) {
    return async (req, res, next) => {
        try {
            const schema = schemas[schemaName];
            if (!schema) {
                throw new Error(`Schema ${schemaName} not found`);
            }

            const validated = await schema.validateAsync(req.body, {
                abortEarly: false,
                stripUnknown: true
            });

            req.validatedData = validated;
            next();
        } catch (error) {
            if (error.isJoi) {
                next(new ValidationError('Invalid request data', {
                    details: error.details
                }));
            } else {
                next(error);
            }
        }
    };
} 