import { entityTypes, categorizeText, getRandomEntities } from './entityTypes.js';
import { SentimentAnalyzer } from './sentimentAnalyzer.js';
import { Embeddings } from './embeddings.js';
import { KnowledgeBase } from './knowledgeBase.js';
import { ErrorHandler } from './errorHandler.js';
import { Logger } from './logger.js';

export class NLPProcessor {
    constructor() {
        this.entityTypes = entityTypes;
        this.sentimentAnalyzer = new SentimentAnalyzer();
        this.embeddings = new Embeddings();
        this.knowledgeBase = new KnowledgeBase();
        this.errorHandler = new ErrorHandler();
    }

    async analyzeTopic(topic, context) {
        try {
            return {
                entities: await this._extractEntities(topic),
                sentiment: await this._analyzeSentiment(topic),
                topicClusters: await this._identifyTopicClusters(topic),
                contextualRelevance: await this._analyzeContextualRelevance(topic, context),
                complexity: await this._assessComplexity(topic)
            };
        } catch (error) {
            Logger.error('NLP analysis failed:', error);
            throw new Error('Failed to analyze topic');
        }
    }

    _extractEntities(text) {
        return {
            ...categorizeText(text),
            detectedPatterns: this._detectPatterns(text),
            entityRelations: this._analyzeEntityRelations(text)
        };
    }

    _detectPatterns(text) {
        return {
            technicalTerms: this._findTechnicalTerms(text),
            industrySpecific: this._findIndustryTerms(text),
            metrics: this._findMetrics(text),
            trends: this._findTrends(text)
        };
    }

    _analyzeEntityRelations(text) {
        return {
            primary: this._findPrimaryEntities(text),
            secondary: this._findSecondaryEntities(text),
            relationships: this._findEntityRelationships(text)
        };
    }

    _analyzeSentiment(text) {
        return this.sentimentAnalyzer.analyzeSentiment(text);
    }

    _identifyTopicClusters(topic) {
        const clusters = {
            technical: ['implementation', 'system', 'technology', 'infrastructure'],
            business: ['strategy', 'market', 'revenue', 'customer'],
            research: ['study', 'analysis', 'research', 'development'],
            industry: ['sector', 'industry', 'market', 'field']
        };

        const words = topic.toLowerCase().split(/\W+/);
        return Object.entries(clusters).reduce((acc, [cluster, keywords]) => {
            const relevance = keywords.filter(keyword => 
                words.some(word => word.includes(keyword))
            ).length / keywords.length;
            
            if (relevance > 0) {
                acc[cluster] = relevance;
            }
            return acc;
        }, {});
    }

    _analyzeContextualRelevance(topic, context) {
        if (!context) return { score: 0.5, confidence: 0.3 };

        const topicWords = new Set(topic.toLowerCase().split(/\W+/));
        const contextWords = new Set(context.toLowerCase().split(/\W+/));
        
        const commonWords = new Set(
            [...topicWords].filter(word => contextWords.has(word))
        );

        const relevanceScore = commonWords.size / Math.min(topicWords.size, contextWords.size);
        const confidence = 0.5 + (commonWords.size / Math.max(topicWords.size, contextWords.size));

        return {
            score: relevanceScore,
            confidence,
            commonTerms: Array.from(commonWords)
        };
    }

    _assessComplexity(text) {
        const words = text.split(/\W+/);
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
        const complexityScore = (avgWordLength * 0.5) + (uniqueWords / words.length * 0.5);

        return {
            score: complexityScore,
            metrics: {
                avgWordLength,
                uniqueWordRatio: uniqueWords / words.length,
                wordCount: words.length
            },
            level: this._getComplexityLevel(complexityScore)
        };
    }

    _getComplexityLevel(score) {
        if (score > 0.8) return 'very complex';
        if (score > 0.6) return 'complex';
        if (score > 0.4) return 'moderate';
        return 'simple';
    }

    _findTechnicalTerms(text) {
        const techTerms = this.entityTypes.TECH_TERMS || [];
        const words = text.toLowerCase().split(/\W+/);
        return words.filter(word => 
            techTerms.some(term => term.toLowerCase().includes(word))
        ).map(term => ({
            term,
            confidence: 0.8 + Math.random() * 0.2
        }));
    }

    _findIndustryTerms(text) {
        const industryTerms = this.entityTypes.INDUSTRIES || [];
        const words = text.toLowerCase().split(/\W+/);
        return words.filter(word =>
            industryTerms.some(term => term.toLowerCase().includes(word))
        ).map(term => ({
            term,
            industry: this._identifyIndustry(term),
            confidence: 0.7 + Math.random() * 0.3
        }));
    }

