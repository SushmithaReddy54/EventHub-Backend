import sharp from "sharp";
import { constants } from "../constansts.js";
import { MailTransporter } from "../helpers/MailTransporter.js";
import User from "../models/UserModel.js";
import Workshop from "../models/workshopModel.js";

export const createEvent = async (req, res) => {
  try {
    const file = req.file;

    const {
      title,
      description,
      createdUser,
      selectedSkills,
      date,
      startTime,
      endTime,
      venue,
      capacity,
    } = req.body;

    if (
      !title ||
      !selectedSkills?.length ||
      !date ||
      !venue ||
      !startTime ||
      !endTime ||
      !capacity
    ) {
      return res.status(422).json({ error: "please fill all the fields" });
    }

    const compressedImage = await sharp(file?.buffer)
      .resize(300, 200, { fit: "cover" }) // Resize to specific dimensions
      .webp({ quality: 70 }) // Convert to WebP with compression
      .toBuffer();

    const post = new Workshop({
      title,
      description,
      selectedSkills,
      startTime,
      venue,
      capacity,
      date,
      endTime,
      createdUser: createdUser,
      image: {
        name: file?.originalname,
        data: compressedImage,
        contentType: file?.mimetype,
      },
    });
    const result = await post.save();
    console.log(result);
    res.status(200).json({ response: "added successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const getEvent = async (req, res) => {
  try {
    const { workshopId } = req.query;

    const workshop = await Workshop.findById(workshopId);
    return res.status(200).send(workshop);
  } catch (error) {
    console.log(error);
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const data = await Workshop.find().sort("-createdAt");
    res.status(200).send({ result: data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllVenues = async (req, res) => {
  try {
    const data = await Workshop.find().sort("-createdAt");
    res.status(200).send({ result: data });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const userData = req.user;
    const workshop = await Workshop.findById(req.params.Id);
    const user = await User.findById(userData._id);
    const isAlreadyRegistered = workshop.registeredUsers.some(
      (registeredUser) => registeredUser.emailId === user.emailId
    );

    if (isAlreadyRegistered) {
      return res
        .status(400)
        .send({ message: "User is already registered for this workshop" });
    }

    const userMeetingData = {
      workshopId: workshop._id,
      title: workshop.title,
      date: workshop.date,
      description: workshop.description,
      startDate: workshop.startDate,
      endDate: workshop.endDate,
    };

    const workshopUserData = {
      userName: user.firstName + " " + user.lastName,
      emailId: user.emailId,
      id: user._id,
    };

    user?.registeredMeetings?.push(userMeetingData);
    await user.save();
    workshop?.registeredUsers?.push(workshopUserData);
    await workshop.save();
    const userEmail = user.emailId;
    const mailOptions = {
      from: constants.EMAIL,
      to: userEmail,
      subject: "Registered for workshop",
      text: `You have successfully registered for the workshop ${workshop.title}.`,
    };
    await MailTransporter.sendMail(mailOptions);
    const userMeetings = user.registeredMeetings;
    return res
      .status(200)
      .send({ message: "Registered successfully", userMeetings });
  } catch (error) {
    console.log("Error registering for event:", error);
    res.status(500).send({ message: "An error occurred during registration" });
  }
};

export const dropoutForEvent = async (req, res) => {
  try {
    const userData = req.user;
    const workshop = await Workshop.findById(req.params.Id);
    const user = await User.findById(userData._id);
    const isAlreadyRegistered = workshop.registeredUsers.some(
      (registeredUser) => registeredUser.emailId === user.emailId
    );

    if (!isAlreadyRegistered) {
      return res
        .status(400)
        .send({ message: "User is not registered for this workshop" });
    }

    user.registeredMeetings = user.registeredMeetings.filter((meeting) => {
      return meeting.workshopId?.toString() !== workshop._id.toString();
    });
    workshop.registeredUsers = workshop.registeredUsers.filter(
      (registeredUser) => registeredUser.id?.toString() !== user._id.toString()
    );
    await user.save();
    await workshop.save();
    return res.status(200).send({ message: "Dropped out successfully" });
  } catch (error) {
    console.log("Error dropping from event:", error);
    res.status(500).send({ message: "An error occurred during dropping out" });
  }
};

export const getRegisteredWorkshops = async (req, res) => {
  const userData = req.user;
  res.json(userData);
};
export const deleteEvent = async (req, res) => {
  const event = await Workshop.findByIdAndDelete({ _id: req.params.Id });
  if (!event) {
    return res.status(422).json({ error: err });
  } else {
    res.json({
      message: "event deleted successfully",
    });
  }
};

export const updateEvent = async (req, res) => {
  //const file = req.file;

  // const compressedImage = await sharp(file?.buffer)
  //   .resize(300, 200, { fit: "cover" }) // Resize to specific dimensions
  //   .webp({ quality: 70 }) // Convert to WebP with compression
  //   .toBuffer();

  // const image = {
  //   name: file?.originalname,
  //   data: compressedImage,
  //   contentType: file?.mimetype,
  // };
  const event = await Workshop.findByIdAndUpdate(
    { _id: req.body.id },
    req.body
  );
  if (!event) {
    return res.status(422).json({ error: err });
  } else {
    res.json({
      message: "event updated successfully",
    });
  }
};
