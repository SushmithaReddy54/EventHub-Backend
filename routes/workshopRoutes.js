import e from "express";
import {
  createEvent,
  deleteEvent,
  dropoutForEvent,
  getAllEvents,
  getAllVenues,
  getRegisteredWorkshops,
  registerForEvent,
  updateEvent,
} from "../controllers/InstructorControllers.js";
import { authMiddleware } from "../controllers/Admin.js";
import multer from "multer";

const router = e.Router();
const storage = multer.memoryStorage(); // Store in memory as a buffer
const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.send("Workshop Route");
});
router.post(
  "/create-event",
  upload.single("image"),
  authMiddleware,
  createEvent
);
router.delete("/delete-event/:Id", deleteEvent);
router.post("/update", upload.single("image"), authMiddleware, updateEvent);
router.post("/drop-event/:Id", authMiddleware, dropoutForEvent);
router.post("/register-for-event/:Id", authMiddleware, registerForEvent);
router.get("/registered-events", authMiddleware, getRegisteredWorkshops);
router.get("/all", getAllEvents);
router.get("/venues", getAllVenues);
router.post("/", (req, res) => {
  res.send("Workshop Route");
});

export default router;
