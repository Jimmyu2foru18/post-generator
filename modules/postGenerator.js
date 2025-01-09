import { config } from '../config.js';
import { Logger } from '../logger.js';
import { ChainOfThought } from './chainOfThought.js';
import { SecurityManager } from './security.js';
import { ErrorHandler } from './errorHandler.js';
import { ContentOptimizer } from './contentOptimizer.js';
import { PostAnalyzer } from './postAnalyzer.js';
import { Cache } from './cache.js';
import { MetricsCollector } from './metrics.js';
import { Profiler } from './profiler.js';

/**
 * Generates AI-powered posts with validation, security checks, and formatting
 * @class PostGenerator
 */
export class PostGenerator {
    /**
     * Creates an instance of PostGenerator
     * @constructor
     */
    constructor(config = {}) {
        this.chain = new ChainOfThought(config);
        this.security = new SecurityManager();
        this.validator = new PostValidator();
        this.optimizer = new ContentOptimizer();
        this.analyzer = new PostAnalyzer();
        this.cache = new Cache('post-generator');
        this.retryAttempts = config.generation.maxRetries || 3;
        this.resources = new Set();
        this._setupCleanup();
        this.metrics = new MetricsCollector();
        this.profiler = new Profiler();
    }

    /**
     * Generates a post based on the given topic and options
     * @param {string} topic - The main topic for the post
     * @param {Object} options - Generation options
     * @param {string} [options.userContext] - User context for personalization
     * @param {string} [options.tone] - Desired tone of the post
     * @param {number} [options.length] - Desired length of the post
     * @returns {Promise<Object>} The generated post content
     * @throws {ValidationError} If input validation fails
     */
    async generatePost(topic, options = {}) {
        const profile = this.profiler.startProfile('generate_post');
        
        try {
            // Input validation
            this._validateInput(topic, options);
            profile.addEvent('input_validated');

            // Check cache
            const cachedResult = await this._checkCache(topic, options);
            if (cachedResult) {
                profile.addEvent('cache_hit');
                return cachedResult;
            }
            profile.addEvent('cache_miss');

            // Generate content
            const result = await this._generateWithRetries(topic, options);
            profile.addEvent('content_generated');

            // Cache result
            await this._cacheResult(topic, options, result);
            profile.addEvent('result_cached');

            return result;
        } catch (error) {
            this.metrics.trackError('generate_post', error);
            throw error;
        } finally {
            const profileResult = this.profiler.endProfile('generate_post');
            this.metrics.trackPerformance('generate_post', profileResult.duration);
        }
    }

    /**
     * Generates multiple post variations
     * @param {string} topic - The main topic
     * @param {number} variations - Number of variations to generate
     * @returns {Promise<Array<Object>>} Array of generated posts
     */
    async generateVariations(topic, variations = 3) {
        const posts = await Promise.all(
            Array(variations).fill().map(() => this.generatePost(topic))
        );
        return this.analyzer.rankPosts(posts);
    }

    /**
     * Regenerates specific sections of a post
     * @param {Object} post - Original post
     * @param {Array<string>} sections - Sections to regenerate
     */
    async regenerateSections(post, sections) {
        const thoughtProcess = await this.chain.regenerateSections(post, sections);
        return this._formatResponse(thoughtProcess, post.content.title.text);
    }

    _formatResponse(thoughtProcess, topic) {
        return {
            content: {
                title: {
                    text: thoughtProcess.title || `Insights on ${topic}`,
                    confidence: thoughtProcess.confidence
                },
                body: {
                    sections: thoughtProcess.insights.map(this._formatSection),
                    structure: thoughtProcess.structure,
                    metadata: {
                        readingTime: this._calculateReadingTime(thoughtProcess.insights)
                    }
                },
                summary: {
                    text: thoughtProcess.summary,
                    confidence: thoughtProcess.confidence
                },
                keywords: this._extractKeywords(thoughtProcess)
            },
            metadata: {
                timestamp: Date.now(),
                thoughtProcess: {
                    confidence: thoughtProcess.confidence,
                    metadata: thoughtProcess.metadata
                }
            },
            signature: this._generateSignature()
        };
    }

    _formatSection(insight) {
        return {
            content: insight.content,
            evidence: insight.evidence,
            confidence: insight.confidence
        };
    }