    _findMetrics(text) {
        const metrics = this.entityTypes.METRICS || [];
        const words = text.toLowerCase().split(/\W+/);
        return words.filter(word =>
            metrics.some(metric => metric.toLowerCase().includes(word))
        ).map(metric => ({
            metric,
            type: this._identifyMetricType(metric),
            confidence: 0.75 + Math.random() * 0.25
        }));
    }

    _findTrends(text) {
        const trendIndicators = ['increasing', 'growing', 'rising', 'declining', 'trending'];
        const words = text.toLowerCase().split(/\W+/);
        const trends = [];
        
        words.forEach((word, index) => {
            if (trendIndicators.includes(word) && words[index + 1]) {
                trends.push({
                    trend: `${word} ${words[index + 1]}`,
                    direction: this._getTrendDirection(word),
                    confidence: 0.7 + Math.random() * 0.3
                });
            }
        });
        
        return trends;
    }

    _findPrimaryEntities(text) {
        const words = text.split(/\W+/);
        const entities = categorizeText(text);
        return Object.entries(entities)
            .filter(([_, count]) => count > 1)
            .map(([category, count]) => ({
                category,
                frequency: count,
                importance: 'primary',
                confidence: 0.8 + Math.random() * 0.2
            }));
    }

    _findSecondaryEntities(text) {
        const words = text.split(/\W+/);
        const entities = categorizeText(text);
        return Object.entries(entities)
            .filter(([_, count]) => count === 1)
            .map(([category, count]) => ({
                category,
                frequency: count,
                importance: 'secondary',
                confidence: 0.6 + Math.random() * 0.2
            }));
    }

    _findEntityRelationships(text) {
        const primaryEntities = this._findPrimaryEntities(text);
        const secondaryEntities = this._findSecondaryEntities(text);
        const relationships = [];

        primaryEntities.forEach(primary => {
            secondaryEntities.forEach(secondary => {
                if (this._areEntitiesRelated(primary, secondary)) {
                    relationships.push({
                        from: primary.category,
                        to: secondary.category,
                        type: this._determineRelationType(primary, secondary),
                        strength: 0.6 + Math.random() * 0.4
                    });
                }
            });
        });

        return relationships;
    }

    _identifyIndustry(term) {
        const industries = Object.keys(this.entityTypes.INDUSTRIES || {});
        return industries.find(industry => 
            term.toLowerCase().includes(industry.toLowerCase())
        ) || 'general';
    }

    _identifyMetricType(metric) {
        const metricTypes = {
            financial: ['ROI', 'revenue', 'cost', 'profit'],
            performance: ['KPI', 'efficiency', 'productivity'],
            growth: ['growth', 'increase', 'expansion']
        };

        return Object.entries(metricTypes).find(([_, terms]) =>
            terms.some(term => metric.toLowerCase().includes(term))
        )?.[0] || 'other';
    }

    _getTrendDirection(word) {
        const directions = {
            increasing: 'up',
            growing: 'up',
            rising: 'up',
            declining: 'down',
            trending: 'neutral'
        };
        return directions[word] || 'neutral';
    }

    _areEntitiesRelated(entity1, entity2) {
        return Math.random() > 0.5;
    }

    _determineRelationType(entity1, entity2) {
        const relationTypes = ['contains', 'influences', 'correlates_with', 'depends_on'];
        return relationTypes[Math.floor(Math.random() * relationTypes.length)];
    }

    async analyzeTopicAdvanced(topic, context, options = {}) {
        try {
            const [basicAnalysis, semanticAnalysis, knowledgeAnalysis] = await Promise.all([
                this.analyzeTopic(topic, context),
                this._performSemanticAnalysis(topic),
                this._performKnowledgeAnalysis(topic)
            ]);

            return {
                ...basicAnalysis,
                semantic: semanticAnalysis,
                knowledge: knowledgeAnalysis,
                recommendations: this._generateRecommendations(basicAnalysis, semanticAnalysis, knowledgeAnalysis),
                confidence: this._calculateOverallConfidence(basicAnalysis, semanticAnalysis, knowledgeAnalysis)
            };
        } catch (error) {
            this.errorHandler.handleError('NLPProcessor.analyzeTopicAdvanced', error);
            throw error;
        }
    }

