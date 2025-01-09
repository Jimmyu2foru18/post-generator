import { EventEmitter } from 'events';
import { Logger } from '../logger.js';

export class Queue extends EventEmitter {
    constructor(config = {}) {
        super();
        this.queue = [];
        this.processing = false;
        this.concurrency = config.concurrency || 1;
        this.activeJobs = 0;
        this.maxRetries = config.maxRetries || 3;
        this.retryDelay = config.retryDelay || 1000;
        this.logger = new Logger('Queue');
    }

    async add(job) {
        this.queue.push({
            ...job,
            attempts: 0,
            added: Date.now()
        });
        this.emit('job:added', job);
        this.process();
    }

    async process() {
        if (this.processing || this.activeJobs >= this.concurrency) {
            return;
        }

        this.processing = true;

        while (this.queue.length > 0 && this.activeJobs < this.concurrency) {
            const job = this.queue.shift();
            this.activeJobs++;

            try {
                await this.processJob(job);
            } catch (error) {
                this.logger.error('Job processing failed:', error);
            } finally {
                this.activeJobs--;
            }
        }

        this.processing = false;
    }

    async processJob(job) {
        try {
            const result = await job.handler(job.data);
            this.emit('job:completed', { job, result });
        } catch (error) {
            if (job.attempts < this.maxRetries) {
                job.attempts++;
                await this.retryJob(job);
            } else {
                this.emit('job:failed', { job, error });
            }
        }
    }

    async retryJob(job) {
        const delay = this.retryDelay * Math.pow(2, job.attempts - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        this.queue.push(job);
        this.emit('job:retrying', job);
    }

    getStats() {
        return {
            queued: this.queue.length,
            active: this.activeJobs,
            processing: this.processing
        };
    }
} 