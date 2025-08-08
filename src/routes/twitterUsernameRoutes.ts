import express from "express";
import {
  addTwitterUsername,
  getTwitterUsernamesByToken,
  getAccessTokensByUsername,
  removeTwitterUsername,
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

/**
 * @swagger
 * /api/twitter-usernames/username/{twitterUsername}:
 *   get:
 *     tags: [Twitter Usernames]
 *     summary: Get all access tokens for a Twitter username
 *     description: Retrieve all access tokens that have added a specific Twitter username
 *     parameters:
 *       - in: path
 *         name: twitterUsername
 *         required: true
 *         schema:
 *           type: string
 *         description: The Twitter username to get access tokens for
 *     responses:
 *       200:
 *         description: Access tokens retrieved successfully
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
 *                     twitterUsername:
 *                       type: string
 *                       example: "john_doe"
 *                     accessTokens:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           accessToken:
 *                             type: string
 *                             example: "966f7dbf481761363f9b94fae"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     count:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Twitter username is required
 *       500:
 *         description: Internal server error
 */
router.get("/username/:twitterUsername", getAccessTokensByUsername);

/**
 * @swagger
 * /api/twitter-usernames/remove:
 *   delete:
 *     tags: [Twitter Usernames]
 *     summary: Remove Twitter username for an access token
 *     description: Remove the association between an access token and a Twitter username
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
 *                 description: The access token to remove the Twitter username from
 *                 example: "966f7dbf481761363f9b94fae"
 *               twitterUsername:
 *                 type: string
 *                 description: Twitter username to remove
 *                 example: "john_doe"
 *     responses:
 *       200:
 *         description: Twitter username removed successfully
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
 *                   example: "Twitter username removed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "966f7dbf481761363f9b94fae"
 *                     twitterUsername:
 *                       type: string
 *                       example: "john_doe"
 *                     removedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Access token and Twitter username are required
 *       401:
 *         description: Access token has expired
 *       404:
 *         description: Access token not found or Twitter username not found for this token
 *       500:
 *         description: Internal server error
 */
router.delete("/remove", removeTwitterUsername);

export default router; 