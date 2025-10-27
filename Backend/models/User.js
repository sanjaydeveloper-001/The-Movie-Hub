import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  original_language: { type: String },
  original_title: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  poster_path: { type: String },
  release_date: { type: String },
  title: { type: String },
  video: { type: Boolean },
  vote_average: { type: Number },
  vote_count: { type: Number },
  userNote: { type: String, default: "" },
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: false },
  profilePic:    { type: String, default: "" },
  resetCode: {type: String },
  resetCodeExpire: { type : Date },
  isGoogleUser: { type: Boolean, default: false },
  watchlist: [movieSchema],
  favourites: [movieSchema],
}, { timestamps: true });

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
