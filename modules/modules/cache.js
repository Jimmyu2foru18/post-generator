import { Logger } from '../logger.js';

export class Cache {
    constructor(config = {}) {
        this.store = new Map();
        this.maxSize = config.maxSize || 1000;
        this.defaultTTL = config.ttl || 3600000; // 1 hour
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0
        };
        this.cleanupInterval = setInterval(() => this.cleanup(), 300000); // 5 minutes
    }

    async get(key) {
        const item = this.store.get(key);
        if (!item) {
            this.stats.misses++;
            return null;
        }

        if (this.isExpired(item)) {
            this.delete(key);
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        return item.value;
    }

    async set(key, value, ttl = this.defaultTTL) {
        if (this.store.size >= this.maxSize) {
            this.evictOldest();
        }

        this.store.set(key, {
            value,
            timestamp: Date.now(),
            ttl
        });
    }

    delete(key) {
        return this.store.delete(key);
    }

    isExpired(item) {
        return Date.now() - item.timestamp > item.ttl;
    }

    evictOldest() {
        const oldest = [...this.store.entries()]
            .reduce((a, b) => a[1].timestamp < b[1].timestamp ? a : b);
        
        if (oldest) {
            this.delete(oldest[0]);
            this.stats.evictions++;
        }
    }

    cleanup() {
        for (const [key, item] of this.store) {
            if (this.isExpired(item)) {
                this.delete(key);
            }
        }
    }

    getStats() {
        return {
            ...this.stats,
            size: this.store.size,
            maxSize: this.maxSize,
            hitRate: this.stats.hits / (this.stats.hits + this.stats.misses)
        };
    }

    clear() {
        this.store.clear();
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0
        };
    }
} 