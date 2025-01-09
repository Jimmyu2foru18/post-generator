export class Monitoring {
    constructor() {
        this.metrics = new Map();
        this.alerts = new Set();
        this.thresholds = {
            responseTime: 1000,
            errorRate: 0.05,
            memoryUsage: 0.9
        };
        this.metricsHistory = new Map();
        this.alertHandlers = new Set();
        this.statusChecks = new Map();
    }

    trackMetric(name, value) {
        const metric = this.metrics.get(name) || [];
        metric.push({
            value,
            timestamp: Date.now()
        });
        this.metrics.set(name, metric.slice(-100)); // Keep last 100 values
        this.checkThresholds(name, value);
    }

    checkThresholds(name, value) {
        if (value > this.thresholds[name]) {
            this.createAlert(name, value);
        }
    }

    createAlert(metric, value) {
        const alert = {
            metric,
            value,
            timestamp: Date.now()
        };
        this.alerts.add(alert);
        Logger.warn(`Alert: ${metric} threshold exceeded`, alert);
    }

    addAlertHandler(handler) {
        this.alertHandlers.add(handler);
    }

    addStatusCheck(name, check) {
        this.statusChecks.set(name, {
            check,
            interval: setInterval(() => this.runStatusCheck(name), 60000)
        });
    }

    async runStatusCheck(name) {
        const check = this.statusChecks.get(name);
        try {
            const result = await check.check();
            this.trackMetric(`status_${name}`, result ? 1 : 0);
        } catch (error) {
            Logger.error(`Status check failed: ${name}`, error);
            this.createAlert(`status_check_failed_${name}`, error.message);
        }
    }

    getMetricsSummary() {
        const summary = {};
        for (const [name, values] of this.metrics.entries()) {
            summary[name] = {
                current: values[values.length - 1]?.value,
                average: this.calculateAverage(values),
                min: Math.min(...values.map(v => v.value)),
                max: Math.max(...values.map(v => v.value))
            };
        }
        return summary;
    }

    calculateAverage(values) {
        return values.reduce((sum, v) => sum + v.value, 0) / values.length;
    }
} 