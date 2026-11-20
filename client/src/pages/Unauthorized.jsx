import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <h1 className="text-4xl font-bold text-red-500">403</h1>
    <p className="text-gray-600">You don't have permission to access this page.</p>
    <Link to="/login" className="btn-primary">
      Back to Login
    </Link>
  </div>
);

export default Unauthorized;
