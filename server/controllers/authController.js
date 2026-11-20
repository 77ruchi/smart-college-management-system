import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import generateToken from "../utils/generateToken.js";

// @desc   Register new user (admin creates faculty/student, or public student signup)
// @route  POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, department, rollNo, semester } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
      phone,
      department,
    });

    // If registering as a student, also create a student profile
    if (user.role === "student" && rollNo) {
      await StudentProfile.create({
        user: user._id,
        rollNo,
        department: department || "N/A",
        semester: semester || 1,
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Login user
// @route  POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated. Contact admin." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get logged-in user profile
// @route  GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ user: user._id }).populate("courses");
    }
    res.json({ user, profile });
  } catch (error) {
    next(error);
  }
};
