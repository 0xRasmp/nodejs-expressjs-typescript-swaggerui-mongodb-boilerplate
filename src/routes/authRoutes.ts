import express from 'express';
import { loginWithToken, getCurrentUser } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login with access token
 *     description: Authenticate user using their access token (no password required)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: The access token to use for authentication
 *                 example: "966f7dbf481761363f9b94fae"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: The token itself serves as the user ID
 *                       example: "966f7dbf481761363f9b94fae"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "966f7dbf481761363f9b94fae"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         purpose:
 *                           type: string
 *                           example: "API access"
 *                     token:
 *                       type: object
 *                       properties:
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: Access token is required
 *       401:
 *         description: Invalid or expired access token
 *       500:
 *         description: Internal server error
 */
router.post('/login', loginWithToken);

/**
 * @swagger
 * /api/auth/me:
 *   post:
 *     tags: [Authentication]
 *     summary: Get current user information
 *     description: Retrieve current user information using access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: The access token to validate
 *                 example: "966f7dbf481761363f9b94fae"
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "966f7dbf481761363f9b94fae"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "966f7dbf481761363f9b94fae"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         purpose:
 *                           type: string
 *                           example: "API access"
 *                     token:
 *                       type: object
 *                       properties:
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: Access token is required
 *       401:
 *         description: Invalid or expired access token
 *       500:
 *         description: Internal server error
 */
router.post('/me', getCurrentUser);

export default router; 