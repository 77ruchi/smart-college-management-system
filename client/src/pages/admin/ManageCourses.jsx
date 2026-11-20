import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", department: "", semester: 1, faculty: "" });

  const fetchData = async () => {
    const [coursesRes, facultyRes] = await Promise.all([
      api.get("/admin/courses"),
      api.get("/admin/users", { params: { role: "faculty" } }),
    ]);
    setCourses(coursesRes.data);
    setFaculty(facultyRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/courses", form);
      toast.success("Course created");
      setForm({ name: "", code: "", department: "", semester: 1, faculty: "" });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    }
  };

  const removeCourse = async (id) => {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/admin/courses/${id}`);
    toast.success("Course deleted");
    fetchData();
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="card space-y-3 md:col-span-1 h-fit">
          <h2 className="font-semibold">Add Course</h2>
          <input name="name" required placeholder="Course Name" className="input-field" value={form.name} onChange={handleChange} />
          <input name="code" required placeholder="Course Code (e.g. CS201)" className="input-field" value={form.code} onChange={handleChange} />
          <input name="department" required placeholder="Department" className="input-field" value={form.department} onChange={handleChange} />
          <input name="semester" type="number" min="1" max="8" placeholder="Semester" className="input-field" value={form.semester} onChange={handleChange} />
          <select name="faculty" className="input-field" value={form.faculty} onChange={handleChange}>
            <option value="">Assign Faculty (optional)</option>
            {faculty.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
          <button className="btn-primary w-full">Create Course</button>
        </form>

        <div className="md:col-span-2 space-y-3">
          <h2 className="font-semibold text-lg">All Courses</h2>
          {courses.map((c) => (
            <div key={c._id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium">{c.name} <span className="text-gray-400 text-sm">({c.code})</span></p>
                <p className="text-sm text-gray-500">
                  {c.department} · Sem {c.semester} · Faculty: {c.faculty?.name || "Unassigned"}
                </p>
              </div>
              <button onClick={() => removeCourse(c._id)} className="text-red-500 text-sm font-medium">
                Delete
              </button>
            </div>
          ))}
          {courses.length === 0 && <p className="text-gray-400">No courses yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;
