import { ValidationError } from './errors.js';

export class PhraseGenerator {
    constructor() {
        this.verbs = {
            positive: [
                // Growth & Improvement
                'accelerates', 'enhances', 'optimizes', 'revolutionizes', 'transforms',
                'streamlines', 'empowers', 'elevates', 'amplifies', 'boosts',
                'strengthens', 'maximizes', 'improves', 'upgrades', 'advances',
                
                // Innovation & Change
                'disrupts', 'innovates', 'modernizes', 'pioneers', 'redefines',
                'reshapes', 'reinvents', 'revitalizes', 'evolves', 'transcends',
                
                // Leadership & Success
                'leads', 'excels', 'dominates', 'outperforms', 'surpasses',
                'achieves', 'succeeds', 'triumphs', 'prevails', 'wins',
                
                // Creation & Development
                'creates', 'develops', 'builds', 'establishes', 'generates',
                'produces', 'crafts', 'constructs', 'designs', 'architects'
            ],

            technical: [
                // Implementation
                'implements', 'deploys', 'integrates', 'installs', 'configures',
                'sets up', 'initializes', 'launches', 'executes', 'activates',
                
                // Development
                'develops', 'codes', 'programs', 'engineers', 'architects',
                'designs', 'constructs', 'builds', 'creates', 'composes',
                
                // Operations
                'operates', 'manages', 'maintains', 'monitors', 'controls',
                'administers', 'supervises', 'orchestrates', 'coordinates', 'directs',
                
                // Analysis & Optimization
                'analyzes', 'optimizes', 'debugs', 'troubleshoots', 'diagnoses',
                'evaluates', 'assesses', 'examines', 'investigates', 'studies',
                
                // Security & Protection
                'secures', 'protects', 'safeguards', 'shields', 'defends',
                'encrypts', 'authenticates', 'validates', 'verifies', 'authorizes'
            ],

            business: [
                // Growth & Scaling
                'monetizes', 'scales', 'grows', 'expands', 'develops',
                'increases', 'multiplies', 'amplifies', 'accelerates', 'intensifies',
                
                // Strategy & Innovation
                'strategizes', 'innovates', 'disrupts', 'transforms', 'revolutionizes',
                'pioneers', 'leads', 'differentiates', 'positions', 'advances',
                
                // Operations & Execution
                'executes', 'implements', 'delivers', 'performs', 'achieves',
                'accomplishes', 'realizes', 'actualizes', 'fulfills', 'completes',
                
                // Market & Competition
                'dominates', 'captures', 'secures', 'wins', 'outperforms',
                'surpasses', 'exceeds', 'leads', 'tops', 'outranks',
                
                // Value & ROI
                'generates', 'produces', 'yields', 'returns', 'delivers',
                'creates', 'provides', 'offers', 'presents', 'supplies'
            ],

            marketing: [
                // Engagement
                'captivates', 'engages', 'attracts', 'delights', 'inspires',
                'motivates', 'persuades', 'influences', 'converts', 'retains',
                
                // Growth
                'accelerates', 'amplifies', 'multiplies', 'expands', 'scales',
                'compounds', 'increases', 'maximizes', 'boosts', 'grows',
                
                // Brand Building
                'positions', 'establishes', 'reinforces', 'elevates', 'strengthens',
                'differentiates', 'distinguishes', 'highlights', 'showcases', 'promotes'
            ],
            
            scientific: [
                // Research
                'analyzes', 'investigates', 'examines', 'explores', 'studies',
                'researches', 'evaluates', 'measures', 'quantifies', 'validates',
                
                // Discovery
                'discovers', 'uncovers', 'reveals', 'identifies', 'determines',
                'establishes', 'demonstrates', 'proves', 'confirms', 'verifies'
            ]
        };

        this.adjectives = {
            positive: [
                // Innovation & Technology
                'innovative', 'cutting-edge', 'advanced', 'state-of-the-art', 'modern',
                'pioneering', 'revolutionary', 'breakthrough', 'next-generation', 'futuristic',
                
                // Performance & Quality
                'powerful', 'efficient', 'robust', 'reliable', 'high-performance',
                'premium', 'superior', 'exceptional', 'outstanding', 'excellent',
                
                // Scale & Growth
                'scalable', 'flexible', 'adaptable', 'expandable', 'extensible',
                'versatile', 'agile', 'dynamic', 'responsive', 'elastic',
                
                // Business Impact
                'strategic', 'competitive', 'profitable', 'cost-effective', 'valuable',
                'beneficial', 'advantageous', 'lucrative', 'productive', 'impactful'
            ],

            technical: [
                // Architecture & Design
                'automated', 'integrated', 'distributed', 'containerized', 'modular',
                'cloud-native', 'serverless', 'microservices-based', 'event-driven', 'API-first',
                
                // Performance & Optimization
                'optimized', 'high-performance', 'efficient', 'streamlined', 'accelerated',
                'cached', 'compressed', 'balanced', 'tuned', 'refined',
                
                // Security & Compliance
                'secure', 'encrypted', 'protected', 'compliant', 'authenticated',
                'validated', 'verified', 'certified', 'authorized', 'safeguarded',
                
                // Reliability & Quality
                'reliable', 'stable', 'resilient', 'fault-tolerant', 'redundant',
                'available', 'consistent', 'durable', 'persistent', 'sustainable'
            ],

            marketing: [
                'engaging', 'compelling', 'persuasive', 'influential', 'impactful',
                'memorable', 'distinctive', 'remarkable', 'outstanding', 'captivating'
            ],
            
            scientific: [
                'empirical', 'quantitative', 'analytical', 'methodical', 'systematic',
                'precise', 'accurate', 'rigorous', 'validated', 'reproducible'
            ],
            
            emotional: [
                'inspiring', 'exciting', 'empowering', 'motivating', 'transformative',
                'game-changing', 'groundbreaking', 'visionary', 'innovative', 'dynamic'
            ]
        };

        this.nouns = {
            technical: [
                // Infrastructure & Systems
                'architecture', 'infrastructure', 'platform', 'framework', 'system',
                'network', 'cluster', 'environment', 'ecosystem', 'stack',
                
                // Applications & Services
                'application', 'service', 'solution', 'tool', 'utility',
                'module', 'component', 'interface', 'API', 'microservice',
                
                // Data & Storage
                'database', 'repository', 'warehouse', 'storage', 'cache',
                'index', 'collection', 'stream', 'pipeline', 'buffer',
                
                // Security & Access
                'firewall', 'gateway', 'proxy', 'authenticator', 'validator',
                'certificate', 'token', 'credential', 'permission', 'role'
            ],

            business: {
                strategy: [
                    'strategy', 'initiative', 'approach', 'methodology', 'framework',
                    'roadmap', 'plan', 'vision', 'mission', 'objective'
                ],
                transformation: [
                    'transformation', 'innovation', 'disruption', 'revolution', 'evolution',
                    'advancement', 'improvement', 'enhancement', 'upgrade', 'modernization'
                ],
                outcomes: [
                    'growth', 'success', 'achievement', 'result', 'outcome',
                    'impact', 'benefit', 'advantage', 'value', 'return'
                ],
                metrics: [
                    'ROI', 'revenue', 'profit', 'margin', 'conversion',
                    'retention', 'acquisition', 'engagement', 'satisfaction', 'performance'
                ]
            },

            marketing: {
                channels: [
                    'campaign', 'platform', 'channel', 'content', 'message',
                    'brand', 'presence', 'voice', 'identity', 'positioning'
                ],
                metrics: [
                    'engagement', 'conversion', 'reach', 'impression', 'interaction',
                    'response', 'impact', 'effectiveness', 'performance', 'success'
                ]
            },
            
            scientific: {
                research: [
                    'analysis', 'study', 'investigation', 'research', 'experiment',
                    'methodology', 'approach', 'framework', 'model', 'theory'
                ],
                results: [
                    'finding', 'outcome', 'result', 'conclusion', 'discovery',
                    'insight', 'observation', 'evidence', 'proof', 'validation'
                ]
            }
        };

        this.templates = {
            marketing: {
                social: '{verb} your {adj} {noun} on social media',
                email: 'discover how to {verb} {adj} {noun} in your emails',
                content: 'create {adj} {noun} that {verb} your audience'
            },
            scientific: {
                research: 'research that {verb} {adj} {noun} in the field',
                analysis: 'comprehensive {adj} {noun} that {verb} understanding',
                methodology: 'innovative {adj} {noun} that {verb} research quality'
            }
        };
    }

