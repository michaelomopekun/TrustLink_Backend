import {Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../model/user";
import { generateToken } from "../middleware/jwt";


export class AuthController
{
    private readonly saltRounds: number = 10;
    private readonly tokenExpiry = `${2} Hour`;

    
     async register(req: Request, res: Response)
     {
        try
        {
            const { name, email, password } = req.body;

            if(!name || !email || !password)
            {
                console.log("Name, email, and password are required");

                return res.status(400).json({ message: "Name, email, and password are required" });
            }

            const existingUser = await User.findOne({ email });

            if(existingUser)
            {
                console.log("User with this email already exists");

                return res.status(409).json({ message: "User with this email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, this.saltRounds);

            const newUser = new User({
                name,
                email,
                password: hashedPassword
            });

            const user = await User.create(newUser);

            const token = generateToken({ id: user._id, email: user.email }, this.tokenExpiry);

            console.log("✅User registered successfully");
            console.log("✅Generated Token:", token);

            return res.status(201).json({ user : { id: user._id, name: user.name, email: user.email }, token, message: "registration successful" });
        }
        catch (error)
        {
            console.error("Error during registration:", error);
            return res.status(500).json({ message: "registration failed" });
        }
     }

     async login(req: Request, res: Response)
     {
        try
        {
            const { email, password } = req.body;

            if(!email || !password)
            {
                console.log("❌Email and password are required");

                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await User.findOne({ email });

            if(!user)
            {
                console.log("❌Invalid email or password");
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid)
            {
                console.log("❌Invalid email or password");
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = generateToken({ id: user._id, email: user.email }, "2 Hour");

            console.log("✅User logged in successfully");
            console.log("✅Generated Token:", token);

            return res.status(200).json({ user : { id: user._id, name: user.name, email: user.email }, token, message: "login successful" });
        }
        catch (error)
        {
            console.error("Error during login:", error);
            return res.status(500).json({ message: "login failed" });
        }
     }


     async logout(res: Response)
     {
        try
        {
            res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
            // res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });

            console.log("✅User logged out successfully");
            return res.status(200).json({ message: "logout successful" });
        }
        catch (error)
        {
            console.error("Error during logout:", error);
            return res.status(500).json({ message: "logout failed" });
        }
     }
    
}

export default AuthController;
