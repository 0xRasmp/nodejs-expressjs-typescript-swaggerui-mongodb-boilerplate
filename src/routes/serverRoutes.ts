import express from 'express';
import { getServerStatus } from '../controllers/serverController';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swaggerConfig';

const router = express.Router();

// Swagger UI setup
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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


export default router; 