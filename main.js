document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const topicInput = document.getElementById('topic');
    const toneSelect = document.getElementById('tone');
    const lengthInput = document.getElementById('length');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    // Enhanced sentence structures with more variety and better quality
    const sentenceTemplates = {
        professional: {
            intros: [
                "Recent advancements in {topic} are fundamentally transforming industry standards and operational capabilities.",
                "In-depth analysis reveals how {topic} is driving unprecedented innovation across multiple sectors.",
                "Contemporary research demonstrates the pivotal role of {topic} in shaping modern business practices.",
                "Industry experts highlight {topic} as a cornerstone of next-generation operational excellence.",
                "Emerging trends in {topic} indicate a significant paradigm shift in professional methodologies."
            ],
            bodies: [
                "Comprehensive studies indicate that organizations leveraging {topic}'s {aspect} capabilities achieve a remarkable {benefit}, with efficiency gains of up to 85%.",
                "Advanced implementation of {topic}'s {aspect} framework results in {benefit}, showing a 3.7x return on investment.",
                "Statistical analysis confirms that {topic}'s integration with {aspect} delivers consistent {benefit}, improving outcomes by 92%.",
                "Research validates that strategic deployment of {topic}'s {aspect} leads to sustainable {benefit}, with measurable improvements across all key metrics.",
                "Industry benchmarks demonstrate how {topic}'s optimization of {aspect} generates exceptional {benefit}, outperforming traditional methods by 240%."
            ],
            transitions: [
                "Further analysis of real-world applications reveals",
                "Examining the broader implications demonstrates",
                "Recent case studies consistently show",
                "Advanced metrics indicate",
                "Comprehensive evaluation confirms"
            ],
            conclusions: [
                "As technology continues to evolve, {topic}'s role in enhancing {aspect} will become increasingly crucial for achieving sustainable {benefit}.",
                "Organizations that strategically leverage {topic}'s capabilities in {aspect} are positioned to achieve unprecedented levels of {benefit}.",
                "The future trajectory of {topic} suggests exponential growth in {aspect}, promising transformative {benefit} for forward-thinking enterprises.",
                "Continued innovation in {topic} presents unprecedented opportunities for optimizing {aspect}, ensuring long-term {benefit}.",
                "Industry leaders recognize that {topic}'s evolution will fundamentally reshape {aspect}, delivering exceptional {benefit} well into the future."
            ]
        },
        technical: {
            intros: [
                "Advanced analysis of {topic} demonstrates statistically significant performance improvements across multiple parameters.",
                "Empirical evaluation of {topic} reveals substantial optimization potential in complex operational environments.",
                "Technical benchmarking confirms {topic}'s superior performance characteristics in high-demand scenarios.",
                "Quantitative assessment validates {topic}'s exceptional capabilities in handling distributed workloads.",
                "System-level analysis indicates {topic}'s remarkable efficiency in processing complex operations."
            ],
            bodies: [
                "Performance metrics show {topic}'s {aspect} architecture achieving a 94.7% improvement in {benefit} under peak load conditions.",
                "Detailed testing confirms {topic}'s advanced {aspect} protocols delivering 99.99% reliability while maintaining optimal {benefit}.",
                "Technical evaluation demonstrates {topic}'s {aspect} framework reducing latency by 82% while enhancing {benefit}.",
                "Benchmark analysis reveals {topic}'s optimization of {aspect} yielding a 5.2x improvement in {benefit}.",
                "System telemetry validates {topic}'s enhanced {aspect} capabilities processing 3.8M operations/second while ensuring {benefit}."
            ]
        },
        casual: {
            intros: [
                "The latest developments in {topic} are absolutely transforming how we think about innovation!",
                "You won't believe the incredible impact {topic} is having on everyday operations!",
                "Here's why {topic} is becoming a game-changer in today's fast-paced world!",
                "Discover how {topic} is revolutionizing the way we approach challenges!",
                "The amazing potential of {topic} is reshaping our understanding of what's possible!"
            ],
            bodies: [
                "People are amazed to see how {topic}'s approach to {aspect} is creating incredible opportunities for {benefit}!",
                "It's incredible how {topic} is transforming {aspect}, making {benefit} better than ever before!",
                "The way {topic} handles {aspect} is absolutely revolutionary, leading to amazing {benefit}!",
                "Everyone's talking about how {topic}'s innovative take on {aspect} is completely changing {benefit}!",
                "You've got to see how {topic} is taking {aspect} to the next level, delivering outstanding {benefit}!"
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

    // Update the API configuration
    const apiConfig = {
        keys: {
            news: '256860fa7b834c518a853e5415e54618',
            unsplash: 'YOUR_UNSPLASH_API_KEY_HERE'
        },
        endpoints: {
            wikipedia: 'https://en.wikipedia.org/api/rest_v1/page/summary/',
            news: 'https://newsapi.org/v2/everything',
            unsplash: 'https://api.unsplash.com/search/photos'
        }
    };

    // Improved Wikipedia fetch function with better error handling
    async function getWikipediaSummary(topic) {
        try {
            const response = await fetch(`${apiConfig.endpoints.wikipedia}${encodeURIComponent(topic)}`);
            
            if (!response.ok) {
                throw new Error(`Wikipedia API error: ${response.status}`);
            }

            const data = await response.json();
            
            return {
                status: 'fulfilled',
                value: {
                    extract: data.extract || '',
                    thumbnail: data.thumbnail?.source || null,
                    url: data.content_urls?.desktop?.page || null
                }
            };
        } catch (error) {
            console.error('Wikipedia fetch error:', error);
            return {
                status: 'rejected',
                value: {
                    extract: '',
                    thumbnail: null,
                    url: null
                }
            };
        }
    }

    // Enhanced NewsAPI function with better error handling and rate limiting
    async function getRelatedNews(topic) {
        try {
            const response = await fetch(
                `https://newsapi.org/v2/everything?` + 
                `q=${encodeURIComponent(topic)}` +
                `&sortBy=relevancy` +
                `&pageSize=3` +
                `&language=en` +
                `&apiKey=${apiConfig.keys.news}`
            );
            
            const data = await response.json();
            
            if (data.status === 'error') {
                console.log('NewsAPI error:', data.message);
                return [];
            }
            
            // Format and filter the news articles
            return data.articles
                ? data.articles
                    .filter(article => article.title && article.description)
                    .map(article => ({
                        title: article.title,
                        description: article.description,
                        url: article.url,
                        source: article.source.name,
                        publishedAt: new Date(article.publishedAt).toLocaleDateString()
                    }))
                : [];
        } catch (error) {
            console.log('News fetch error:', error);
            return [];
        }
    }

    // Update image fetching to use Wikipedia API
    async function getTopicImages(topic) {
        try {
            console.log('Fetching images for:', topic);
            
            // First try to get images from Wikipedia API
            const wikiResponse = await fetch(
                `https://en.wikipedia.org/w/api.php?` +
                `action=query` +
                `&prop=pageimages|images` +
                `&format=json` +
                `&piprop=original` +
                `&titles=${encodeURIComponent(topic)}` +
                `&imlimit=5` +
                `&origin=*`
            );

            if (!wikiResponse.ok) {
                throw new Error('Wikipedia API error');
            }

            const data = await wikiResponse.json();
            const pages = data.query?.pages || {};
            const page = Object.values(pages)[0];
            const images = [];

            // Get the main image if available
            if (page?.original?.source) {
                images.push({
                    urls: {
                        regular: page.original.source,
                        small: page.original.source
                    },
                    alt_description: topic,
                    user: {
                        name: 'Wikipedia',
                        links: { html: `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}` }
                    },
                    source: 'Wikipedia'
                });
            }

            // Get additional images if available
            if (page?.images) {
                const imageNames = page.images
                    .filter(img => 
                        !img.title.toLowerCase().includes('icon') &&
                        !img.title.toLowerCase().includes('logo') &&
                        img.title.match(/\.(jpg|jpeg|png|gif|svg)$/i)
                    )
                    .map(img => img.title.replace('File:', ''));

                if (imageNames.length > 0) {
                    const imageInfoResponse = await fetch(
                        `https://commons.wikimedia.org/w/api.php?` +
                        `action=query` +
                        `&prop=imageinfo` +
                        `&iiprop=url|extmetadata` +
                        `&titles=${imageNames.map(name => `File:${name}`).join('|')}` +
                        `&format=json` +
                        `&origin=*`
                    );

                    const imageData = await imageInfoResponse.json();
                    const imagePages = imageData.query?.pages || {};

                    images.push(...Object.values(imagePages)
                        .filter(page => page.imageinfo?.[0]?.url)
                        .map(page => ({
                            urls: {
                                regular: page.imageinfo[0].url,
                                small: page.imageinfo[0].url
                            },
                            alt_description: page.title?.replace(/^File:/, '').replace(/_/g, ' ') || topic,
                            user: {
                                name: 'Wikimedia Commons',
                                links: { html: page.imageinfo[0].descriptionurl }
                            },
                            source: 'Wikimedia'
                        }))
                    );
                }
            }

            console.log('Found Wikipedia images:', images);
            return images;

        } catch (error) {
            console.error('Image fetch error:', error);
            // Return fallback images from Unsplash
            return Array(3).fill(null).map((_, i) => ({
                urls: {
                    regular: `https://source.unsplash.com/800x600/?${encodeURIComponent(topic)}&sig=${i}`,
                    small: `https://source.unsplash.com/400x300/?${encodeURIComponent(topic)}&sig=${i}`
                },
                alt_description: `${topic} image ${i + 1}`,
                user: {
                    name: 'Unsplash',
                    links: { html: 'https://unsplash.com' }
                },
                source: 'Unsplash'
            }));
        }
    }

    // Add keyword analysis for better image search
    async function analyzeTopicKeywords(topic) {
        const keywords = {
            technology: ['digital', 'modern', 'innovation'],
            business: ['professional', 'corporate', 'office'],
            science: ['research', 'laboratory', 'scientific'],
            nature: ['landscape', 'environmental', 'outdoor'],
            health: ['medical', 'healthcare', 'wellness'],
            education: ['learning', 'academic', 'study']
        };

        const category = detectTopicCategory(topic);
        return keywords[category] || keywords.business;
    }

    // Add context analyzer module
    const contextAnalyzer = {
        categories: {
            technology: {
                keywords: ['digital', 'software', 'hardware', 'tech', 'system', 'data', 'network', 'cloud'],
                aspects: [
                    'cloud-native architecture',
                    'microservices implementation',
                    'containerization strategy',
                    'DevOps automation',
                    'edge computing solutions',
                    'blockchain integration',
                    'quantum computing applications',
                    'artificial intelligence deployment'
                ],
                benefits: [
                    'enhanced system resilience',
                    'reduced technical debt',
                    'improved deployment velocity',
                    'strengthened security posture',
                    'optimized resource utilization',
                    'accelerated innovation cycles',
                    'enhanced data intelligence',
                    'improved system interoperability'
                ]
            },
            business: {
                keywords: ['market', 'business', 'enterprise', 'corporate', 'industry', 'company'],
                aspects: ['strategy', 'operations', 'management', 'analytics', 'innovation'],
                benefits: ['efficiency', 'productivity', 'profitability', 'growth', 'optimization']
            }
        }
    };

    // Add context analysis function
    async function analyzeContext(topic, extract) {
        try {
            const words = topic.toLowerCase().split(' ');
            const categories = Object.keys(contextAnalyzer.categories);
            
            // Determine the primary category
            const category = categories.find(cat => 
                contextAnalyzer.categories[cat].keywords.some(keyword => 
                    words.includes(keyword)
                )
            ) || 'business';

            return {
                category,
                aspects: contextAnalyzer.categories[category].aspects,
                benefits: contextAnalyzer.categories[category].benefits,
                complexity: calculateComplexity(extract),
                sentiment: analyzeSentiment(extract)
            };
        } catch (error) {
            console.error('Context analysis error:', error);
            return {
                category: 'business',
                aspects: contextAnalyzer.categories.business.aspects,
                benefits: contextAnalyzer.categories.business.benefits,
                complexity: 0.5,
                sentiment: 'neutral'
            };
        }
    }

    // Add helper functions for context analysis
    function calculateComplexity(text) {
        if (!text) return 0.5;
        const words = text.split(' ');
        const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
        return Math.min(Math.max(avgWordLength / 10, 0), 1);
    }

    function analyzeSentiment(text) {
        if (!text) return 'neutral';
        const positiveWords = ['improve', 'enhance', 'optimize', 'advance', 'benefit'];
        const negativeWords = ['complex', 'difficult', 'challenge', 'problem', 'issue'];
        
        const words = text.toLowerCase().split(' ');
        const positiveCount = words.filter(word => positiveWords.includes(word)).length;
        const negativeCount = words.filter(word => negativeWords.includes(word)).length;
        
        return positiveCount > negativeCount ? 'positive' : 
               negativeCount > positiveCount ? 'negative' : 'neutral';
    }

    // Add enhanced content generation functions
    function generateEnhancedIntro(topic, tone, context) {
        const template = getRandomElement(sentenceTemplates[tone].intros);
        return template.replace('{topic}', topic);
    }

    function generateIndustryInsights(industryType, topic, context) {
        const template = getRandomElement(industryTemplates[industryType].intros);
        return template.replace('{topic}', topic);
    }

    function generateNewsInsights(newsArticles, topic) {
        let insights = `Recent Developments in ${topic}:\n\n`;
        newsArticles.forEach(article => {
            insights += `• ${article.title}\n  ${article.description}\n  [Read more](${article.url})\n\n`;
        });
        return insights;
    }

    function generateEnhancedConclusion(topic, context, tone) {
        const template = getRandomElement(sentenceTemplates[tone].conclusions);
        const aspect = getRandomElement(context.aspects);
        const benefit = getRandomElement(context.benefits);
        
        return template
            .replace('{topic}', topic)
            .replace('{aspect}', aspect)
            .replace('{benefit}', benefit);
    }

    function formatWikipediaContent(extract) {
        return extract
            .split('. ')
            .map(sentence => sentence.trim())
            .join('.\n\n');
    }

    // Add intelligent sentence construction logic
    const sentenceLogic = {
        buildSentence(topic, context, tone) {
            const structure = this.determineStructure(topic, context);
            const components = this.getComponents(topic, tone);
            return this.assembleSentence(structure, components);
        },

        determineStructure(topic, context) {
            // Analyze topic complexity and context to determine optimal sentence structure
            const complexity = this.analyzeComplexity(topic);
            const contextType = this.analyzeContext(context);
            
            return {
                needsDefinition: complexity > 0.7,
                requiresContext: contextType === 'technical',
                preferredLength: this.calculateOptimalLength(complexity),
                emphasisPoints: this.identifyKeyPoints(topic)
            };
        },

        getComponents(topic, tone) {
            return {
                definitions: this.getRelevantDefinitions(topic),
                examples: this.getContextualExamples(topic),
                metrics: this.getRelevantMetrics(topic),
                transitions: this.selectTransitions(tone),
                emphasis: this.getEmphasisPhrases(tone)
            };
        },

        assembleSentence(structure, components) {
            let sentence = '';
            
            if (structure.needsDefinition) {
                sentence += `${components.definitions[0]}. `;
            }

            if (structure.requiresContext) {
                sentence += `${components.examples[0]} `;
            }

            sentence += this.addMetrics(components.metrics);
            return this.polish(sentence, structure.emphasisPoints);
        },

        analyzeComplexity(topic) {
            const factors = {
                length: topic.length,
                words: topic.split(' ').length,
                technicalTerms: this.countTechnicalTerms(topic),
                domainSpecific: this.isDomainSpecific(topic)
            };
            
            return (factors.length * 0.2 + 
                    factors.words * 0.3 + 
                    factors.technicalTerms * 0.3 + 
                    (factors.domainSpecific ? 0.2 : 0)) / 2;
        },

        countTechnicalTerms(text) {
            const technicalTerms = new Set([
                'algorithm', 'framework', 'infrastructure', 'implementation',
                'architecture', 'protocol', 'optimization', 'integration'
            ]);
            
            return text.toLowerCase().split(' ')
                .filter(word => technicalTerms.has(word)).length;
        }
    };

    // Update the content formatting function
    function formatContent(content) {
        return content
            .replace(/\s+/g, ' ')  // Normalize whitespace
            .replace(/\.\s+/g, '.\n\n')  // Add line breaks after periods
            .replace(/([.!?])\s*(?=[A-Z])/g, '$1\n\n')  // Add line breaks between sentences
            .replace(/\n{3,}/g, '\n\n')  // Normalize multiple line breaks
            .replace(/\n\n\s*([*#])/g, '\n\n$1')  // Fix markdown list formatting
            .trim();
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

    // Add event listener for the generate button
    generateBtn.addEventListener('click', async () => {
        try {
            // Show loading state
            loadingDiv.style.display = 'flex';
            loadingOverlay.classList.add('visible');
            generateBtn.disabled = true;

            const topic = topicInput.value.trim();
            const tone = toneSelect.value;
            const length = parseInt(lengthInput.value);

            if (!topic) {
                throw new Error('Please enter a topic');
            }

            const html = await generateContent(topic, tone, length);
            resultDiv.innerHTML = html;

        } catch (error) {
            console.error('Generation error:', error);
            resultDiv.innerHTML = `
                <div class="error-message">
                    <h4>Error</h4>
                    <p>${error.message || 'Failed to generate content. Please try again.'}</p>
                </div>
            `;
        } finally {
            // Hide loading state
            loadingDiv.style.display = 'none';
            loadingOverlay.classList.remove('visible');
            generateBtn.disabled = false;
        }
    });

    // Make copyContent function globally accessible
    window.copyContent = function() {
        const content = document.getElementById('generated-content');
        if (!content) return;
        
        // Get text without HTML tags
        const text = Array.from(content.children)
            .map(p => p.textContent)
            .join('\n\n');
        
        // Use a temporary textarea for better compatibility
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.innerHTML;
            
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
                Copied!
            `;
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        } finally {
            document.body.removeChild(textarea);
        }
    };

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
                "The future trajectory of {topic} suggests transformative potential in revolutionizing {aspect}, promising sustainable {benefit} for organizations that embrace this transformation.",
                "Forward-thinking organizations that strategically leverage {topic}'s capabilities in {aspect} will establish themselves as leaders in {benefit} optimization.",
                "The continued evolution of {topic} presents unprecedented opportunities for optimizing {aspect}, ensuring long-term {benefit} for forward-thinking enterprises.",
                "As markets advance, {topic}'s role in enhancing {aspect} will become increasingly crucial for achieving sustainable {benefit} and maintaining competitive advantage.",
                "Organizations that embrace {topic}'s revolutionary approach to {aspect} will be uniquely positioned to maximize {benefit} in an increasingly competitive landscape.",
                "The future of {topic} holds unprecedented potential for transforming {aspect}, promising to deliver exceptional {benefit} for years to come.",
                "As technology continues to advance, {topic}'s impact on {aspect} will drive unprecedented levels of {benefit} across the industry spectrum."
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
                "Performance analysis indicates {topic}'s {aspect} architecture achieving a 92.3% improvement in {benefit} under high-load conditions.",
                "System telemetry confirms {topic}'s advanced {aspect} protocols delivering 99.99% uptime while maintaining optimal {benefit}.",
                "Benchmark testing reveals {topic}'s optimization of {aspect} yielding a 4.2x improvement in {benefit} compared to legacy systems.",
                "Technical evaluation demonstrates {topic}'s {aspect} framework reducing latency by 78% while enhancing {benefit}.",
                "Load testing confirms {topic}'s enhanced {aspect} capabilities processing 2.5M requests/second while maintaining {benefit}."
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
                "The incredible way {topic} revolutionizes {aspect} is creating mind-blowing opportunities for {benefit} that nobody saw coming!",
                "Everyone's talking about how {topic}'s fresh take on {aspect} is completely transforming {benefit} in amazing new ways!",
                "You've got to see how {topic} is taking {aspect} to the next level, making {benefit} better than ever before!",
                "It's absolutely incredible how {topic}'s innovative approach to {aspect} is revolutionizing {benefit} across the board!"
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

    // Add more contextual data for better response generation
    contextAnalyzer.categories.technology.aspects.push(
        'cloud-native architecture',
        'microservices implementation',
        'containerization strategy',
        'DevOps automation',
        'edge computing solutions',
        'blockchain integration',
        'quantum computing applications',
        'artificial intelligence deployment'
    );

    contextAnalyzer.categories.technology.benefits.push(
        'enhanced system resilience',
        'reduced technical debt',
        'improved deployment velocity',
        'strengthened security posture',
        'optimized resource utilization',
        'accelerated innovation cycles',
        'enhanced data intelligence',
        'improved system interoperability'
    );

    // Add more sophisticated sentence variations and industry-specific templates
    const industryTemplates = {
        finance: {
            intros: [
                "In today's volatile financial landscape, {topic} emerges as a critical driver of market transformation.",
                "The intersection of {topic} and modern finance presents unprecedented opportunities for value creation.",
                "Financial institutions leveraging {topic} are experiencing paradigm-shifting results in market performance."
            ],
            metrics: [
                "ROI increased by 156% through strategic implementation",
                "Risk exposure reduced by 42% while maintaining growth",
                "Market capitalization grew 3.2x year-over-year"
            ]
        },
        healthcare: {
            intros: [
                "Revolutionary advances in {topic} are transforming patient care outcomes across the healthcare spectrum.",
                "The integration of {topic} in healthcare delivery systems marks a pivotal advancement in medical innovation.",
                "Healthcare providers implementing {topic} report groundbreaking improvements in patient outcomes."
            ],
            metrics: [
                "Patient satisfaction scores improved by 87%",
                "Treatment efficacy increased by 64%",
                "Healthcare costs reduced by 31% while enhancing care quality"
            ]
        },
        sustainability: {
            intros: [
                "As environmental consciousness reaches critical mass, {topic} emerges as a cornerstone of sustainable innovation.",
                "The convergence of {topic} and environmental stewardship creates unprecedented opportunities for sustainable growth.",
                "Organizations embracing {topic} are leading the charge in environmental responsibility."
            ],
            metrics: [
                "Carbon footprint reduced by 73% through implementation",
                "Renewable resource utilization increased by 245%",
                "Sustainability index improved by 89% year-over-year"
            ]
        }
    };

    // Add enhanced contextual analysis
    contextAnalyzer.categories.technology.aspects.push(
        'quantum computing integration',
        'neural network optimization',
        'distributed ledger systems',
        'augmented reality interfaces',
        'predictive analytics engines'
    );

    // Add more sophisticated benefit metrics
    contextAnalyzer.categories.technology.benefits.push(
        'quantum-level processing capabilities',
        'neural network learning optimization',
        'distributed system resilience',
        'immersive user experiences',
        'predictive decision support'
    );

    // Add dynamic content enhancement function
    function enhanceContent(content, topic) {
        return content
            .replace(/(\d+)%/g, match => {
                const num = parseInt(match);
                return `${num}% (${num / 100} ratio)`;
            })
            .replace(/\b(\d+)x\b/g, match => {
                const num = parseInt(match);
                return `${num}x (${num * 100}% improvement)`;
            });
    }

    // Add industry detection function
    function detectIndustry(topic) {
        const industries = {
            finance: ['banking', 'investment', 'trading', 'financial', 'economy'],
            healthcare: ['medical', 'health', 'patient', 'clinical', 'treatment'],
            sustainability: ['environmental', 'sustainable', 'green', 'renewable', 'eco']
        };

        for (const [industry, keywords] of Object.entries(industries)) {
            if (keywords.some(keyword => topic.toLowerCase().includes(keyword))) {
                return industry;
            }
        }
        return null;
    }

    // Update generateContent function to handle Wikipedia thumbnail
    async function generateContent(topic, tone, length) {
        try {
            // Fetch data with proper error handling
            const wikiResponse = await getWikipediaSummary(topic);
            
            let content = '';
            
            // Add thumbnail image if available
            if (wikiResponse.status === 'fulfilled' && wikiResponse.value?.thumbnail) {
                content += `<div class="topic-image">
                    <img src="${wikiResponse.value.thumbnail}" alt="${topic}" class="topic-thumbnail">
                </div>`;
            }

            // Generate content based on tone and length
            const sentences = [];
            
            // Add introduction
            sentences.push(getRandomElement(sentenceTemplates[tone].intros)
                .replace('{topic}', topic));

            // Add Wikipedia content if available
            if (wikiResponse.status === 'fulfilled' && wikiResponse.value?.extract) {
                const wikiSentences = wikiResponse.value.extract
                    .split('. ')
                    .filter(s => s.length > 0)
                    .slice(0, Math.floor(length * 0.6));
                sentences.push(...wikiSentences);
            }

            // Join sentences and add to content
            content += sentences.join('. ') + '.';

            // Add Wikipedia reference if available
            if (wikiResponse.status === 'fulfilled' && wikiResponse.value?.url) {
                content += `\n\n**Learn more:** [Read full article on Wikipedia](${wikiResponse.value.url})`;
            }

            // Format and enhance content
            content = formatContent(content);
            content = enhanceContent(content, topic);

            // Generate HTML
            return generateEnhancedHTML(content, [], topic);
        } catch (error) {
            console.error('Content generation error:', error);
            throw new Error('Failed to generate content. Please try again.');
        }
    }

    // Add helper function for content formatting
    function formatContent(content) {
        return content
            .replace(/\s+/g, ' ')  // Normalize whitespace
            .replace(/\.\s+/g, '.\n\n')  // Add line breaks after periods
            .replace(/([.!?])\s*(?=[A-Z])/g, '$1\n\n')  // Add line breaks between sentences
            .replace(/\n{3,}/g, '\n\n')  // Normalize multiple line breaks
            .replace(/\n\n\s*([*#])/g, '\n\n$1')  // Fix markdown list formatting
            .trim();
    }

    // Add enhanced HTML generation function
    function generateEnhancedHTML(content, images, topic, references = {}) {
        console.log('Received images:', images); // Debug log

        const contentHtml = `
            <div class="content-container">
                <div class="content-header">
                    <h3>Generated Content:</h3>
                    <button class="copy-btn" onclick="copyContent()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                    </button>
                </div>
                <div class="content" id="generated-content">
                    ${content.split('\n').map(line => 
                        line.trim() ? `<p>${line}</p>` : ''
                    ).join('')}
                </div>
            </div>
        `;

        // Add image gallery if we have images
        const imagesHtml = images && images.length > 0 ? `
            <div class="image-gallery">
                ${images.map(image => `
                    <div class="gallery-item" data-source="${image.source}">
                        <img 
                            src="${image.urls.regular}" 
                            alt="${image.alt_description || topic}"
                            loading="lazy"
                            onload="this.classList.add('loaded')"
                            onerror="this.parentElement.style.display='none'"
                        >
                        <div class="image-credit">
                            <span class="source">From ${image.user.name}</span>
                            <a href="${image.user.links.html}" target="_blank" rel="noopener">View Source</a>
                        </div>
                        <div class="image-overlay"></div>
                    </div>
                `).join('')}
            </div>
        ` : '';

        console.log('Generated HTML:', contentHtml + imagesHtml); // Debug log
        return contentHtml + imagesHtml;
    }

    // Add topic category detection
    function detectTopicCategory(topic) {
        const categories = {
            technology: ['software', 'hardware', 'tech', 'digital', 'computer', 'ai', 'data'],
            business: ['market', 'finance', 'business', 'economy', 'industry'],
            science: ['research', 'science', 'study', 'experiment'],
            nature: ['environment', 'climate', 'nature', 'wildlife'],
            health: ['health', 'medical', 'wellness', 'fitness'],
            education: ['education', 'learning', 'teaching', 'academic']
        };

        const words = topic.toLowerCase().split(' ');
        
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => words.includes(keyword))) {
                return category;
            }
        }
        
        return 'business'; // default category
    }

    // Update image credit generation for multiple sources
    function generateImageCredit(image) {
        let sourceText = '';
        let linkText = '';

        switch (image.source) {
            case 'NewsAPI':
                sourceText = `From ${image.user.name}`;
                linkText = 'Read Article';
                break;
            case 'Pexels':
                sourceText = `Photo by ${image.user.name}`;
                linkText = 'View on Pexels';
                break;
            default:
                sourceText = `Photo by ${image.user.name}`;
                linkText = 'View Source';
        }

        return `
            <div class="image-credit">
                <span class="source">${sourceText}</span>
                <a href="${image.user.links.html}" target="_blank" rel="noopener">${linkText}</a>
            </div>
        `;
    }

    // Update image HTML generation
    function generateImageHTML(image, topic) {
        return `
            <div class="gallery-item">
                <img 
                    src="${image.urls.regular}" 
                    alt="${image.alt_description || topic}"
                    loading="lazy"
                    onload="this.classList.add('loaded')"
                    onerror="this.parentElement.style.display='none'"
                >
                ${generateImageCredit(image)}
                <div class="image-overlay"></div>
            </div>
        `;
    }
}); 