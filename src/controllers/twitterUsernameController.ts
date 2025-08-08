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

// Get all access tokens that have added a specific Twitter username
export const getAccessTokensByUsername = async (req: Request, res: Response) => {
  try {
    const { twitterUsername } = req.params;

    if (!twitterUsername) {
      return res.status(400).json({
        success: false,
        message: "Twitter username is required",
      });
    }

    // Remove @ symbol if present and trim whitespace
    const cleanUsername = twitterUsername.replace(/^@/, '').trim();

    // Get all access tokens that have added this Twitter username
    const entries = await TwitterUsername.find({
      twitterUsername: cleanUsername,
      isActive: true,
    }).select("-__v");

    res.json({
      success: true,
      data: {
        twitterUsername: cleanUsername,
        accessTokens: entries.map((entry) => ({
          accessToken: entry.accessToken,
          createdAt: entry.createdAt,
        })),
        count: entries.length,
      },
    });
  } catch (error) {
    console.error("Error getting access tokens by username:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Remove a Twitter username for an access token
export const removeTwitterUsername = async (req: Request, res: Response) => {
  try {
    const { accessToken, twitterUsername } = req.body;

    if (!accessToken || !twitterUsername) {
      return res.status(400).json({
        success: false,
        message: "Access token and Twitter username are required",
      });
    }

    // Remove @ symbol if present and trim whitespace
    const cleanUsername = twitterUsername.replace(/^@/, '').trim();

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

    // Find and deactivate the Twitter username entry
    const entry = await TwitterUsername.findOneAndUpdate(
      {
        accessToken: accessToken,
        twitterUsername: cleanUsername,
        isActive: true,
      },
      { isActive: false },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Twitter username not found for this access token",
      });
    }

    res.json({
      success: true,
      message: "Twitter username removed successfully",
      data: {
        accessToken: entry.accessToken,
        twitterUsername: entry.twitterUsername,
        removedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error removing Twitter username:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}; 