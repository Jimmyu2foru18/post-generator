import { config } from '../config.js';
import { Logger } from '../logger.js';

export class API {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || process.env.API_BASE_URL || 'http://localhost:11434';
        this.apiKey = config.apiKey || process.env.API_KEY;
        this.maxRetries = config.maxRetries || 3;
        this.retryDelay = config.retryDelay || 1000;
        this.timeout = config.timeout || 30000;
    }

    async generateThoughts(topic, context) {
        let attempts = 0;
        while (attempts < this.maxRetries) {
            try {
                const response = await this._makeRequest('/chat/completions', {
                    method: 'POST',
                    body: this._buildRequestBody(topic, context)
                });
                return this._formatResponse(response);
            } catch (error) {
                attempts++;
                if (attempts === this.maxRetries) {
                    throw error;
                }
                await this._wait(this._getRetryDelay(attempts));
            }
        }
    }

    async _makeRequest(endpoint, options) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    ...options.headers
                },
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    _getRetryDelay(attempt) {
        return Math.min(
            this.retryDelay * Math.pow(2, attempt - 1),
            10000
        );
    }

    _buildRequestBody(topic, context) {
        return JSON.stringify({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a professional content generator."
                },
                {
                    role: "user",
                    content: `Generate insights about: ${topic}\nContext: ${context}`
                }
            ],
            temperature: 0.7
        });
    }

    _formatResponse(data) {
        try {
            if (!data.choices || !data.choices[0]) {
                Logger.error('Invalid API response format');
                throw new Error('Invalid API response format');
            }

            const message = data.choices[0].message;
            
            return {
                content: message.content,
                metadata: {
                    model: data.model,
                    created: data.created,
                    promptTokens: data.usage?.prompt_tokens,
                    completionTokens: data.usage?.completion_tokens,
                    totalTokens: data.usage?.total_tokens
                },
                status: 'success'
            };
        } catch (error) {
            Logger.error('Error formatting API response:', error);
            return {
                content: null,
                metadata: {},
                status: 'error',
                error: error.message
            };
        }
    }
} 