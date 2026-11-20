import Attendance from "../models/Attendance.js";
import Result from "../models/Result.js";
import Fee from "../models/Fee.js";
import StudentProfile from "../models/StudentProfile.js";
import Course from "../models/Course.js";

// @desc  List all courses matching the student's own department + semester,
//        marking which ones they're already enrolled in
export const getAvailableCourses = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: "Student profile not found" });

    const courses = await Course.find({
      department: profile.department,
      semester: profile.semester,
    }).populate("faculty", "name");

    const enrolledIds = new Set(profile.courses.map((c) => c.toString()));
    const result = courses.map((c) => ({
      ...c.toObject(),
      isEnrolled: enrolledIds.has(c._id.toString()),
    }));

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc  Student enrolls themselves in a course
// @body  { courseId }
export const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: "Student profile not found" });

    if (profile.courses.some((c) => c.toString() === courseId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    profile.courses.push(courseId);
    await profile.save();

    res.status(200).json({ message: `Enrolled in ${course.name}`, courses: profile.courses });
  } catch (error) {
    next(error);
  }
};

// @desc  Student drops/unenrolls from a course
export const unenrollFromCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: "Student profile not found" });

    profile.courses = profile.courses.filter((c) => c.toString() !== courseId);
    await profile.save();

    res.json({ message: "Unenrolled successfully", courses: profile.courses });
  } catch (error) {
    next(error);
  }
};

// @desc  Get logged-in student's attendance, grouped with %
export const getMyAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ student: req.user._id }).populate(
      "course",
      "name code"
    );

    const grouped = {};
    records.forEach((rec) => {
      const courseId = rec.course._id.toString();
      if (!grouped[courseId]) {
        grouped[courseId] = {
          course: rec.course.name,
          code: rec.course.code,
          total: 0,
          present: 0,
        };
      }
      grouped[courseId].total += 1;
      if (rec.status === "present") grouped[courseId].present += 1;
    });

    const summary = Object.values(grouped).map((g) => ({
      ...g,
      percentage: ((g.present / g.total) * 100).toFixed(2),
      lowAttendance: (g.present / g.total) * 100 < 75,
    }));

    res.json(summary);
  } catch (error) {
    next(error);
  }
};

// @desc  Get logged-in student's results
export const getMyResults = async (req, res, next) => {
  try {
    const results = await Result.find({ student: req.user._id }).populate(
      "course",
      "name code"
    );
    res.json(results);
  } catch (error) {
    next(error);
  }
};

// @desc  Get logged-in student's fee records
export const getMyFees = async (req, res, next) => {
  try {
    const fees = await Fee.find({ student: req.user._id }).sort({ dueDate: 1 });
    res.json(fees);
  } catch (error) {
    next(error);
  }
};

// @desc  Get full dashboard summary in one call
export const getDashboardSummary = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id }).populate("courses");

    const attendance = await Attendance.find({ student: req.user._id });
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter((a) => a.status === "present").length;
    const attendancePercent = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;

    const pendingFees = await Fee.countDocuments({ student: req.user._id, status: "pending" });

    res.json({
      profile,
      attendancePercent,
      pendingFees,
      totalCourses: profile?.courses?.length || 0,
    });
  } catch (error) {
    next(error);
  }
};