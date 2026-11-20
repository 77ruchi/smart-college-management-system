import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ["present", "absent"], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Prevent duplicate attendance entries for same student/course/date
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
