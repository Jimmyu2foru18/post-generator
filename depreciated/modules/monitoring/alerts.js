import { EventEmitter } from 'events';
import { Logger } from '../../logger.js';

export class AlertManager extends EventEmitter {
    constructor() {
        super();
        this.alerts = new Map();
        this.handlers = new Set();
        this.setupDefaultHandlers();
    }

    setupDefaultHandlers() {
        this.addHandler('email', (alert) => {
            Logger.info('Email alert:', alert);
            // Implement email sending
        });

        this.addHandler('slack', (alert) => {
            Logger.info('Slack alert:', alert);
            // Implement Slack notification
        });
    }

    addHandler(name, handler) {
        this.handlers.add({ name, handler });
    }

    async sendAlert(alert) {
        const alertId = Date.now().toString();
        this.alerts.set(alertId, {
            ...alert,
            timestamp: Date.now(),
            status: 'new'
        });

        try {
            for (const { handler } of this.handlers) {
                await handler(alert);
            }
            this.alerts.get(alertId).status = 'sent';
            this.emit('alert:sent', alertId);
        } catch (error) {
            Logger.error('Failed to send alert:', error);
            this.alerts.get(alertId).status = 'failed';
            this.emit('alert:failed', alertId);
        }
    }

    getAlerts(filter = {}) {
        return Array.from(this.alerts.values())
            .filter(alert => {
                if (filter.status && alert.status !== filter.status) return false;
                if (filter.type && alert.type !== filter.type) return false;
                if (filter.level && alert.level !== filter.level) return false;
                return true;
            });
    }
} 