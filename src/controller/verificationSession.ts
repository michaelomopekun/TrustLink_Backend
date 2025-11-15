import {Request, Response} from "express";
import {VerificationSession} from "../model/verificationSession";
import {User} from "../model/user";
import { isVpnOrProxy } from "../util/vpnCheck";
import { generateDeviceHash } from "../util/devicehash";
import { get } from "axios";
import { getIpLocation } from "../service/ipLocation.service";
import { calculateDistance } from "../util/distance";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export class VerificationSessionController 
{
    // private 

    async createVerificationSession(req: Request, res: Response)
    {
        const userId = req.user.id;

        try
        {
            const user = await User.findById(userId);
            if(!user)
            {
                console.log("❌User not found for verification session:", userId);
                return res.status(404).json({message: "user not found"});
            }

            const pendingSessionExists = await VerificationSession.findOne({userId: user._id, status: "pending"});
            if(pendingSessionExists)
            {
                console.log("❌Verification session already started/initialized for user:", userId);
                return res.status(400).json({message: "verification session already started/initialized for user", sessionId: pendingSessionExists._id});
            }

            const newSession = await VerificationSession.create(
            {
                userId,
                signals: {},
                score: 0,
                status: "pending",
                
            });

            console.log("✅Verification session initialized for user:", userId);

            res.status(201).json({verificationSession: newSession, message: "verification session initialized successfully"});
        }
        catch(error)
        {
            console.log("❌Error creating verification session:", error);

            res.status(500).json({message: "failed to create verification session"});
        }
    }


    async addDeviceSignals(req: Request, res: Response)
    {
        const userId = req.user.id;
        const {sessionId} = req.params;

        try
        {
            const session = await VerificationSession.findOne({_id: sessionId, userId, status: "pending"});
            if(!session)
            {
                console.log("❌Verification session not found for user:", userId);

                return res.status(404).json({message: "verification session not found"});
            }

            const ip = req.ip || req.headers["x-forwarded-for"];

            const userAgent = req.headers["user-agent"] || "unknown";

            if(!ip || !userAgent)
            {
                console.log("❌Insufficient data to retrieve device signals for user:", userId);

                return res.status(400).json({message: "insufficient data to retrieve device signals"});
            }

            const deviceHash = generateDeviceHash(ip.toString(), userAgent.toString());

            const isVpn = isVpnOrProxy(req);

            let score = 0;

            if(isVpn) score -= 50;
            else score += 20;

            session.signals = {
            ...session.signals,
                device: 
                {
                    ip,
                    userAgent,
                    deviceHash,
                    vpnDetected: isVpn,
                    score
                }
            };

            await session.save();

            console.log("✅Device signals retrieved for user:", userId);

            await User.findByIdAndUpdate(userId, {$addToSet: {verifiedSignals: "device"}});

            return res.status(200).json({signals: session.signals, message: "device signals retrieved successfully"});
            
        }
        catch(error)
        {
            console.log("❌Error retrieving device signals:", error);

            res.status(500).json({message: "failed to retrieve device signals"});
        }
    }


    async addLocationSignals(req: any, res: Response)
    {
        try
        {
            const userId = req.user.id;
            const {sessionId} = req.params;
            const {gpsLat, gpsLng} = req.body;

            const session = await VerificationSession.findOne({_id: sessionId, userId, status: "pending"});
            if(!session)
            {
                console.log("❌Verification session not found for user:", userId);

                return res.status(404).json({message: "verification session not found"});
            }

            if(!gpsLat || !gpsLng)
            {
                console.log("❌Insufficient data to retrieve location signals for user, please provide GPS coordinates:", userId);

                return res.status(400).json({message: "insufficient data to retrieve location signals, please provide GPS coordinates"});
            }

            const ip = req.headers["x-forwarded-for"] || req.ip;
            const clientIp = Array.isArray(ip) ? ip[0] : ip;

            const ipLocation = await getIpLocation(clientIp);

            if(!ipLocation)
            {
                console.log("❌Failed to retrieve IP location for user:", userId);

                return res.status(500).json({message: "failed to retrieve or detect IP location"});
            }

            const distance = await calculateDistance(gpsLat, gpsLng, ipLocation.lat, ipLocation.lng);

            let score = 0;
            let confidence = "low";

            if(distance <= 5)
            {
                score += 20;
                confidence = "high";
            }
            else if(distance <= 20)
            {
                score += 15;
                confidence = "medium";
            }
            else if(distance > 100)
            {
                score += 5;
                confidence = "low";
            }
            else
            {
                score -= 10;
                confidence = "suspicious";
            }

            session.signals = {
                ...session.signals,
                location: {
                    gpsLat,
                    gpsLng,
                    ipLat: ipLocation.lat,
                    ipLng: ipLocation.lng,
                    gpsToIpDistance: distance,
                    confidence,
                    score
                }
                };
        }
        catch(error)
        {
            console.log("❌Error retrieving location signals:", error);

            res.status(500).json({message: "failed to retrieve location signals"});
        }
    }
}

export default new VerificationSessionController();