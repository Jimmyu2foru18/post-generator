import { mockApi } from './mockApi.js';
import { API } from './api.js';
import { config } from '../config.js';

export class ChainOfThought {
    constructor() {
        this.synonyms = {
            // Action words
            revolutionize: ['transform', 'disrupt', 'reshape', 'redefine', 'modernize', 'reinvent'],
            improve: ['enhance', 'optimize', 'upgrade', 'elevate', 'boost', 'amplify'],
            accelerate: ['speed up', 'fast-track', 'expedite', 'streamline', 'quicken'],
            enable: ['empower', 'facilitate', 'unlock', 'catalyze', 'drive'],
            
            // Descriptive words
            innovative: ['groundbreaking', 'cutting-edge', 'pioneering', 'revolutionary', 'advanced'],
            efficient: ['optimized', 'streamlined', 'productive', 'high-performance', 'effective'],
            powerful: ['robust', 'dynamic', 'impactful', 'potent', 'formidable'],
            significant: ['substantial', 'considerable', 'remarkable', 'notable', 'major'],

            // Industry-specific terms
            technology: {
                implement: ['deploy', 'integrate', 'incorporate', 'utilize', 'leverage'],
                solution: ['platform', 'framework', 'system', 'infrastructure', 'architecture'],
                feature: ['capability', 'functionality', 'component', 'module', 'element']
            },
            business: {
                growth: ['expansion', 'scaling', 'development', 'advancement', 'progress'],
                strategy: ['approach', 'methodology', 'framework', 'roadmap', 'initiative'],
                outcome: ['result', 'impact', 'benefit', 'advantage', 'achievement']
            }
        };

        this.contextualPhrases = {
            technology: {
                positive: [
                    'seamless integration',
                    'enhanced performance',
                    'robust security',
                    'scalable architecture',
                    'optimized workflow'
                ],
                action: [
                    'leveraging cloud technology',
                    'implementing AI solutions',
                    'automating processes',
                    'streamlining operations',
                    'enhancing user experience'
                ]
            },
            business: {
                positive: [
                    'market leadership',
                    'competitive advantage',
                    'strategic growth',
                    'operational excellence',
                    'innovation leadership'
                ],
                action: [
                    'driving revenue growth',
                    'optimizing operations',
                    'expanding market share',
                    'enhancing customer value',
                    'accelerating innovation'
                ]
            }
        };
    }

    generateVariation(template, context) {
        // Replace common words with synonyms based on context
        let result = template;
        for (const [word, synonyms] of Object.entries(this.synonyms)) {
            if (typeof synonyms === 'object' && !Array.isArray(synonyms)) {
                // Handle industry-specific terms
                if (context.industry && synonyms[context.industry]) {
                    const industrySpecificSynonyms = synonyms[context.industry];
                    result = this._replaceWithSynonym(result, word, industrySpecificSynonyms);
                }
            } else {
                // Handle general synonyms
                result = this._replaceWithSynonym(result, word, synonyms);
            }
        }

        // Add contextual phrases
        if (context.industry && this.contextualPhrases[context.industry]) {
            const phrases = this.contextualPhrases[context.industry];
            result = this._enhanceWithPhrases(result, phrases, context);
        }

        return result;
    }

    _replaceWithSynonym(text, word, synonyms) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        if (Math.random() < 0.3) { // 30% chance to replace with synonym
            const synonym = synonyms[Math.floor(Math.random() * synonyms.length)];
            return text.replace(regex, synonym);
        }
        return text;
    }

    _enhanceWithPhrases(text, phrases, context) {
        // Add relevant contextual phrases
        const positivePhrase = phrases.positive[Math.floor(Math.random() * phrases.positive.length)];
        const actionPhrase = phrases.action[Math.floor(Math.random() * phrases.action.length)];

        // Intelligently insert phrases based on sentence structure
        const sentences = text.split('. ');
        if (sentences.length > 2) {
            sentences.splice(1, 0, `This enables ${actionPhrase}.`);
            sentences.splice(-1, 0, `The result is ${positivePhrase}.`);
        }

        return sentences.join('. ');
    }

    generateInsight(topic, context) {
        const templates = [
            `${topic} is revolutionizing the industry through innovative approaches`,
            `Organizations are improving their operations with ${topic}`,
            `${topic} enables significant transformation in business processes`,
            `Companies implementing ${topic} report powerful results`
        ];

        const template = templates[Math.floor(Math.random() * templates.length)];
        return this.generateVariation(template, context);
    }

    generateEvidence(topic, context) {
        const templates = [
            `Implementation of ${topic} shows significant improvements`,
            `Organizations report powerful results using ${topic}`,
            `Studies demonstrate the efficient impact of ${topic}`
        ];

        const template = templates[Math.floor(Math.random() * templates.length)];
        return this.generateVariation(template, context);
    }

    async generateAnalysis(topic, context) {
        // Generate a comprehensive analysis combining insight and evidence
        const insight = this.generateInsight(topic, context);
        const evidence = this.generateEvidence(topic, context);
        
        // Add quantitative data if available
        let quantitativeData = '';
        try {
            const api = config.useMockApi ? new mockApi() : new API();
            const stats = await api.getTopicStats(topic);
            if (stats) {
                quantitativeData = `Recent data indicates a ${stats.growthRate}% increase in adoption, ` +
                    `with ${stats.implementationSuccess}% of organizations reporting successful implementation.`;
            }
        } catch (error) {
            console.warn('Could not fetch quantitative data:', error);
        }

        return {
            insight,
            evidence,
            quantitativeData,
            timestamp: new Date().toISOString()
        };
    }

    generateRecommendations(topic, context) {
        const recommendationTemplates = [
            `Consider ${this.synonyms.technology.implement[0]} ${topic} to ${this.synonyms.enable[0]} growth`,
            `Focus on ${this.synonyms.business.strategy[0]} alignment when adopting ${topic}`,
            `Prioritize ${this.synonyms.technology.solution[0]} integration with existing systems`
        ];

        return recommendationTemplates.map(template => 
            this.generateVariation(template, context)
        );
    }

    validateContext(context) {
        const requiredFields = ['industry', 'objective'];
        const validIndustries = Object.keys(this.contextualPhrases);
        
        if (!context.industry || !validIndustries.includes(context.industry)) {
            throw new Error(`Invalid industry. Must be one of: ${validIndustries.join(', ')}`);
        }
        
        for (const field of requiredFields) {
            if (!context[field]) {
                throw new Error(`Missing required context field: ${field}`);
            }
        }
        
        return true;
    }
} 