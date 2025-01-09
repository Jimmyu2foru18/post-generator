// Metrics tracking module
export class MetricsTracker {
    constructor() {
        this.generations = 0;
        this.topics = new Map();
        this.tones = new Map();
        this.startTime = Date.now();
        this.errors = [];
        this.lengthDistribution = new Map();
    }

    trackGeneration(topic, tone, length) {
        this.generations++;
        this.topics.set(topic, (this.topics.get(topic) || 0) + 1);
        this.tones.set(tone, (this.tones.get(tone) || 0) + 1);
        this.lengthDistribution.set(length, (this.lengthDistribution.get(length) || 0) + 1);
    }

    trackError(error) {
        this.errors.push({
            timestamp: new Date().toISOString(),
            message: error.message
        });
    }

    getReport() {
        return {
            uptime: Date.now() - this.startTime,
            totalGenerations: this.generations,
            topTopics: Array.from(this.topics.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5),
            toneUsage: Object.fromEntries(this.tones),
            lengthPreferences: Object.fromEntries(this.lengthDistribution),
            recentErrors: this.errors.slice(-5),
            averageGenerationsPerHour: this.calculateGenerationsPerHour()
        };
    }

    calculateGenerationsPerHour() {
        const uptimeHours = (Date.now() - this.startTime) / (1000 * 60 * 60);
        return uptimeHours > 0 ? (this.generations / uptimeHours).toFixed(2) : 0;
    }
} 