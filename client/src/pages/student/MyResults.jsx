import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

const MyResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get("/student/results").then((res) => setResults(res.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Results</h1>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Course</th>
                <th className="pb-2">Exam</th>
                <th className="pb-2">Marks</th>
                <th className="pb-2">Semester</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r._id} className="border-b last:border-0">
                  <td className="py-2">{r.course?.name} ({r.course?.code})</td>
                  <td className="py-2 capitalize">{r.examType}</td>
                  <td className="py-2">{r.marksObtained} / {r.maxMarks}</td>
                  <td className="py-2">{r.semester}</td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-400">No results published yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyResults;
