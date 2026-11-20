import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-primary-700">🎓 Smart College</span>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <div className="text-sm text-right">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-400 capitalize">{user.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
