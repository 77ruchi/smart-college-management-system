import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const EnrollCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/student/courses/available");
      setCourses(data);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const enroll = async (courseId) => {
    try {
      await api.post("/student/courses/enroll", { courseId });
      toast.success("Enrolled successfully!");
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to enroll");
    }
  };

  const unenroll = async (courseId) => {
    if (!confirm("Drop this course?")) return;
    try {
      await api.delete(`/student/courses/enroll/${courseId}`);
      toast.success("Dropped course");
      fetchCourses();
    } catch (err) {
      toast.error("Failed to drop course");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-1">Course Enrollment</h1>
        <p className="text-gray-500 text-sm mb-6">
          Showing courses available for your department & semester.
        </p>

        {loading && <p className="text-gray-400">Loading courses...</p>}

        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c._id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {c.name} <span className="text-gray-400 text-sm">({c.code})</span>
                </p>
                <p className="text-sm text-gray-500">
                  {c.department} · Semester {c.semester} · Faculty: {c.faculty?.name || "Unassigned"}
                </p>
              </div>
              {c.isEnrolled ? (
                <button
                  onClick={() => unenroll(c._id)}
                  className="text-red-500 text-sm font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  Drop
                </button>
              ) : (
                <button onClick={() => enroll(c._id)} className="btn-primary text-sm px-3 py-1.5">
                  Enroll
                </button>
              )}
            </div>
          ))}
          {!loading && courses.length === 0 && (
            <p className="text-gray-400 text-center">
              No courses found for your department/semester yet. Contact admin.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollCourses;