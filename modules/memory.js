export class ChainMemory {
    constructor(options = {}) {
        this.shortTermMemory = new Map();
        this.workingMemory = [];
        this.maxWorkingMemorySize = options.maxWorkingMemorySize || 50;
        this.memoryRetentionTime = options.memoryRetentionTime || 1000 * 60 * 60; // 1 hour default
        this.lastCleanup = Date.now();
        this.cleanupInterval = options.cleanupInterval || 1000 * 60 * 5; // 5 minutes default
    }

    store(key, value, metadata = {}) {
        this.shortTermMemory.set(key, {
            value,
            metadata,
            timestamp: Date.now(),
            accessCount: 0
        });
        this._cleanupIfNeeded();
    }

    retrieve(key) {
        const entry = this.shortTermMemory.get(key);
        if (entry) {
            entry.accessCount++;
            entry.lastAccessed = Date.now();
            return entry.value;
        }
        return null;
    }

    addToWorkingMemory(thought, importance = 1) {
        this.workingMemory.unshift({
            content: thought,
            timestamp: Date.now(),
            importance: importance
        });

        if (this.workingMemory.length > this.maxWorkingMemorySize) {
            // Remove least important thoughts when exceeding size
            this.workingMemory.sort((a, b) => b.importance - a.importance);
            this.workingMemory = this.workingMemory.slice(0, this.maxWorkingMemorySize);
        }
    }

    getRecentThoughts(limit = 5, minImportance = 0) {
        return this.workingMemory
            .filter(thought => thought.importance >= minImportance)
            .slice(0, limit)
            .map(thought => thought.content);
    }

    getAllMemoryKeys() {
        return Array.from(this.shortTermMemory.keys());
    }

    getMemoryStats() {
        return {
            shortTermSize: this.shortTermMemory.size,
            workingMemorySize: this.workingMemory.length,
            oldestMemory: this._getOldestMemoryTimestamp(),
            mostAccessed: this._getMostAccessedKey()
        };
    }

    _getOldestMemoryTimestamp() {
        let oldest = Date.now();
        for (const entry of this.shortTermMemory.values()) {
            if (entry.timestamp < oldest) {
                oldest = entry.timestamp;
            }
        }
        return oldest;
    }

    _getMostAccessedKey() {
        let maxAccess = 0;
        let mostAccessedKey = null;
        
        for (const [key, entry] of this.shortTermMemory.entries()) {
            if (entry.accessCount > maxAccess) {
                maxAccess = entry.accessCount;
                mostAccessedKey = key;
            }
        }
        return mostAccessedKey;
    }

    _cleanupIfNeeded() {
        const now = Date.now();
        if (now - this.lastCleanup > this.cleanupInterval) {
            this._cleanup();
            this.lastCleanup = now;
        }
    }

    _cleanup() {
        const now = Date.now();
        for (const [key, entry] of this.shortTermMemory.entries()) {
            if (now - entry.timestamp > this.memoryRetentionTime) {
                this.shortTermMemory.delete(key);
            }
        }
    }

    clear() {
        this.shortTermMemory.clear();
        this.workingMemory = [];
    }

    exportMemory() {
        return {
            shortTermMemory: Array.from(this.shortTermMemory.entries()),
            workingMemory: this.workingMemory,
            stats: this.getMemoryStats()
        };
    }

    importMemory(memoryData) {
        if (memoryData.shortTermMemory) {
            this.shortTermMemory = new Map(memoryData.shortTermMemory);
        }
        if (memoryData.workingMemory) {
            this.workingMemory = memoryData.workingMemory;
        }
    }
} 