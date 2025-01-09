import helmet from 'helmet';

export function configureSecurityMiddleware(app) {
    // Basic security headers
    app.use(helmet());

    // Custom CSP
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", process.env.API_BASE_URL]
        }
    }));

    // Additional security measures
    app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.disable('x-powered-by');

    // CORS configuration
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Max-Age', '86400');
        next();
    });
} 