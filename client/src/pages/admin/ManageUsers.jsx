import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const emptyForm = { name: "", email: "", password: "", role: "faculty", department: "", phone: "" };

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    const { data } = await api.get("/admin/users", { params: { role: roleFilter || undefined } });
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [roleFilter]);

  const toggleStatus = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive: !isActive });
      toast.success("User status updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const removeUser = async (id) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/admin/users", form);
      toast.success(`${form.role === "admin" ? "Admin" : "Faculty"} account created`);
      setForm(emptyForm);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <div className="flex items-center gap-3">
            <select className="input-field w-40" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>
            <button onClick={() => setShowForm((s) => !s)} className="btn-primary whitespace-nowrap">
              {showForm ? "Cancel" : "+ Add Faculty"}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleAddStaff} className="card space-y-3 mb-6">
            <h2 className="font-semibold">New Faculty / Admin Account</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input name="name" required placeholder="Full Name" className="input-field" value={form.name} onChange={handleFormChange} />
              <input name="email" type="email" required placeholder="Email" className="input-field" value={form.email} onChange={handleFormChange} />
              <input name="password" type="password" required minLength={6} placeholder="Temporary Password (min 6 chars)" className="input-field" value={form.password} onChange={handleFormChange} />
              <input name="department" placeholder="Department (e.g. Computer Science)" className="input-field" value={form.department} onChange={handleFormChange} />
              <input name="phone" placeholder="Phone (optional)" className="input-field" value={form.phone} onChange={handleFormChange} />
              <select name="role" className="input-field" value={form.role} onChange={handleFormChange}>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button disabled={saving} className="btn-primary">
              {saving ? "Creating..." : "Create Account"}
            </button>
            <p className="text-xs text-gray-400">
              Share the email + temporary password with them directly — they can log in right away.
            </p>
          </form>
        )}

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Role</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b last:border-0">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2">{u.email}</td>
                  <td className="py-2 capitalize">{u.role}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2 space-x-2">
                    <button onClick={() => toggleStatus(u._id, u.isActive)} className="text-primary-600 text-xs font-medium">
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => removeUser(u._id)} className="text-red-500 text-xs font-medium">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;