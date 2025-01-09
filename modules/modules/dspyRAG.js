import { APIClient } from './apiClient.js';
import { RAGError, ValidationError } from './errors.js';

export class DSPyRAG {
    constructor(config) {
        this.config = config;
        this.retrievers = {};
        this.generators = {};
        this.indexes = {};
        this.vectorStore = null;
        this.cache = new Map();
        this.apiClient = new APIClient();
    }

    async initialize() {
        await this.initializeRetrievers();
        await this.initializeGenerators();
        await this.setupVectorStore();
        await this.initializeIndexes();
    }

    async initializeRetrievers() {
        this.retrievers = {
            semantic: await this.setupSemanticSearch(),
            keyword: await this.setupKeywordSearch(),
            hybrid: await this.setupHybridSearch()
        };
    }

    async setupSemanticSearch() {
        return {
            model: await this.loadEmbeddingModel(),
            search: async (query) => {
                const embedding = await this.generateEmbedding(query);
                return this.vectorStore.similaritySearch(embedding, 5);
            }
        };
    }

    async setupKeywordSearch() {
        return {
            index: await this.createBM25Index(),
            search: async (query) => {
                const keywords = this.extractKeywords(query);
                return this.searchWithKeywords(keywords);
            }
        };
    }

    async setupHybridSearch() {
        return {
            search: async (query) => {
                const [semanticResults, keywordResults] = await Promise.all([
                    this.retrievers.semantic.search(query),
                    this.retrievers.keyword.search(query)
                ]);
                return this.hybridRanking(semanticResults, keywordResults);
            }
        };
    }

    async retrieve(queryContext) {
        try {
            this.validateQueryContext(queryContext);
            
            const cacheKey = this.generateCacheKey(queryContext);
            const cachedResults = this.cache.get(cacheKey);
            if (cachedResults) return cachedResults;

            const results = await Promise.allSettled([
                this.retrieveWithRateLimit('semantic', queryContext),
                this.retrieveWithRateLimit('keyword', queryContext),
                this.retrieveWithRateLimit('hybrid', queryContext)
            ]);

            const successfulResults = this.processRetrievalResults(results);
            if (successfulResults.length === 0) {
                throw new RAGError('All retrieval methods failed', {
                    phase: 'retrieval',
                    context: { results }
                });
            }

            const mergedResults = await this.mergeAndRankResults(successfulResults);
            this.cache.set(cacheKey, mergedResults);
            
            return mergedResults;
        } catch (error) {
            if (error instanceof RAGError) {
                return this.handleRAGError(error);
            }
            throw error;
        }
    }

    validateQueryContext(queryContext) {
        if (!queryContext || typeof queryContext !== 'object') {
            throw new ValidationError('Invalid query context', {
                context: { queryContext }
            });
        }

        const requiredFields = ['query', 'type', 'parameters'];
        const missingFields = requiredFields.filter(field => !queryContext[field]);
        
        if (missingFields.length > 0) {
            throw new ValidationError('Missing required fields in query context', {
                context: { missingFields }
            });
        }
    }

    processRetrievalResults(results) {
        return results
            .filter(result => result.status === 'fulfilled')
            .map(result => result.value)
            .filter(Boolean);
    }

    async handleRAGError(error) {
        console.error('RAG error:', error);
        
        if (error.recoverable) {
            return this.fallbackRetrieval();
        }

        throw error;
    }

