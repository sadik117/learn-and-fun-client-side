import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function WithdrawRequests() {
  const axiosSecure = useAxiosSecure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch withdrawal requests
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/withdrawals");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Approve request
  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`/withdrawals/${id}/approve`);
      fetchRequests();
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  // Reject request
  const handleReject = async (id) => {
    try {
      await axiosSecure.patch(`/withdrawals/${id}/reject`);
      fetchRequests();
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  if (loading) return(
  <div className=" flex justify-center py-8">
     <p className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></p>;
  </div>
  )

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-5">Withdrawal Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-300">No withdrawal requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-gray-800 text-white shadow-lg rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Left section (info) */}
              <div>
                <p className="font-semibold text-lg">{req.name}</p>
                <p className="text-sm text-gray-400">{req.email}</p>

                <p className="mt-1">
                  Amount:{" "}
                  <span className="font-semibold text-green-400">
                    {req.amount}৳
                  </span>
                </p>

                <p className="text-sm">
                  Method:{" "}
                  <span className="font-medium text-blue-400 capitalize">
                    {req.method}
                  </span>{" "}
                  | Phone:{" "}
                  <span className="font-medium text-gray-300">{req.phone}</span>
                </p>

                <p className="mt-1 text-sm">
                  Status:{" "}
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      req.status === "pending"
                        ? "bg-yellow-600 text-yellow-100"
                        : req.status === "approved"
                        ? "bg-green-600 text-green-100"
                        : "bg-red-600 text-red-100"
                    }`}
                  >
                    {req.status}
                  </span>
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Right section (buttons) */}
              {req.status === "pending" && (
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => handleApprove(req._id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
