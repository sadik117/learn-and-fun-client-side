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

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-3">Withdrawal Requests</h1>

      {requests.length === 0 ? (
        <p>No withdrawal requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="shadow-lg rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{req.name}</p>
                <p className="text-sm text-gray-400">{req.email}</p>
                <p className="mt-1">
                  Amount:{" "}
                  <span className="text-green-400">{req.amount}৳</span>
                </p>
                <p className="text-sm text-gray-400">
                  Status:{" "}
                  <span
                    className={
                      req.status === "pending"
                        ? "text-yellow-400"
                        : req.status === "approved"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {req.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(req.createdAt).toLocaleString()}
                </p>
              </div>

              {req.status === "pending" && (
                <div className="flex gap-2 mt-3 sm:mt-0">
                  <button
                    onClick={() => handleApprove(req._id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(req._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
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
