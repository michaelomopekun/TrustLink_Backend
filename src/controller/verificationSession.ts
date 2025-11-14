import {Request, Response} from "express";
import {VerificationSession} from "../model/verificationSession";
import {User} from "../model/user";
import { isVpnOrProxy } from "../util/vpnCheck";
import { generateDeviceHash } from "../util/devicehash";

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
}

export default new VerificationSessionController();