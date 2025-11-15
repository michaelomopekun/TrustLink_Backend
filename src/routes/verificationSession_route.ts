import { Router, Request, Response } from "express";
import { VerificationSessionController } from "../controller/verificationSession";
import { verifyToken } from "../middleware/jwt";


const router = Router();

const verificationSessionController = new VerificationSessionController();

router.post("/create", verifyToken, (req: Request, res: Response) => verificationSessionController.createVerificationSession(req, res));

router.post("/device-signals/:sessionId", verifyToken, (req: Request, res: Response) => verificationSessionController.addDeviceSignals(req, res));

router.post("/location-signals/:sessionId", verifyToken, (req: Request, res: Response) => verificationSessionController.addLocationSignals(req, res));

export default router;