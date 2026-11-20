import express from "express";
import {
  createStaffUser,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  createFee,
  getAllFees,
  getDashboardStats,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes here require admin role
router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);

router.post("/users", createStaffUser);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

router.post("/courses", createCourse);
router.get("/courses", getCourses);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

router.post("/fees", createFee);
router.get("/fees", getAllFees);

export default router;