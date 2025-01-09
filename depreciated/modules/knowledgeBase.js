export const knowledgeBase = {
    topics: {
        technology: {
            keywords: ['AI', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'IoT'],
            patterns: ['implementation', 'development', 'integration', 'deployment'],
            metrics: ['efficiency', 'performance', 'scalability', 'reliability']
        },
        business: {
            keywords: ['Strategy', 'Innovation', 'Leadership', 'Marketing', 'Finance'],
            patterns: ['growth', 'optimization', 'management', 'analysis'],
            metrics: ['ROI', 'KPI', 'revenue', 'market share']
        },
        science: {
            keywords: ['Research', 'Discovery', 'Analysis', 'Methodology', 'Data'],
            patterns: ['observation', 'experimentation', 'validation', 'replication'],
            metrics: ['accuracy', 'precision', 'significance', 'correlation']
        }
    },
    
    getTopicInfo(topic) {
        const category = this.identifyCategory(topic);
        return category ? this.topics[category] : null;
    },

    identifyCategory(topic) {
        return Object.entries(this.topics).find(([_, info]) =>
            info.keywords.some(keyword => 
                topic.toLowerCase().includes(keyword.toLowerCase())
            )
        )?.[0] || null;
    }
}; 