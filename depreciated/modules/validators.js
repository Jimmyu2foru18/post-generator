import Joi from 'joi';

export class ThoughtValidator {
    constructor() {
        this.schemas = {
            thought: Joi.object({
                content: Joi.string().min(50).max(2000).required(),
                confidence: Joi.number().min(0).max(1).required(),
                metadata: Joi.object({
                    topic: Joi.string().required(),
                    timestamp: Joi.date().iso().required(),
                    version: Joi.string()
                }).required()
            }),
            options: Joi.object({
                maxLength: Joi.number().integer().min(50).max(5000),
                style: Joi.string().valid('formal', 'casual', 'technical'),
                format: Joi.string().valid('markdown', 'html', 'text')
            })
        };
    }

    validate(thought) {
        const validation = this.schemas.thought.validate(thought);
        if (validation.error) {
            return {
                valid: false,
                error: validation.error.details[0].message
            };
        }
        return { valid: true };
    }
}

export class PostValidator {
    constructor() {
        this.maxTitleLength = 300;
        this.maxContentLength = 5000;
        this.minContentLength = 100;
        this.requiredFields = ['title', 'content', 'author'];
    }

    validate(post) {
        if (!post || typeof post !== 'object') {
            return { valid: false, error: 'Invalid post format' };
        }

        // Check required fields
        for (const field of this.requiredFields) {
            if (!post[field]) {
                return { valid: false, error: `Missing required field: ${field}` };
            }
        }

        // Validate title
        if (post.title.length > this.maxTitleLength) {
            return { valid: false, error: 'Title exceeds maximum length' };
        }

        // Validate content
        if (post.content.length < this.minContentLength) {
            return { valid: false, error: 'Content too short' };
        }
        if (post.content.length > this.maxContentLength) {
            return { valid: false, error: 'Content exceeds maximum length' };
        }

        return { valid: true };
    }
}

export class TemplateValidator {
    constructor() {
        this.requiredFields = ['name', 'pattern', 'variables'];
        this.maxPatternLength = 5000;
    }

    validate(template) {
        if (!template || typeof template !== 'object') {
            return { valid: false, error: 'Invalid template format' };
        }

        // Check required fields
        for (const field of this.requiredFields) {
            if (!template[field]) {
                return { valid: false, error: `Missing required field: ${field}` };
            }
        }

        // Validate pattern
        if (typeof template.pattern !== 'string') {
            return { valid: false, error: 'Pattern must be a string' };
        }

        if (template.pattern.length > this.maxPatternLength) {
            return { valid: false, error: 'Pattern exceeds maximum length' };
        }

        // Validate variables
        if (!Array.isArray(template.variables)) {
            return { valid: false, error: 'Variables must be an array' };
        }

        return { valid: true };
    }
}

export class SecurityValidator {
    constructor() {
        this.forbiddenPatterns = [
            /<script>/i,
            /javascript:/i,
            /on\w+=/i,  // onclick=, onload=, etc.
            /data:text\/html/i
        ];
    }

    validate(content) {
        if (typeof content !== 'string') {
            return { valid: false, error: 'Content must be a string' };
        }

        // Check for potentially malicious patterns
        for (const pattern of this.forbiddenPatterns) {
            if (pattern.test(content)) {
                return { valid: false, error: 'Potentially unsafe content detected' };
            }
        }

        return { valid: true };
    }
}

export class RateLimitValidator {
    constructor(maxRequests = 100, timeWindowMs = 3600000) {
        this.maxRequests = maxRequests;
        this.timeWindowMs = timeWindowMs;
        this.requests = new Map(); // userId -> [{timestamp}]
    }

    validate(userId) {
        if (!userId) {
            return { valid: false, error: 'User ID required' };
        }

        const now = Date.now();
        const userRequests = this.requests.get(userId) || [];
        
        // Remove old requests outside the time window
        const recentRequests = userRequests.filter(
            req => now - req.timestamp < this.timeWindowMs
        );

        if (recentRequests.length >= this.maxRequests) {
            return { valid: false, error: 'Rate limit exceeded' };
        }

        // Update requests
        recentRequests.push({ timestamp: now });
        this.requests.set(userId, recentRequests);

        return { valid: true };
    }

    reset(userId) {
        this.requests.delete(userId);
    }
}

