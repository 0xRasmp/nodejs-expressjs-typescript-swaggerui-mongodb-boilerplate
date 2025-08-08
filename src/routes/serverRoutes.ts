import express from 'express';
import { getServerStatus } from '../controllers/serverController';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swaggerConfig';
import tokenRoutes from './tokenRoutes';
import authRoutes from './authRoutes';
import twitterUsernameRoutes from './twitterUsernameRoutes';

const router = express.Router();

// Swagger UI setup
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Check server health status
 *     description: Returns the current health status of the server
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 */
router.get('/health', getServerStatus);

/**
 * @swagger
 * /api/version:
 *   get:
 *     tags: [Health]
 *     summary: Get API version
 *     description: Returns the current version of the API
 *     responses:
 *       200:
 *         description: API version information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 name:
 *                   type: string
 *                   example: "Node.js Express TypeScript MongoDB Boilerplate"
 */
router.get('/version', (req, res) => {
  res.json({
    version: '1.0.0',
    name: 'Node.js Express TypeScript MongoDB Boilerplate'
  });
});

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Check if the server is running
 *     responses:
 *       200:
 *         description: Server is running
 */
router.get('/status', getServerStatus);

// Token routes
router.use('/tokens', tokenRoutes);

// Auth routes
router.use('/auth', authRoutes);

// Twitter username routes
router.use('/twitter-usernames', twitterUsernameRoutes);

export default router; 