import {Router, Request, Response} from "express";
import { AuthController } from "../controller/auth";
import { verifyToken } from "../middleware/jwt";


const router = Router();
const authController = new AuthController();

router.post("/register", (req: Request, res: Response) => authController.register(req, res));
router.post("/login", (req: Request, res: Response) => authController.login(req, res));
router.post("/logout", verifyToken, (res: Response) => authController.logout(res));

export default router;