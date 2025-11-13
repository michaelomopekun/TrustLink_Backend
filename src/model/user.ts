import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true 
    },

    password: { type: String, required: true },

    trustScore: { type: Number, default: 0 },

    verifiedSignals: { 
      type: [String], 
      default: [] 
    }
  },
  { timestamps: true }
);

export const User = model("User", userSchema);