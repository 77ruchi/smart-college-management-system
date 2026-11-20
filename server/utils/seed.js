// Run with: npm run seed
// Creates one admin, one faculty, one student, and one sample course.
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import StudentProfile from "../models/StudentProfile.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  console.log("Clearing existing demo users...");
  await User.deleteMany({ email: { $in: ["admin@college.com", "faculty@college.com", "student@college.com"] } });
  await Course.deleteMany({ code: "CS101" });

  const admin = await User.create({
    name: "Admin User",
    email: "admin@college.com",
    password: "Admin@123",
    role: "admin",
  });

  const faculty = await User.create({
    name: "Prof. Sharma",
    email: "faculty@college.com",
    password: "Faculty@123",
    role: "faculty",
    department: "Computer Science",
  });

  const student = await User.create({
    name: "Rahul Verma",
    email: "student@college.com",
    password: "Student@123",
    role: "student",
    department: "Computer Science",
  });

  const course = await Course.create({
    name: "Data Structures",
    code: "CS101",
    department: "Computer Science",
    semester: 3,
    faculty: faculty._id,
  });

  await StudentProfile.create({
    user: student._id,
    rollNo: "CS2023001",
    department: "Computer Science",
    semester: 3,
    batch: "2023-2027",
    courses: [course._id],
  });

  console.log("✅ Seed data created:");
  console.log("   Admin    -> admin@college.com   / Admin@123");
  console.log("   Faculty  -> faculty@college.com / Faculty@123");
  console.log("   Student  -> student@college.com / Student@123");

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
