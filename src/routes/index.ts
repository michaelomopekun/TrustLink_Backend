import { Router } from "express";
import authRoute from "./auth_route";
import verificationSessionRoute from "./verificationSession_route"
// import userRoute from "./user_route";
// import productRoute from "./product_route";

const router = Router();

router.use("/auth", authRoute);
router.use("/verification-session", verificationSessionRoute);

export default router;