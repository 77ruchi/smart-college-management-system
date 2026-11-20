import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const FacultyDashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/faculty/my-courses").then((res) => setCourses(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Faculty Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c._id} className="card">
              <h3 className="font-semibold">{c.name} <span className="text-gray-400 text-sm">({c.code})</span></h3>
              <p className="text-sm text-gray-500 mb-3">{c.department} · Semester {c.semester}</p>
              <div className="flex gap-3">
                <Link to={`/faculty/attendance/${c._id}`} className="text-primary-600 text-sm font-medium">
                  Mark Attendance →
                </Link>
                <Link to={`/faculty/results/${c._id}`} className="text-primary-600 text-sm font-medium">
                  Enter Marks →
                </Link>
              </div>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-gray-400">No courses assigned yet. Contact admin.</p>
          )}
        </div>

        <Link to="/notices" className="card mt-6 block hover:shadow-md transition-shadow">
          📢 View / Post Notices
        </Link>
      </div>
    </div>
  );
};

export default FacultyDashboard;
