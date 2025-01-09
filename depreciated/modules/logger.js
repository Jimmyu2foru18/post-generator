import winston from 'winston';

const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

export class Logger {
    static logger = winston.createLogger({
        levels: logLevels,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' }),
            new winston.transports.File({ filename: 'combined.log' })
        ]
    });

    // Add console transport in development
    static {
        if (process.env.NODE_ENV !== 'production') {
            Logger.logger.add(new winston.transports.Console({
                format: winston.format.simple()
            }));
        }
    }

    static info(message, meta = {}) {
        this.logger.info(message, meta);
    }

    static error(message, meta = {}) {
        this.logger.error(message, meta);
    }

    static warn(message, meta = {}) {
        this.logger.warn(message, meta);
    }

    static debug(message, meta = {}) {
        this.logger.debug(message, meta);
    }
} 