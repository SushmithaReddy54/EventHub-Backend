import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    selectedSkills: Array,
    venue: {
      type: Object,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: false,
      default: 30,
    },
    createdUser: {
      type: String,
      ref: "User",
    },
    registeredUsers: {
      type: Array,
      required: false,
    },
    image: {
      name: { type: String },
      data: { type: Buffer },
      contentType: { type: String },
    }
  },
  { timestamps: true }
);

const Workshop = mongoose.model("Workshop", workshopSchema);

export default Workshop;
