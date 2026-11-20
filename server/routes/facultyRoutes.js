import express from "express";
import {
  getMyCourses,
  markAttendance,
  getCourseAttendance,
  addResult,
  getStudentsInCourse,
} from "../controllers/facultyController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("faculty", "admin"));

router.get("/my-courses", getMyCourses);
router.get("/courses/:courseId/students", getStudentsInCourse);
router.post("/attendance", markAttendance);
router.get("/attendance/:courseId", getCourseAttendance);
router.post("/results", addResult);

export default router;
