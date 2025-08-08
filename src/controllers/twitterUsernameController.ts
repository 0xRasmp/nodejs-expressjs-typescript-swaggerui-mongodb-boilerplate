import { Request, Response } from "express";
import TwitterUsername from "../models/twitterUsernameModel";
import Token from "../models/tokenModel";

// Add Twitter username for an access token
export const addTwitterUsername = async (req: Request, res: Response) => {
  try {
    const { accessToken, twitterUsername } = req.body;

    // Validate required fields
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }

    if (!twitterUsername) {
      return res.status(400).json({
        success: false,
        message: "Twitter username is required",
      });
    }

    // Remove @ symbol if present and trim whitespace
    const cleanUsername = twitterUsername.replace(/^@/, '').trim();

    // Validate Twitter username format (basic validation)
    const twitterRegex = /^[a-zA-Z0-9_]{1,15}$/;
    if (!twitterRegex.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Twitter username format. Must be 1-15 characters, letters, numbers, and underscores only.",
      });
    }

    // First, validate that the access token exists and is active
    const tokenDoc = await Token.findOne({
      token: accessToken,
      isActive: true,
    });

    if (!tokenDoc) {
      return res.status(404).json({
        success: false,
        message: "Access token not found or inactive",
      });
    }

    // Check if token is expired
    if (
      tokenDoc.metadata?.expiresAt &&
      new Date() > tokenDoc.metadata.expiresAt
    ) {
      return res.status(401).json({
        success: false,
        message: "Access token has expired",
      });
    }

    // Check if this access token has already added this specific username
    const existingEntry = await TwitterUsername.findOne({
      accessToken: accessToken,
      twitterUsername: cleanUsername,
      isActive: true,
    });

    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message: "This access token has already added this Twitter username",
      });
    }

    // Check if the access token has reached the limit of 300 usernames
    const currentCount = await TwitterUsername.countDocuments({
      accessToken: accessToken,
      isActive: true,
    });

    if (currentCount >= 300) {
      return res.status(429).json({
        success: false,
        message: "Access token has reached the maximum limit of 300 Twitter usernames",
        data: {
          currentCount: currentCount,
          limit: 300,
        },
      });
    }

    // Create new Twitter username entry
    const twitterUsernameDoc = new TwitterUsername({
      accessToken: accessToken,
      twitterUsername: cleanUsername,
    });

    const savedEntry = await twitterUsernameDoc.save();

    res.status(201).json({
      success: true,
      message: "Twitter username added successfully",
      data: {
        accessToken: savedEntry.accessToken,
        twitterUsername: savedEntry.twitterUsername,
        createdAt: savedEntry.createdAt,
      },
    });
  } catch (error) {
    console.error("Error adding Twitter username:", error);
    
    // Handle duplicate key error (MongoDB unique constraint)
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This access token has already added this Twitter username",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all Twitter usernames for an access token
export const getTwitterUsernamesByToken = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.params;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }

    // Validate that the access token exists and is active
    const tokenDoc = await Token.findOne({
      token: accessToken,
      isActive: true,
    });

    if (!tokenDoc) {
      return res.status(404).json({
        success: false,
        message: "Access token not found or inactive",
      });
    }

    // Check if token is expired
    if (
      tokenDoc.metadata?.expiresAt &&
      new Date() > tokenDoc.metadata.expiresAt
    ) {
      return res.status(401).json({
        success: false,
        message: "Access token has expired",
      });
    }

    // Get all Twitter usernames for this access token
    const twitterUsernames = await TwitterUsername.find({
      accessToken: accessToken,
      isActive: true,
    }).select("-__v");

    res.json({
      success: true,
      data: {
        accessToken: accessToken,
        twitterUsernames: twitterUsernames.map((entry) => ({
          twitterUsername: entry.twitterUsername,
          createdAt: entry.createdAt,
        })),
        count: twitterUsernames.length,
      },
    });
  } catch (error) {
    console.error("Error getting Twitter usernames:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};



 