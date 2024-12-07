import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { constants } from "../constansts.js";
import User from "../models/UserModel.js";
import { MailTransporter } from "../helpers/MailTransporter.js";

export const signUpController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      emailId,
      phoneNumber,
      userRole,
      createPassword,
    } = req.body;
    if (!firstName || !emailId || !createPassword) {
      return res
        .status(400)
        .send({ message: "Please provide all required fields" });
    }
    const existingUser = await User.findOne({ emailId: emailId });
    if (existingUser) {
      return res
        .status(403)
        .send({ message: "User already exists, please login" });
    }
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(createPassword, salt);
    const newUser = await User.create({
      firstName,
      lastName,
      emailId,
      phoneNumber,
      userRole,
      password,
    });
    const token = jwt.sign(
      { emailId: newUser.emailId, id: newUser._id, userRole: userRole },
      constants.JWT_SECRET
    );
    res.status(200).send({ result: newUser, token });
  } catch (error) {
    console.log(error);
  }
};

export const loginController = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res
        .status(400)
        .send({ message: "Please provide emailId and password" });
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(402).send({ message: "User not found, please signup" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { emailId: user.emailId, id: user._id, userRole: user.userRole },
      constants.JWT_SECRET
    );
    const nUser = { ...user.toObject(), session: { sessionId: token } };
    res.status(200).send({ user: nUser });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.params;
  try {
    const oldUser = await User.findOne({ emailId: email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = constants.JWT_SECRET + oldUser.password;
    const token = jwt.sign(
      { email: oldUser.emailId, id: oldUser._id },
      secret,
      {
        expiresIn: "15m",
      }
    );
    const link = `http://localhost:3000/reset-password/${oldUser._id}/${token}`;

    var mailOptions = {
      from: constants.EMAIL,
      to: oldUser.emailId,
      subject: "Password Reset - Event Hub",
      text: link,
    };

    MailTransporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res.json({ status: "sent email" });
  } catch (error) {}
};

export const getResetPassword = async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = constants.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.send({ email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = constants.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.send({ email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  const token = jwt.sign(
    { emailId: user.emailId, id: user._id, userRole: user.userRole },
    constants.JWT_SECRET
  );
  const nUser = { ...user.toObject(), session: { sessionId: token } };
  res.status(200).send({ user: nUser });
};
