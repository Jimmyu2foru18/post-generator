import { ContentGenerator } from './knowledgeBase.js';
import { Logger } from '../logger.js';

export class MockApi {
    constructor(config = {}) {
        this.generator = new ContentGenerator();
        this.errorRate = config.errorRate || 0.1; // 10% error rate
        this.minDelay = config.minDelay || 500;
        this.maxDelay = config.maxDelay || 2000;
    }

    async generateThoughts(topic, context = '') {
        try {
            // Simulate random delay
            const delay = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
            await new Promise(resolve => setTimeout(resolve, delay));

            // Simulate random errors
            if (Math.random() < this.errorRate) {
                throw new Error('Simulated API error');
            }

            return this.generator.generateContent(topic, context);
        } catch (error) {
            Logger.error('MockApi error:', error);
            throw error;
        }
    }
} 