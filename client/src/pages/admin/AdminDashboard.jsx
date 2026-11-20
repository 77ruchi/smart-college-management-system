import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const StatCard = ({ label, value, color }) => (
  <div className="card">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Students" value={stats?.totalStudents ?? "—"} color="text-primary-600" />
          <StatCard label="Total Faculty" value={stats?.totalFaculty ?? "—"} color="text-emerald-600" />
          <StatCard label="Total Courses" value={stats?.totalCourses ?? "—"} color="text-purple-600" />
          <StatCard label="Overall Attendance %" value={`${stats?.overallAttendancePercent ?? "—"}%`} color="text-amber-600" />
          <StatCard label="Pending Fees" value={stats?.pendingFees ?? "—"} color="text-red-500" />
          <StatCard label="Paid Fees" value={stats?.paidFees ?? "—"} color="text-green-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/users" className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-1">👥 Manage Users</h3>
            <p className="text-sm text-gray-500">View, activate/deactivate faculty & students</p>
          </Link>
          <Link to="/admin/courses" className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-1">📚 Manage Courses</h3>
            <p className="text-sm text-gray-500">Create courses, assign faculty</p>
          </Link>
          <Link to="/admin/notices" className="card hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-1">📢 Notices</h3>
            <p className="text-sm text-gray-500">Post announcements to students/faculty</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
