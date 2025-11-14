// controllers/userController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import multer from "multer";
import fs from "fs";
import path from "path";

// ---------------- JWT GENERATOR ----------------
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ---------------- GOOGLE LOGIN ----------------
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ message: "Google token missing" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    if (!email) return res.status(400).json({ message: "Email not found" });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: name || email.split("@")[0],
        email,
        password: null,
        photo: picture || "",
        isGoogleUser: true,
      });

      await sendWelcomeEmail(email, user.username, true);
    }

    const jwtToken = generateToken(user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      photo: user.photo,
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    res.status(500).json({ message: "Google login failed" });
  }
};

// ---------------- MULTER SETUP ----------------
// store files into ./uploads/profilePhotos using path.join for cross-platform
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads", "profilePhotos");
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user._id}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
export const uploadProfilePhoto = upload.single("photo");

// ---------------- REGISTER USER ----------------
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });

    await sendWelcomeEmail(email, username, false);
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- SEND WELCOME EMAIL ----------------
const sendWelcomeEmail = async (email, username, isGoogleUser = false) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject = `🎬 Welcome to MovieHub, ${username}!`;
    const message = isGoogleUser
      ? `
Hello ${username},

We're thrilled to have you onboard! You've successfully joined MovieHub using your Google account.
...
help: ${process.env.EMAIL_USER}
      `
      : `
Hello ${username},

Your account has been successfully created on MovieHub!
...
help: ${process.env.EMAIL_USER}
      `;

    await transporter.sendMail({
      from: `"MovieHub Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    });

    console.log(`✅ Welcome email sent to ${email}`);
  } catch (err) {
    console.error("❌ Failed to send welcome email:", err);
  }
};

// ---------------- LOGIN USER ----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isGoogleUser)
      return res.status(400).json({ message: "Please use Google login" });
    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        photo: user.photo,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid Password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- GET USER PROFILE ----------------
export const getUserProfile = async (req, res) => res.json(req.user);

// ---------------- CHANGE USERNAME ----------------
export const changeUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username?.trim())
      return res.status(400).json({ message: "Username required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username.trim();
    await user.save();

    res.json({
      message: "Username updated successfully",
      username: user.username,
    });
  } catch (error) {
    console.error("Change username error:", error);
    res.status(500).json({ message: "Failed to change username" });
  }
};

// ---------------- CHANGE PHOTO ----------------
export const changePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!req.file) return res.status(400).json({ message: "No photo uploaded" });

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    if (user.photo && user.photo.startsWith(hostUrl)) {
      const segments = user.photo.split(`${req.get("host")}/`);
      const oldRelative = segments[1] || "";
      const oldPath = path.join(process.cwd(), oldRelative);
      if (oldPath && fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { console.warn("Unable to delete old photo:", e); }
      }
    }
    let relativeFilePath = path.relative(process.cwd(), req.file.path);
    relativeFilePath = relativeFilePath.replace(/\\/g, "/");
    if (!relativeFilePath.startsWith("uploads/")) {
      const idx = relativeFilePath.indexOf("uploads/");
      if (idx !== -1) relativeFilePath = relativeFilePath.slice(idx);
      else relativeFilePath = `uploads/${relativeFilePath}`;
    }

    user.photo = `${hostUrl}/${relativeFilePath}`;
    await user.save();

    res.json({
      message: "Profile photo updated successfully",
      photo: user.photo,
    });
  } catch (error) {
    console.error("Change photo error:", error);
    res.status(500).json({ message: "Failed to change photo" });
  }
};

// ---------------- DELETE PHOTO ----------------
export const deletePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hostUrl = `${req.protocol}://${req.get("host")}`;

    if (user.photo && user.photo.startsWith(hostUrl)) {
      const segments = user.photo.split(`${req.get("host")}/`);
      const oldRelative = segments[1] || "";
      const oldPath = path.join(process.cwd(), oldRelative);
      if (oldPath && fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (e) { console.warn("Unable to delete photo:", e); }
      }
    }

    user.photo = "";
    await user.save();

    res.json({ message: "Profile photo deleted successfully", photo: "" });
  } catch (error) {
    console.error("Delete photo error:", error);
    res.status(500).json({ message: "Failed to delete photo" });
  }
};


// ---------------- CHANGE PASSWORD ----------------
export const changePassword = async (req, res) => {
  try {
    const { current, new: newPass } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.json({ message: "User not found" });

    if (!user.isGoogleUser) {
      const isMatch = await bcrypt.compare(current, user.password);
      if (!isMatch) return res.json({ message: "Incorrect current password" });
    }
    const isSamePassword = await bcrypt.compare(newPass, user.password);
    if (isSamePassword)
      return res.json({
        message: "You recently used this password Please try new one",
      });
    user.password = newPass;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password" });
  }
};

// ---------------- UPDATE LANGUAGE ----------------
export const updateLanguage = async (req, res) => {
  try {
    const { email, language } = req.body;
    if (!email || !language)
      return res.status(400).json({ message: "Email and language required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.language = language;
    await user.save();

    res.json({ message: "Language updated successfully", language });
  } catch (error) {
    console.error("Error updating language:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- UPDATE WATCHLIST / FAVOURITES ----------------
export const updateUserLists = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { type, movie } = req.body;

    if (!["watchlist", "favourites"].includes(type))
      return res.status(400).json({ message: "Invalid list type" });

    const exists = user[type].find((m) => m.id === movie.id);
    if (exists) {
      user[type] = user[type].filter((m) => m.id !== movie.id);
    } else {
      user[type].push(movie);
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- SEND RESET CODE ----------------
export const sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a 6-digit verification code
    const changeCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.changeCode = changeCode;
    user.changeCodeExpire = Date.now() + 10 * 60 * 1000; // expires in 10 mins
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirm Your Password Change Request 🔐",
      text: `
Hi ${user.username || "User"},

We received a request to change your MovieHub account password.

Your verification code is: ${changeCode}

⚠️ This code will expire in 10 minutes. If you didn’t request a password change, please ignore this message — your account is still secure.

Best regards,
The MovieHub Security Team
Email Support: ${process.env.EMAIL_USER}
      `,
    });

    res.json({ message: "Code sent to your email successfully." });
  } catch (error) {
    console.error("SendChangePasswordCode error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.resetCode !== code)
      return res.status(400).json({ message: "Invalid or expired code" });

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword)
      return res.status(400).json({
        message: "You recently used this password Please try new one.",
      });

    user.password = newPassword;
    user.resetCode = null;
    user.resetCodeExpire = null;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
