import express from "express";
import {
  generateAndSaveToken,
  getAllTokens,
  getTokenById,
  validateToken,
  deactivateToken,
} from "../controllers/tokenController";

const router = express.Router();

/**
 * @swagger
 * /api/tokens:
 *   post:
 *     tags: [Tokens]
 *     summary: Generate a new token
 *     description: Generate a unique token and save it to the database
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               purpose:
 *                 type: string
 *                 description: Purpose of the token
 *                 example: "API access"

 *               expiresIn:
 *                 type: number
 *                 description: Token expiration time in days
 *                 example: 30
 *     responses:
 *       201:
 *         description: Token generated successfully
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
 *                   example: "Token generated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "966f7dbf481761363f9b94fae"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     purpose:
 *                       type: string
 *                       example: "API access"
 *       500:
 *         description: Internal server error
 */
router.post("/", generateAndSaveToken);

/**
 * @swagger
 * /api/tokens:
 *   get:
 *     tags: [Tokens]
 *     summary: Get all tokens
 *     description: Retrieve all active tokens with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of tokens per page
 *     responses:
 *       200:
 *         description: Tokens retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       token:
 *                         type: string
 *                         example: "966f7dbf481761363f9b94fae"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       isActive:
 *                         type: boolean
 *                       metadata:
 *                         type: object
 *                         properties:
 *                           purpose:
 *                             type: string

 *                           expiresAt:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllTokens);

/**
 * @swagger
 * /api/tokens/{id}:
 *   get:
 *     tags: [Tokens]
 *     summary: Get token by ID
 *     description: Retrieve a specific token by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Token ID
 *     responses:
 *       200:
 *         description: Token retrieved successfully
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
 *                     _id:
 *                       type: string
 *                     token:
 *                       type: string
 *                       example: "966f7dbf481761363f9b94fae"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     isActive:
 *                       type: boolean
 *                     metadata:
 *                       type: object
 *       404:
 *         description: Token not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getTokenById);

/**
 * @swagger
 * /api/tokens/{id}/deactivate:
 *   patch:
 *     tags: [Tokens]
 *     summary: Deactivate a token
 *     description: Mark a token as inactive
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Token ID
 *     responses:
 *       200:
 *         description: Token deactivated successfully
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
 *                   example: "Token deactivated successfully"
 *                 data:
 *                   type: object
 *       404:
 *         description: Token not found
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/tokens/validate/{token}:
 *   get:
 *     tags: [Tokens]
 *     summary: Validate a token
 *     description: Check if a token is valid and get user information
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token to validate
 *     responses:
 *       200:
 *         description: Token is valid
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
 *                   example: "Token is valid"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: The token itself serves as the user ID
 *                       example: "966f7dbf481761363f9b94fae"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     purpose:
 *                       type: string
 *       401:
 *         description: Token has expired
 *       404:
 *         description: Token not found or inactive
 *       500:
 *         description: Internal server error
 */
router.get("/validate/:token", validateToken);



router.patch("/:id/deactivate", deactivateToken);

export default router;
