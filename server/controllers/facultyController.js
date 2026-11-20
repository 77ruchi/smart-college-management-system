import Attendance from "../models/Attendance.js";
import Result from "../models/Result.js";
import Course from "../models/Course.js";
import StudentProfile from "../models/StudentProfile.js";

// @desc  Get courses assigned to logged-in faculty
export const getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ faculty: req.user._id });
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc  Mark attendance for multiple students at once
// @body  { courseId, date, records: [{ studentId, status }] }
export const markAttendance = async (req, res, next) => {
  try {
    const { courseId, date, records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "Attendance records are required" });
    }

    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];
    for (const r of records) {
      const record = await Attendance.findOneAndUpdate(
        { student: r.studentId, course: courseId, date: attendanceDate },
        {
          student: r.studentId,
          course: courseId,
          date: attendanceDate,
          status: r.status,
          markedBy: req.user._id,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      results.push(record);
    }

    res.status(201).json({ message: "Attendance marked successfully", records: results });
  } catch (error) {
    next(error);
  }
};

// @desc  Get attendance sheet for a course/date range
export const getCourseAttendance = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const records = await Attendance.find({ course: courseId })
      .populate("student", "name email")
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    next(error);
  }
};

// @desc  Enter/update marks for a student
export const addResult = async (req, res, next) => {
  try {
    const result = await Result.create({ ...req.body, enteredBy: req.user._id });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getStudentsInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const students = await StudentProfile.find({ courses: courseId }).populate(
      "user",
      "name email"
    );
    res.json(students);
  } catch (error) {
    next(error);
  }
};
