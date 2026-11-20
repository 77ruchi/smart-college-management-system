import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    rollNo: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    batch: { type: String, default: "" },
    parentContact: { type: String, default: "" },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export default mongoose.model("StudentProfile", studentProfileSchema);
