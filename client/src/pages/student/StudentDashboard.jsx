import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const StudentDashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get("/student/dashboard").then((res) => setSummary(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-400 text-sm">Attendance</p>
            <p className={`text-3xl font-bold mt-1 ${summary?.attendancePercent < 75 ? "text-red-500" : "text-green-600"}`}>
              {summary?.attendancePercent ?? "—"}%
            </p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Enrolled Courses</p>
            <p className="text-3xl font-bold mt-1 text-primary-600">{summary?.totalCourses ?? "—"}</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Pending Fees</p>
            <p className="text-3xl font-bold mt-1 text-amber-600">{summary?.pendingFees ?? "—"}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/student/enroll" className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-1">➕ Enroll in Courses</h3>
            <p className="text-sm text-gray-500">Browse and register for available courses</p>
          </Link>
          <Link to="/student/attendance" className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-1">📊 My Attendance</h3>
            <p className="text-sm text-gray-500">Subject-wise attendance percentage</p>
          </Link>
          <Link to="/student/results" className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-1">📝 My Results</h3>
            <p className="text-sm text-gray-500">View marks & grades</p>
          </Link>
          <Link to="/student/fees" className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-1">💳 Fee Status</h3>
            <p className="text-sm text-gray-500">Check dues and payment history</p>
          </Link>
          <Link to="/notices" className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-1">📢 Notices</h3>
            <p className="text-sm text-gray-500">Latest announcements</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;