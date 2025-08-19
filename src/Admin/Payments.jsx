import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { FiUser, FiMail, FiPhone, FiCalendar, FiImage, FiCheck, FiX, FiEye } from "react-icons/fi";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const [filter, setFilter] = useState("all");
  const axiosSecure = useAxiosSecure();

  const fetchPayments = async () => {
    try {
      const response = await axiosSecure.get("/payments");
      setPayments(response.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/payments/${id}`, { status: newStatus });
      setPayments((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: newStatus } : p
        )
      );
    } catch (error) {
      console.error("Failed to update payment status:", error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === "all") return true;
    return payment.status === filter;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">All Payments</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold">All Payments</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              filter === "all" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-700"
            }`}
          >
            All ({payments.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              filter === "pending" 
                ? "bg-yellow-600 text-white" 
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Pending ({payments.filter(p => p.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              filter === "approved" 
                ? "bg-green-600 text-white" 
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Approved ({payments.filter(p => p.status === "approved").length})
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              filter === "rejected" 
                ? "bg-red-600 text-white" 
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Rejected ({payments.filter(p => p.status === "rejected").length})
          </button>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <FiImage className="mx-auto text-4xl text-gray-400 mb-3" />
          <p className="text-gray-500">
            {filter === "all" ? "No payments found" : `No ${filter} payments`}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="py-3 px-4 font-medium text-gray-700">User</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Contact</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="py-3 px-4 font-medium text-gray-700">Screenshot</th>
                  <th className="py-3 px-4 font-medium text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiUser className="text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="font-medium">{payment.name}</p>
                          <p className="text-sm text-gray-500">{payment.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-gray-600">
                        <FiPhone className="mr-2" />
                        {payment.phone || "N/A"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2" />
                        {new Date(payment.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {payment.screenshot ? (
                        <button
                          onClick={() => setModalImage(payment.screenshot)}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <FiEye className="mr-1" />
                          View
                        </button>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      {payment.status !== "approved" && (
                        <button
                          onClick={() => handleStatusChange(payment._id, "approved")}
                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                        >
                          <FiCheck className="mr-1" />
                          Approve
                        </button>
                      )}
                      {payment.status !== "rejected" && (
                        <button
                          onClick={() => handleStatusChange(payment._id, "rejected")}
                          className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                        >
                          <FiX className="mr-1" />
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{payment.name}</p>
                      <p className="text-sm text-gray-500">{payment.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  {payment.phone && (
                    <div className="flex items-center">
                      <FiPhone className="mr-2" />
                      {payment.phone}
                    </div>
                  )}
                  <div className="flex items-center">
                    <FiCalendar className="mr-2" />
                    {new Date(payment.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  {payment.screenshot ? (
                    <button
                      onClick={() => setModalImage(payment.screenshot)}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      <FiEye className="mr-1" />
                      View Screenshot
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">No screenshot</span>
                  )}
                  
                  <div className="flex space-x-2">
                    {payment.status !== "approved" && (
                      <button
                        onClick={() => handleStatusChange(payment._id, "approved")}
                        className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                        title="Approve"
                      >
                        <FiCheck size={14} />
                      </button>
                    )}
                    {payment.status !== "rejected" && (
                      <button
                        onClick={() => handleStatusChange(payment._id, "rejected")}
                        className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                        title="Reject"
                      >
                        <FiX size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Screenshot Modal */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg shadow-xl relative max-w-4xl w-full max-h-[90vh]">
            <button
              className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-gray-300"
              onClick={() => setModalImage(null)}
            >
              ×
            </button>
            <div className="max-h-[80vh] overflow-auto">
              <img
                src={modalImage}
                alt="Payment screenshot"
                className="w-full h-auto rounded"
              />
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setModalImage(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;