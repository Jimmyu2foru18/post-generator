import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { logger } from './logger.js';
import { MetricsCollector } from './modules/metrics.js';
import { HealthCheck } from './modules/health.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Initialize monitoring
const metrics = new MetricsCollector();
const healthCheck = new HealthCheck();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Basic routes
app.get('/health', async (req, res) => {
    const health = await healthCheck.checkHealth();
    res.status(health.healthy ? 200 : 503).json(health);
});

app.get('/metrics', (req, res) => {
    res.json(metrics.getMetricsReport());
});

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
}); 