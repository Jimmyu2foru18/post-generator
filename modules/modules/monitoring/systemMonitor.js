import os from 'os';
import { EventEmitter } from 'events';
import { Logger } from '../../logger.js';

export class SystemMonitor extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {
            interval: config.interval || 60000,
            thresholds: {
                cpu: config.cpuThreshold || 80,
                memory: config.memoryThreshold || 85,
                disk: config.diskThreshold || 90
            }
        };
        this.metrics = new Map();
        this.startMonitoring();
    }

    startMonitoring() {
        this.interval = setInterval(() => this.collectMetrics(), this.config.interval);
        this.collectMetrics(); // Initial collection
    }

    async collectMetrics() {
        try {
            const metrics = {
                timestamp: Date.now(),
                cpu: await this.getCPUUsage(),
                memory: this.getMemoryUsage(),
                disk: await this.getDiskUsage(),
                network: this.getNetworkStats(),
                process: this.getProcessStats()
            };

            this.metrics.set('system', metrics);
            this.checkThresholds(metrics);
            this.emit('metrics', metrics);
        } catch (error) {
            Logger.error('Error collecting system metrics:', error);
        }
    }

    async getCPUUsage() {
        const cpus = os.cpus();
        const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
        const totalTick = cpus.reduce((acc, cpu) => 
            acc + Object.values(cpu.times).reduce((sum, time) => sum + time, 0), 0);
        
        return {
            usage: ((1 - totalIdle / totalTick) * 100).toFixed(2),
            cores: cpus.length,
            load: os.loadavg()
        };
    }

    getMemoryUsage() {
        const total = os.totalmem();
        const free = os.freemem();
        const used = total - free;
        
        return {
            total: total / 1024 / 1024,
            used: used / 1024 / 1024,
            free: free / 1024 / 1024,
            usagePercent: (used / total * 100).toFixed(2)
        };
    }

    checkThresholds(metrics) {
        if (parseFloat(metrics.cpu.usage) > this.config.thresholds.cpu) {
            this.emit('alert', {
                type: 'cpu',
                message: `CPU usage above threshold: ${metrics.cpu.usage}%`,
                level: 'warning'
            });
        }

        if (parseFloat(metrics.memory.usagePercent) > this.config.thresholds.memory) {
            this.emit('alert', {
                type: 'memory',
                message: `Memory usage above threshold: ${metrics.memory.usagePercent}%`,
                level: 'warning'
            });
        }
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    async getDiskUsage() {
        // This would need a platform-specific implementation
        // For now, return placeholder
        return {
            total: 0,
            used: 0,
            free: 0,
            usagePercent: 0
        };
    }

    getNetworkStats() {
        const networkInterfaces = os.networkInterfaces();
        return Object.entries(networkInterfaces).reduce((acc, [name, interfaces]) => {
            acc[name] = interfaces.map(int => ({
                address: int.address,
                netmask: int.netmask,
                family: int.family,
                mac: int.mac,
                internal: int.internal
            }));
            return acc;
        }, {});
    }

    getProcessStats() {
        return {
            pid: process.pid,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            resourceUsage: process.resourceUsage()
        };
    }
} 