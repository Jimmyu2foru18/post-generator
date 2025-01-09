import { ChainOfThought } from './chainOfThought.js';

export const templateLibrary = {
    openings: {
        general: [
            `🚀 Revolutionary insights about ${topic} that are changing the game`,
            `💡 Groundbreaking developments in ${topic} you need to know`,
            `🔥 The future of ${topic} is here, and it's extraordinary`,
            `⚡️ Breaking: ${topic} reshapes industry standards`,
            `🌟 Discover how ${topic} is revolutionizing everything`,
            `📈 ${topic} leads unprecedented growth`,
            `🎯 Why ${topic} is the next big thing`,
            `🔮 The evolution of ${topic}: A game-changing perspective`,
            `💪 Unleashing the power of ${topic}`,
            `🎉 Game-changing breakthroughs in ${topic}`,
            `🌈 Transform your perspective on ${topic}`,
            `⭐️ Expert insights: ${topic} redefined`,
            `🔄 The revolution of ${topic} continues`,
            `📱 Digital transformation through ${topic}`,
            `🎨 Innovative approaches to ${topic}`,
            `🚦 Green light for ${topic} advancement`,
            `🎭 The changing face of ${topic}`,
            `🎪 Welcome to the future of ${topic}`,
            `🎢 The exciting journey of ${topic}`,
            `🎯 Targeting excellence with ${topic}`
        ],
        industry_specific: {
            technology: [
                `⚡️ Tech breakthrough: ${topic} transforms digital landscape`,
                `🔮 Future of tech: ${topic} leads innovation`,
                `🤖 AI-powered: ${topic} revolutionizes tech`,
                `🌐 Web3 meets ${topic}: A new era begins`,
                `📱 Mobile-first: ${topic} changes everything`,
                `☁️ Cloud innovation: ${topic} scales new heights`,
                `🔒 Cybersecurity evolution: ${topic} leads the way`,
                `🔄 DevOps revolution: ${topic} streamlines development`,
                `🎮 Tech evolution: ${topic} breaks boundaries`,
                `💻 Digital transformation: ${topic} sets new standards`
            ],
            healthcare: [
                `🏥 Healthcare revolution: ${topic} improves patient care`,
                `🌟 Medical breakthrough: ${topic} changes everything`,
                `❤️ Patient care evolution: ${topic} leads the way`,
                `🧬 Clinical innovation: ${topic} transforms healthcare`,
                `🩺 Digital health: ${topic} revolutionizes care`,
                `🌡️ Medical advancement: ${topic} sets new standards`,
                `🚑 Emergency care: ${topic} saves lives`,
                `🧪 Laboratory breakthrough: ${topic} advances science`,
                `👨‍⚕️ Doctor's choice: ${topic} improves outcomes`,
                `🏨 Hospital innovation: ${topic} enhances care`
            ],
            finance: [
                `💰 Financial innovation: ${topic} transforms banking`,
                `📈 Market leader: ${topic} drives growth`,
                `🏦 Banking evolution: ${topic} changes finance`,
                `💳 Payment innovation: ${topic} revolutionizes transactions`,
                `📊 Investment breakthrough: ${topic} maximizes returns`,
                `🤝 FinTech partnership: ${topic} leads change`,
                `📱 Mobile banking: ${topic} enhances access`,
                `🔐 Secure transactions: ${topic} protects assets`,
                `📑 Regulatory compliance: ${topic} ensures safety`,
                `💹 Market analysis: ${topic} predicts trends`
            ],
            education: [
                `📚 Learning revolution: ${topic} transforms education`,
                `🎓 Academic breakthrough: ${topic} enhances learning`,
                `✏️ Teaching innovation: ${topic} improves outcomes`,
                `🏫 Classroom evolution: ${topic} engages students`,
                `👩‍🏫 Educator's choice: ${topic} facilitates teaching`,
                `📝 Assessment innovation: ${topic} measures progress`,
                `🌈 Interactive learning: ${topic} captivates minds`,
                `🧩 Problem-solving: ${topic} develops skills`,
                `📖 Digital education: ${topic} expands access`,
                `🎯 Targeted learning: ${topic} personalizes education`
            ]
        }
    },

    insights: {
        technology: {
            software: [
                `${topic} accelerates development cycles by leveraging AI`,
                `Cloud-native ${topic} solutions scale automatically`,
                `${topic} enables seamless system integration`,
                `Microservices architecture in ${topic} improves flexibility`,
                `${topic} reduces technical debt through smart design`,
                `Containerized ${topic} deployment ensures consistency`,
                `${topic} automates repetitive development tasks`,
                `Real-time monitoring in ${topic} prevents issues`,
                `${topic} implements zero-trust security model`,
                `Edge computing enables faster ${topic} processing`
            ],
            hardware: [
                `${topic} optimizes processing power efficiency`,
                `Next-gen ${topic} hardware reduces energy consumption`,
                `${topic} enhances hardware performance metrics`,
                `Innovative ${topic} design minimizes heat generation`,
                `${topic} improves component durability`,
                `Advanced ${topic} circuitry maximizes throughput`,
                `${topic} enables seamless peripheral integration`,
                `Modular ${topic} design facilitates upgrades`,
                `${topic} hardware meets military-grade standards`,
                `Compact ${topic} form factor saves space`
            ],
            networking: [
                `${topic} accelerates network throughput`,
                `Advanced ${topic} routing optimizes traffic`,
                `${topic} enhances network security protocols`,
                `Distributed ${topic} architecture improves reliability`,
                `${topic} reduces network latency significantly`,
                `Intelligent ${topic} load balancing maximizes performance`,
                `${topic} enables seamless failover protection`,
                `Next-gen ${topic} protocols enhance bandwidth`,
                `${topic} strengthens network redundancy`,
                `Adaptive ${topic} routing prevents bottlenecks`
            ],
            cloud: [
                `${topic} enables elastic cloud scaling`,
                `Serverless ${topic} reduces operational overhead`,
                `${topic} optimizes cloud resource utilization`,
                `Multi-cloud ${topic} strategy enhances reliability`,
                `${topic} improves cloud cost efficiency`,
                `Advanced ${topic} orchestration simplifies management`,
                `${topic} ensures cloud data sovereignty`,
                `Hybrid ${topic} architecture maximizes flexibility`,
                `${topic} streamlines cloud migration`,
                `Intelligent ${topic} provisioning optimizes resources`
            ]
        },
        business: {
            strategy: [
                `${topic} drives strategic decision-making processes`,
                `Market leaders adopt ${topic} for competitive advantage`,
                `${topic} enables data-driven strategy formulation`,
                `Strategic ${topic} implementation boosts market share`,
                `${topic} aligns business goals with execution`,
                `Innovative ${topic} approach disrupts industry norms`,
                `${topic} accelerates strategic transformation`,
                `Agile ${topic} strategy adapts to market changes`,
                `${topic} optimizes resource allocation`,
                `Strategic ${topic} partnerships drive growth`
            ],
            operations: [
                `${topic} streamlines operational workflows`,
                `Process optimization through ${topic} implementation`,
                `${topic} reduces operational bottlenecks`,
                `Automated ${topic} operations increase efficiency`,
                `${topic} enhances supply chain visibility`,
                `Intelligent ${topic} scheduling optimizes resources`,
                `${topic} improves quality control measures`,
                `Real-time ${topic} monitoring prevents issues`,
                `${topic} reduces operational costs significantly`,
                `Scalable ${topic} operations support growth`
            ],
            marketing: [
                `${topic} personalizes customer engagement`,
                `Data-driven ${topic} campaigns increase ROI`,
                `${topic} optimizes marketing channel mix`,
                `Advanced ${topic} analytics improve targeting`,
                `${topic} enhances brand visibility`,
                `Multi-channel ${topic} strategy drives engagement`,
                `${topic} automation scales marketing efforts`,
                `Predictive ${topic} insights guide decisions`,
                `${topic} maximizes customer lifetime value`,
                `Interactive ${topic} content boosts conversion`
            ]
        },
        healthcare: {
            clinical: [
                `${topic} improves patient outcomes`,
                `Clinical ${topic} protocols enhance care quality`,
                `${topic} reduces treatment time significantly`,
                `Advanced ${topic} diagnostics increase accuracy`,
                `${topic} enables personalized treatment plans`,
                `Real-time ${topic} monitoring saves lives`,
                `${topic} streamlines clinical workflows`,
                `Evidence-based ${topic} protocols optimize care`,
                `${topic} reduces medical errors`,
                `Innovative ${topic} treatments show promise`
            ],
            research: [
                `${topic} accelerates medical discoveries`,
                `Research-backed ${topic} validates findings`,
                `${topic} enables breakthrough treatments`,
                `Clinical trials confirm ${topic} effectiveness`,
                `${topic} advances medical knowledge`,
                `Innovative ${topic} research shows potential`,
                `${topic} studies demonstrate efficacy`,
                `Peer-reviewed ${topic} research confirms benefits`,
                `${topic} opens new treatment possibilities`,
                `Groundbreaking ${topic} findings impact care`
            ]
        }
    },

    evidence: {
        statistical: [
            `${topic} improves efficiency by ${percentage}%`,
            `Organizations report ${percentage}% cost reduction with ${topic}`,
            `${topic} increases productivity by ${percentage}%`,
            `User satisfaction with ${topic} reaches ${percentage}%`,
            `${topic} reduces error rates by ${percentage}%`,
            `Implementation of ${topic} saves ${money} annually`,
            `${topic} accelerates processes by ${times}x`,
            `ROI of ${topic} exceeds ${percentage}%`,
            `${topic} reduces overhead by ${percentage}%`,
            `Market share grows ${percentage}% with ${topic}`
        ],
        case_studies: [
            `Fortune 500 company achieves ${percentage}% growth using ${topic}`,
            `Startup scales ${times}x faster with ${topic}`,
            `${company} reduces costs by ${percentage}% through ${topic}`,
            `${topic} implementation saves ${company} ${money} annually`,
            `${company} increases efficiency ${times}x with ${topic}`,
            `${topic} helps ${company} achieve record growth`,
            `${company} transforms operations using ${topic}`,
            `${topic} enables ${company} digital transformation`,
            `${company} leads industry with ${topic} adoption`,
            `${topic} drives ${company} innovation strategy`
        ],
        research: [
            `Latest research shows ${topic} effectiveness rate of ${percentage}%`,
            `Scientific studies validate ${topic} with ${percentage}% accuracy`,
            `Research demonstrates ${topic} improves outcomes by ${percentage}%`,
            `Clinical trials confirm ${topic} safety and efficacy`,
            `Peer-reviewed studies support ${topic} benefits`,
            `Research indicates ${topic} reduces risks by ${percentage}%`,
            `Scientific data validates ${topic} performance`,
            `Studies show ${topic} outperforms alternatives`,
            `Research proves ${topic} cost-effectiveness`,
            `Academic studies endorse ${topic} methodology`
        ]
    },

    conclusions: {
        impact_focused: [
            `${topic} is revolutionizing how we think about ${industry}`,
            `The impact of ${topic} extends beyond traditional boundaries`,
            `${topic} creates unprecedented opportunities in ${industry}`,
            `Industry leaders recognize ${topic}'s transformative power`,
            `${topic} delivers measurable results across ${industry}`,
            `The influence of ${topic} continues to expand globally`,
            `${topic} reshapes ${industry} best practices`,
            `Market dynamics shift as ${topic} gains momentum`,
            `${topic} demonstrates remarkable industry impact`,
            `${industry} evolution accelerates through ${topic}`
        ],
        future_oriented: [
            `${topic} sets the stage for next-gen innovation`,
            `Future developments in ${topic} promise even greater advances`,
            `${topic} paves the way for future breakthroughs`,
            `Emerging ${topic} trends signal exciting possibilities`,
            `${topic} innovation pipeline shows immense potential`,
            `Next-generation ${topic} solutions are on the horizon`,
            `${topic} development roadmap reveals ambitious goals`,
            `Future-ready ${topic} platforms enable growth`,
            `${topic} evolution continues to accelerate`,
            `Tomorrow's ${topic} innovations start today`
        ],
        call_to_action: [
            `Don't miss out on ${topic}'s transformative potential`,
            `Stay ahead of the curve with ${topic}`,
            `Embrace the future of ${topic} today`,
            `Transform your approach with ${topic}`,
            `Maximize your potential through ${topic}`,
            `Take the lead with innovative ${topic} solutions`,
            `Revolutionize your strategy using ${topic}`,
            `Accelerate growth with cutting-edge ${topic}`,
            `Partner with leaders in ${topic} innovation`,
            `Start your ${topic} journey now`
        ],
        industry_specific: {
            technology: [
                `${topic} defines the future of tech innovation`,
                `Digital transformation accelerates through ${topic}`,
                `${topic} sets new technology standards`,
                `Tech leaders embrace ${topic} solutions`,
                `${topic} drives digital excellence`
            ],
            healthcare: [
                `${topic} advances patient care standards`,
                `Healthcare outcomes improve with ${topic}`,
                `${topic} transforms medical practices`,
                `Patient experience evolves through ${topic}`,
                `${topic} enhances healthcare delivery`
            ],
            finance: [
                `${topic} revolutionizes financial services`,
                `Banking innovation driven by ${topic}`,
                `${topic} enhances financial outcomes`,
                `Financial markets embrace ${topic}`,
                `${topic} transforms banking experiences`
            ]
        }
    },

    metrics: {
        performance: [
            `${percentage}% faster processing`,
            `${percentage}% improvement in efficiency`,
            `${percentage}% reduction in processing time`,
            `${percentage}% better resource utilization`,
            `${percentage}% increase in throughput`,
            `${times}x faster response times`,
            `${percentage}% improvement in system performance`,
            `${percentage}% reduction in latency`,
            `${percentage}% better scalability`,
            `${times}x increase in processing capacity`
        ],
        adoption: [
            `${percentage}% market adoption rate`,
            `${percentage}% user satisfaction score`,
            `${percentage}% customer retention rate`,
            `${percentage}% implementation success rate`,
            `${percentage}% user engagement increase`,
            `${percentage}% adoption among industry leaders`,
            `${percentage}% positive user feedback`,
            `${percentage}% market penetration`,
            `${percentage}% client satisfaction`,
            `${percentage}% adoption growth year-over-year`
        ],
        roi: [
            `${percentage}% return on investment`,
            `${times}x cost savings`,
            `${money} annual cost reduction`,
            `${percentage}% reduction in operational costs`,
            `${times}x revenue growth`,
            `${percentage}% profit margin improvement`,
            `${money} savings per implementation`,
            `${percentage}% efficiency gains`,
            `${times}x ROI within ${days} days`,
            `${percentage}% reduced total cost of ownership`
        ],
        impact: [
            `${percentage}% reduction in carbon footprint`,
            `${percentage}% improvement in sustainability metrics`,
            `${percentage}% better resource allocation`,
            `${percentage}% enhanced team productivity`,
            `${percentage}% reduction in waste`,
            `${times}x improvement in quality metrics`,
            `${percentage}% better compliance scores`,
            `${percentage}% increase in customer satisfaction`,
            `${percentage}% reduction in errors`,
            `${percentage}% improvement in safety metrics`
        ],
        business: [
            `${percentage}% market share growth`,
            `${percentage}% increase in customer lifetime value`,
            `${times}x lead generation improvement`,
            `${percentage}% higher conversion rates`,
            `${percentage}% reduction in churn`,
            `${times}x faster time-to-market`,
            `${percentage}% improved customer retention`,
            `${percentage}% increase in brand value`,
            `${times}x expansion in market reach`,
            `${percentage}% boost in customer engagement`
        ]
    }
};