    generatePhrase(context) {
        if (!context || typeof context !== 'object') {
            throw new ValidationError('Context must be a valid object');
        }

        const { industry, style, tone } = context;

        if (!industry || !style || !tone) {
            throw new ValidationError('Context must include industry, style, and tone');
        }

        // Select appropriate word categories based on context
        const verbCategory = this._selectCategory('verbs', industry, style);
        const adjCategory = this._selectCategory('adjectives', tone, industry);
        const nounCategory = this._selectCategory('nouns', industry, style);

        // Generate phrase components
        const verb = this._getRandomItem(this.verbs[verbCategory]);
        const adj = this._getRandomItem(this.adjectives[adjCategory]);
        const noun = this._getRandomItem(
            typeof this.nouns[nounCategory] === 'object' 
                ? this._flattenObject(this.nouns[nounCategory]) 
                : this.nouns[nounCategory]
        );

        // Combine components based on style
        return this._combineComponents(verb, adj, noun, style);
    }

    _selectCategory(wordType, ...contexts) {
        const validCategory = contexts.find(ctx => {
            return this[wordType] && this[wordType][ctx];
        });
        
        if (!validCategory && (!this[wordType] || Object.keys(this[wordType]).length === 0)) {
            throw new ValidationError(`Invalid word type: ${wordType}`);
        }
        
        return validCategory || Object.keys(this[wordType])[0];
    }

