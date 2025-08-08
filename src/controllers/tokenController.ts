import { Request, Response } from 'express';
import crypto from 'crypto';
import Token from '../models/tokenModel';

// Generate a random token similar to the example: 966f7dbf481761363f9b94fae
const generateToken = (): string => {
  return crypto.randomBytes(12).toString('hex');
};

// Generate and save a new token
export const generateAndSaveToken = async (req: Request, res: Response) => {
  try {
    const { purpose, expiresIn } = req.body;
    
    // Generate a unique token
    let token: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    do {
      token = generateToken();
      const existingToken = await Token.findOne({ token });
      isUnique = !existingToken;
      attempts++;
    } while (!isUnique && attempts < maxAttempts);
    
    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate unique token after multiple attempts'
      });
    }
    
    // Calculate expiration date if provided
    let expiresAt: Date | undefined;
    if (expiresIn) {
      // expiresIn is now in days, convert to milliseconds
      const daysInMs = expiresIn * 24 * 60 * 60 * 1000; // days * hours * minutes * seconds * milliseconds
      expiresAt = new Date(Date.now() + daysInMs);
    }
    
    // Create token document
    const tokenDoc = new Token({
      token,
      metadata: {
        purpose,
        expiresAt
      }
    });
    
    // Save to database
    const savedToken = await tokenDoc.save();
    
    res.status(201).json({
      success: true,
      message: 'Token generated successfully',
      data: {
        token: savedToken.token,
        createdAt: savedToken.createdAt,
        expiresAt: savedToken.metadata?.expiresAt,
        purpose: savedToken.metadata?.purpose
      }
    });
    
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all tokens (with pagination)
export const getAllTokens = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const tokens = await Token.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await Token.countDocuments({ isActive: true });
    
    res.json({
      success: true,
      data: tokens,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get token by ID
export const getTokenById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const token = await Token.findById(id).select('-__v');
    
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }
    
    res.json({
      success: true,
      data: token
    });
    
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Validate token and get user info
export const validateToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    const tokenDoc = await Token.findOne({ 
      token, 
      isActive: true 
    }).select('-__v');
    
    if (!tokenDoc) {
      return res.status(404).json({
        success: false,
        message: 'Token not found or inactive'
      });
    }
    
    // Check if token is expired
    if (tokenDoc.metadata?.expiresAt && new Date() > tokenDoc.metadata.expiresAt) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }
    
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        userId: tokenDoc.token, // The token itself serves as the user ID
        createdAt: tokenDoc.createdAt,
        expiresAt: tokenDoc.metadata?.expiresAt,
        purpose: tokenDoc.metadata?.purpose
      }
    });
    
  } catch (error) {
    console.error('Error validating token:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};



// Deactivate token
export const deactivateToken = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const token = await Token.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-__v');
    
    if (!token) {
      return res.status(404).json({
        success: false,
        message: 'Token not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Token deactivated successfully',
      data: token
    });
    
  } catch (error) {
    console.error('Error deactivating token:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 