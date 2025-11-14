import {Schema, model} from "mongoose";

const verificationSessionSchema = new Schema(
    {
        userId: 
        {
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },

        status: 
        {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },

        // All trust signals are stored here
        signals: 
        {
            type: Object,
            default: {},

            // Sub-schemas, they are optional sha
            device: 
            {
                ip: String,
                userAgent: String,
                deviceHash: String,
                vpnDetected: Boolean,
                score: Number,
            },

            location: 
            {
                gpsLat: Number,
                gpsLng: Number,
                ipLat: Number,
                ipLng: Number,
                gpsToIpDistance: Number,
                confidence: String, // high | medium | low
                score: Number,
            },

            address: 
            {
                userAddress: String,

                // From Google Maps Geocoding API
                addressLat: Number,
                addressLng: Number,

                // GPS from user's device
                gpsLat: Number,
                gpsLng: Number,

                distanceFromAddress: Number,
                confidence: String, // high | medium | low
                score: Number,
            },

            social: 
            {
                linked: Boolean,
                platform: String, // LinkedIn, Facebook, etc.
                accountAge: Number,
                credibilityScore: Number,
                score: Number,
            },

            referee: 
            {
                refereeUserId: { type: Schema.Types.ObjectId, ref: "User" },
                refereeTrustScore: Number,
                relationshipStrength: Number,
                score: Number,
            },
        },

        // Final Trust Score (0–100)
        score: 
        {
            type: Number,
            default: 0,
        },


    },

    {
        timestamps: true,
    }
);

export const VerificationSession = model(
  "VerificationSession",
  verificationSessionSchema
);