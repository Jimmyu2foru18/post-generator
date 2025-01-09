export class BaseError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = this.constructor.name;
        this.timestamp = Date.now();
        this.code = options.code || 'UNKNOWN_ERROR';
        this.context = options.context || {};
        this.recoverable = options.recoverable || false;
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            context: this.context,
            timestamp: this.timestamp,
            recoverable: this.recoverable
        };
    }
}

export class APIError extends BaseError {
    constructor(message, options = {}) {
        super(message, {
            code: 'API_ERROR',
            recoverable: false,
            ...options
        });
        this.statusCode = options.statusCode;
        this.endpoint = options.endpoint;
    }
}

export class ValidationError extends BaseError {
    constructor(message, options = {}) {
        super(message, {
            code: 'VALIDATION_ERROR',
            recoverable: true,
            ...options
        });
        this.validationErrors = options.validationErrors || [];
    }

    toJSON() {
        return {
            ...super.toJSON(),
            validationErrors: this.validationErrors
        };
    }
}

export class ChainError extends BaseError {
    constructor(message, options = {}) {
        super(message, {
            code: 'CHAIN_ERROR',
            recoverable: false,
            ...options
        });
        this.chainStep = options.chainStep;
        this.thoughtProcess = options.thoughtProcess;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            chainStep: this.chainStep,
            thoughtProcess: this.thoughtProcess
        };
    }
}

export class RAGError extends BaseError {
    constructor(message, options = {}) {
        super(message, {
            code: 'RAG_ERROR',
            recoverable: true,
            ...options
        });
        this.phase = options.phase;
        this.retrieverType = options.retrieverType;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            phase: this.phase,
            retrieverType: this.retrieverType
        };
    }
}

export class DatabaseError extends BaseError {
    constructor(message, options = {}) {
        super(message, {
            code: 'DATABASE_ERROR',
            recoverable: false,
            ...options
        });
        this.operation = options.operation;
        this.table = options.table;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            operation: this.operation,
            table: this.table
        };
    }
}

export class EmbeddingError extends BaseError {
    constructor(message, options = {}) {
        super(message, {
            code: 'EMBEDDING_ERROR',
            recoverable: false,
            ...options
        });
        this.modelName = options.modelName;
        this.inputType = options.inputType;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            modelName: this.modelName,
            inputType: this.inputType
        };
    }
}

export class ContentGenerationError extends BaseError {
    constructor(message, options = {}) {
        super(message, {
            code: 'CONTENT_GENERATION_ERROR',
            recoverable: true,
            ...options
        });
        this.contentType = options.contentType;
        this.generatorType = options.generatorType;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            contentType: this.contentType,
            generatorType: this.generatorType
        };
    }
} 