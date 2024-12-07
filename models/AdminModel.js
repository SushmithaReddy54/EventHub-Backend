import mongoose from "mongoose";
import User from "./UserModel.js";

const AdminSchema = new mongoose.Schema(
  {
    permissions: [String],
  },
  { timestamps: true }
);

const Admin = User.discriminator("Admin", AdminSchema);

export default Admin;