    _calculateReadingTime(insights) {
        const words = insights.reduce((count, insight) => {
            return count + insight.content.split(/\s+/).length;
        }, 0);
        return Math.ceil(words / 200); // Average reading speed
    }

    _extractKeywords(thoughtProcess) {
        const keywords = new Set();
        thoughtProcess.insights.forEach(insight => {
            insight.keywords?.forEach(keyword => keywords.add(keyword));
        });
        return Array.from(keywords).slice(0, 5);
    }

    _generateSignature() {
        return `Generated by AI Post Generator v${config.version}`;
    }

    /**
     * Sanitizes and prepares the topic for processing
     * @private
     */
    _prepareTopic(topic) {
        return topic.trim().toLowerCase();
    }

    /**
     * Enriches the post with additional metadata
     * @private
     */
    _enrichMetadata(response) {
        return {
            ...response,
            metadata: {
                ...response.metadata,
                generatedAt: new Date().toISOString(),
                version: config.version,
                language: 'en',
                contentType: 'blog-post'
            }
        };
    }

    /**
     * Validates the final post structure before returning
     * @private
     */
    _validateFinalStructure(post) {
        const requiredFields = ['content', 'metadata', 'signature'];
        for (const field of requiredFields) {
            if (!post[field]) {
                throw new ValidationError(`Missing required field: ${field}`);
            }
        }
        return post;
    }

    /**
     * Generates a cache key for the post
     * @private
     */
    _generateCacheKey(topic, options) {
        const optionsHash = this._hashOptions(options);
        return `post:${topic}:${optionsHash}`;
    }

    /**
     * Creates a hash of the options object
     * @private
     */
    _hashOptions(options) {
        return Object.entries(options)
            .sort()
            .map(([k, v]) => `${k}:${v}`)
            .join('|');
    }

    /**
     * Generates performance metrics for the post
     * @private
     */
    _generateMetrics(response) {
        return {
            generationTime: Date.now() - response.metadata.timestamp,
            contentScore: this.analyzer.calculateContentScore(response),
            readabilityScore: this.analyzer.calculateReadabilityScore(response),
            seoScore: this.analyzer.calculateSEOScore(response),
            uniquenessScore: this.analyzer.calculateUniquenessScore(response)
        };
    }

    /**
     * Utility method for waiting
     * @private
     */
    _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    _setupCleanup() {
        process.on('beforeExit', async () => {
            await this.cleanup();
        });
    }

    async cleanup() {
        try {
            // Cleanup resources
            for (const resource of this.resources) {
                await resource.cleanup();
            }
            this.resources.clear();

            // Clear caches
            await this.cache.clear();
            
            // Close connections
            await this.chain.cleanup();
            await this.analyzer.cleanup();
            
            Logger.info('PostGenerator cleanup completed');
        } catch (error) {
            Logger.error('Error during cleanup:', error);
        }
    }

    _trackResource(resource) {
        this.resources.add(resource);
    }

    _validateInput(topic, options) {
        if (!topic || typeof topic !== 'string') {
            throw new ValidationError('Invalid topic format');
        }

        if (topic.length < 3 || topic.length > 200) {
            throw new ValidationError('Topic length must be between 3 and 200 characters');
        }

        if (options.userContext && typeof options.userContext !== 'string') {
            throw new ValidationError('Invalid context format');
        }

        if (options.tone && !['formal', 'casual', 'professional', 'friendly'].includes(options.tone)) {
            throw new ValidationError('Invalid tone specified');
        }
        if (options.length && (typeof options.length !== 'number' || options.length < 100)) {
            throw new ValidationError('Invalid length specified');
        }
    }

    async _checkCache(topic, options) {
        const cacheKey = this._generateCacheKey(topic, options);
        return await this.cache.get(cacheKey);
    }

    async _cacheResult(topic, options, result) {
        const cacheKey = this._generateCacheKey(topic, options);
        await this.cache.set(cacheKey, result);
    }

