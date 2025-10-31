import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  release_date: String,
  title: String,
  video: Boolean,
  vote_average: Number,
  vote_count: Number,
  userNote: { type: String, default: "" },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    photo: { type: String, default: "" },
    isGoogleUser: { type: Boolean, default: false },
    watchlist: { type: [movieSchema], default: [] }, 
    favourites: { type: [movieSchema], default: [] },
    resetCode: String,
    resetCodeExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
