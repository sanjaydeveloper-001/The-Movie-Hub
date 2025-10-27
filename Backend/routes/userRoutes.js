import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserLists,
  sendCode,
  resetPassword,
  googleLogin,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/google-login", googleLogin);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post("/update-list", protect, updateUserLists);
router.post("/forgotpassword",sendCode);
router.post("/resetpassword",resetPassword);

export default router;