    async _generateWithRetries(topic, options) {
        let lastError;
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const preparedTopic = this._prepareTopic(topic);
                
                // Validate input
                this.validator.validateInput(preparedTopic, options);
                
                // Security check
                this.security.validateRequest(preparedTopic, options.userContext);

                // Generate content
                const thoughtProcess = await this.chain.process(preparedTopic, options);
                
                // Validate output
                this.validator.validateOutput(thoughtProcess);

                // Format response
                const formattedResponse = this._formatResponse(thoughtProcess, preparedTopic);
                
                // Validate structure
                this.validator.validatePostStructure(formattedResponse);
                
                // Enrich with metadata
                const enrichedResponse = this._enrichMetadata(formattedResponse);
                
                // Add optimization step before final validation
                const optimizedResponse = await this.optimizer.optimize(enrichedResponse, options);
                
                // Add performance metrics
                const metrics = this._generateMetrics(optimizedResponse);
                optimizedResponse.metadata.performance = metrics;

                return optimizedResponse;

            } catch (error) {
                lastError = error;
                Logger.warn(`Generation attempt ${attempt} failed`, { topic, error });
                
                if (attempt === this.retryAttempts) {
                    Logger.error('All generation attempts failed', { topic, error });
                    throw ErrorHandler.handle(error, { topic, options, attempts: attempt });
                }
                
                // Wait before retry with exponential backoff
                await this._wait(Math.pow(2, attempt) * 1000);
            }
        }
    }
}

class PostValidator {
    /**
     * Validates input parameters
     * @throws {ValidationError}
     */
    validateInput(topic, options) {
        if (!topic || typeof topic !== 'string') {
            throw new ValidationError('Invalid topic');
        }
        if (topic.length < 3 || topic.length > 200) {
            throw new ValidationError('Topic length must be between 3 and 200 characters');
        }
        if (options.userContext && typeof options.userContext !== 'string') {
            throw new ValidationError('Invalid context format');
        }

        if (options.tone && !['formal', 'casual', 'professional', 'friendly'].includes(options.tone)) {
            throw new ValidationError('Invalid tone specified');
        }
        if (options.length && (typeof options.length !== 'number' || options.length < 100)) {
            throw new ValidationError('Invalid length specified');
        }
    }

    /**
     * Validates the generated content
     * @throws {ValidationError}
     */
    validateOutput(thoughtProcess) {
        if (!thoughtProcess || !thoughtProcess.insights) {
            throw new ValidationError('Invalid generation result');
        }
        if (thoughtProcess.confidence < config.validation.minConfidence) {
            throw new ValidationError('Generated content did not meet confidence threshold');
        }

        if (!Array.isArray(thoughtProcess.insights) || thoughtProcess.insights.length === 0) {
            throw new ValidationError('No insights generated');
        }
        
        thoughtProcess.insights.forEach((insight, index) => {
            if (!insight.content || typeof insight.content !== 'string') {
                throw new ValidationError(`Invalid insight content at index ${index}`);
            }
            if (typeof insight.confidence !== 'number' || insight.confidence < 0 || insight.confidence > 1) {
                throw new ValidationError(`Invalid confidence score at index ${index}`);
            }
        });
    }

    /**
     * Validates the structure of the final post
     * @throws {ValidationError}
     */
    validatePostStructure(post) {
        const requiredContentFields = ['title', 'body', 'summary', 'keywords'];
        for (const field of requiredContentFields) {
            if (!post.content[field]) {
                throw new ValidationError(`Missing required content field: ${field}`);
            }
        }
    }

    /**
     * Validates content optimization results
     * @throws {ValidationError}
     */
    validateOptimization(optimizedContent) {
        const minImprovement = config.validation.minOptimizationImprovement || 0.1;
        
        if (!optimizedContent.optimizationMetrics) {
            throw new ValidationError('Missing optimization metrics');
        }

        if (optimizedContent.optimizationMetrics.improvement < minImprovement) {
            throw new ValidationError('Insufficient optimization improvement');
        }
    }

    /**
     * Validates post metrics
     * @throws {ValidationError}
     */
    validateMetrics(metrics) {
        const minScores = config.validation.minScores || {
            contentScore: 0.7,
            readabilityScore: 0.6,
            seoScore: 0.65,
            uniquenessScore: 0.8
        };

        Object.entries(minScores).forEach(([metric, minScore]) => {
            if (metrics[metric] < minScore) {
                throw new ValidationError(
                    `${metric} below minimum threshold: ${metrics[metric]} < ${minScore}`
                );
            }
        });
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class OptimizationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OptimizationError';
    }
}

class GenerationTimeoutError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GenerationTimeoutError';
    }
} 