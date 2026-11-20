import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const EnterResults = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ student: "", examType: "internal", marksObtained: "", maxMarks: 100, semester: 1 });

  useEffect(() => {
    api.get(`/faculty/courses/${courseId}/students`).then((res) => setStudents(res.data));
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/faculty/results", { ...form, course: courseId });
      toast.success("Result saved");
      setForm({ ...form, student: "", marksObtained: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save result");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Enter Marks</h1>
        <form onSubmit={handleSubmit} className="card space-y-3">
          <select required className="input-field" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.user._id} value={s.user._id}>
                {s.user.name} ({s.rollNo})
              </option>
            ))}
          </select>
          <select className="input-field" value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })}>
            <option value="internal">Internal</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" required placeholder="Marks Obtained" className="input-field" value={form.marksObtained} onChange={(e) => setForm({ ...form, marksObtained: e.target.value })} />
            <input type="number" placeholder="Max Marks" className="input-field" value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} />
          </div>
          <input type="number" min="1" max="8" placeholder="Semester" className="input-field" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
          <button className="btn-primary w-full">Save Result</button>
        </form>
      </div>
    </div>
  );
};

export default EnterResults;
