import { Request, Response } from "express";
import Token from "../models/tokenModel";

// Login with access token
export const loginWithToken = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    // Validate required field
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }

    // Find the token in database
    const tokenDoc = await Token.findOne({
      token: accessToken,
      isActive: true,
    }).select("-__v");

    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
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

    // Login successful
    res.json({
      success: true,
      message: "Login successful",
      data: {
        userId: tokenDoc.token, // Token serves as user ID
        user: {
          id: tokenDoc.token,
          createdAt: tokenDoc.createdAt,
          purpose: tokenDoc.metadata?.purpose,
        },
        token: {
          expiresAt: tokenDoc.metadata?.expiresAt,
          isActive: tokenDoc.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get current user info (requires token validation)
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }

    const tokenDoc = await Token.findOne({
      token: accessToken,
      isActive: true,
    }).select("-__v");

    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    if (
      tokenDoc.metadata?.expiresAt &&
      new Date() > tokenDoc.metadata.expiresAt
    ) {
      return res.status(401).json({
        success: false,
        message: "Access token has expired",
      });
    }

    res.json({
      success: true,
      data: {
        userId: tokenDoc.token,
        user: {
          id: tokenDoc.token,
          createdAt: tokenDoc.createdAt,
          purpose: tokenDoc.metadata?.purpose,
        },
        token: {
          expiresAt: tokenDoc.metadata?.expiresAt,
          isActive: tokenDoc.isActive,
        },
      },
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