    _getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    _flattenObject(obj) {
        return Object.values(obj).flat();
    }

    _isValidStyle(style) {
        const validStyles = ['statement', 'description', 'benefit', 'technical', 'business'];
        return validStyles.includes(style);
    }

    _combineComponents(verb, adj, noun, style) {
        if (!this._isValidStyle(style)) {
            style = 'statement';
        }

        const patterns = {
            statement: `${verb} ${adj} ${noun}`,
            description: `${adj} ${noun} that ${verb}`,
            benefit: `${verb} through ${adj} ${noun}`,
            technical: `${adj} ${noun} ${verb}s performance`,
            business: `${verb}s ${noun} with ${adj} results`,
            impact: `delivers ${adj} ${noun} that ${verb}s results`,
            solution: `leverages ${adj} ${noun} to ${verb}`,
            feature: `${adj} ${noun} ${verb}s efficiently`
        };

        return patterns[style] || patterns.statement;
    }

    addWords(category, type, newWords) {
        if (!this[category] || !this[category][type]) {
            throw new ValidationError(`Invalid category or type: ${category}.${type}`);
        }
        
        if (!Array.isArray(newWords)) {
            throw new ValidationError('New words must be provided as an array');
        }

        this[category][type] = [...new Set([...this[category][type], ...newWords])];
    }

    getAvailableStyles() {
        return Object.keys(this._combineComponents('', '', '', 'statement'));
    }

    generateMultiplePhrases(context, count = 1) {
        const phrases = new Set();
        const maxAttempts = count * 3;
        let attempts = 0;

        while (phrases.size < count && attempts < maxAttempts) {
            phrases.add(this.generatePhrase(context));
            attempts++;
        }

        return Array.from(phrases);
    }

    getWordStats() {
        const stats = {};
        
        for (const category of Object.keys(this)) {
            if (typeof this[category] === 'object') {
                stats[category] = {};
                for (const type of Object.keys(this[category])) {
                    if (Array.isArray(this[category][type])) {
                        stats[category][type] = this[category][type].length;
                    } else if (typeof this[category][type] === 'object') {
                        stats[category][type] = Object.values(this[category][type])
                            .flat()
                            .length;
                    }
                }
            }
        }
        
        return stats;
    }

    generateTemplatedPhrase(context, template) {
        if (!this.templates[context.industry]?.[template]) {
            throw new ValidationError(`Template not found: ${context.industry}.${template}`);
        }

        const phrase = this.generatePhrase(context);
        return this.templates[context.industry][template]
            .replace('{verb}', this._getRandomItem(this.verbs[context.industry]))
            .replace('{adj}', this._getRandomItem(this.adjectives[context.industry]))
            .replace('{noun}', this._getRandomItem(this._flattenObject(this.nouns[context.industry])));
    }

    generateVariations(basePhrase, count = 3) {
        const variations = new Set([basePhrase]);
        const words = basePhrase.split(' ');
        
        while (variations.size < count + 1) {
            const newWords = [...words];
            const posToChange = Math.floor(Math.random() * words.length);
            const wordType = this._determineWordType(words[posToChange]);
            
            if (wordType && this[wordType]) {
                const category = Object.keys(this[wordType])[0];
                newWords[posToChange] = this._getRandomItem(this[wordType][category]);
                variations.add(newWords.join(' '));
            }
        }

        return Array.from(variations).slice(1); // Exclude original phrase
    }

    _determineWordType(word) {
        for (const [type, categories] of Object.entries(this)) {
            if (typeof categories !== 'object') continue;
            
            for (const category of Object.values(categories)) {
                if (Array.isArray(category) && category.includes(word)) {
                    return type;
                }
                if (typeof category === 'object') {
                    if (Object.values(category).flat().includes(word)) {
                        return type;
                    }
                }
            }
        }
        return null;
    }

    analyzePhrase(phrase) {
        const words = phrase.split(' ');
        return {
            wordCount: words.length,
            types: words.map(word => ({
                word,
                type: this._determineWordType(word) || 'unknown'
            })),
            complexity: this._calculateComplexity(phrase),
            sentiment: this._analyzeSentiment(phrase)
        };
    }

    _calculateComplexity(phrase) {
        const words = phrase.split(' ');
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        return {
            avgWordLength,
            syllableCount: this._countSyllables(phrase),
            readabilityScore: Math.round((avgWordLength * 1.8 + words.length * 0.39) * 10) / 10
        };
    }

    _countSyllables(phrase) {
        return phrase.toLowerCase()
            .split(' ')
            .reduce((count, word) => {
                return count + (word.match(/[aeiouy]{1,2}/g) || []).length;
            }, 0);
    }

    _analyzeSentiment(phrase) {
        const positiveWords = new Set([...this.verbs.positive, ...this.adjectives.positive]);
        const words = phrase.toLowerCase().split(' ');
        const positiveCount = words.filter(word => positiveWords.has(word)).length;
        
        return {
            score: (positiveCount / words.length) * 10,
            positive: positiveCount,
            total: words.length
        };
    }
} 