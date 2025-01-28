import express from "express";
import * as usersController from "../controllers/users";
import passport from "passport";
import requiresAuth from "../middlewares/requiresAuth";
import validateRequestSchema from "../middlewares/validateRequestSchema";
import { requestVerificationCodeSchema, resetPasswordSchema, signUpSchema, updateUserSchema } from "../validation/users";
import { profilePicUpload } from "../middlewares/image-upload";
import { loginRateLimit, requestVerificationCodeRateLimit } from "../middlewares/rate-limit";

const router = express.Router();

router.get("/me", requiresAuth, usersController.getAuthenticatedUser);

router.get("/profile/:username", usersController.getUserByUserName);

router.post("/signup", validateRequestSchema(signUpSchema), usersController.signUp);

router.post("/verification-code", requestVerificationCodeRateLimit, validateRequestSchema(requestVerificationCodeSchema), usersController.requestEmailVerificationCode);

router.post("/reset-password-code", requestVerificationCodeRateLimit, validateRequestSchema(requestVerificationCodeSchema), usersController.requestResetPasswordCode);

router.post("/reset-password", validateRequestSchema(resetPasswordSchema), usersController.resetPassword);

router.post("/login", loginRateLimit, passport.authenticate("local"), (req, res): void => {
    res.status(200).json(req.user);
  });
  

router.post("/logout", usersController.logOut);

router.patch("/me", requiresAuth, profilePicUpload.single("profilePic"), validateRequestSchema(updateUserSchema), usersController.updateUser);

export default router;