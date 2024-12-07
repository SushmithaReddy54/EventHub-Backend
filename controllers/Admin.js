import jwt from "jsonwebtoken";
import { constants } from "../constansts.js";
import Admin from "../models/AdminModel.js";
import UserModel from "../models/UserModel.js";
import { response } from "express";
import Instructor from "../models/InstructorModel.js";

export const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, constants.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }
    const { id, userRole } = payload;
    let Db = null;
    switch (userRole) {
      case "ADMIN":
        Db = Admin;
        break;
      case "INSTRUCTOR":
        Db = UserModel;
        break;
      case "USER":
      default:
        Db = UserModel;
    }
    Db.findById(id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const data = await UserModel.find().sort("-createdAt");
    res.status(200).json({ data: data });
  } catch (err) {
    console.log("error on get all users", err);
    throw err;
  }
};
