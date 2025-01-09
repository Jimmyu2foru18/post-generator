export const entityTypes = {
    // Business & Organizations
    COMPANY_TYPES: [
        'Inc', 'Corp', 'LLC', 'Company', 'Technologies', 'Solutions', 'Group', 'Corporation',
        'Enterprise', 'Partners', 'Associates', 'International', 'Global', 'Industries',
        'Holdings', 'Limited', 'Services', 'Systems', 'Ventures', 'Consulting'
    ],

    // Technology & Computing
    TECH_TERMS: [
        'AI', 'ML', 'API', 'Cloud', 'Platform', 'Software', 'Hardware', 'Database', 'Network',
        'Interface', 'Algorithm', 'Framework', 'Architecture', 'Protocol', 'System', 'Application',
        'Infrastructure', 'Integration', 'Analytics', 'Automation', 'Blockchain', 'IoT', 
        'Cybersecurity', 'DevOps', 'Frontend', 'Backend', 'Full-stack', 'Mobile', 'Web',
        'Desktop', 'SaaS', 'PaaS', 'IaaS', 'Microservices', 'Container', 'Virtual', 'Digital'
    ],

    // Business Metrics
    METRICS: [
        'ROI', 'KPI', 'Growth', 'Revenue', 'Efficiency', 'Productivity', 'Performance',
        'Conversion', 'Retention', 'Churn', 'Engagement', 'Acquisition', 'Profit', 'Loss',
        'Sales', 'Cost', 'Budget', 'Investment', 'Return', 'Margin', 'Valuation', 'Capital',
        'Asset', 'Liability', 'Equity', 'Cash Flow', 'Revenue', 'Expense', 'Income'
    ],

    // Industries
    INDUSTRIES: [
        'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Technology',
        'Automotive', 'Aerospace', 'Agriculture', 'Construction', 'Energy', 'Entertainment',
        'Media', 'Telecommunications', 'Transportation', 'Logistics', 'Hospitality', 'Tourism',
        'Real Estate', 'Mining', 'Pharmaceutical', 'Chemical', 'Food', 'Beverage'
    ],

    // Job Titles & Roles
    ROLES: [
        'CEO', 'CTO', 'CFO', 'COO', 'CIO', 'Director', 'Manager', 'Supervisor', 'Engineer',
        'Developer', 'Designer', 'Analyst', 'Consultant', 'Specialist', 'Coordinator',
        'Administrator', 'Executive', 'President', 'Vice President', 'Head', 'Lead', 'Senior',
        'Junior', 'Associate', 'Assistant', 'Advisor', 'Strategist', 'Expert'
    ],

    // Academic & Research
    ACADEMIC: [
        'Research', 'Study', 'Analysis', 'Theory', 'Methodology', 'Framework', 'Model',
        'Hypothesis', 'Experiment', 'Data', 'Statistics', 'Survey', 'Review', 'Publication',
        'Journal', 'Conference', 'Symposium', 'Workshop', 'Seminar', 'Lecture', 'Course',
        'Curriculum', 'Program', 'Degree', 'Certificate', 'Diploma', 'Thesis', 'Dissertation'
    ],

    // Healthcare & Medical
    MEDICAL: [
        'Treatment', 'Diagnosis', 'Therapy', 'Medicine', 'Surgery', 'Clinical', 'Patient',
        'Doctor', 'Nurse', 'Physician', 'Specialist', 'Hospital', 'Clinic', 'Laboratory',
        'Pharmacy', 'Drug', 'Device', 'Equipment', 'Procedure', 'Protocol', 'Care', 'Health',
        'Wellness', 'Prevention', 'Recovery', 'Rehabilitation', 'Emergency', 'Intensive'
    ],

    // Financial Terms
    FINANCIAL: [
        'Investment', 'Stock', 'Bond', 'Fund', 'Asset', 'Liability', 'Equity', 'Debt',
        'Credit', 'Debit', 'Account', 'Balance', 'Transaction', 'Payment', 'Transfer',
        'Interest', 'Dividend', 'Portfolio', 'Market', 'Trade', 'Exchange', 'Currency',
        'Commodity', 'Security', 'Option', 'Future', 'Derivative', 'Hedge'
    ],

    // Marketing & Sales
    MARKETING: [
        'Brand', 'Campaign', 'Strategy', 'Marketing', 'Advertising', 'Promotion', 'Sales',
        'Customer', 'Client', 'Consumer', 'Market', 'Segment', 'Target', 'Audience',
        'Channel', 'Media', 'Digital', 'Social', 'Content', 'SEO', 'PPC', 'Email',
        'Mobile', 'Web', 'Analytics', 'Conversion', 'Lead', 'Funnel', 'Journey'
    ],

    // Project Management
    PROJECT: [
        'Project', 'Program', 'Portfolio', 'Initiative', 'Task', 'Milestone', 'Deadline',
        'Schedule', 'Timeline', 'Resource', 'Budget', 'Scope', 'Risk', 'Issue', 'Change',
        'Quality', 'Requirement', 'Specification', 'Plan', 'Strategy', 'Objective', 'Goal',
        'Target', 'Metric', 'Measure', 'Indicator', 'Performance', 'Success'
    ],

    // Legal Terms
    LEGAL: [
        'Contract', 'Agreement', 'Policy', 'Regulation', 'Compliance', 'Law', 'Rule',
        'Statute', 'Legislation', 'Requirement', 'Standard', 'Guideline', 'Protocol',
        'Procedure', 'Process', 'Document', 'Record', 'Report', 'Filing', 'Application',
        'License', 'Permit', 'Certificate', 'Registration', 'Authorization'
    ],

    // Environmental & Sustainability
    ENVIRONMENTAL: [
        'Sustainable', 'Green', 'Eco-friendly', 'Renewable', 'Clean', 'Environmental',
        'Conservation', 'Preservation', 'Protection', 'Recycling', 'Waste', 'Energy',
        'Efficiency', 'Carbon', 'Emission', 'Climate', 'Weather', 'Natural', 'Resource',
        'Biodiversity', 'Ecosystem', 'Habitat', 'Species', 'Flora', 'Fauna'
    ],

    // Software Development
    SOFTWARE_DEV: [
        'Code', 'Programming', 'Development', 'Testing', 'Debugging', 'Deployment',
        'Version Control', 'Git', 'CI/CD', 'Unit Test', 'Integration', 'Build',
        'Release', 'Sprint', 'Agile', 'Scrum', 'Kanban', 'Repository', 'Branch',
        'Merge', 'Pull Request', 'Commit', 'Pipeline', 'Documentation', 'API'
    ],

    // Data Science
    DATA_SCIENCE: [
        'Data', 'Analytics', 'Statistics', 'Machine Learning', 'Deep Learning',
        'Neural Network', 'Algorithm', 'Model', 'Training', 'Dataset', 'Feature',
        'Classification', 'Regression', 'Clustering', 'Prediction', 'Validation',
        'Optimization', 'Visualization', 'Mining', 'Processing', 'ETL', 'NLP'
    ],

    // Product Development
    PRODUCT: [
        'Product', 'Feature', 'Release', 'Roadmap', 'Backlog', 'User Story',
        'Prototype', 'MVP', 'Innovation', 'Design', 'UX', 'UI', 'Usability',
        'Interface', 'Experience', 'Feedback', 'Testing', 'Iteration', 'Launch',
        'Scale', 'Growth', 'Adoption', 'Retention', 'Engagement'
    ],

    // Cybersecurity
    SECURITY: [
        'Firewall', 'Encryption', 'Authentication', 'Authorization', 'VPN', 'Malware',
        'Virus', 'Phishing', 'Ransomware', 'Breach', 'Vulnerability', 'Patch',
        'Security', 'Threat', 'Risk', 'Compliance', 'Audit', 'Access Control',
        'Identity', 'Zero Trust', 'Penetration Testing', 'SIEM', 'IDS', 'IPS'
    ],

    // Cloud Computing
    CLOUD: [
        'AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Serverless', 'Lambda',
        'Microservice', 'Container', 'Orchestration', 'Scaling', 'Load Balancer',
        'Instance', 'Virtual Machine', 'Storage', 'CDN', 'Gateway', 'Service Mesh',
        'Cluster', 'Node', 'Pod', 'Registry', 'Namespace', 'Volume'
    ],

    // Digital Transformation
    DIGITAL: [
        'Innovation', 'Disruption', 'Transformation', 'Modernization', 'Digitization',
        'Automation', 'Integration', 'Migration', 'Adoption', 'Strategy', 'Roadmap',
        'Initiative', 'Platform', 'Ecosystem', 'Framework', 'Architecture', 'Solution',
        'Implementation', 'Deployment', 'Scalability', 'Optimization'
    ],

    // Emerging Technologies
    EMERGING_TECH: [
        'Quantum Computing', 'Edge Computing', 'Web3', 'Metaverse', '5G', '6G',
        'AR', 'VR', 'XR', 'Robotics', 'Drone', 'Autonomous', 'Biometric',
        'Blockchain', 'NFT', 'Cryptocurrency', 'Smart Contract', 'DeFi', 'DAO',
        'Synthetic Biology', 'Nanotech', 'Brain-Computer Interface'
    ]
};

