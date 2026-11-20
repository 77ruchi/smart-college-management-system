import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      toast.success("Login successful!");
      if (res.role === "admin") navigate("/admin");
      else if (res.role === "faculty") navigate("/faculty");
      else navigate("/student");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gray-100 px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-1">🎓 Smart College</h1>
        <p className="text-center text-gray-500 mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="input-field mt-1"
              placeholder="you@college.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              className="input-field mt-1"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          New student?{" "}
          <Link to="/register" className="text-primary-600 font-medium">
            Register here
          </Link>
        </p>

        <div className="mt-6 border-t pt-4 text-xs text-gray-400 text-center">
          Demo: admin@college.com / Admin@123 &nbsp;|&nbsp; faculty@college.com / Faculty@123
          &nbsp;|&nbsp; student@college.com / Student@123
        </div>
      </div>
    </div>
  );
};

export default Login;
