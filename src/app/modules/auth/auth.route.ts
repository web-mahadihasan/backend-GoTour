import { Router } from "express";
import { authController } from "./auth.controller";
import checkAuth from "@/app/middlewares/checkAuth";
import { ChangePasswordSchema, USER_ROLES } from "../user/user.interface";
import validateRequestBody from "@/app/middlewares/validateRequestBody";
import passport from "passport";


const authRouter = Router();

authRouter.route("/login")
    .post(authController.credentialsLogin)

authRouter.route("/refresh-token")
    .post(authController.refreshToken)
    
authRouter.route("/me/reset-password")
    .post(checkAuth(...Object.values(USER_ROLES)), validateRequestBody(ChangePasswordSchema), authController.resetPassword)

authRouter.route("/google")
    .get(authController.googleLogin)

authRouter.route("/google/callback")
    .get(passport.authenticate("google", {failureRedirect: "/login"}), authController.googleLoginCallback)
    
export default authRouter;