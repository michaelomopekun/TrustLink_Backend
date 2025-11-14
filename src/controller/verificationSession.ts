import {Request, Response} from "express";
import {VerificationSession} from "../model/verificationSession";
import {User} from "../model/user";


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
}

export default new VerificationSessionController();