    async retrieveWithRateLimit(strategy, queryContext) {
        const apiName = this.getAPINameForStrategy(strategy);
        const endpoint = this.getEndpointForStrategy(strategy);
        
        return this.apiClient.fetch(apiName, endpoint, {
            method: 'POST',
            body: JSON.stringify({ query: queryContext }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getAPINameForStrategy(strategy) {
        const strategyToAPI = {
            semantic: 'semanticScholar',
            keyword: 'wikipedia',
            hybrid: 'newsapi'
        };
        return strategyToAPI[strategy] || 'default';
    }

    async generate(params) {
        const { documents, context, style } = params;
        
        try {
            // Initial content generation
            const firstDraft = await this.generateInitialContent(documents, context);
            
            // Fact verification
            const factChecked = await this.verifyFacts(firstDraft);
            
            // Content enhancement
            const enhanced = await this.enhanceContent(factChecked, style);
            
            // Quality check
            await this.qualityCheck(enhanced);
            
            return enhanced;
        } catch (error) {
            console.error('Generation error:', error);
            return this.fallbackGeneration(params);
        }
    }

    async generateInitialContent(documents, context) {
        const prompt = this.createGenerationPrompt(documents, context);
        const response = await this.generators.primary.generate(prompt);
        return this.processGeneratorOutput(response);
    }

    async verifyFacts(content) {
        const facts = this.extractClaims(content);
        const verifiedFacts = await this.verifyClaimsAgainstSources(facts);
        return this.incorporateVerifiedFacts(content, verifiedFacts);
    }

    async enhanceContent(content, style) {
        const enhancements = await this.generateEnhancements(content, style);
        return this.applyEnhancements(content, enhancements);
    }

    // Helper methods
    async mergeAndRankResults(results) {
        const merged = this.removeDuplicates(results.flat());
        const scored = await this.scoreResults(merged);
        return this.rankByRelevance(scored);
    }

    removeDuplicates(results) {
        const seen = new Set();
        return results.filter(result => {
            const key = this.generateResultKey(result);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    async scoreResults(results) {
        return Promise.all(results.map(async result => ({
            ...result,
            relevanceScore: await this.calculateRelevance(result),
            credibilityScore: await this.assessCredibility(result),
            freshnessScore: this.calculateFreshness(result)
        })));
    }

    rankByRelevance(scoredResults) {
        return scoredResults
            .sort((a, b) => {
                const scoreA = this.calculateOverallScore(a);
                const scoreB = this.calculateOverallScore(b);
                return scoreB - scoreA;
            })
            .slice(0, 10); // Return top 10 results
    }

    calculateOverallScore(result) {
        return (
            result.relevanceScore * 0.5 +
            result.credibilityScore * 0.3 +
            result.freshnessScore * 0.2
        );
    }

    async qualityCheck(content) {
        try {
            const checks = await Promise.all([
                this.checkFactualAccuracy(content),
                this.checkCoherence(content),
                this.checkStyle(content),
                this.checkGrammar(content)
            ]);

            const failedChecks = checks.filter(check => !check.passed);
            if (failedChecks.length > 0) {
                throw new ValidationError('Content failed quality checks', {
                    context: { failedChecks }
                });
            }

            return true;
        } catch (error) {
            if (error instanceof ValidationError) {
                return this.handleValidationError(error);
            }
            throw error;
        }
    }

    async handleValidationError(error) {
        console.error('Validation error:', error);
        
        if (error.recoverable) {
            return this.attemptContentRepair(error.context);
        }

        throw error;
    }

    async fallbackGeneration(params) {
        // Implement template-based generation
        return this.generateFromTemplate(params);
    }

    async handleRetrievalError(error) {
        console.error('Retrieval error:', error);
        return this.fallbackRetrieval();
    }

    async handleGenerationError(error) {
        console.error('Generation error:', error);
        return this.fallbackGeneration();
    }

    async fallbackRetrieval() {
        // Implement simpler retrieval method
        return [];
    }

    async initializeGenerators() {
        this.generators = {
            primary: await this.setupPrimaryGenerator(),
            fallback: await this.setupFallbackGenerator()
        };
    }

    async setupPrimaryGenerator() {
        return {
            generate: async (prompt) => {
                const response = await this.apiClient.fetch('llm', '/generate', {
                    method: 'POST',
                    body: JSON.stringify({ prompt }),
                    headers: { 'Content-Type': 'application/json' }
                });
                return this.processGeneratorOutput(response);
            }
        };
    }

    async setupFallbackGenerator() {
        return {
            generate: async (prompt) => {
                // Simpler, more reliable generation method
                const templates = await this.loadTemplates();
                return this.generateFromTemplate(prompt, templates);
            }
        };
    }

    async setupVectorStore() {
        this.vectorStore = {
            similaritySearch: async (embedding, k) => {
                return this.apiClient.fetch('vectorstore', '/search', {
                    method: 'POST',
                    body: JSON.stringify({ embedding, k }),
                    headers: { 'Content-Type': 'application/json' }
                });
            },
            addDocuments: async (documents) => {
                const embeddings = await Promise.all(
                    documents.map(doc => this.generateEmbedding(doc))
                );
                return this.apiClient.fetch('vectorstore', '/add', {
                    method: 'POST',
                    body: JSON.stringify({ documents, embeddings }),
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        };
    }

    async initializeIndexes() {
        this.indexes = {
            bm25: await this.createBM25Index(),
            semantic: await this.createSemanticIndex()
        };
    }

    async loadEmbeddingModel() {
        return {
            embed: async (text) => {
                return this.apiClient.fetch('embedding', '/embed', {
                    method: 'POST',
                    body: JSON.stringify({ text }),
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        };
    }

    async generateEmbedding(text) {
        try {
            return await this.retrievers.semantic.model.embed(text);
        } catch (error) {
            console.error('Embedding generation failed:', error);
            throw new RAGError('Failed to generate embedding', {
                phase: 'embedding',
                context: { text }
            });
        }
    }

    async createBM25Index() {
        return {
            search: async (keywords) => {
                return this.apiClient.fetch('search', '/bm25', {
                    method: 'POST',
                    body: JSON.stringify({ keywords }),
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        };
    }

    async createSemanticIndex() {
        return {
            search: async (query) => {
                const embedding = await this.generateEmbedding(query);
                return this.vectorStore.similaritySearch(embedding, 5);
            }
        };
    }

    extractKeywords(query) {
        // Simple keyword extraction
        return query
            .toLowerCase()
            .split(/\W+/)
            .filter(word => word.length > 2)
            .filter(word => !this.isStopWord(word));
    }

    isStopWord(word) {
        const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'in']);
        return stopWords.has(word.toLowerCase());
    }

    async searchWithKeywords(keywords) {
        return this.indexes.bm25.search(keywords);
    }

    hybridRanking(semanticResults, keywordResults) {
        const combined = [...semanticResults, ...keywordResults];
        return this.removeDuplicates(combined);
    }

    generateCacheKey(queryContext) {
        return `${queryContext.type}:${queryContext.query}`;
    }

    generateResultKey(result) {
        return `${result.id}:${result.source}`;
    }

    async calculateRelevance(result) {
        // Implement relevance scoring based on semantic similarity
        const queryEmbedding = await this.generateEmbedding(result.query);
        const contentEmbedding = await this.generateEmbedding(result.content);
        return this.cosineSimilarity(queryEmbedding, contentEmbedding);
    }

    async assessCredibility(result) {
        // Implement credibility scoring based on source and content quality
        const sourceScore = this.getSourceCredibilityScore(result.source);
        const contentScore = await this.assessContentQuality(result.content);
        return (sourceScore + contentScore) / 2;
    }

    calculateFreshness(result) {
        // Implement freshness scoring based on document age
        const age = Date.now() - new Date(result.timestamp).getTime();
        const maxAge = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds
        return Math.max(0, 1 - age / maxAge);
    }

    cosineSimilarity(vec1, vec2) {
        const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
        const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
        const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (mag1 * mag2);
    }

    getSourceCredibilityScore(source) {
        const credibilityScores = {
            'academic': 0.9,
            'news': 0.7,
            'blog': 0.5,
            'social': 0.3
        };
        return credibilityScores[source] || 0.1;
    }

    async assessContentQuality(content) {
        // Implement content quality assessment
        const metrics = await Promise.all([
            this.checkGrammar(content),
            this.checkCoherence(content),
            this.checkFactualAccuracy(content)
        ]);
        return metrics.reduce((avg, score) => avg + score, 0) / metrics.length;
    }

    async checkGrammar(content) {
        // Implement grammar checking
        return this.apiClient.fetch('grammar', '/check', {
            method: 'POST',
            body: JSON.stringify({ content }),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async checkCoherence(content) {
        // Implement coherence checking
        return this.apiClient.fetch('coherence', '/check', {
            method: 'POST',
            body: JSON.stringify({ content }),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async checkFactualAccuracy(content) {
        // Implement fact checking
        return this.apiClient.fetch('factcheck', '/verify', {
            method: 'POST',
            body: JSON.stringify({ content }),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async checkStyle(content) {
        // Implement style checking
        return this.apiClient.fetch('style', '/check', {
            method: 'POST',
            body: JSON.stringify({ content }),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async generateFromTemplate(params) {
        const templates = await this.loadTemplates();
        const template = this.selectTemplate(params);
        return this.fillTemplate(template, params);
    }

    async loadTemplates() {
        return this.apiClient.fetch('templates', '/load', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    }

    selectTemplate(params) {
        // Implement template selection logic
        return this.templates.find(template => 
            template.type === params.type && 
            template.style === params.style
        );
    }

    fillTemplate(template, params) {
        // Implement template filling logic
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => params[key] || match);
    }

    async attemptContentRepair(context) {
        // Implement content repair logic
        const repairs = await this.generateRepairs(context);
        return this.applyRepairs(context.content, repairs);
    }

    async generateRepairs(context) {
        return this.apiClient.fetch('repair', '/generate', {
            method: 'POST',
            body: JSON.stringify(context),
            headers: { 'Content-Type': 'application/json' }
        });
    }

    async applyRepairs(content, repairs) {
        // Implement repair application logic
        return repairs.reduce((repairedContent, repair) => 
            repairedContent.replace(repair.target, repair.replacement), 
            content
        );
    }
} 