// Enhanced helper functions with more dynamic placeholders
export const templateHelpers = {
    // Time-based helpers
    time: {
        year: () => new Date().getFullYear(),
        nextYear: () => new Date().getFullYear() + 1,
        quarter: () => `Q${Math.floor(Math.random() * 4) + 1}`,
        month: () => new Date().toLocaleString('en-US', { month: 'long' }),
        timeOfDay: () => {
            const hour = new Date().getHours();
            if (hour < 12) return 'morning';
            if (hour < 17) return 'afternoon';
            if (hour < 21) return 'evening';
            return 'night';
        }
    },

    // Number generators
    numbers: {
        percentage: () => Math.floor(Math.random() * 60 + 40), // 40-99%
        smallPercentage: () => Math.floor(Math.random() * 30 + 20), // 20-49%
        largePercentage: () => Math.floor(Math.random() * 200 + 100), // 100-299%
        times: () => Math.floor(Math.random() * 8 + 3), // 3-10x
        users: () => (Math.floor(Math.random() * 900) + 100) * 1000, // 100K-1M
        money: () => Math.floor(Math.random() * 900000 + 100000), // $100K-$1M
        days: () => Math.floor(Math.random() * 90 + 30), // 30-120 days
        hours: () => Math.floor(Math.random() * 12 + 4), // 4-16 hours
        rank: () => Math.floor(Math.random() * 10 + 1) // 1-10
    },

    // Text formatters
    formatters: {
        money: (amount) => new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount),
        users: (num) => new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short'
        }).format(num),
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
        titleCase: (str) => str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    },

    // Random content generators
    content: {
        emoji: () => {
            const emojis = {
                positive: ['🚀', '💡', '🔥', '⚡️', '🌟', '📈', '🎯', '🔮', '💪', '🎉'],
                tech: ['💻', '🤖', '📱', '☁️', '🔒', '🌐', '📊', '💾', '🔋', '📡'],
                business: ['💼', '📈', '🤝', '💰', '📊', '🎯', '📱', '💡', '🔑', '📢'],
                education: ['📚', '🎓', '✏️', '🏫', '👩‍🏫', '📝', '🌈', '🧩', '📖', '🎯'],
                healthcare: ['🏥', '👨‍⚕️', '💊', '🩺', '🧬', '🌡️', '🚑', '🧪', '🔬', '❤️']
            };
            const category = Object.keys(emojis)[Math.floor(Math.random() * Object.keys(emojis).length)];
            return emojis[category][Math.floor(Math.random() * emojis[category].length)];
        },
        metric: () => {
            const metrics = [
                'efficiency', 'productivity', 'performance', 'satisfaction',
                'adoption', 'engagement', 'retention', 'conversion',
                'optimization', 'reliability'
            ];
            return metrics[Math.floor(Math.random() * metrics.length)];
        },
        company: () => {
            const companies = [
                'Fortune 500', 'leading tech', 'innovative startup',
                'global enterprise', 'industry leader', 'emerging company',
                'market pioneer', 'tech giant', 'digital native', 'unicorn startup'
            ];
            return companies[Math.floor(Math.random() * companies.length)];
        },
        industry: () => {
            const industries = [
                'technology', 'healthcare', 'finance', 'education',
                'manufacturing', 'retail', 'automotive', 'energy',
                'telecommunications', 'entertainment'
            ];
            return industries[Math.floor(Math.random() * industries.length)];
        }
    },

    // Process all placeholders in a template
    processTemplate: (template, data) => {
        const helpers = templateHelpers;
        // Process template with chain of thought variations
        let processed = helpers.chainOfThought.generateVariation(template, {
            industry: data.industry,
            topic: data.topic
        });

        return processed
            // Basic replacements
            .replace(/\${topic}/g, helpers.formatters.titleCase(data.topic))
            .replace(/\${industry}/g, data.industry || helpers.content.industry())
            
            // Time-based replacements
            .replace(/\${year}/g, helpers.time.year())
            .replace(/\${nextYear}/g, helpers.time.nextYear())
            .replace(/\${quarter}/g, helpers.time.quarter())
            .replace(/\${month}/g, helpers.time.month())
            .replace(/\${timeOfDay}/g, helpers.time.timeOfDay())
            
            // Number replacements
            .replace(/\${percentage}/g, helpers.numbers.percentage())
            .replace(/\${smallPercentage}/g, helpers.numbers.smallPercentage())
            .replace(/\${largePercentage}/g, helpers.numbers.largePercentage())
            .replace(/\${times}/g, helpers.numbers.times())
            .replace(/\${users}/g, helpers.formatters.users(helpers.numbers.users()))
            .replace(/\${money}/g, helpers.formatters.money(helpers.numbers.money()))
            .replace(/\${days}/g, helpers.numbers.days())
            .replace(/\${hours}/g, helpers.numbers.hours())
            .replace(/\${rank}/g, helpers.numbers.rank())
            
            // Content replacements
            .replace(/\${emoji}/g, helpers.content.emoji())
            .replace(/\${metric}/g, helpers.content.metric())
            .replace(/\${company}/g, helpers.content.company())
            .replace(/\${randomIndustry}/g, helpers.content.industry());
    },

    chainOfThought: new ChainOfThought()
}; 