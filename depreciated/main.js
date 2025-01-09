document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const topicInput = document.getElementById('topic');
    const toneSelect = document.getElementById('tone');
    const lengthInput = document.getElementById('length');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    // Enhanced sentence structures with more variety
    const sentenceTemplates = {
        professional: {
            intros: [
                "The field of {topic} is undergoing remarkable transformation, reshaping industries and creating new possibilities.",
                "Recent innovations in {topic} are fundamentally changing how we approach traditional challenges.",
                "In today's rapidly evolving landscape, {topic} stands at the forefront of technological advancement.",
                "The impact of {topic} on modern business practices cannot be overstated.",
                "As organizations embrace {topic}, we're witnessing unprecedented shifts in operational paradigms."
            ],
            bodies: [
                "Analysis reveals that {topic}'s approach to {aspect} delivers exceptional {benefit}, setting new industry benchmarks.",
                "By leveraging advanced {aspect}, {topic} consistently achieves remarkable {benefit} across diverse applications.",
                "Organizations implementing {topic} report significant improvements in {aspect}, leading to measurable {benefit}.",
                "Research indicates that {topic}'s integration with {aspect} creates sustainable {benefit} for forward-thinking enterprises.",
                "Case studies demonstrate how {topic}'s optimization of {aspect} generates substantial {benefit} in real-world scenarios."
            ],
            transitions: [
                "Furthermore, the data suggests",
                "This success extends beyond initial applications, as",
                "Building on these foundational insights,",
                "The implications become even more significant when",
                "What's particularly noteworthy is how"
            ],
            conclusions: [
                "Looking ahead, {topic}'s continued evolution in {aspect} promises to deliver even greater {benefit} for organizations worldwide.",
                "The future of {topic} appears exceptionally promising, particularly in its ability to enhance {aspect} and drive {benefit}.",
                "As {topic} continues to mature, its impact on {aspect} will undoubtedly lead to unprecedented levels of {benefit}.",
                "Organizations that embrace {topic}'s approach to {aspect} will be well-positioned to achieve sustainable {benefit}.",
                "The trajectory of {topic} suggests a future where enhanced {aspect} consistently delivers exceptional {benefit}."
            ]
        },
        casual: {
            intros: [
                "Have you noticed how {topic} is changing everything around us lately?",
                "It's amazing to see what's happening with {topic} these days!",
                "Let's talk about something really exciting - {topic} is absolutely transforming our world.",
                "You won't believe the incredible ways {topic} is shaping our future.",
                "I'm really excited to share what I've discovered about {topic}!"
            ],
            bodies: [
                "One of the coolest things about {topic} is how it makes {aspect} so much better, leading to amazing {benefit}.",
                "When you look at {aspect}, {topic} is totally changing the game by delivering incredible {benefit}.",
                "People are loving how {topic} transforms {aspect}, creating fantastic opportunities for {benefit}.",
                "The way {topic} handles {aspect} is brilliant, and it's giving us remarkable {benefit}.",
                "It's fascinating to see how {topic} improves {aspect}, making {benefit} better than ever before."
            ],
            transitions: [
                "And that's not even the best part -",
                "Here's where it gets really interesting:",
                "But wait, there's something even cooler:",
                "Now, check this out:",
                "Here's what really blows my mind:"
            ],
            conclusions: [
                "I can't wait to see how {topic} continues to improve {aspect} and create even more amazing {benefit}!",
                "The future of {topic} looks incredibly bright, especially when it comes to enhancing {aspect} and delivering fantastic {benefit}!",
                "We're just seeing the beginning of how {topic} will revolutionize {aspect} and bring us incredible {benefit}!",
                "Keep an eye on {topic} - it's going to make {aspect} even better and deliver amazing {benefit}!",
                "The possibilities for {topic} are endless, especially in how it'll transform {aspect} and create outstanding {benefit}!"
            ]
        },
        technical: {
            intros: [
                "Initial analysis of {topic} reveals sophisticated implementations of advanced algorithms and optimization patterns.",
                "Technical evaluation of {topic} demonstrates significant improvements in core performance metrics.",
                "Systematic review of {topic} indicates substantial advancements in processing efficiency.",
                "Empirical data suggests that {topic} represents a paradigm shift in technical capabilities.",
                "Performance benchmarks show that {topic} significantly outperforms traditional approaches."
            ],
            bodies: [
                "Implementation metrics indicate that {topic}'s handling of {aspect} achieves a 40% improvement in {benefit}.",
                "Technical analysis confirms {topic}'s optimization of {aspect} results in measurable {benefit} across all test cases.",
                "Benchmark testing reveals {topic}'s processing of {aspect} consistently delivers superior {benefit}.",
                "Performance data shows {topic}'s approach to {aspect} yields statistically significant {benefit}.",
                "System logs demonstrate {topic}'s management of {aspect} produces quantifiable improvements in {benefit}."
            ],
            transitions: [
                "Further analysis reveals",
                "Technical metrics indicate",
                "System telemetry shows",
                "Performance data suggests",
                "Benchmark results demonstrate"
            ],
            conclusions: [
                "Technical projections indicate {topic}'s continued refinement of {aspect} will yield exponential improvements in {benefit}.",
                "Benchmark forecasts suggest {topic}'s optimization of {aspect} will drive substantial gains in {benefit}.",
                "System analysis predicts {topic}'s evolution will significantly enhance {aspect}, maximizing {benefit}.",
                "Performance metrics indicate {topic}'s advancement in {aspect} will generate unprecedented levels of {benefit}.",
                "Technical roadmaps suggest {topic}'s development will revolutionize {aspect}, optimizing {benefit}."
            ]
        }
    };

    // Enhanced aspect and benefit generators
    const contextualData = {
        benefits: [
            "improved efficiency",
            "enhanced productivity",
            "competitive advantage",
            "sustainable growth",
            "operational excellence",
            "increased value creation",
            "better user engagement",
            "optimized performance",
            "strategic advancement",
            "measurable results"
        ],
        aspects: {
            general: [
                "strategic planning",
                "resource optimization",
                "quality management",
                "process improvement",
                "innovation initiatives",
                "market adaptation",
                "system integration",
                "performance metrics",
                "development cycles",
                "implementation strategies"
            ],
            specific: (topic) => [
                `${topic} management`,
                `${topic} strategy`,
                `${topic} optimization`,
                `${topic} development`,
                `${topic} integration`
            ]
        }
    };

    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Function to fetch Wikipedia summary
    async function getWikipediaSummary(topic) {
        try {
            const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
            const data = await response.json();
            return {
                extract: data.extract || '',
                thumbnail: data.thumbnail?.source || null,
                url: data.content_urls?.desktop?.page || null
            };
        } catch (error) {
            console.log('Wikipedia fetch error:', error);
            return {
                extract: '',
                thumbnail: null,
                url: null
            };
        }
    }

    // Update the API keys section
    const apiKeys = {
        wikipedia: '', // No key needed
        news: '256860fa7b834c518a853e5415e54618'  // Your NewsAPI key
    };

    // Update the getRelatedNews function with better error handling
    async function getRelatedNews(topic) {
        try {
            const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&sortBy=relevancy&pageSize=3&apiKey=${apiKeys.news}`);
            const data = await response.json();
            
            if (data.status === 'error') {
                console.log('NewsAPI error:', data.message);
                return [];
            }
            
            return data.articles ? data.articles : [];
        } catch (error) {
            console.log('News fetch error:', error);
            return [];
        }
    }

    // Add this context analyzer before the generateContent function
    const contextAnalyzer = {
        // Topic categories and their related aspects
        categories: {
            technology: {
                keywords: ['ai', 'software', 'digital', 'tech', 'computer', 'internet', 'blockchain', 'data', 'cloud', 'automation'],
                aspects: [
                    'system architecture',
                    'user experience',
                    'data processing',
                    'security protocols',
                    'scalability solutions',
                    'integration capabilities',
                    'performance optimization',
                    'machine learning models',
                    'cloud infrastructure',
                    'automation workflows'
                ],
                benefits: [
                    'improved efficiency',
                    'enhanced security',
                    'seamless user experience',
                    'increased automation',
                    'reduced operational costs',
                    'faster processing times',
                    'better scalability',
                    'improved reliability',
                    'enhanced data insights',
                    'future-proof solutions'
                ]
            },
            business: {
                keywords: ['management', 'business', 'marketing', 'finance', 'strategy', 'enterprise', 'market'],
                aspects: [
                    'market positioning',
                    'revenue optimization',
                    'customer engagement',
                    'operational efficiency',
                    'strategic planning',
                    'brand development',
                    'market penetration',
                    'resource allocation',
                    'risk management',
                    'growth strategies'
                ],
                benefits: [
                    'increased revenue',
                    'market leadership',
                    'customer satisfaction',
                    'competitive advantage',
                    'sustainable growth',
                    'brand recognition',
                    'operational excellence',
                    'cost optimization',
                    'market share growth',
                    'stakeholder value'
                ]
            },
            healthcare: {
                keywords: ['health', 'medical', 'healthcare', 'patient', 'clinical', 'treatment', 'diagnosis', 'therapy'],
                aspects: [
                    'patient care',
                    'treatment protocols',
                    'diagnostic accuracy',
                    'clinical workflows',
                    'healthcare delivery',
                    'medical research',
                    'patient outcomes',
                    'preventive care',
                    'medical technology',
                    'health monitoring'
                ],
                benefits: [
                    'improved patient outcomes',
                    'enhanced care quality',
                    'reduced treatment times',
                    'better diagnostic accuracy',
                    'increased patient satisfaction',
                    'streamlined workflows',
                    'cost-effective care',
                    'preventive health measures',
                    'personalized treatment',
                    'evidence-based results'
                ]
            },
            education: {
                keywords: ['education', 'learning', 'teaching', 'academic', 'student', 'school', 'training', 'curriculum'],
                aspects: [
                    'learning methods',
                    'educational content',
                    'student engagement',
                    'assessment systems',
                    'teaching strategies',
                    'curriculum design',
                    'skill development',
                    'knowledge retention',
                    'learning outcomes',
                    'educational technology'
                ],
                benefits: [
                    'improved learning outcomes',
                    'enhanced student engagement',
                    'better knowledge retention',
                    'personalized learning',
                    'skill mastery',
                    'educational accessibility',
                    'measurable progress',
                    'collaborative learning',
                    'practical application',
                    'lifelong learning'
                ]
            },
            environmental: {
                keywords: ['environment', 'sustainable', 'green', 'eco', 'climate', 'renewable', 'conservation'],
                aspects: [
                    'sustainability practices',
                    'environmental impact',
                    'resource conservation',
                    'energy efficiency',
                    'waste reduction',
                    'carbon footprint',
                    'ecological balance',
                    'renewable solutions',
                    'conservation methods',
                    'environmental monitoring'
                ],
                benefits: [
                    'reduced environmental impact',
                    'sustainable operations',
                    'resource efficiency',
                    'energy savings',
                    'waste minimization',
                    'carbon reduction',
                    'ecological preservation',
                    'environmental compliance',
                    'green innovation',
                    'natural resource protection'
                ]
            },
            finance: {
                keywords: ['finance', 'investment', 'banking', 'trading', 'fintech', 'cryptocurrency', 'economics'],
                aspects: [
                    'risk assessment',
                    'portfolio management',
                    'market analysis',
                    'investment strategy',
                    'financial planning',
                    'wealth management',
                    'asset allocation',
                    'trading systems',
                    'regulatory compliance',
                    'financial forecasting'
                ],
                benefits: [
                    'increased returns',
                    'reduced risk exposure',
                    'portfolio optimization',
                    'market outperformance',
                    'improved liquidity',
                    'better risk management',
                    'enhanced compliance',
                    'strategic positioning',
                    'capital preservation',
                    'sustainable growth'
                ]
            }
        },

        // Determine the category of a topic
        analyzeContext(topic) {
            const words = topic.toLowerCase().split(' ');
            let bestMatch = {
                category: 'general',
                matchCount: 0
            };

            for (const [category, data] of Object.entries(this.categories)) {
                const matchCount = words.reduce((count, word) => {
                    return count + (data.keywords.includes(word) ? 1 : 0);
                }, 0);

                if (matchCount > bestMatch.matchCount) {
                    bestMatch = { category, matchCount };
                }
            }

            return bestMatch.category;
        },

        // Get contextually appropriate aspects and benefits
        getContextualData(topic) {
            const category = this.analyzeContext(topic);
            const categoryData = this.categories[category] || {
                aspects: contextualData.aspects.general,
                benefits: contextualData.benefits
            };

        return {
                aspects: [
                    ...categoryData.aspects,
                    ...contextualData.aspects.specific(topic)
                ],
                benefits: categoryData.benefits
            };
        }
    };

    // Update the generateContent function to initialize the sets
    async function generateContent(topic, tone, length) {
        try {
            const [wikiData, newsArticles] = await Promise.all([
                getWikipediaSummary(topic).catch(error => ({
                    extract: '',
                    thumbnail: null,
                    url: null
                })),
                getRelatedNews(topic).catch(error => [])
            ]);
            
            const templates = sentenceTemplates[tone];
            const contextData = contextAnalyzer.getContextualData(topic);
            const aspects = contextData.aspects;
            const benefits = contextData.benefits;
            
            // Initialize the tracking sets
            const usedAspects = new Set();
            const usedBenefits = new Set();

            let content = '';

            // Introduction with context awareness
            content += getRandomElement(templates.intros).replace('{topic}', topic) + ' ';
            
            if (wikiData.extract) {
                content += '\n\n' + wikiData.extract + '\n\n';
            }

            // Generate content based on sentence count instead of paragraphs
            const sentenceCount = parseInt(length); // Now directly represents number of sentences
            const paragraphSize = 3; // sentences per paragraph
            const paragraphCount = Math.ceil(sentenceCount / paragraphSize);
            
            let sentencesGenerated = 0;
            
            for (let i = 0; i < paragraphCount && sentencesGenerated < sentenceCount; i++) {
                if (i > 0) {
                    content += '\n\n' + getRandomElement(templates.transitions) + ' ';
                }

                // Generate sentences for this paragraph
                const sentencesInParagraph = Math.min(
                    paragraphSize,
                    sentenceCount - sentencesGenerated
                );

                for (let j = 0; j < sentencesInParagraph; j++) {
                    let aspect = getRandomElement(aspects.filter(a => !usedAspects.has(a)));
                    let benefit = getRandomElement(benefits.filter(b => !usedBenefits.has(b)));
                    
                    if (!aspect) {
                        usedAspects.clear();
                        aspect = getRandomElement(aspects);
                    }
                    if (!benefit) {
                        usedBenefits.clear();
                        benefit = getRandomElement(benefits);
                    }

                    usedAspects.add(aspect);
                    usedBenefits.add(benefit);

                    const bodyTemplate = getRandomElement(templates.bodies)
                        .replace(/{topic}/g, topic)
                        .replace(/{aspect}/g, aspect)
                        .replace(/{benefit}/g, benefit);
                    
                    content += bodyTemplate + ' ';
                    sentencesGenerated++;
                }
            }

            // Add related news if available
            if (Array.isArray(newsArticles) && newsArticles.length > 0) {
                content += '\n\n**Recent Related News:**\n';
                newsArticles.forEach(article => {
                    if (article && article.title && article.url && article.source) {
                        content += `- [${article.title}](${article.url}) - ${article.source.name}\n`;
                    }
                });
            }

            // Add Wikipedia reference if available
            if (wikiData.url) {
                content += `\n\n**Learn more:** [Read full article on Wikipedia](${wikiData.url})`;
            }

            // Generate conclusion
            content += '\n\n' + getRandomElement(templates.conclusions)
                .replace('{topic}', topic)
                .replace('{aspect}', getRandomElement(aspects))
                .replace('{benefit}', getRandomElement(benefits));

            return {
                content,
                thumbnail: wikiData.thumbnail,
                news: Array.isArray(newsArticles) ? newsArticles : [],
                references: {
                    wikipedia: wikiData.url,
                    newsCount: Array.isArray(newsArticles) ? newsArticles.length : 0
                }
            };
        } catch (error) {
            console.error('Content generation error:', error);
            throw new Error('Failed to generate content. Please try again.');
        }
    }

    // Add metrics collector
    const metrics = {
        generations: 0,
        topics: new Map(),
        tones: new Map(),
        startTime: Date.now(),
        errors: [],

        trackGeneration(topic, tone, length) {
            this.generations++;
            this.topics.set(topic, (this.topics.get(topic) || 0) + 1);
            this.tones.set(tone, (this.tones.get(tone) || 0) + 1);
        },

        trackError(error) {
            this.errors.push({
                timestamp: new Date().toISOString(),
                message: error.message
            });
        },

        getReport() {
        return {
                uptime: Date.now() - this.startTime,
                totalGenerations: this.generations,
                topTopics: Array.from(this.topics.entries())
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5),
                toneUsage: Object.fromEntries(this.tones),
                recentErrors: this.errors.slice(-5)
            };
        }
    };

    // Add metrics display
    const metricsBtn = document.createElement('button');
    metricsBtn.textContent = 'Show Metrics';
    metricsBtn.className = 'metrics-btn';
    document.querySelector('.container').appendChild(metricsBtn);

    metricsBtn.addEventListener('click', () => {
        const report = metrics.getReport();
        resultDiv.innerHTML = `
            <div class="metrics-content">
                <h3>System Metrics</h3>
                
                <div class="metric-grid">
                    <div class="metric-card">
                        <h4>Uptime</h4>
                        <span class="metrics-value">${Math.floor(report.uptime / 1000)} seconds</span>
                    </div>
                    <div class="metric-card">
                        <h4>Total Generations</h4>
                        <span class="metrics-value">${report.totalGenerations}</span>
                    </div>
                </div>

                <h4>Top Topics</h4>
                <ul>
                    ${report.topTopics.map(([topic, count]) => `
                        <li>
                            <span>${topic}</span>
                            <span class="metrics-value">${count} generations</span>
                        </li>
                    `).join('')}
                </ul>

                <h4>Tone Usage</h4>
                <ul>
                    ${Object.entries(report.toneUsage).map(([tone, count]) => `
                        <li>
                            <span>${tone}</span>
                            <span class="metrics-value">${count} uses</span>
                        </li>
                    `).join('')}
                </ul>

                ${report.recentErrors.length ? `
                    <h4>Recent Errors</h4>
                    <ul class="error-list">
                        ${report.recentErrors.map(error => `
                            <li>
                                <span>${new Date(error.timestamp).toLocaleString()}</span>
                                <span>${error.message}</span>
                            </li>
                        `).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
    });

    // Add this after your existing DOM elements
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    document.body.appendChild(loadingOverlay);

    // Update the click handler
    generateBtn.addEventListener('click', async () => {
        try {
            const topic = topicInput.value;
            const tone = toneSelect.value;
            const length = parseInt(lengthInput.value);

            // Show loading state
            loadingDiv.classList.add('visible');
            loadingOverlay.classList.add('visible');
            resultDiv.innerHTML = '';
            generateBtn.disabled = true;

            metrics.trackGeneration(topic, tone, length);

            // Get all content including news and Wikipedia data
            const { content, thumbnail, news, references } = await generateContent(topic, tone, length);

            // Hide loading state
            loadingDiv.classList.remove('visible');
            loadingOverlay.classList.remove('visible');

            let html = `<h3>Generated Content:</h3>`;
            
            // Add thumbnail if available
            if (thumbnail) {
                html += `
                    <div class="content-header">
                        <img src="${thumbnail}" alt="${topic}" class="topic-thumbnail">
                    </div>
                `;
            }
            
            // Add main content
            html += `<div class="content">${content}</div>`;

            // Add news section if available
            if (news && news.length > 0) {
                html += `
                    <div class="news-section">
                        <h4>Recent News About ${topic}</h4>
                        ${news.map(article => `
                            <div class="news-item">
                                <a href="${article.url}" target="_blank">${article.title}</a>
                                <span class="news-source">${article.source.name}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            // Add references section
            if (references.wikipedia || references.newsCount > 0) {
                html += `
                    <div class="references-section">
                        <h4>Sources:</h4>
                        <ul>
                            ${references.wikipedia ? `<li>Wikipedia Article</li>` : ''}
                            ${references.newsCount > 0 ? `<li>${references.newsCount} News Articles</li>` : ''}
                        </ul>
                    </div>
                `;
            }

            resultDiv.innerHTML = html;
        } catch (error) {
            metrics.trackError(error);
            resultDiv.innerHTML = `
                <div class="error">Error: ${error.message}</div>
            `;
        } finally {
            // Ensure loading state is hidden
            loadingDiv.classList.remove('visible');
            loadingOverlay.classList.remove('visible');
            generateBtn.disabled = false;
        }
    });

    // Update the HTML select element for length
    const lengthSelect = document.getElementById('length');
    lengthSelect.innerHTML = `
        <option value="3">Very Brief (3 sentences)</option>
        <option value="5">Brief (5 sentences)</option>
        <option value="8" selected>Medium (8 sentences)</option>
        <option value="12">Long (12 sentences)</option>
        <option value="15">Detailed (15 sentences)</option>
    `;

    // Add more sophisticated sentence templates
    const additionalTemplates = {
        professional: {
            intros: [
                "The evolution of {topic} marks a pivotal moment in industry transformation, setting new benchmarks for excellence.",
                "In an era defined by rapid innovation, {topic} emerges as a cornerstone of strategic advancement.",
                "Forward-thinking organizations are increasingly recognizing {topic} as a catalyst for transformative change.",
                "The convergence of market demands and technological capabilities has positioned {topic} at the forefront of innovation.",
                "As industries navigate digital transformation, {topic} stands out as a key driver of organizational success."
            ],
            bodies: [
                "Through strategic implementation of {aspect}, {topic} demonstrates remarkable capability in delivering {benefit} across diverse scenarios.",
                "Comprehensive analysis reveals how {topic}'s innovative approach to {aspect} consistently yields exceptional {benefit} for stakeholders.",
                "By leveraging cutting-edge {aspect}, {topic} establishes new paradigms for achieving sustainable {benefit} in today's dynamic environment.",
                "The integration of advanced {aspect} within {topic} frameworks has proven instrumental in maximizing {benefit} across operations.",
                "Expert evaluation confirms that {topic}'s sophisticated {aspect} methodology significantly enhances {benefit} potential."
            ],
            transitions: [
                "In examining broader implications,",
                "From a strategic perspective,",
                "Considering market dynamics,",
                "Through deeper analysis,",
                "In the context of industry evolution,"
            ],
            conclusions: [
                "As the landscape continues to evolve, {topic}'s innovative approach to {aspect} positions organizations to achieve unprecedented levels of {benefit}.",
                "The future trajectory of {topic} suggests transformative potential in revolutionizing {aspect}, promising sustainable {benefit} for years to come.",
                "Organizations that strategically leverage {topic}'s capabilities in {aspect} will be well-positioned to maximize {benefit} in an increasingly competitive environment.",
                "The continued evolution of {topic} presents unprecedented opportunities for optimizing {aspect}, ensuring long-term {benefit} for forward-thinking enterprises.",
                "As markets advance, {topic}'s role in enhancing {aspect} will become increasingly crucial for achieving sustainable {benefit}."
            ]
        },
        technical: {
            intros: [
                "Quantitative analysis of {topic} reveals significant performance improvements across key metrics and operational parameters.",
                "Advanced algorithmic evaluation of {topic} demonstrates exceptional optimization potential in complex systems.",
                "Technical benchmarking indicates that {topic} substantially outperforms conventional methodologies in critical areas.",
                "Comprehensive system analysis confirms {topic}'s superior performance in high-demand environments.",
                "Performance metrics validate {topic}'s exceptional capabilities in handling complex computational challenges."
            ],
            bodies: [
                "Implementation data shows {topic}'s {aspect} architecture achieving a remarkable 65% improvement in {benefit} under load testing.",
                "System telemetry confirms that {topic}'s advanced {aspect} protocols deliver consistent {benefit} across all operational scenarios.",
                "Performance analysis indicates {topic}'s optimization of {aspect} yields a 3x improvement in {benefit} compared to baseline metrics.",
                "Technical evaluation demonstrates {topic}'s innovative {aspect} framework providing sustainable {benefit} at scale.",
                "Benchmark testing reveals {topic}'s enhanced {aspect} capabilities generating significant improvements in {benefit}."
            ],
            transitions: [
                "Analyzing performance metrics further,",
                "Examining system architecture details,",
                "Evaluating operational parameters,",
                "Through algorithmic analysis,",
                "Based on performance telemetry,"
            ]
        },
        casual: {
            intros: [
                "You're not going to believe the incredible breakthroughs happening with {topic} right now!",
                "Get ready to have your mind blown by what {topic} is doing these days!",
                "Want to hear something amazing? {topic} is completely revolutionizing everything!",
                "Here's the really cool thing about {topic} that everyone's talking about!",
                "I'm super excited to share these game-changing developments in {topic}!"
            ],
            bodies: [
                "The way {topic} handles {aspect} is absolutely mind-blowing, creating incredible opportunities for {benefit}!",
                "It's incredible how {topic}'s approach to {aspect} is totally transforming the way we think about {benefit}!",
                "Everyone's amazed by how {topic} is revolutionizing {aspect}, making {benefit} better than ever!",
                "The innovation in {topic}'s {aspect} is seriously next-level, delivering amazing {benefit} like never before!",
                "You won't believe how {topic}'s new take on {aspect} is completely changing the game for {benefit}!"
            ]
        }
    };

    // Merge the additional templates with existing ones
    Object.keys(sentenceTemplates).forEach(tone => {
        Object.keys(additionalTemplates[tone]).forEach(type => {
            sentenceTemplates[tone][type] = [
                ...sentenceTemplates[tone][type],
                ...additionalTemplates[tone][type]
            ];
        });
    });
}); 