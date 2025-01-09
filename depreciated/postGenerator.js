import { ChainOfThought } from './modules/chainOfThought.js';
import { SignatureGenerator } from './modules/signatureGenerator.js';
import { Database } from './modules/database.js';
import { APIError } from './modules/errors.js';
import { VectorIndex } from './modules/vectorIndex.js';
import { validators } from './modules/validators.js';
import { Logger } from './logger.js';

export class PostGenerator {
    constructor(config = {}) {
        this.chainOfThought = new ChainOfThought(config.chain);
        this.signatureGenerator = new SignatureGenerator(config.signature);
        this.database = new Database(config.database);
        this.config = this._validateConfig(config);
        this.vectorIndex = new VectorIndex(config.vectorIndex);
        this.validators = validators;
        this.logger = new Logger('PostGenerator');
        this.cache = new Map();
        this.analytics = {
            totalPosts: 0,
            successRate: 0,
            averageProcessingTime: 0
        };
        this.retryConfig = config.retry || {
            maxAttempts: 3,
            backoffMs: 1000
        };
    }

    async generatePost(topic, context = {}) {
        const startTime = Date.now();
        let attempts = 0;
        
        while (attempts < this.retryConfig.maxAttempts) {
            try {
                const result = await this._attemptPostGeneration(topic, context);
                this._updateAnalytics(Date.now() - startTime, true);
                return result;
            } catch (error) {
                attempts++;
                if (attempts === this.retryConfig.maxAttempts) {
                    this._updateAnalytics(Date.now() - startTime, false);
                    throw error;
                }
                await this._wait(attempts * this.retryConfig.backoffMs);
            }
        }
    }

    async _attemptPostGeneration(topic, context) {
        this.logger.info('Generating post for topic:', topic);
        const result = await this._generatePost(topic, context);
        
        const validation = await this.validatePost(result);
        if (!validation.isValid) {
            throw new APIError('Generated post failed validation', {
                code: 'VALIDATION_ERROR',
                context: { validation, topic },
                recoverable: true
            });
        }
        
        return result;
    }

    async _generatePost(topic, context) {
        try {
            // Execute thought chain
            const thoughtProcess = await this.chainOfThought.executeDoubleChain(topic, context);
            
            // Generate content
            const content = await this._generateContent(thoughtProcess);
            
            // Generate signature
            const signature = await this.signatureGenerator.generateSignature(content);
            
            // Store result
            const result = {
                topic,
                content,
                signature,
                metadata: {
                    thoughtProcess,
                    context,
                    timestamp: Date.now()
                }
            };

            await this.database.store(result);
            return result;
        } catch (error) {
            throw new APIError('Post generation failed', {
                code: 'GENERATION_ERROR',
                context: { topic, error },
                recoverable: true
            });
        }
    }

    async _generateContent(thoughtProcess) {
        const { mainInsights, supportingEvidence } = thoughtProcess;
        
        return {
            title: this._generateTitle(mainInsights),
            body: this._generateBody(mainInsights, supportingEvidence),
            summary: this._generateSummary(mainInsights),
            keywords: this._extractKeywords(mainInsights)
        };
    }

