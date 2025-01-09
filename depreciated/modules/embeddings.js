export class EmbeddingService {
    constructor(config = {}) {
        this.config = {
            model: config.model || 'text-embedding-ada-002',
            batchSize: config.batchSize || 100,
            cacheDuration: config.cacheDuration || 24 * 60 * 60 * 1000, // 24 hours
            maxCacheSize: config.maxCacheSize || 1000, // Maximum number of cached embeddings
            retryAttempts: config.retryAttempts || 3,
            retryDelay: config.retryDelay || 1000, // ms
            ...config
        };
        this.cache = new Map();
    }

    async getEmbedding(text) {
        const cacheKey = this._generateCacheKey(text);
        
        // Check cache
        const cached = this.cache.get(cacheKey);
        if (cached && !this._isCacheExpired(cached)) {
            return cached.embedding;
        }

        // Generate new embedding
        const embedding = await this._generateEmbedding(text);
        
        // Cache result
        this.cache.set(cacheKey, {
            embedding,
            timestamp: Date.now()
        });

        return embedding;
    }

    async getBatchEmbeddings(texts) {
        const batches = this._createBatches(texts);
        const embeddings = [];

        for (const batch of batches) {
            const batchEmbeddings = await Promise.all(
                batch.map(text => this.getEmbedding(text))
            );
            embeddings.push(...batchEmbeddings);
        }

        return embeddings;
    }

    _createBatches(array) {
        const batches = [];
        for (let i = 0; i < array.length; i += this.config.batchSize) {
            batches.push(array.slice(i, i + this.config.batchSize));
        }
        return batches;
    }

    _generateCacheKey(text) {
        return `${this.config.model}-${text.substring(0, 100)}`;
    }

    _isCacheExpired(cached) {
        return Date.now() - cached.timestamp > this.config.cacheDuration;
    }

    async _generateEmbedding(text) {
        let lastError;
        for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
            try {
                const response = await fetch('/api/embeddings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: this.config.model,
                        input: this._sanitizeText(text)
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`Failed to generate embedding: ${response.status} ${errorData.message || ''}`);
                }

                const data = await response.json();
                return data.embedding;
            } catch (error) {
                lastError = error;
                if (attempt < this.config.retryAttempts) {
                    await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt));
                }
            }
        }
        throw lastError;
    }

    /**
     * Cleans up old cache entries and ensures cache doesn't exceed max size
     */
    cleanupCache() {
        // Remove expired entries
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (this._isCacheExpired(value)) {
                this.cache.delete(key);
            }
        }

        // If still over max size, remove oldest entries
        if (this.cache.size > this.config.maxCacheSize) {
            const sortedEntries = [...this.cache.entries()]
                .sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const entriesToRemove = sortedEntries.slice(0, this.cache.size - this.config.maxCacheSize);
            for (const [key] of entriesToRemove) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Calculates similarity between two embeddings using cosine similarity
     */
    calculateSimilarity(embedding1, embedding2) {
        if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
            throw new Error('Invalid embeddings provided for similarity calculation');
        }

        const dotProduct = embedding1.reduce((sum, val, i) => sum + val * embedding2[i], 0);
        const norm1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
        const norm2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));

        return dotProduct / (norm1 * norm2);
    }

    /**
     * Sanitizes input text before generating embeddings
     */
    _sanitizeText(text) {
        if (typeof text !== 'string') {
            throw new Error('Input must be a string');
        }
        // Remove excessive whitespace
        text = text.trim().replace(/\s+/g, ' ');
        // Truncate if too long (model specific limits could be added to config)
        return text.substring(0, 8000);
    }

    /**
     * Clear all cached embeddings
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        const now = Date.now();
        const stats = {
            totalEntries: this.cache.size,
            activeEntries: 0,
            expiredEntries: 0,
            cacheHitRate: 0,
            averageAge: 0
        };

        let totalAge = 0;
        for (const entry of this.cache.values()) {
            if (this._isCacheExpired(entry)) {
                stats.expiredEntries++;
            } else {
                stats.activeEntries++;
                totalAge += now - entry.timestamp;
            }
        }

        stats.averageAge = totalAge / stats.activeEntries || 0;
        return stats;
    }

    /**
     * Find most similar texts based on their embeddings
     */
    async findSimilarTexts(queryText, texts, topK = 5) {
        const queryEmbedding = await this.getEmbedding(queryText);
        const textEmbeddings = await this.getBatchEmbeddings(texts);
        
        const similarities = textEmbeddings.map((embedding, index) => ({
            text: texts[index],
            similarity: this.calculateSimilarity(queryEmbedding, embedding)
        }));

        return similarities
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);
    }
} 