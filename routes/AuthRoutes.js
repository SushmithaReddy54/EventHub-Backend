import express from "express";
import {
  loginController,
  signUpController,
  forgotPassword,
  getResetPassword,
  resetPassword,
} from "../controllers/AuthCntrollers.js";

const router = express.Router();

router.post("/signup", signUpController);

router.post("/login", loginController);

router.get("/forget-password/:email", forgotPassword);

router.get("/reset-password/:id/:token", getResetPassword);

router.post("/reset-password/:id/:token", resetPassword);

export default router;
