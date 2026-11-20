import express from "express";
import {
  getMyAttendance,
  getMyResults,
  getMyFees,
  getDashboardSummary,
  getAvailableCourses,
  enrollInCourse,
  unenrollFromCourse,
} from "../controllers/studentController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("student"));

router.get("/dashboard", getDashboardSummary);
router.get("/attendance", getMyAttendance);
router.get("/results", getMyResults);
router.get("/fees", getMyFees);

router.get("/courses/available", getAvailableCourses);
router.post("/courses/enroll", enrollInCourse);
router.delete("/courses/enroll/:courseId", unenrollFromCourse);

export default router;