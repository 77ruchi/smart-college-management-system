import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const MarkAttendance = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    api.get(`/faculty/courses/${courseId}/students`).then((res) => {
      setStudents(res.data);
      const initial = {};
      res.data.forEach((s) => (initial[s.user._id] = "present"));
      setStatusMap(initial);
    });
  }, [courseId]);

  const toggleStatus = (studentId) => {
    setStatusMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const submitAttendance = async () => {
    const records = Object.entries(statusMap).map(([studentId, status]) => ({ studentId, status }));
    try {
      await api.post("/faculty/attendance", { courseId, date, records });
      toast.success("Attendance saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save attendance");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>

        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium">Date:</label>
          <input type="date" className="input-field w-48" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="card divide-y">
          {students.map((s) => (
            <div key={s.user._id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{s.user.name}</p>
                <p className="text-sm text-gray-400">{s.rollNo}</p>
              </div>
              <button
                onClick={() => toggleStatus(s.user._id)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusMap[s.user._id] === "present"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {statusMap[s.user._id]}
              </button>
            </div>
          ))}
          {students.length === 0 && <p className="text-gray-400 py-4 text-center">No students enrolled in this course.</p>}
        </div>

        {students.length > 0 && (
          <button onClick={submitAttendance} className="btn-primary mt-4 w-full">
            Save Attendance
          </button>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;
