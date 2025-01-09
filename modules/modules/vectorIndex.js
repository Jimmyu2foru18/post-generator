export class VectorIndex {
    constructor(dimensions = 768, options = {}) {
        this.vectors = new Map();
        this.dimensions = dimensions;
        this.metadata = new Map();
        this.options = {
            maxVectors: options.maxVectors || Infinity,
            minSimilarity: options.minSimilarity || 0.0,
            indexType: options.indexType || 'flat',
            cacheEnabled: options.cacheEnabled || false,
            ...options
        };
        this.searchCache = new Map();
        this.stats = {
            totalSearches: 0,
            cacheHits: 0,
            lastOptimized: Date.now()
        };
    }

    async add(id, vector, metadata = {}) {
        if (vector.length !== this.dimensions) {
            throw new Error(`Vector must have ${this.dimensions} dimensions`);
        }
        this.vectors.set(id, vector);
        this.metadata.set(id, metadata);
    }

    async addBatch(items) {
        for (const { id, vector, metadata } of items) {
            await this.add(id, vector, metadata);
        }
    }

    async search(query, limit = 10, threshold = 0.0, options = {}) {
        const cacheKey = this._generateCacheKey(query, limit, threshold, options);
        
        if (this.options.cacheEnabled && this.searchCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.searchCache.get(cacheKey);
        }

        this.stats.totalSearches++;
        const queryVector = await this._embedQuery(query);
        const scores = await this._performSearch(queryVector, limit, threshold, options);
        
        if (this.options.cacheEnabled) {
            this.searchCache.set(cacheKey, scores);
            this._pruneCache();
        }

        return scores;
    }

    async searchById(id, limit = 10, threshold = 0.0) {
        const sourceVector = this.vectors.get(id);
        if (!sourceVector) {
            throw new Error(`Vector with id ${id} not found`);
        }

        return this.searchByVector(sourceVector, limit, threshold);
    }

    async searchByVector(vector, limit = 10, threshold = 0.0) {
        if (vector.length !== this.dimensions) {
            throw new Error(`Vector must have ${this.dimensions} dimensions`);
        }

        const scores = Array.from(this.vectors.entries()).map(([id, compareVector]) => ({
            id,
            score: this._cosineSimilarity(vector, compareVector),
            metadata: this.metadata.get(id)
        }));

        return scores
            .filter(result => result.score >= threshold)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    async _embedQuery(query) {
        // Implement query embedding using your preferred model
        const embedding = await fetch('/api/embed', {
            method: 'POST',
            body: JSON.stringify({ text: query }),
            headers: { 'Content-Type': 'application/json' }
        });
        return embedding.json();
    }

    _cosineSimilarity(a, b) {
        const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }

    remove(id) {
        this.vectors.delete(id);
        this.metadata.delete(id);
    }

    clear() {
        this.vectors.clear();
        this.metadata.clear();
    }

    size() {
        return this.vectors.size;
    }

    has(id) {
        return this.vectors.has(id);
    }

    getVector(id) {
        return this.vectors.get(id);
    }

    getMetadata(id) {
        return this.metadata.get(id);
    }

    updateMetadata(id, metadata) {
        if (!this.vectors.has(id)) {
            throw new Error(`Vector with id ${id} not found`);
        }
        this.metadata.set(id, metadata);
    }

    getAllIds() {
        return Array.from(this.vectors.keys());
    }

    toJSON() {
        return {
            dimensions: this.dimensions,
            vectors: Array.from(this.vectors.entries()),
            metadata: Array.from(this.metadata.entries())
        };
    }

    static fromJSON(data) {
        const index = new VectorIndex(data.dimensions);
        data.vectors.forEach(([id, vector]) => {
            index.vectors.set(id, vector);
        });
        data.metadata.forEach(([id, metadata]) => {
            index.metadata.set(id, metadata);
        });
        return index;
    }

    async addWithEmbedding(id, text, metadata = {}) {
        const vector = await this._embedQuery(text);
        return this.add(id, vector, { ...metadata, originalText: text });
    }

    async addBatchWithEmbeddings(items) {
        const embeddings = await Promise.all(
            items.map(async item => ({
                id: item.id,
                vector: await this._embedQuery(item.text),
                metadata: { ...item.metadata, originalText: item.text }
            }))
        );
        return this.addBatch(embeddings);
    }

    async _performSearch(queryVector, limit, threshold, options = {}) {
        const { 
            includeVectors = false, 
            sortBy = 'score',
            filters = {}
        } = options;

        let scores = Array.from(this.vectors.entries())
            .map(([id, vector]) => ({
                id,
                score: this._cosineSimilarity(queryVector, vector),
                metadata: this.metadata.get(id),
                ...(includeVectors && { vector })
            }))
            .filter(result => {
                // Apply metadata filters
                return Object.entries(filters).every(([key, value]) => {
                    const metadata = result.metadata || {};
                    if (typeof value === 'function') {
                        return value(metadata[key]);
                    }
                    return metadata[key] === value;
                });
            })
            .filter(result => result.score >= threshold);

        // Custom sorting
        if (typeof sortBy === 'function') {
            scores.sort(sortBy);
        } else if (sortBy === 'score') {
            scores.sort((a, b) => b.score - a.score);
        }

        return scores.slice(0, limit);
    }

    async optimize() {
        // Implement index optimization based on indexType
        if (this.options.indexType === 'hnsw') {
            // Implement HNSW index optimization
        }
        this.stats.lastOptimized = Date.now();
    }

    _generateCacheKey(query, limit, threshold, options) {
        return JSON.stringify({ query, limit, threshold, options });
    }

    _pruneCache() {
        const MAX_CACHE_SIZE = 1000;
        if (this.searchCache.size > MAX_CACHE_SIZE) {
            const oldestKeys = Array.from(this.searchCache.keys()).slice(0, 100);
            oldestKeys.forEach(key => this.searchCache.delete(key));
        }
    }

    async calculateCentroid(ids) {
        if (!ids || ids.length === 0) {
            throw new Error('Must provide at least one ID to calculate centroid');
        }

        const vectors = ids.map(id => this.getVector(id)).filter(Boolean);
        if (vectors.length === 0) {
            throw new Error('No valid vectors found for the provided IDs');
        }

        const centroid = new Array(this.dimensions).fill(0);
        for (const vector of vectors) {
            for (let i = 0; i < this.dimensions; i++) {
                centroid[i] += vector[i];
            }
        }

        for (let i = 0; i < this.dimensions; i++) {
            centroid[i] /= vectors.length;
        }

        return centroid;
    }

    async findClusters(numClusters = 5, maxIterations = 100) {
        if (this.size() < numClusters) {
            throw new Error('Not enough vectors to form requested clusters');
        }

        // Simple k-means clustering
        let centroids = Array.from({ length: numClusters }, () => 
            this.getVector(Array.from(this.vectors.keys())[Math.floor(Math.random() * this.size())])
        );

        let clusters = new Map();
        let iterations = 0;
        let changed = true;

        while (changed && iterations < maxIterations) {
            changed = false;
            clusters.clear();

            // Assign vectors to nearest centroid
            for (const [id, vector] of this.vectors.entries()) {
                const centroidIndex = centroids.reduce((best, centroid, index) => {
                    const similarity = this._cosineSimilarity(vector, centroid);
                    return similarity > best.similarity ? { index, similarity } : best;
                }, { index: -1, similarity: -1 }).index;

                if (!clusters.has(centroidIndex)) {
                    clusters.set(centroidIndex, []);
                }
                clusters.get(centroidIndex).push(id);
            }

            // Update centroids
            for (const [index, clusterIds] of clusters.entries()) {
                const newCentroid = await this.calculateCentroid(clusterIds);
                if (!this._areVectorsEqual(centroids[index], newCentroid)) {
                    centroids[index] = newCentroid;
                    changed = true;
                }
            }

            iterations++;
        }

        return Array.from(clusters.entries()).map(([index, ids]) => ({
            centroid: centroids[index],
            ids,
            metadata: ids.map(id => this.getMetadata(id))
        }));
    }

    _areVectorsEqual(a, b) {
        return a.every((val, i) => Math.abs(val - b[i]) < 1e-10);
    }

    getStats() {
        return {
            ...this.stats,
            vectorCount: this.size(),
            dimensions: this.dimensions,
            cacheSize: this.searchCache.size,
            memoryUsage: this._estimateMemoryUsage()
        };
    }

    _estimateMemoryUsage() {
        // Rough estimation of memory usage in bytes
        const vectorSize = this.dimensions * 4; // 4 bytes per float
        const totalVectorSize = vectorSize * this.vectors.size;
        const metadataSize = JSON.stringify(Array.from(this.metadata.values())).length;
        const cacheSize = JSON.stringify(Array.from(this.searchCache.values())).length;
        
        return {
            vectors: totalVectorSize,
            metadata: metadataSize,
            cache: cacheSize,
            total: totalVectorSize + metadataSize + cacheSize
        };
    }
} 