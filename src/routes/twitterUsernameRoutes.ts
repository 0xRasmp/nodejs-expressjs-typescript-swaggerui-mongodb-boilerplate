import express from "express";
import {
  addTwitterUsername,
  getTwitterUsernamesByToken,
} from "../controllers/twitterUsernameController";

const router = express.Router();

/**
 * @swagger
 * /api/twitter-usernames:
 *   post:
 *     tags: [Twitter Usernames]
 *     summary: Add Twitter username for an access token
 *     description: Associate a Twitter username with an access token (one token can only add one specific username once)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *               - twitterUsername
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: The access token to associate with the Twitter username
 *                 example: "966f7dbf481761363f9b94fae"
 *               twitterUsername:
 *                 type: string
 *                 description: Twitter username to add
 *                 example: "john_doe"
 *     responses:
 *       201:
 *         description: Twitter username added successfully
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
 *                   example: "Twitter username added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "966f7dbf481761363f9b94fae"
 *                     twitterUsername:
 *                       type: string
 *                       example: "john_doe"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Missing required fields or invalid Twitter username format
 *       401:
 *         description: Access token has expired
 *       404:
 *         description: Access token not found or inactive
 *       409:
 *         description: This access token has already added this Twitter username
 *       429:
 *         description: Access token has reached the maximum limit of 300 Twitter usernames
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Access token has reached the maximum limit of 300 Twitter usernames"
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentCount:
 *                       type: integer
 *                       example: 300
 *                     limit:
 *                       type: integer
 *                       example: 300
 *       500:
 *         description: Internal server error
 */
router.post("/", addTwitterUsername);

/**
 * @swagger
 * /api/twitter-usernames/token/{accessToken}:
 *   get:
 *     tags: [Twitter Usernames]
 *     summary: Get all Twitter usernames for an access token
 *     description: Retrieve all Twitter usernames that a specific access token has added
 *     parameters:
 *       - in: path
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The access token to get Twitter usernames for
 *     responses:
 *       200:
 *         description: Twitter usernames retrieved successfully
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
 *                     accessToken:
 *                       type: string
 *                       example: "966f7dbf481761363f9b94fae"
 *                     twitterUsernames:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           twitterUsername:
 *                             type: string
 *                             example: "john_doe"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     count:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Access token is required
 *       401:
 *         description: Access token has expired
 *       404:
 *         description: Access token not found or inactive
 *       500:
 *         description: Internal server error
 */
router.get("/token/:accessToken", getTwitterUsernamesByToken);

export default router; 