// Helper function to get random entities from a category
export function getRandomEntities(category, count = 1) {
    const entities = entityTypes[category];
    if (!entities) return [];
    
    const shuffled = [...entities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Helper function to check if a word belongs to a category
export function getCategoryForWord(word) {
    return Object.entries(entityTypes).find(([category, words]) => 
        words.some(w => w.toLowerCase() === word.toLowerCase())
    )?.[0] || null;
}

// Helper function to get all categories for a text
export function categorizeText(text) {
    const words = text.split(/\W+/);
    const categories = new Map();

    words.forEach(word => {
        const category = getCategoryForWord(word);
        if (category) {
            categories.set(category, (categories.get(category) || 0) + 1);
        }
    });

    return Object.fromEntries(categories);
}

// Additional helper functions

// Get all words from all categories
export function getAllWords() {
    return Object.values(entityTypes).flat();
}

// Get all categories
export function getAllCategories() {
    return Object.keys(entityTypes);
}

// Get random words across all categories
export function getRandomWords(count = 1) {
    const allWords = getAllWords();
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Get words that appear in multiple categories
export function getOverlappingWords() {
    const wordCount = new Map();
    const wordCategories = new Map();

    Object.entries(entityTypes).forEach(([category, words]) => {
        words.forEach(word => {
            wordCount.set(word, (wordCount.get(word) || 0) + 1);
            if (!wordCategories.has(word)) {
                wordCategories.set(word, new Set());
            }
            wordCategories.get(word).add(category);
        });
    });

    return Array.from(wordCount.entries())
        .filter(([_, count]) => count > 1)
        .map(([word, count]) => ({
            word,
            count,
            categories: Array.from(wordCategories.get(word))
        }));
}

// Search for words across categories
export function searchWords(query) {
    const results = new Map();
    const searchTerm = query.toLowerCase();

    Object.entries(entityTypes).forEach(([category, words]) => {
        const matches = words.filter(word => 
            word.toLowerCase().includes(searchTerm)
        );
        if (matches.length > 0) {
            results.set(category, matches);
        }
    });

    return Object.fromEntries(results);
}

// Get related words from other categories
export function getRelatedWords(word, maxResults = 5) {
    const category = getCategoryForWord(word);
    if (!category) return [];

    const otherCategories = Object.keys(entityTypes).filter(cat => cat !== category);
    const related = new Set();

    otherCategories.forEach(cat => {
        const categoryWords = entityTypes[cat];
        const randomIndices = Array.from(
            { length: Math.min(maxResults, categoryWords.length) },
            () => Math.floor(Math.random() * categoryWords.length)
        );
        randomIndices.forEach(index => related.add(categoryWords[index]));
    });

    return Array.from(related).slice(0, maxResults);
}

// Get category statistics
export function getCategoryStats() {
    return Object.entries(entityTypes).map(([category, words]) => ({
        category,
        wordCount: words.length,
        averageWordLength: Math.round(
            words.reduce((acc, word) => acc + word.length, 0) / words.length
        ),
        longestWord: words.reduce((a, b) => a.length > b.length ? a : b),
        shortestWord: words.reduce((a, b) => a.length < b.length ? a : b)
    }));
}

// Generate word combinations from different categories
export function generateCombinations(categories = [], count = 1) {
    if (!categories.length) return [];
    
    const combinations = [];
    for (let i = 0; i < count; i++) {
        const combination = categories.map(category => 
            getRandomEntities(category, 1)[0]
        ).filter(Boolean);
        
        if (combination.length === categories.length) {
            combinations.push(combination);
        }
    }
    return combinations;
}

// Find similar words based on simple string matching
export function findSimilarWords(word, threshold = 0.5) {
    const allWords = getAllWords();
    const similar = new Map();

    allWords.forEach(candidate => {
        if (candidate.toLowerCase() === word.toLowerCase()) return;
        
        const similarity = calculateStringSimilarity(word, candidate);
        if (similarity >= threshold) {
            similar.set(candidate, similarity);
        }
    });

    return Array.from(similar.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([word, similarity]) => ({ word, similarity }));
}

// Calculate string similarity (Levenshtein distance based)
function calculateStringSimilarity(str1, str2) {
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) track[0][i] = i;
    for (let j = 0; j <= str2.length; j++) track[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1,
                track[j - 1][i] + 1,
                track[j - 1][i - 1] + indicator
            );
        }
    }

    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (track[str2.length][str1.length] / maxLength);
}

// Generate category chains (words that might be related across categories)
export function generateCategoryChains(startWord, chainLength = 3) {
    const startCategory = getCategoryForWord(startWord);
    if (!startCategory) return [];

    const chains = [];
    const chain = [{ word: startWord, category: startCategory }];
    
    function buildChain(currentChain) {
        if (currentChain.length === chainLength) {
            chains.push([...currentChain]);
            return;
        }

        const lastWord = currentChain[currentChain.length - 1].word;
        const related = getRelatedWords(lastWord, 3);
        
        related.forEach(word => {
            const category = getCategoryForWord(word);
            if (category && !currentChain.some(item => item.category === category)) {
                buildChain([...currentChain, { word, category }]);
            }
        });
    }

    buildChain(chain);
    return chains;
}

// Export all entity types and helper functions
export default {
    entityTypes,
    getRandomEntities,
    getCategoryForWord,
    categorizeText,
    getAllWords,
    getAllCategories,
    getRandomWords,
    getOverlappingWords,
    searchWords,
    getRelatedWords,
    getCategoryStats,
    generateCombinations,
    findSimilarWords,
    generateCategoryChains
}; 