    _validateConfig(config) {
        const requiredFields = ['chain', 'signature', 'database'];
        const missingFields = requiredFields.filter(field => !config[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required config fields: ${missingFields.join(', ')}`);
        }
        
        return config;
    }

    _generateTitle(insights) {
        const mainInsight = insights[0];
        return {
            text: mainInsight.content.substring(0, 100),
            confidence: mainInsight.confidence
        };
    }

    _generateBody(insights, evidence) {
        const sections = insights.map(insight => ({
            content: insight.content,
            evidence: this._findRelevantEvidence(insight, evidence),
            confidence: insight.confidence
        }));

        return {
            sections,
            structure: this._organizeContent(sections),
            metadata: {
                wordCount: this._calculateWordCount(sections),
                readingTime: this._estimateReadingTime(sections)
            }
        };
    }

    _generateSummary(insights) {
        const topInsights = insights
            .filter(insight => insight.confidence > 0.8)
            .slice(0, 3);

        return {
            text: topInsights.map(i => i.content).join(' '),
            confidence: this._calculateAverageConfidence(topInsights)
        };
    }

    _extractKeywords(insights) {
        const words = insights
            .flatMap(insight => insight.content.toLowerCase().split(/\W+/))
            .filter(word => word.length > 3);

        const frequency = {};
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });

        return Object.entries(frequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([word]) => word);
    }

    _findRelevantEvidence(insight, evidence) {
        return evidence
            .filter(e => this._calculateRelevance(insight, e) > 0.7)
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3);
    }

    _organizeContent(sections) {
        return {
            introduction: sections[0],
            body: sections.slice(1, -1),
            conclusion: sections[sections.length - 1],
            transitions: this._generateTransitions(sections)
        };
    }

    _calculateWordCount(sections) {
        return sections.reduce((count, section) => {
            return count + section.content.split(/\s+/).length;
        }, 0);
    }

    _estimateReadingTime(sections) {
        const wordsPerMinute = 200;
        const wordCount = this._calculateWordCount(sections);
        return Math.ceil(wordCount / wordsPerMinute);
    }

    _calculateAverageConfidence(insights) {
        return insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length;
    }

    _calculateRelevance(insight, evidence) {
        const vectorSimilarity = this.vectorIndex.calculateSimilarity(
            insight.content,
            evidence.content
        );
        
        const confidenceWeight = (insight.confidence + evidence.confidence) / 2;
        const semanticOverlap = this._calculateSemanticOverlap(insight, evidence);
        
        return (vectorSimilarity * 0.5 + confidenceWeight * 0.3 + semanticOverlap * 0.2);
    }

    _calculateSemanticOverlap(insight, evidence) {
        const insightKeywords = new Set(this._extractKeywords([insight]));
        const evidenceKeywords = new Set(this._extractKeywords([evidence]));
        
        const intersection = new Set(
            [...insightKeywords].filter(x => evidenceKeywords.has(x))
        );
        
        return intersection.size / Math.max(insightKeywords.size, evidenceKeywords.size);
    }

    _generateTransitions(sections) {
        return sections.slice(1).map((section, index) => {
            return this._createTransition(sections[index], section);
        });
    }

    _createTransition(fromSection, toSection) {
        // Implement transition generation logic
        return {
            text: `Moreover, ${toSection.content.substring(0, 50)}...`,
            confidence: Math.min(fromSection.confidence, toSection.confidence)
        };
    }

    async validatePost(post) {
        const validationResults = await Promise.all([
            this.validators.content(post.content),
            this.validators.signature(post.signature),
            this.validators.metadata(post.metadata)
        ]);

        return {
            isValid: validationResults.every(result => result.valid),
            errors: validationResults
                .filter(result => !result.valid)
                .map(result => result.error)
        };
    }

    async optimizePost(post) {
        const baseOptimized = await this._optimizePost(post);
        return this._applyAIOptimizations(baseOptimized);
    }

    async _optimizePost(post) {
        const optimizedSections = await Promise.all(
            post.content.body.sections.map(async section => ({
                ...section,
                content: await this._optimizeText(section.content),
                evidence: await Promise.all(
                    section.evidence.map(e => this._optimizeText(e))
                )
            }))
        );

        return {
            ...post,
            content: {
                ...post.content,
                body: {
                    ...post.content.body,
                    sections: optimizedSections
                }
            }
        };
    }

    async _optimizeText(text) {
        const wordLimit = this.config.wordLimits?.optimal || 1000;
        const sentences = text.split(/[.!?]+/).filter(Boolean);
        
        const optimizedSentences = sentences
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 10)
            .slice(0, Math.ceil(wordLimit / 20));

        return optimizedSentences.join('. ') + '.';
    }

    async generateBatchPosts(topics, commonContext = {}) {
        const results = await Promise.allSettled(
            topics.map(topic => this.generatePost(topic, {
                ...commonContext,
                batchId: Date.now()
            }))
        );

        return {
            successful: results
                .filter(r => r.status === 'fulfilled')
                .map(r => r.value),
            failed: results
                .filter(r => r.status === 'rejected')
                .map(r => ({
                    error: r.reason,
                    topic: topics[results.indexOf(r)]
                }))
        };
    }

    async getCachedPost(topic, context = {}) {
        const cacheKey = this._generateCacheKey(topic, context);
        
        if (this.cache.has(cacheKey)) {
            this.logger.info('Cache hit for topic:', topic);
            return this.cache.get(cacheKey);
        }

        const post = await this.generatePost(topic, context);
        this.cache.set(cacheKey, post);
        return post;
    }

    _generateCacheKey(topic, context) {
        return `${topic}-${JSON.stringify(context)}`;
    }

    _updateAnalytics(processingTime, success) {
        this.analytics.totalPosts++;
        this.analytics.successRate = (
            (this.analytics.successRate * (this.analytics.totalPosts - 1) + (success ? 1 : 0)) 
            / this.analytics.totalPosts
        );
        this.analytics.averageProcessingTime = (
            (this.analytics.averageProcessingTime * (this.analytics.totalPosts - 1) + processingTime)
            / this.analytics.totalPosts
        );
    }

    getAnalytics() {
        return {
            ...this.analytics,
            cacheSize: this.cache.size,
            timestamp: Date.now()
        };
    }

    async _applyAIOptimizations(post) {
        const improvements = await Promise.all([
            this._improveReadability(post),
            this._enhanceSEO(post),
            this._optimizeEngagement(post)
        ]);

        return improvements.reduce((enhanced, improvement) => ({
            ...enhanced,
            ...improvement
        }), post);
    }

    async _improveReadability(post) {
        const readabilityScore = this._calculateReadabilityScore(post.content);
        
        if (readabilityScore < 0.7) {
            return {
                content: {
                    ...post.content,
                    body: await this._simplifyContent(post.content.body)
                }
            };
        }
        
        return post;
    }

    async _enhanceSEO(post) {
        const seoKeywords = await this._generateSEOKeywords(post);
        const seoMetadata = this._generateSEOMetadata(post, seoKeywords);
        
        return {
            ...post,
            metadata: {
                ...post.metadata,
                seo: seoMetadata
            }
        };
    }

    async _optimizeEngagement(post) {
        const hooks = await this._generateEngagementHooks(post);
        const callsToAction = this._generateCallsToAction(post);
        
        return {
            ...post,
            content: {
                ...post.content,
                hooks,
                callsToAction
            }
        };
    }

    _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async cleanup() {
        this.logger.info('Cleaning up PostGenerator resources');
        this.cache.clear();
        await this.database.disconnect();
        await this.vectorIndex.cleanup();
    }

    async bulkOptimize(posts, options = {}) {
        const batchSize = options.batchSize || 10;
        const results = [];
        
        for (let i = 0; i < posts.length; i += batchSize) {
            const batch = posts.slice(i, i + batchSize);
            const optimized = await Promise.all(
                batch.map(post => this.optimizePost(post)
                    .catch(error => ({ error, post })))
            );
            results.push(...optimized);
        }

        return {
            successful: results.filter(r => !r.error),
            failed: results.filter(r => r.error)
        };
    }
} 