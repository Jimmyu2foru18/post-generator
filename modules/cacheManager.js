export class CacheManager {
    constructor() {
        this.CACHE_KEY = 'ai_post_generator_cache';
        this.MAX_CACHE_SIZE = 50;
        this.CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
        this.initializeCache();
    }

    initializeCache() {
        if (!localStorage.getItem(this.CACHE_KEY)) {
            this.clearCache();
        }
        this.cleanExpiredEntries();
    }

    saveToCache(topic, result) {
        try {
            const cache = this.getCache();
            
            // Add metadata for better management
            cache[topic.toLowerCase()] = {
                data: result,
                timestamp: Date.now(),
                accessCount: 0,
                lastAccessed: null,
                size: new Blob([JSON.stringify(result)]).size
            };

            this._maintainCacheSize(cache);
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
            return true;
        } catch (error) {
            console.warn('Failed to save to cache:', error);
            return false;
        }
    }

    getFromCache(topic) {
        try {
            const cache = this.getCache();
            const entry = cache[topic.toLowerCase()];
            
            if (!entry) return null;

            if (this._isExpired(entry)) {
                this._removeEntry(topic.toLowerCase());
                return null;
            }

            // Update access statistics
            entry.accessCount++;
            entry.lastAccessed = Date.now();
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));

            return entry.data;
        } catch (error) {
            console.warn('Failed to read from cache:', error);
            return null;
        }
    }

    exportCache() {
        try {
            const cache = this.getCache();
            const exportData = {
                version: '1.0',
                timestamp: Date.now(),
                data: cache
            };
            
            const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-post-generator-cache-${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Failed to export cache:', error);
            return false;
        }
    }

    async importCache(file) {
        try {
            const text = await file.text();
            const importData = JSON.parse(text);
            
            if (!this._validateImport(importData)) {
                throw new Error('Invalid cache file format');
            }

            const currentCache = this.getCache();
            const mergedCache = { ...currentCache, ...importData.data };
            
            this._maintainCacheSize(mergedCache);
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(mergedCache));
            
            return true;
        } catch (error) {
            console.error('Failed to import cache:', error);
            return false;
        }
    }

    cleanExpiredEntries() {
        const cache = this.getCache();
        let cleaned = 0;
        
        Object.entries(cache).forEach(([key, entry]) => {
            if (this._isExpired(entry)) {
                delete cache[key];
                cleaned++;
            }
        });
        
        if (cleaned > 0) {
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
        }
        
        return cleaned;
    }

    getCacheStats() {
        const cache = this.getCache();
        const entries = Object.keys(cache).length;
        const totalSize = Object.values(cache).reduce((sum, entry) => sum + entry.size, 0);
        const oldestEntry = this._getOldestEntry(cache);
        const mostAccessed = this._getMostAccessedEntry(cache);
        
        return {
            entries,
            size: `${(totalSize / 1024).toFixed(1)} KB`,
            maxEntries: this.MAX_CACHE_SIZE,
            oldestEntry: oldestEntry ? {
                topic: oldestEntry.key,
                age: this._formatAge(oldestEntry.timestamp)
            } : null,
            mostAccessed: mostAccessed ? {
                topic: mostAccessed.key,
                count: mostAccessed.accessCount
            } : null,
            expiresIn: this._formatAge(Date.now() + this.CACHE_EXPIRY)
        };
    }

    // Private helper methods
    _maintainCacheSize(cache) {
        const keys = Object.keys(cache);
        if (keys.length <= this.MAX_CACHE_SIZE) return;

        // Remove least recently accessed entries
        const sortedKeys = keys.sort((a, b) => 
            (cache[b].lastAccessed || cache[b].timestamp) -
            (cache[a].lastAccessed || cache[a].timestamp)
        );

        while (sortedKeys.length > this.MAX_CACHE_SIZE) {
            const key = sortedKeys.pop();
            delete cache[key];
        }
    }

    _isExpired(entry) {
        return Date.now() - entry.timestamp > this.CACHE_EXPIRY;
    }

    _validateImport(data) {
        return data.version && data.timestamp && data.data &&
               typeof data.data === 'object';
    }

    _formatAge(timestamp) {
        const diff = Math.abs(Date.now() - timestamp);
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        return `${days}d ${hours}h`;
    }

    _getOldestEntry(cache) {
        return Object.entries(cache).reduce((oldest, [key, entry]) => {
            if (!oldest || entry.timestamp < oldest.timestamp) {
                return { key, ...entry };
            }
            return oldest;
        }, null);
    }

    _getMostAccessedEntry(cache) {
        return Object.entries(cache).reduce((most, [key, entry]) => {
            if (!most || entry.accessCount > most.accessCount) {
                return { key, ...entry };
            }
            return most;
        }, null);
    }

    clearCache() {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify({}));
    }

    getCache() {
        try {
            return JSON.parse(localStorage.getItem(this.CACHE_KEY) || '{}');
        } catch (error) {
            console.error('Failed to parse cache:', error);
            this.clearCache();
            return {};
        }
    }

    removeFromCache(topic) {
        try {
            const cache = this.getCache();
            const key = topic.toLowerCase();
            if (cache[key]) {
                delete cache[key];
                localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Failed to remove from cache:', error);
            return false;
        }
    }

    getCacheSize() {
        try {
            const cache = this.getCache();
            const size = new Blob([JSON.stringify(cache)]).size;
            return {
                bytes: size,
                kilobytes: (size / 1024).toFixed(2),
                megabytes: (size / (1024 * 1024)).toFixed(2)
            };
        } catch (error) {
            console.warn('Failed to calculate cache size:', error);
            return null;
        }
    }

    _removeEntry(key) {
        const cache = this.getCache();
        delete cache[key];
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    }
} 