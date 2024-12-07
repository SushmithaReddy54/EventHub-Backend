import mongoose from "mongoose";
import User from "./UserModel.js";

const InstructorSchema = new mongoose.Schema(
  {
    isVerifiedInstructor: {
      type: Boolean,
      default: false,
    },
    instructorDetails: {
      certification: String,
      experience: Number,
    },
  },
  { timestamps: true }
);

const Instructor = User.discriminator("Instructor", InstructorSchema);

export default Instructor;
