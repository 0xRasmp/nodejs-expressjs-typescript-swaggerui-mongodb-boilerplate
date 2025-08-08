import mongoose, { Schema, Document } from "mongoose";

interface IToken extends Document {
  token: string;
  createdAt: Date;
  isActive: boolean;
  metadata?: {
    purpose?: string;
    expiresAt?: Date;
  };
}

const TokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  metadata: {
    purpose: { type: String },
    expiresAt: { type: Date },
  },
});

// Add TTL index to automatically delete expired tokens
TokenSchema.index({ "metadata.expiresAt": 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IToken>("Token", TokenSchema);
