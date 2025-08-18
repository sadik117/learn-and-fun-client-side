import React, { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiCheckCircle } from "react-icons/fi";

export default function PendingUsers() {
  const axiosSecure = useAxiosSecure();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/pending-users");
      setPendingUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch pending users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const promoteToMember = async (email) => {
    try {
      const res = await axiosSecure.patch(`/pending-users/${email}/approve`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchPendingUsers(); // refresh list
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update role");
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Pending Users</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Pending Users</h2>
        <div className="text-center py-8">
          <FiUser className="mx-auto text-4xl text-gray-400 mb-2" />
          <p className="text-gray-500">No pending users found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Pending Users</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {pendingUsers.length} pending
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-3 px-4 font-medium text-gray-700">Name</th>
              <th className="py-3 px-4 font-medium text-gray-700">Email</th> 
              <th className="py-3 px-10 font-medium text-gray-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pendingUsers.map((user) => (
              <tr key={user.email} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{user.email}</td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => promoteToMember(user.email)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FiCheckCircle className="mr-1.5" />
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {pendingUsers.map((user) => (
          <div key={user.email} className="border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUser className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user.name}</p>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <FiMail className="flex-shrink-0 mr-1.5" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => promoteToMember(user.email)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <FiCheckCircle className="mr-1.5" />
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}