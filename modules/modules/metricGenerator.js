export class MetricGenerator {
    constructor() {
        this.metrics = {
            performance: [
                'processing speed', 'response time', 'throughput',
                'latency', 'bandwidth', 'resource utilization',
                'cache hit rate', 'queue depth', 'connection pool usage',
                'memory consumption', 'CPU utilization', 'I/O operations',
                'network throughput', 'request rate', 'concurrent users',
                'thread pool utilization', 'garbage collection time',
                'database connections', 'active sessions', 'buffer size'
            ],
            business: [
                'ROI', 'revenue growth', 'market share',
                'customer satisfaction', 'user adoption',
                'customer lifetime value', 'churn rate', 'conversion rate',
                'average order value', 'customer acquisition cost',
                'monthly recurring revenue', 'net promoter score',
                'employee satisfaction', 'brand awareness', 'lead generation',
                'sales velocity', 'profit margin', 'market penetration',
                'customer engagement', 'operational efficiency'
            ],
            technical: [
                'code coverage', 'uptime', 'error rates',
                'deployment frequency', 'recovery time',
                'bug resolution time', 'test coverage', 'code complexity',
                'technical debt', 'API response success rate',
                'security vulnerabilities', 'code review time',
                'build time', 'deployment success rate', 'incident count',
                'documentation coverage', 'API versioning', 'cache efficiency',
                'database query performance', 'service availability'
            ],
            security: [
                'vulnerability count', 'security score', 'patch compliance',
                'incident response time', 'authentication success rate',
                'failed login attempts', 'security audit findings',
                'encryption coverage', 'firewall effectiveness',
                'security training completion'
            ],
            infrastructure: [
                'server health', 'storage utilization', 'network capacity',
                'backup success rate', 'infrastructure cost',
                'cloud resource usage', 'container health',
                'auto-scaling efficiency', 'load balancer distribution',
                'service mesh performance'
            ]
        };

        this.units = {
            time: ['seconds', 'minutes', 'hours', 'days', 'milliseconds', 'microseconds'],
            percentage: ['%', 'percent', 'percentage points', 'basis points'],
            scale: ['x', 'times', 'fold', 'factor'],
            count: ['instances', 'occurrences', 'events', 'items', 'units'],
            size: ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
            currency: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'],
            custom: ['points', 'score', 'index', 'rating'],
            rate: ['per second', 'per minute', 'per hour', 'per day'],
            resource: ['cores', 'threads', 'nodes', 'instances'],
            frequency: ['daily', 'weekly', 'monthly', 'quarterly', 'annually']
        };

        this.comparators = [
            'increased by',
            'decreased by',
            'improved by',
            'declined by',
            'maintained at',
            'reached',
            'achieved',
            'exceeded target by',
            'fell short by',
            'stabilized at',
            'peaked at',
            'bottomed at',
            'normalized to'
        ];

        this.trends = [
            'showing upward trend',
            'showing downward trend',
            'remaining stable',
            'fluctuating within normal range',
            'exceeding expectations',
            'below target threshold',
            'requiring attention',
            'meeting SLA requirements'
        ];
    }

    generateMetric(context = {}) {
        const {
            category = this.getRandomCategory(),
            timeframe = this.generateTimeframe(),
            includeComparison = true,
            includeTrend = true,
            specificUnit = null,
            threshold = null
        } = context;

        const metric = this.getRandomMetric(category);
        const unit = specificUnit || this.determineAppropriateUnit(metric);
        const value = this.generateValue(unit);
        
        let metricStatement = `${metric} ${this.formatValue(value, unit)}`;

        if (includeComparison) {
            const comparison = this.generateComparison(unit);
            metricStatement += ` (${comparison})`;
        }

        if (includeTrend) {
            const trend = this.generateTrend();
            metricStatement += `, ${trend}`;
        }

        if (threshold) {
            const thresholdStatement = this.compareToThreshold(value, threshold, unit);
            metricStatement += `, ${thresholdStatement}`;
        }

        if (timeframe) {
            metricStatement += ` ${timeframe}`;
        }

        return metricStatement;
    }

    getRandomCategory() {
        const categories = Object.keys(this.metrics);
        return categories[Math.floor(Math.random() * categories.length)];
    }

    getRandomMetric(category) {
        const metricsInCategory = this.metrics[category];
        return metricsInCategory[Math.floor(Math.random() * metricsInCategory.length)];
    }

    determineAppropriateUnit(metric) {
        // Map metrics to appropriate unit types
        const unitMappings = {
            'processing speed': 'time',
            'response time': 'time',
            'latency': 'time',
            'uptime': 'percentage',
            'error rates': 'percentage',
            'market share': 'percentage',
            'code coverage': 'percentage',
            'ROI': 'percentage',
            'revenue growth': 'percentage',
            'bandwidth': 'size',
            'resource utilization': 'percentage'
        };

        const defaultUnit = 'custom';
        const unitType = unitMappings[metric.toLowerCase()] || defaultUnit;
        const possibleUnits = this.units[unitType];
        return possibleUnits[Math.floor(Math.random() * possibleUnits.length)];
    }

    generateValue(unit) {
        let value;
        switch (unit) {
            case '%':
            case 'percent':
            case 'percentage points':
                value = Math.floor(Math.random() * 100);
                break;
            case 'seconds':
            case 'minutes':
            case 'hours':
                value = Math.floor(Math.random() * 1000);
                break;
            case 'x':
            case 'times':
            case 'fold':
                value = (Math.random() * 10).toFixed(1);
                break;
            default:
                value = Math.floor(Math.random() * 1000);
        }
        return value;
    }

    formatValue(value, unit) {
        if (unit === '%') {
            return `${value}${unit}`;
        }
        return `${value} ${unit}`;
    }

    generateComparison(unit) {
        const comparator = this.comparators[Math.floor(Math.random() * this.comparators.length)];
        const value = this.generateValue(unit);
        return `${comparator} ${this.formatValue(value, unit)} from previous period`;
    }

    generateTimeframe() {
        const timeframes = [
            'in the last quarter',
            'year-over-year',
            'month-over-month',
            'in the past 30 days',
            'during the latest sprint',
            'this fiscal year'
        ];
        return timeframes[Math.floor(Math.random() * timeframes.length)];
    }

    generateBatchMetrics(count, context = {}) {
        const metrics = [];
        for (let i = 0; i < count; i++) {
            metrics.push(this.generateMetric(context));
        }
        return metrics;
    }

    generateTrend() {
        return this.trends[Math.floor(Math.random() * this.trends.length)];
    }

    compareToThreshold(value, threshold, unit) {
        const difference = value - threshold;
        const formattedDiff = this.formatValue(Math.abs(difference), unit);
        return difference >= 0 
            ? `${formattedDiff} above threshold`
            : `${formattedDiff} below threshold`;
    }

    generateMetricReport(categories = [], options = {}) {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {},
            details: {}
        };

        const targetCategories = categories.length > 0 ? categories : Object.keys(this.metrics);

        for (const category of targetCategories) {
            const metrics = this.generateBatchMetrics(3, { ...options, category });
            report.details[category] = metrics;
            report.summary[category] = this.summarizeMetrics(metrics);
        }

        return report;
    }

    summarizeMetrics(metrics) {
        return {
            count: metrics.length,
            criticalMetrics: metrics.filter(m => m.includes('requiring attention')),
            positiveMetrics: metrics.filter(m => m.includes('exceeding expectations'))
        };
    }

    generateHistoricalData(metric, periods = 12, interval = 'monthly') {
        const history = [];
        let baseValue = this.generateValue(this.determineAppropriateUnit(metric));
        
        for (let i = 0; i < periods; i++) {
            const variance = (Math.random() - 0.5) * 0.2; // ±10% variance
            const value = baseValue * (1 + variance);
            history.push({
                period: this.generateHistoricalDate(i, interval),
                value: Math.round(value * 100) / 100
            });
            baseValue = value; // Use this as the base for the next period
        }

        return history;
    }

    generateHistoricalDate(periodsAgo, interval) {
        const date = new Date();
        switch (interval) {
            case 'daily':
                date.setDate(date.getDate() - periodsAgo);
                break;
            case 'weekly':
                date.setDate(date.getDate() - (periodsAgo * 7));
                break;
            case 'monthly':
                date.setMonth(date.getMonth() - periodsAgo);
                break;
            case 'quarterly':
                date.setMonth(date.getMonth() - (periodsAgo * 3));
                break;
        }
        return date.toISOString().split('T')[0];
    }
} 