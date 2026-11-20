import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const MyAttendance = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get("/student/attendance").then((res) => setRecords(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Attendance</h1>
        <div className="space-y-3">
          {records.map((r, idx) => (
            <div key={idx} className="card">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{r.course} <span className="text-gray-400 text-sm">({r.code})</span></p>
                  <p className="text-sm text-gray-500">{r.present} / {r.total} classes attended</p>
                </div>
                <span className={`text-xl font-bold ${r.lowAttendance ? "text-red-500" : "text-green-600"}`}>
                  {r.percentage}%
                </span>
              </div>
              {r.lowAttendance && (
                <p className="text-xs text-red-500 mt-2">⚠️ Below 75% — attendance shortage risk</p>
              )}
            </div>
          ))}
          {records.length === 0 && <p className="text-gray-400 text-center">No attendance records yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;
