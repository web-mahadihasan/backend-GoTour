import { Router } from "express";
import { authController } from "./auth.controller";
import checkAuth from "@/app/middlewares/checkAuth";
import { ChangePasswordSchema, CreateUserSchema, USER_ROLES } from "../user/user.interface";
import validateRequestBody from "@/app/middlewares/validateRequestBody";
import passport from "passport";


const authRouter = Router();

authRouter.route("/register")
    .post(validateRequestBody(CreateUserSchema), authController.registerUser)

authRouter.route("/login")
    .post(authController.credentialsLogin)

authRouter.route("/me/logout")
    .post(checkAuth(...Object.values(USER_ROLES)), authController.userLogout)

authRouter.route("/me/refresh-token")
    .post(authController.refreshToken)
    
authRouter.route("/me/reset-password")
    .post(checkAuth(...Object.values(USER_ROLES)), validateRequestBody(ChangePasswordSchema), authController.resetPassword)

authRouter.route("/google")
    .get(authController.googleLogin)

authRouter.route("/google/callback")
    .get(passport.authenticate("google", {failureRedirect: "/login"}), authController.googleLoginCallback)
    
export default authRouter;