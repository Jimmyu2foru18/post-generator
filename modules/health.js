export class HealthCheck {
    constructor() {
        this.status = {
            healthy: true,
            lastCheck: null,
            services: {}
        };
        this.healthChecks = new Map();
        this.checkInterval = 30000; // 30 seconds
    }

    async checkHealth() {
        this.status.lastCheck = new Date().toISOString();
        
        try {
            // Check memory usage
            const memoryUsage = process.memoryUsage();
            this.status.services.memory = {
                status: 'healthy',
                usage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
            };

            // Check system resources
            this.status.services.system = {
                status: 'healthy',
                uptime: process.uptime()
            };

            this.status.healthy = Object.values(this.status.services)
                .every(service => service.status === 'healthy');

        } catch (error) {
            this.status.healthy = false;
            this.status.error = error.message;
        }

        return this.status;
    }
} 