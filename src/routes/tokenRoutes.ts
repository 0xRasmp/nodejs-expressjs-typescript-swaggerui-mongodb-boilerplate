import express from "express";
import { generateAndSaveToken } from "../controllers/tokenController";

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

export default router;
