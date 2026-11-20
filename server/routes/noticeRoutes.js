import express from "express";
import { createNotice, getNotices, deleteNotice } from "../controllers/noticeController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getNotices);
router.post("/", authorize("admin", "faculty"), createNotice);
router.delete("/:id", authorize("admin"), deleteNotice);

export default router;