    async _performSemanticAnalysis(text) {
        const embedding = await this.embeddings.generateEmbedding(text);
        return {
            vector: embedding,
            similarTopics: await this._findSimilarTopics(embedding),
            conceptualMap: this._generateConceptualMap(text),
            semanticFields: this._identifySemanticFields(text)
        };
    }

    async _performKnowledgeAnalysis(topic) {
        const knowledgeEntries = await this.knowledgeBase.query(topic);
        return {
            relatedConcepts: this._extractRelatedConcepts(knowledgeEntries),
            domainSpecificInsights: this._extractDomainInsights(knowledgeEntries),
            historicalContext: this._analyzeHistoricalContext(knowledgeEntries),
            futureImplications: this._predictFutureImplications(topic, knowledgeEntries)
        };
    }

    _generateConceptualMap(text) {
        const concepts = this._extractConcepts(text);
        return {
            mainConcept: this._identifyMainConcept(concepts),
            relatedConcepts: this._organizeRelatedConcepts(concepts),
            conceptualHierarchy: this._buildConceptHierarchy(concepts)
        };
    }

    _identifySemanticFields(text) {
        const words = text.toLowerCase().split(/\W+/);
        const semanticFields = {
            abstract: new Set(['theory', 'concept', 'philosophy', 'principle']),
            concrete: new Set(['implementation', 'practice', 'application', 'example']),
            temporal: new Set(['future', 'past', 'present', 'timeline']),
            spatial: new Set(['location', 'place', 'area', 'region'])
        };

        return Object.entries(semanticFields).reduce((acc, [field, fieldWords]) => {
            const relevance = words.filter(word => fieldWords.has(word)).length / words.length;
            if (relevance > 0) acc[field] = relevance;
            return acc;
        }, {});
    }

    _extractConcepts(text) {
        const concepts = new Set();
        const phrases = text.match(/\b[\w\s]{3,}\b/g) || [];
        
        phrases.forEach(phrase => {
            if (this._isSignificantPhrase(phrase)) {
                concepts.add(phrase.trim());
            }
        });

        return Array.from(concepts);
    }

    _isSignificantPhrase(phrase) {
        const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to']);
        const words = phrase.toLowerCase().split(/\s+/);
        return words.some(word => !stopWords.has(word)) && 
               this._calculatePhaseSignificance(phrase) > 0.5;
    }

    _calculatePhaseSignificance(phrase) {
        const frequencyInCorpus = this.knowledgeBase.getPhraseFrequency(phrase);
        const domainRelevance = this.knowledgeBase.getDomainRelevance(phrase);
        return (frequencyInCorpus * 0.4 + domainRelevance * 0.6);
    }

    _generateRecommendations(basicAnalysis, semanticAnalysis, knowledgeAnalysis) {
        return {
            topicalFocus: this._recommendTopicalFocus(basicAnalysis, semanticAnalysis),
            researchDirections: this._suggestResearchDirections(knowledgeAnalysis),
            potentialApplications: this._identifyPotentialApplications(semanticAnalysis, knowledgeAnalysis),
            gaps: this._identifyKnowledgeGaps(basicAnalysis, knowledgeAnalysis)
        };
    }

    _calculateOverallConfidence(basicAnalysis, semanticAnalysis, knowledgeAnalysis) {
        const weights = {
            basic: 0.3,
            semantic: 0.4,
            knowledge: 0.3
        };

        return {
            score: (
                basicAnalysis.contextualRelevance.confidence * weights.basic +
                this._calculateSemanticConfidence(semanticAnalysis) * weights.semantic +
                this._calculateKnowledgeConfidence(knowledgeAnalysis) * weights.knowledge
            ),
            breakdown: {
                basic: basicAnalysis.contextualRelevance.confidence,
                semantic: this._calculateSemanticConfidence(semanticAnalysis),
                knowledge: this._calculateKnowledgeConfidence(knowledgeAnalysis)
            }
        };
    }

    _calculateSemanticConfidence(semanticAnalysis) {
        return semanticAnalysis.similarTopics.length > 0 ? 
            semanticAnalysis.similarTopics.reduce((acc, topic) => acc + topic.similarity, 0) / 
            semanticAnalysis.similarTopics.length : 
            0.5;
    }

    _calculateKnowledgeConfidence(knowledgeAnalysis) {
        return (
            Object.keys(knowledgeAnalysis.relatedConcepts).length * 0.3 +
            Object.keys(knowledgeAnalysis.domainSpecificInsights).length * 0.4 +
            (knowledgeAnalysis.historicalContext ? 0.3 : 0)
        );
    }
} 