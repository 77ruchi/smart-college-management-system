import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Notices from "./pages/Notices";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCourses from "./pages/admin/ManageCourses";

import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import MarkAttendance from "./pages/faculty/MarkAttendance";
import EnterResults from "./pages/faculty/EnterResults";

import StudentDashboard from "./pages/student/StudentDashboard";
import MyAttendance from "./pages/student/MyAttendance";
import MyResults from "./pages/student/MyResults";
import MyFees from "./pages/student/MyFees";
import EnrollCourses from "./pages/student/EnrollCourses";

// Redirects "/" to the correct dashboard based on logged-in role (or to /login)
const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "faculty") return <Navigate to="/faculty" replace />;
  return <Navigate to="/student" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/notices"
            element={
              <ProtectedRoute allowedRoles={["admin", "faculty", "student"]}>
                <Notices />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageCourses />
              </ProtectedRoute>
            }
          />

          {/* Faculty routes */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={["faculty", "admin"]}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/attendance/:courseId"
            element={
              <ProtectedRoute allowedRoles={["faculty", "admin"]}>
                <MarkAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/results/:courseId"
            element={
              <ProtectedRoute allowedRoles={["faculty", "admin"]}>
                <EnterResults />
              </ProtectedRoute>
            }
          />

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/results"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/fees"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyFees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/enroll"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <EnrollCourses />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;