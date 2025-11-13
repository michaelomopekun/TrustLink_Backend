import {Request, Response, NextFunction} from "express";
import jwt, { SignOptions } from "jsonwebtoken";


declare global 
{
    namespace Express
    {
        interface Request
        {
            user?: any;
        }
    }
}

export const generateToken = (payload: any, expiresIn: `${2} Hour`): string => {
    const options: SignOptions =
    {
        expiresIn
    };

    return jwt.sign(payload, process.env.JWT_SECRET || "keep-your-key-secret", options);
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try
    {
        const token = req.headers.authorization?.split(" ")[1];

        if(!token)
        {
            return res.status(401).json({message: "❌No token provided"});
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET || "keep-your-key-secret");
        req.user = decode;
        
        next();
    }
    catch(error: any)
    {
        if(error instanceof jwt.TokenExpiredError)
        {
            return res.status(401).json({message: "❌Token expired"});
        }

        return res.status(403).json({message: "❌Invalid token"});
    }
}

// export const refreshToken = (token: string): string | null => {
//     try
//     {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || "keep-your-key-secret", {ignoreExpiration: true});

//         return generateToken(decoded, "2 Hour");
//     }
//     catch(error)
//     {
//         return null;
//     }
// }