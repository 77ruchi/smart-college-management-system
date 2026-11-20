import User from "../models/User.js";
import Course from "../models/Course.js";
import StudentProfile from "../models/StudentProfile.js";
import Attendance from "../models/Attendance.js";
import Fee from "../models/Fee.js";

// ---------- USERS ----------

// @desc  Admin creates a new faculty (or admin) account directly
// @route POST /api/admin/users
// @body  { name, email, password, role, phone, department }
export const createStaffUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, department } = req.body;

    if (!["faculty", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'faculty' or 'admin'" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const user = await User.create({ name, email, password, role, phone, department });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isActive = req.body.isActive;
    await user.save();
    res.json({ message: "User status updated", user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ---------- COURSES ----------
export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("faculty", "name email");
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ---------- FEES ----------
export const createFee = async (req, res, next) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    next(error);
  }
};

export const getAllFees = async (req, res, next) => {
  try {
    const fees = await Fee.find().populate("student", "name email");
    res.json(fees);
  } catch (error) {
    next(error);
  }
};

// ---------- DASHBOARD ANALYTICS ----------
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculty = await User.countDocuments({ role: "faculty" });
    const totalCourses = await Course.countDocuments();

    const totalAttendanceRecords = await Attendance.countDocuments();
    const presentRecords = await Attendance.countDocuments({ status: "present" });
    const overallAttendancePercent =
      totalAttendanceRecords > 0
        ? ((presentRecords / totalAttendanceRecords) * 100).toFixed(2)
        : 0;

    const pendingFees = await Fee.countDocuments({ status: "pending" });
    const paidFees = await Fee.countDocuments({ status: "paid" });

    res.json({
      totalStudents,
      totalFaculty,
      totalCourses,
      overallAttendancePercent,
      pendingFees,
      paidFees,
    });
  } catch (error) {
    next(error);
  }
};