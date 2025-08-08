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









 