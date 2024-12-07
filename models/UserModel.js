import e from "express";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    emailId: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: Number,
    userRole: {
      type: String,
      required: true,
      enum: ["ADMIN", "USER", "INSTRUCTOR"], // Allowed values
    },
    skills: {
      type: Object,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    registeredMeetings: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
