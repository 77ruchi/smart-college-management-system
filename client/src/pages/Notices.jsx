import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Notices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", targetRole: "all" });
  const canPost = user.role === "admin" || user.role === "faculty";

  const fetchNotices = async () => {
    const { data } = await api.get("/notices");
    setNotices(data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notices", form);
      toast.success("Notice posted");
      setForm({ title: "", description: "", targetRole: "all" });
      fetchNotices();
    } catch (err) {
      toast.error("Failed to post notice");
    }
  };

  const removeNotice = async (id) => {
    if (!confirm("Delete this notice?")) return;
    await api.delete(`/notices/${id}`);
    fetchNotices();
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">📢 Notice Board</h1>

        {canPost && (
          <form onSubmit={handleSubmit} className="card space-y-3">
            <input
              required
              placeholder="Notice title"
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              required
              placeholder="Description"
              rows={3}
              className="input-field"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select
              className="input-field"
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
            >
              <option value="all">Everyone</option>
              <option value="student">Students only</option>
              <option value="faculty">Faculty only</option>
            </select>
            <button className="btn-primary">Post Notice</button>
          </form>
        )}

        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n._id} className="card">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{n.title}</h3>
                {user.role === "admin" && (
                  <button onClick={() => removeNotice(n._id)} className="text-red-500 text-xs">
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1">{n.description}</p>
              <p className="text-gray-400 text-xs mt-2">
                By {n.createdBy?.name} · {new Date(n.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
          {notices.length === 0 && <p className="text-gray-400 text-center">No notices yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Notices;
