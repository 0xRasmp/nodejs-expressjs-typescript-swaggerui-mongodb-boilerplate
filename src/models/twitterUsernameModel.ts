import mongoose, { Schema, Document } from "mongoose";

interface ITwitterUsername extends Document {
  accessToken: string;
  twitterUsername: string;
  createdAt: Date;
  isActive: boolean;
}

const TwitterUsernameSchema: Schema = new Schema({
  accessToken: {
    type: String,
    required: true,
    index: true,
  },
  twitterUsername: {
    type: String,
    required: true,
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
});

// Compound unique index: one access token can only add one specific username once
TwitterUsernameSchema.index(
  { accessToken: 1, twitterUsername: 1 },
  { unique: true }
);

export default mongoose.model<ITwitterUsername>("TwitterUsername", TwitterUsernameSchema); 