import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const statusColor = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-700",
};

const MyFees = () => {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    api.get("/student/fees").then((res) => setFees(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Fee Status</h1>
        <div className="space-y-3">
          {fees.map((f) => (
            <div key={f._id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium">₹{f.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(f.dueDate).toLocaleDateString()}
                  {f.remarks ? ` · ${f.remarks}` : ""}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[f.status]}`}>
                {f.status}
              </span>
            </div>
          ))}
          {fees.length === 0 && <p className="text-gray-400 text-center">No fee records found.</p>}
        </div>
      </div>
    </div>
  );
};

export default MyFees;
