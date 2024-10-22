import express from "express";
import {
  registerUser,
  loginUser,
  verifyToken,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-token", verifyToken);

export default router;
