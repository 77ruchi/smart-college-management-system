import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    rollNo: "",
    semester: 1,
  });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register({ ...form, role: "student" });
    if (res.success) {
      toast.success("Account created!");
      navigate("/student");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-100 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-1">Student Registration</h1>
        <p className="text-center text-gray-500 mb-6">Create your student account</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" required placeholder="Full Name" className="input-field" onChange={handleChange} />
          <input name="email" type="email" required placeholder="Email" className="input-field" onChange={handleChange} />
          <input name="password" type="password" required minLength={6} placeholder="Password (min 6 chars)" className="input-field" onChange={handleChange} />
          <input name="department" required placeholder="Department (e.g. Computer Science)" className="input-field" onChange={handleChange} />
          <div className="grid grid-cols-2 gap-3">
            <input name="rollNo" required placeholder="Roll No" className="input-field" onChange={handleChange} />
            <input name="semester" type="number" min="1" max="8" placeholder="Semester" className="input-field" onChange={handleChange} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
