export class SentimentAnalyzer {
    constructor() {
        this.sentimentLexicon = {
            positive: {
                strong: [
                    'excellent', 'outstanding', 'exceptional', 'revolutionary', 'breakthrough',
                    'innovative', 'remarkable', 'extraordinary', 'phenomenal', 'spectacular',
                    'transformative', 'groundbreaking', 'pioneering', 'visionary', 'masterful'
                ],
                moderate: [
                    'good', 'effective', 'beneficial', 'improved', 'successful',
                    'efficient', 'valuable', 'reliable', 'positive', 'promising',
                    'productive', 'advantageous', 'favorable', 'proficient', 'competent'
                ],
                mild: [
                    'helpful', 'decent', 'satisfactory', 'adequate', 'useful',
                    'practical', 'functional', 'serviceable', 'workable', 'acceptable',
                    'reasonable', 'fair', 'suitable', 'appropriate', 'sufficient'
                ]
            },
            negative: {
                strong: [
                    'terrible', 'disastrous', 'catastrophic', 'devastating', 'horrible',
                    'critical', 'dangerous', 'severe', 'fatal', 'detrimental',
                    'destructive', 'ruinous', 'calamitous', 'dire', 'dreadful'
                ],
                moderate: [
                    'bad', 'poor', 'problematic', 'difficult', 'concerning',
                    'troubling', 'ineffective', 'unreliable', 'negative', 'questionable',
                    'deficient', 'inadequate', 'flawed', 'subpar', 'unsatisfactory'
                ],
                mild: [
                    'challenging', 'uncertain', 'unclear', 'complicated', 'confusing',
                    'tricky', 'awkward', 'inconvenient', 'uncomfortable', 'mediocre',
                    'doubtful', 'ambiguous', 'vague', 'puzzling', 'perplexing'
                ]
            },
            technical: {
                positive: [
                    'optimized', 'scalable', 'robust', 'efficient', 'reliable',
                    'maintainable', 'modular', 'secure', 'performant', 'stable'
                ],
                negative: [
                    'buggy', 'unstable', 'vulnerable', 'inefficient', 'unreliable',
                    'fragile', 'insecure', 'slow', 'complex', 'outdated'
                ]
            },
            business: {
                positive: [
                    'profitable', 'cost-effective', 'strategic', 'competitive', 'lucrative',
                    'sustainable', 'scalable', 'marketable', 'innovative', 'disruptive'
                ],
                negative: [
                    'unprofitable', 'costly', 'risky', 'uncompetitive', 'unsustainable',
                    'stagnant', 'obsolete', 'inefficient', 'bureaucratic', 'outdated'
                ]
            },
            academic: {
                positive: [
                    'rigorous', 'comprehensive', 'systematic', 'empirical', 'validated',
                    'peer-reviewed', 'evidence-based', 'methodical', 'thorough', 'scholarly'
                ],
                negative: [
                    'unsubstantiated', 'biased', 'flawed', 'inconclusive', 'unreliable',
                    'unverified', 'questionable', 'incomplete', 'superficial', 'inconsistent'
                ]
            },
            neutral: [
                'analysis', 'observation', 'study', 'research', 'investigation',
                'review', 'assessment', 'evaluation', 'examination', 'consideration',
                'overview', 'summary', 'report', 'finding', 'conclusion'
            ],
            intensifiers: [
                'very', 'extremely', 'highly', 'incredibly', 'remarkably',
                'notably', 'particularly', 'especially', 'significantly', 'substantially',
                'exceptionally', 'extraordinarily', 'tremendously', 'immensely', 'vastly'
            ],
            diminishers: [
                'somewhat', 'slightly', 'relatively', 'fairly', 'rather',
                'moderately', 'partially', 'marginally', 'minimally', 'occasionally',
                'hardly', 'barely', 'scarcely', 'seldom', 'rarely'
            ]
        };

        this.contextModifiers = {
            negation: ['not', 'never', 'no', 'neither', 'nor', 'none', 'nothing', 'without'],
            condition: ['if', 'unless', 'although', 'however', 'but', 'despite', 'though', 'while', 'whereas'],
            uncertainty: ['maybe', 'perhaps', 'possibly', 'probably', 'likely', 'unlikely', 'supposedly', 'presumably'],
            temporal: ['sometimes', 'occasionally', 'often', 'usually', 'always', 'rarely', 'frequently'],
            comparison: ['more', 'less', 'better', 'worse', 'similar', 'different', 'comparable'],
            causation: ['because', 'therefore', 'thus', 'hence', 'consequently', 'due to'],
            emphasis: ['particularly', 'especially', 'notably', 'significantly', 'primarily'],
            qualification: ['somewhat', 'relatively', 'partially', 'mainly', 'largely']
        };

        // Add domain-specific context patterns
        this.domainContexts = {
            technical: {
                keywords: ['implementation', 'system', 'software', 'hardware', 'network'],
                patterns: [/\b(API|SDK|UI|UX)\b/g, /\b(v\d+\.\d+\.\d+)\b/g]
            },
            business: {
                keywords: ['market', 'revenue', 'cost', 'profit', 'strategy'],
                patterns: [/\b\d+%\b/g, /\$\d+(?:\.\d{2})?/g]
            },
            academic: {
                keywords: ['research', 'study', 'analysis', 'methodology', 'theory'],
                patterns: [/\bp\s*<\s*0\.0\d+\b/g, /\bcitation\b/gi]
            }
        };

        // Add emotion categories
        this.emotionLexicon = {
            joy: ['happy', 'delighted', 'excited', 'pleased', 'thrilled', 'elated', 'jubilant'],
            sadness: ['sad', 'depressed', 'gloomy', 'miserable', 'heartbroken', 'melancholy'],
            anger: ['angry', 'furious', 'outraged', 'irritated', 'enraged', 'hostile'],
            fear: ['afraid', 'scared', 'terrified', 'anxious', 'panicked', 'nervous'],
            surprise: ['amazed', 'astonished', 'shocked', 'stunned', 'unexpected'],
            disgust: ['disgusted', 'repulsed', 'revolted', 'appalled', 'horrified']
        };

        // Add sarcasm indicators
        this.sarcasmPatterns = {
            contrasts: [
                /\b(great|wonderful|fantastic|amazing)\b.*\b(not|never)\b/i,
                /\b(not|never)\b.*\b(great|wonderful|fantastic|amazing)\b/i
            ],
            exaggerations: [
                /\b(obviously|clearly|totally|absolutely|definitely)\b/i,
                /!!+|\?!|\?{2,}/
            ],
            quotes: [
                /"([^"]*?)"/g,
                /'([^']*?)'/g
            ],
            punctuation: [
                /\.\.\./g,
                /[!?]{2,}/g
            ]
        };

        // Historical analysis storage
        this.analysisHistory = [];
        this.maxHistorySize = 100;
    }

    analyzeSentiment(text, domain = 'general') {
        const words = text.toLowerCase().split(/\W+/);
        const scores = {
            positive: { strong: 0, moderate: 0, mild: 0 },
            negative: { strong: 0, moderate: 0, mild: 0 },
            neutral: 0,
            domain: {
                score: 0,
                relevance: 0
            },
            contextual: {
                negations: 0,
                conditions: 0,
                uncertainties: 0,
                temporal: 0,
                comparisons: 0,
                causations: 0,
                emphasis: 0,
                qualifications: 0
            }
        };

        const context = this._analyzeContext(text, domain);
        const domainScore = this._analyzeDomainSentiment(text, domain);

        return {
            scores: this._normalizeScores(scores),
            analysis: this._analyzeSentimentScores(scores, context),
            context: context,
            domain: domainScore,
            details: this._generateSentimentDetails(scores, context, domainScore)
        };
    }

    _analyzeContext(text, domain) {
        const contextScores = {};
        const words = text.toLowerCase().split(/\W+/);
        
        // Analyze each type of context modifier
        Object.entries(this.contextModifiers).forEach(([type, modifiers]) => {
            contextScores[type] = {
                count: words.filter(word => modifiers.includes(word)).length,
                words: words.filter(word => modifiers.includes(word)),
                impact: this._calculateContextImpact(type)
            };
        });

        // Add domain-specific context analysis
        if (this.domainContexts[domain]) {
            const domainContext = this._analyzeDomainContext(text, domain);
            contextScores.domain = domainContext;
        }

        return {
            modifiers: contextScores,
            overall: this._calculateOverallContext(contextScores),
            confidence: this._calculateContextConfidence(contextScores)
        };
    }

    _analyzeDomainContext(text, domain) {
        const domainInfo = this.domainContexts[domain];
        if (!domainInfo) return null;

        const keywordMatches = domainInfo.keywords.filter(keyword => 
            text.toLowerCase().includes(keyword)
        );

        const patternMatches = domainInfo.patterns.map(pattern => 
            (text.match(pattern) || []).length
        );

        return {
            relevance: keywordMatches.length / domainInfo.keywords.length,
            patterns: patternMatches.reduce((a, b) => a + b, 0),
            confidence: this._calculateDomainConfidence(keywordMatches.length, patternMatches)
        };
    }

    _calculateContextImpact(type) {
        const impacts = {
            negation: -1,
            condition: -0.5,
            uncertainty: -0.3,
            temporal: 0.2,
            comparison: 0.1,
            causation: 0.4,
            emphasis: 0.5,
            qualification: -0.2
        };
        return impacts[type] || 0;
    }

    _calculateOverallContext(contextScores) {
        const weights = Object.entries(contextScores).reduce((acc, [type, data]) => {
            acc += data.count * this._calculateContextImpact(type);
            return acc;
        }, 0);

        return {
            score: weights,
            interpretation: this._interpretContextScore(weights)
        };
    }

    _interpretContextScore(score) {
        if (score < -0.5) return 'highly modified';
        if (score < -0.2) return 'moderately modified';
        if (score < 0.2) return 'neutral';
        if (score < 0.5) return 'moderately enhanced';
        return 'highly enhanced';
    }

    _scoreSentimentWord(word, scores, modifiers) {
        const { intensifierActive, diminisherActive, negationActive } = modifiers;
        let multiplier = 1;

        if (intensifierActive) multiplier = 1.5;
        if (diminisherActive) multiplier = 0.5;
        if (negationActive) multiplier *= -1;

        for (const [sentiment, categories] of Object.entries(this.sentimentLexicon)) {
            if (sentiment === 'intensifiers' || sentiment === 'diminishers') continue;

            if (sentiment === 'neutral' && categories.includes(word)) {
                scores.neutral += 1 * Math.abs(multiplier);
                return;
            }

            if (sentiment === 'positive' || sentiment === 'negative') {
                for (const [strength, words] of Object.entries(categories)) {
                    if (words.includes(word)) {
                        const score = this._getBaseScore(strength) * multiplier;
                        scores[sentiment][strength] += score;
                        return;
                    }
                }
            }
        }
    }

    _getBaseScore(strength) {
        return {
            strong: 3,
            moderate: 2,
            mild: 1
        }[strength] || 1;
    }

    _normalizeScores(scores) {
        const totalPositive = Object.values(scores.positive).reduce((a, b) => a + b, 0);
        const totalNegative = Object.values(scores.negative).reduce((a, b) => a + b, 0);
        const total = totalPositive + totalNegative + scores.neutral;

        return {
            positive: total ? totalPositive / total : 0,
            negative: total ? totalNegative / total : 0,
            neutral: total ? scores.neutral / total : 0,
            confidence: this._calculateConfidence(scores)
        };
    }

    _calculateConfidence(scores) {
        const contextModifiers = Object.values(scores.contextual).reduce((a, b) => a + b, 0);
        return Math.max(0, 1 - (contextModifiers * 0.1));
    }

    _analyzeSentimentScores(scores) {
        const normalized = this._normalizeScores(scores);
        const dominantSentiment = this._getDominantSentiment(normalized);
        const intensity = this._calculateIntensity(scores);

        return {
            dominant: dominantSentiment,
            intensity,
            summary: this._generateSummary(dominantSentiment, intensity, normalized.confidence)
        };
    }

    _getDominantSentiment(normalized) {
        if (normalized.neutral > Math.max(normalized.positive, normalized.negative)) {
            return 'neutral';
        }
        return normalized.positive > normalized.negative ? 'positive' : 'negative';
    }

    _calculateIntensity(scores) {
        const strongCount = scores.positive.strong + scores.negative.strong;
        const moderateCount = scores.positive.moderate + scores.negative.moderate;
        const mildCount = scores.positive.mild + scores.negative.mild;
        
        const total = strongCount + moderateCount + mildCount;
        if (!total) return 'neutral';

        const weightedScore = (strongCount * 3 + moderateCount * 2 + mildCount) / total;
        
        if (weightedScore > 2.5) return 'very strong';
        if (weightedScore > 2) return 'strong';
        if (weightedScore > 1.5) return 'moderate';
        return 'mild';
    }

    _generateSummary(sentiment, intensity, confidence) {
        return {
            text: `${intensity} ${sentiment} sentiment detected`,
            confidence: confidence,
            reliability: this._calculateReliability(confidence, intensity)
        };
    }

    _generateSentimentDetails(scores) {
        return {
            composition: {
                positive: scores.positive,
                negative: scores.negative,
                neutral: scores.neutral
            },
            context: scores.contextual,
            reliability: this._calculateReliability(
                this._normalizeScores(scores).confidence,
                this._calculateIntensity(scores)
            )
        };
    }

    _calculateReliability(confidence, intensity) {
        const intensityFactor = {
            'very strong': 0.9,
            'strong': 0.8,
            'moderate': 0.7,
            'mild': 0.6,
            'neutral': 0.5
        }[intensity];

        return Math.min(1, confidence * intensityFactor);
    }

    _analyzeDomainSentiment(text, domain) {
        // Return default if domain analysis is not supported
        if (!this.sentimentLexicon[domain]) {
            return {
                score: 0,
                relevance: 0,
                confidence: 0
            };
        }

        const words = text.toLowerCase().split(/\W+/);
        let domainScore = 0;
        let relevantWords = 0;

        // Analyze domain-specific positive words
        const positiveMatches = words.filter(word => 
            this.sentimentLexicon[domain].positive.includes(word)
        ).length;

        // Analyze domain-specific negative words
        const negativeMatches = words.filter(word => 
            this.sentimentLexicon[domain].negative.includes(word)
        ).length;

        // Calculate total relevant words found
        relevantWords = positiveMatches + negativeMatches;

        // Calculate domain score (-1 to 1 range)
        if (relevantWords > 0) {
            domainScore = (positiveMatches - negativeMatches) / relevantWords;
        }

        // Calculate relevance score (0 to 1 range)
        const totalDomainWords = 
            this.sentimentLexicon[domain].positive.length + 
            this.sentimentLexicon[domain].negative.length;
        const relevance = relevantWords / Math.min(words.length, totalDomainWords);

        // Calculate confidence based on relevance and sample size
        const confidence = this._calculateDomainConfidence(relevantWords, words.length);

        return {
            score: domainScore,
            relevance: relevance,
            confidence: confidence,
            details: {
                positiveMatches,
                negativeMatches,
                totalRelevantWords: relevantWords
            }
        };
    }

    _calculateDomainConfidence(relevantWords, totalWords) {
        // Base confidence on the proportion of domain-specific words found
        // and the total sample size
        const relevanceFactor = Math.min(1, relevantWords / 5); // Requires at least 5 relevant words for max confidence
        const sizeFactor = Math.min(1, totalWords / 20); // Requires at least 20 words for max confidence
        
        return relevanceFactor * sizeFactor;
    }

    detectEmotions(text) {
        const words = text.toLowerCase().split(/\W+/);
        const emotions = {};
        let dominantEmotion = null;
        let maxScore = 0;

        Object.entries(this.emotionLexicon).forEach(([emotion, keywords]) => {
            const matches = words.filter(word => keywords.includes(word));
            const score = matches.length / words.length;
            emotions[emotion] = {
                score,
                matches: matches
            };

            if (score > maxScore) {
                maxScore = score;
                dominantEmotion = emotion;
            }
        });

        return {
            emotions,
            dominant: dominantEmotion,
            confidence: maxScore,
            intensity: this._calculateEmotionIntensity(emotions)
        };
    }

    detectSarcasm(text) {
        let sarcasmScore = 0;
        let evidence = [];

        // Check for contrasting statements
        this.sarcasmPatterns.contrasts.forEach(pattern => {
            if (pattern.test(text)) {
                sarcasmScore += 0.3;
                evidence.push('contrasting_statement');
            }
        });

        // Check for exaggerations
        this.sarcasmPatterns.exaggerations.forEach(pattern => {
            if (pattern.test(text)) {
                sarcasmScore += 0.2;
                evidence.push('exaggeration');
            }
        });

        // Check for quotation marks (potential air quotes)
        this.sarcasmPatterns.quotes.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
                sarcasmScore += 0.15 * matches.length;
                evidence.push('quoted_text');
            }
        });

        // Check for excessive punctuation
        this.sarcasmPatterns.punctuation.forEach(pattern => {
            if (pattern.test(text)) {
                sarcasmScore += 0.15;
                evidence.push('excessive_punctuation');
            }
        });

        return {
            isSarcastic: sarcasmScore > 0.5,
            score: Math.min(1, sarcasmScore),
            confidence: this._calculateSarcasmConfidence(sarcasmScore, evidence),
            evidence
        };
    }

    analyzeTrends(text) {
        const currentAnalysis = {
            sentiment: this.analyzeSentiment(text),
            emotions: this.detectEmotions(text),
            sarcasm: this.detectSarcasm(text),
            timestamp: Date.now()
        };

        this._updateAnalysisHistory(currentAnalysis);

        return {
            current: currentAnalysis,
            trends: this._calculateTrends(),
            patterns: this._identifyPatterns()
        };
    }

    _calculateEmotionIntensity(emotions) {
        const totalScore = Object.values(emotions)
            .reduce((sum, emotion) => sum + emotion.score, 0);
        
        if (totalScore > 0.8) return 'very high';
        if (totalScore > 0.6) return 'high';
        if (totalScore > 0.4) return 'moderate';
        if (totalScore > 0.2) return 'low';
        return 'very low';
    }

    _calculateSarcasmConfidence(score, evidence) {
        // More evidence types suggest higher confidence
        const evidenceWeight = evidence.length / 4; // Normalize by maximum possible evidence types
        return Math.min(1, (score + evidenceWeight) / 2);
    }

    _updateAnalysisHistory(analysis) {
        this.analysisHistory.push(analysis);
        if (this.analysisHistory.length > this.maxHistorySize) {
            this.analysisHistory.shift();
        }
    }

    _calculateTrends() {
        if (this.analysisHistory.length < 2) return null;

        const sentimentTrend = this._calculateMovingAverage(
            this.analysisHistory.map(a => a.sentiment.scores.positive - a.sentiment.scores.negative)
        );

        const emotionTrends = {};
        Object.keys(this.emotionLexicon).forEach(emotion => {
            emotionTrends[emotion] = this._calculateMovingAverage(
                this.analysisHistory.map(a => a.emotions.emotions[emotion]?.score || 0)
            );
        });

        return {
            sentiment: sentimentTrend,
            emotions: emotionTrends,
            period: {
                start: this.analysisHistory[0].timestamp,
                end: this.analysisHistory[this.analysisHistory.length - 1].timestamp
            }
        };
    }

    _calculateMovingAverage(values, window = 3) {
        if (values.length < window) return values;

        const result = [];
        for (let i = 0; i <= values.length - window; i++) {
            const avg = values
                .slice(i, i + window)
                .reduce((sum, val) => sum + val, 0) / window;
            result.push(avg);
        }
        return result;
    }

    _identifyPatterns() {
        if (this.analysisHistory.length < 5) return null;

        return {
            sentiment: this._detectPattern(
                this.analysisHistory.map(a => a.sentiment.scores.positive - a.sentiment.scores.negative)
            ),
            sarcasm: this._detectPattern(
                this.analysisHistory.map(a => a.sarcasm.score)
            ),
            volatility: this._calculateVolatility()
        };
    }

    _detectPattern(values) {
        const changes = values.slice(1).map((val, i) => val - values[i]);
        const increasingCount = changes.filter(c => c > 0).length;
        const decreasingCount = changes.filter(c => c < 0).length;
        
        if (increasingCount > changes.length * 0.7) return 'increasing';
        if (decreasingCount > changes.length * 0.7) return 'decreasing';
        if (Math.abs(increasingCount - decreasingCount) <= 1) return 'stable';
        return 'fluctuating';
    }

    _calculateVolatility() {
        const sentimentValues = this.analysisHistory.map(
            a => a.sentiment.scores.positive - a.sentiment.scores.negative
        );
        
        const mean = sentimentValues.reduce((sum, val) => sum + val, 0) / sentimentValues.length;
        const variance = sentimentValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sentimentValues.length;
        
        return {
            score: Math.sqrt(variance),
            level: this._getVolatilityLevel(Math.sqrt(variance))
        };
    }

    _getVolatilityLevel(volatility) {
        if (volatility > 0.8) return 'very high';
        if (volatility > 0.6) return 'high';
        if (volatility > 0.4) return 'moderate';
        if (volatility > 0.2) return 'low';
        return 'very low';
    }
} 