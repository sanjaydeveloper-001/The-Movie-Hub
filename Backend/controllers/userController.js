import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token missing" });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Email not found in Google account" });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        username: name || email.split("@")[0],
        email,
        password: null,
        photo: picture || "",
        isGoogleUser: true,
      });
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
    res.status(500).json({
      message: "Google login failed. Please try again.",
      error: error.message,
    });
  }
};
// export const googleLogin = async (req, res) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return res.status(400).json({ message: "Google token missing" });
//     }

//     // Verify Google token
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture } = payload;

//     if (!email) {
//       return res.status(400).json({ message: "Email not found in Google account" });
//     }

//     // Check if the user already exists
//     let user = await User.findOne({ email });

//     if (!user) {
//       // Create a new user if not found
//       user = await User.create({
//         username: name || email.split("@")[0],
//         email,
//         password: null, // No password for Google users
//         profilePic: picture || null,
//         authProvider: "google",
//       });
//     }

//     // Generate JWT token
//     const jwtToken = generateToken(user._id);

//     // Send response
//     res.status(200).json({
//       _id: user._id,
//       username: user.username,
//       email: user.email,
//       profilePic: user.profilePic,
//       token: jwtToken,
//     });
//   } catch (error) {
//     console.error("Google Login Error:", error);
//     res.status(500).json({
//       message: "Google login failed. Please try again.",
//       error: error.message,
//     });
//   }
// };

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });
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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid Password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  res.json(req.user);
};


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


export const sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = resetCode;
    user.resetCodeExpire = Date.now() + 10 * 60 * 1000;
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
      subject: "Password Reset Code",
      text: `Your password reset code is ${resetCode}. It expires in 10 minutes.`,
    });

    res.json({ message: "Reset code sent to email" });
  } catch (error) {
    console.error("ForgotPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetCode !== code || Date.now() > user.resetCodeExpire) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "You recently used this password. Please choose a new one.",
      });
    }
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

