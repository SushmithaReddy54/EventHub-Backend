import express from "express";
import {
  addEvent,
  createEvent,
  deleteEvent,
  dropoutForEvent,
  getAllEvents,
} from "../controllers/InstructorControllers.js";
const router = express.Router();

router.post("/add-event", middleware, createEvent);
router.get("/all-events", middleware, getAllEvents);
router.delete("/delete-event/:Id", middleware, deleteEvent);