export class SentimentValidator {
    constructor() {
        this.validSentiments = ['positive', 'negative', 'neutral'];
        this.minScore = -1;
        this.maxScore = 1;
    }

    validate(sentimentData) {
        if (!sentimentData || typeof sentimentData !== 'object') {
            return { valid: false, error: 'Invalid sentiment data format' };
        }

        if (!sentimentData.sentiment || !this.validSentiments.includes(sentimentData.sentiment)) {
            return { valid: false, error: 'Invalid sentiment category' };
        }

        if (typeof sentimentData.score !== 'number' || 
            sentimentData.score < this.minScore || 
            sentimentData.score > this.maxScore) {
            return { valid: false, error: 'Invalid sentiment score' };
        }

        return { valid: true };
    }
}

export class SignatureValidator {
    constructor() {
        this.minLength = 10;
        this.maxLength = 200;
        this.requiredElements = ['authorName', 'timestamp', 'hash'];
    }

    validate(signature) {
        if (!signature || typeof signature !== 'object') {
            return { valid: false, error: 'Invalid signature format' };
        }

        // Check required elements
        for (const element of this.requiredElements) {
            if (!signature[element]) {
                return { valid: false, error: `Missing required element: ${element}` };
            }
        }

        // Validate signature length
        if (signature.hash.length < this.minLength || 
            signature.hash.length > this.maxLength) {
            return { valid: false, error: 'Invalid signature length' };
        }

        // Validate timestamp
        const timestamp = new Date(signature.timestamp).getTime();
        if (isNaN(timestamp)) {
            return { valid: false, error: 'Invalid timestamp' };
        }

        return { valid: true };
    }
}

export class PhraseValidator {
    constructor() {
        this.maxPhraseLength = 500;
        this.minPhraseLength = 3;
        this.maxKeywords = 10;
    }

    validate(phrase) {
        if (!phrase || typeof phrase !== 'object') {
            return { valid: false, error: 'Invalid phrase format' };
        }

        if (!phrase.text || typeof phrase.text !== 'string') {
            return { valid: false, error: 'Missing or invalid phrase text' };
        }

        if (phrase.text.length < this.minPhraseLength) {
            return { valid: false, error: 'Phrase too short' };
        }

        if (phrase.text.length > this.maxPhraseLength) {
            return { valid: false, error: 'Phrase too long' };
        }

        if (phrase.keywords && Array.isArray(phrase.keywords)) {
            if (phrase.keywords.length > this.maxKeywords) {
                return { valid: false, error: 'Too many keywords' };
            }

            for (const keyword of phrase.keywords) {
                if (typeof keyword !== 'string') {
                    return { valid: false, error: 'Invalid keyword format' };
                }
            }
        }

        return { valid: true };
    }
}

export class ReasoningValidator {
    constructor() {
        this.minSteps = 1;
        this.maxSteps = 10;
        this.requiredStepFields = ['description', 'confidence'];
    }

    validate(reasoning) {
        if (!reasoning || typeof reasoning !== 'object') {
            return { valid: false, error: 'Invalid reasoning format' };
        }

        if (!Array.isArray(reasoning.steps)) {
            return { valid: false, error: 'Steps must be an array' };
        }

        if (reasoning.steps.length < this.minSteps) {
            return { valid: false, error: 'Not enough reasoning steps' };
        }

        if (reasoning.steps.length > this.maxSteps) {
            return { valid: false, error: 'Too many reasoning steps' };
        }

        // Validate each step
        for (const step of reasoning.steps) {
            for (const field of this.requiredStepFields) {
                if (!step[field]) {
                    return { valid: false, error: `Missing ${field} in reasoning step` };
                }
            }

            if (typeof step.confidence !== 'number' || 
                step.confidence < 0 || 
                step.confidence > 1) {
                return { valid: false, error: 'Invalid confidence value in step' };
            }
        }

        return { valid: true };
    }
}

export class ValidationAggregator {
    constructor(validators = []) {
        this.validators = validators;
    }

    addValidator(validator) {
        this.validators.push(validator);
    }

    validateAll(data) {
        const results = [];
        
        for (const validator of this.validators) {
            const result = validator.validate(data);
            results.push(result);
            
            if (!result.valid) {
                return {
                    valid: false,
                    errors: results.filter(r => !r.valid).map(r => r.error)
                };
            }
        }

        return { valid: true };
    }
} 