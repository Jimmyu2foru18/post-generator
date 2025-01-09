export class SignatureGenerator {
    constructor(config = {}) {
        this.config = {
            maxLength: config.maxLength || 100,
            style: config.style || 'professional',
            includeTimestamp: config.includeTimestamp ?? true,
            includeAuthor: config.includeAuthor ?? true,
            customPrefix: config.customPrefix || '',
            customSuffix: config.customSuffix || '',
            dateFormat: config.dateFormat || 'full', // 'full', 'short', 'iso', 'custom'
            customDateFormat: config.customDateFormat || null,
            separator: config.separator || ' | ',
            includeVersion: config.includeVersion ?? false,
            version: config.version || '1.0.0',
            locale: config.locale || 'en-US',
            hashAlgorithm: config.hashAlgorithm || 'simple', // 'simple', 'md5', 'sha1'
            encodeEmojis: config.encodeEmojis ?? true,
            signatureTemplate: config.signatureTemplate || null,
            ...config
        };

        this.emojiMap = {
            '✨': ':sparkles:',
            '🤖': ':robot:',
            '📝': ':memo:',
            '⚡': ':zap:',
            '🔒': ':lock:'
        };
    }

    async generateSignature(content, author = 'AI Post Generator', metadata = {}) {
        try {
            if (this.config.signatureTemplate) {
                return this.generateFromTemplate(content, author, metadata);
            }
            const signature = this.buildSignature(content, author, metadata);
            return this.formatSignature(signature);
        } catch (error) {
            console.error('Signature generation error:', error);
            this.logError(error);
            return 'Generated by AI';
        }
    }

    buildSignature(content, author, metadata) {
        const components = [];

        if (this.config.customPrefix) {
            components.push(this.encodeComponent(this.config.customPrefix));
        }

        if (this.config.includeAuthor) {
            components.push(`Generated by ${this.sanitizeInput(author)}`);
        }

        if (this.config.includeTimestamp) {
            const timestamp = this.formatTimestamp();
            components.push(timestamp);
        }

        if (this.config.includeVersion) {
            components.push(`v${this.config.version}`);
        }

        if (content && this.config.style === 'detailed') {
            const contentHash = this.generateContentHash(content);
            components.push(`Content ID: ${contentHash}`);
            
            if (metadata.category) {
                components.push(`Category: ${this.sanitizeInput(metadata.category)}`);
            }
            
            if (metadata.tags?.length > 0) {
                components.push(`Tags: ${metadata.tags.map(tag => this.sanitizeInput(tag)).join(', ')}`);
            }
        }

        if (this.config.customSuffix) {
            components.push(this.encodeComponent(this.config.customSuffix));
        }

        return components;
    }

    generateFromTemplate(content, author, metadata) {
        const template = this.config.signatureTemplate;
        const variables = {
            author: this.sanitizeInput(author),
            timestamp: this.formatTimestamp(),
            version: this.config.version,
            contentHash: this.generateContentHash(content),
            ...metadata
        };

        return template.replace(/\${(\w+)}/g, (match, variable) => 
            variables[variable] || match
        );
    }

    formatSignature(components) {
        let signature = components.join(this.config.separator);

        if (signature.length > this.config.maxLength) {
            signature = signature.substring(0, this.config.maxLength - 3) + '...';
        }

        switch (this.config.style) {
            case 'minimal':
                return signature.toLowerCase();
            case 'formal':
                return signature.toUpperCase();
            case 'compact':
                return this.makeCompact(signature);
            case 'professional':
            default:
                return signature;
        }
    }

    formatTimestamp() {
        const date = new Date();
        
        switch (this.config.dateFormat) {
            case 'short':
                return date.toLocaleDateString(this.config.locale);
            case 'iso':
                return date.toISOString();
            case 'custom':
                return this.formatCustomDate(date);
            case 'full':
            default:
                const options = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                };
                return date.toLocaleString(this.config.locale, options);
        }
    }

    formatCustomDate(date) {
        if (!this.config.customDateFormat) return date.toISOString();
        
        const formats = {
            'YYYY': date.getFullYear(),
            'MM': String(date.getMonth() + 1).padStart(2, '0'),
            'DD': String(date.getDate()).padStart(2, '0'),
            'HH': String(date.getHours()).padStart(2, '0'),
            'mm': String(date.getMinutes()).padStart(2, '0'),
            'ss': String(date.getSeconds()).padStart(2, '0')
        };

        return this.config.customDateFormat.replace(
            /YYYY|MM|DD|HH|mm|ss/g,
            match => formats[match]
        );
    }

    generateContentHash(content) {
        switch (this.config.hashAlgorithm) {
            case 'md5':
                return this.generateMD5Hash(content);
            case 'sha1':
                return this.generateSHA1Hash(content);
            case 'simple':
            default:
                return this.generateSimpleHash(content);
        }
    }

    generateSimpleHash(content) {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).substring(0, 8);
    }

    generateMD5Hash(content) {
        // Implement MD5 hashing or use a library
        return this.generateSimpleHash(content); // Fallback
    }

    generateSHA1Hash(content) {
        // Implement SHA1 hashing or use a library
        return this.generateSimpleHash(content); // Fallback
    }

    encodeComponent(text) {
        if (!this.config.encodeEmojis) return text;
        
        return text.replace(/[^\x00-\x7F]/g, char => 
            this.emojiMap[char] || char
        );
    }

    sanitizeInput(input) {
        return String(input)
            .replace(/[<>]/g, '')
            .trim();
    }

    makeCompact(signature) {
        return signature
            .replace(/\s+/g, ' ')
            .replace(/\|\s*/g, '|');
    }

    logError(error) {
        // Implement error logging logic here
        console.error('Detailed error log:', {
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack
        });
    }

    static getAvailableStyles() {
        return ['professional', 'minimal', 'formal', 'detailed', 'compact'];
    }

    static getAvailableDateFormats() {
        return ['full', 'short', 'iso', 'custom'];
    }

    static getAvailableHashAlgorithms() {
        return ['simple', 'md5', 'sha1'];
    }
} 