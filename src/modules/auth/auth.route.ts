import { Router } from "express";
import { authController } from "./auth.controller";


const authRouter = Router();

authRouter.route("/login")
    .post(authController.credentialsLogin)


export default authRouter;