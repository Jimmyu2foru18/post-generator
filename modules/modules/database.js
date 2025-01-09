import { VectorIndex } from './vectorIndex.js';
import { EmbeddingService } from './embeddings.js';
import { Logger } from '../logger.js';

export class Database {
    constructor(config = {}) {
        this.maxEntries = config.maxEntries || 10000;
        this.maxConnections = config.maxConnections || 10;
        this.connectionTimeout = config.connectionTimeout || 5000;
        this.connectionPool = new Map();
        this.data = new Map();
        this.vectorIndex = new VectorIndex();
        this.embeddingService = new EmbeddingService(config.embeddingConfig);
        this.initializeCleanup(config.cleanupInterval || 3600000);
    }

    async getConnection() {
        // Implement connection pooling
        if (this.connectionPool.size >= this.maxConnections) {
            throw new Error('Connection pool exhausted');
        }

        const connection = {
            id: Date.now(),
            lastUsed: Date.now()
        };

        this.connectionPool.set(connection.id, connection);
        return connection;
    }

    async releaseConnection(connection) {
        this.connectionPool.delete(connection.id);
    }

    async store(entry) {
        try {
            const id = this._generateId();
            const timestamp = Date.now();
            
            this.data.set(id, {
                ...entry,
                id,
                timestamp,
                metadata: {
                    ...entry.metadata,
                    storageTimestamp: timestamp
                }
            });

            await this._cleanup();
            return id;
        } catch (error) {
            console.error('Database storage error:', error);
            throw error;
        }
    }

    async retrieve(id) {
        const entry = this.data.get(id);
        if (!entry) {
            throw new Error('Entry not found');
        }
        return entry;
    }

    async retrieveRelevant(topic, limit = 5) {
        try {
            // Get embedding for the topic
            const topicEmbedding = await this.embeddingService.getEmbedding(topic);
            
            // Search using vector index
            const vectorResults = await this.vectorIndex.search(topicEmbedding, limit * 2);
            
            // Combine vector search with text-based relevance
            const entries = await Promise.all(
                vectorResults.map(async result => {
                    const entry = await this.retrieve(result.id);
                    const textRelevance = this._calculateRelevance(entry, topic);
                    return {
                        ...entry,
                        relevanceScore: (result.score + textRelevance) / 2
                    };
                })
            );

            return entries
                .filter(entry => entry.relevanceScore > 0.3)
                .sort((a, b) => b.relevanceScore - a.relevanceScore)
                .slice(0, limit);
        } catch (error) {
            console.error('Error retrieving relevant entries:', error);
            throw error;
        }
    }

    async update(id, updates) {
        try {
            const existingEntry = await this.retrieve(id);
            if (!existingEntry) {
                throw new Error('Entry not found for update');
            }

            const updatedEntry = {
                ...existingEntry,
                ...updates,
                metadata: {
                    ...existingEntry.metadata,
                    ...updates.metadata,
                    lastUpdated: Date.now()
                }
            };

            this.data.set(id, updatedEntry);

            // Update vector index if content changed
            if (updates.content || updates.topic) {
                const embedding = await this.embeddingService.getEmbedding(
                    updates.content || updatedEntry.content
                );
                await this.vectorIndex.update(id, embedding);
            }

            return updatedEntry;
        } catch (error) {
            console.error('Error updating entry:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const entry = await this.retrieve(id);
            if (!entry) {
                throw new Error('Entry not found for deletion');
            }

            this.data.delete(id);
            await this.vectorIndex.delete(id);

            return true;
        } catch (error) {
            console.error('Error deleting entry:', error);
            throw error;
        }
    }

    async query(queryOptions = {}) {
        try {
            let entries = Array.from(this.data.values());

            // Apply filters
            if (queryOptions.filters) {
                entries = entries.filter(entry => {
                    return Object.entries(queryOptions.filters).every(([key, value]) => {
                        if (key.includes('.')) {
                            const [parent, child] = key.split('.');
                            return entry[parent] && entry[parent][child] === value;
                        }
                        return entry[key] === value;
                    });
                });
            }

            // Apply sorting
            if (queryOptions.sortBy) {
                const [field, order] = queryOptions.sortBy.split(':');
                entries.sort((a, b) => {
                    const aValue = field.includes('.') ? 
                        field.split('.').reduce((obj, key) => obj[key], a) : 
                        a[field];
                    const bValue = field.includes('.') ? 
                        field.split('.').reduce((obj, key) => obj[key], b) : 
                        b[field];
                    
                    return order === 'desc' ? 
                        bValue - aValue : 
                        aValue - bValue;
                });
            }

            // Apply pagination
            if (queryOptions.limit) {
                const start = queryOptions.offset || 0;
                entries = entries.slice(start, start + queryOptions.limit);
            }

            return entries;
        } catch (error) {
            console.error('Error querying database:', error);
            throw error;
        }
    }

    async backup() {
        try {
            const backup = {
                timestamp: Date.now(),
                entries: Array.from(this.data.entries()),
                vectorIndex: await this.vectorIndex.serialize()
            };
            return backup;
        } catch (error) {
            console.error('Error creating backup:', error);
            throw error;
        }
    }

    async restore(backup) {
        try {
            this.data.clear();
            for (const [id, entry] of backup.entries) {
                this.data.set(id, entry);
            }
            await this.vectorIndex.deserialize(backup.vectorIndex);
            return true;
        } catch (error) {
            console.error('Error restoring backup:', error);
            throw error;
        }
    }

    _generateId() {
        return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    _calculateRelevance(entry, topic) {
        // Simple relevance calculation based on topic similarity
        const entryTopic = entry.topic.toLowerCase();
        topic = topic.toLowerCase();
        
        if (entryTopic === topic) return 1;
        if (entryTopic.includes(topic) || topic.includes(entryTopic)) return 0.8;
        
        const entryWords = new Set(entryTopic.split(/\W+/));
        const topicWords = new Set(topic.split(/\W+/));
        const intersection = new Set([...entryWords].filter(x => topicWords.has(x)));
        
        return intersection.size / Math.max(entryWords.size, topicWords.size);
    }

    initializeCleanup(interval) {
        setInterval(() => this._cleanup(), interval);
    }

    async _cleanup() {
        if (this.data.size > this.maxEntries) {
            const entries = Array.from(this.data.entries())
                .sort(([, a], [, b]) => b.timestamp - a.timestamp);
            
            const toKeep = entries.slice(0, this.maxEntries);
            this.data.clear();
            
            for (const [id, entry] of toKeep) {
                this.data.set(id, entry);
            }
        }
    }
} 