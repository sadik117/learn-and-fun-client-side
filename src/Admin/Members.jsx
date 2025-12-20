import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiEye } from "react-icons/fi";


export default function Members() {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/members");
      setMembers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const viewProfile = (email) => {
    navigate(`/members/profile/${email}`);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Members</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (filteredMembers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold">Members</h2>
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search members..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiUser className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="text-center py-12">
          <FiUser className="mx-auto text-4xl text-gray-400 mb-3" />
          <p className="text-gray-500">
            {searchTerm ? "No matching members found" : "No members found"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-3 text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-bold">Members</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
          </span>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search members..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiUser className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-3 px-4 font-medium text-gray-700">Member</th>
              <th className="py-3 px-4 font-medium text-gray-700">Email</th>
              <th className="py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="py-3 px-6 font-medium text-gray-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredMembers.map((member) => (
              <tr key={member.email} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{member.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{member.email}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status || 'active'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button
                    onClick={() => viewProfile(member.email)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiEye className="mr-1.5" />
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredMembers.map((member) => (
          <div key={member.email} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUser className="text-blue-600 text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{member.name}</p>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <FiMail className="flex-shrink-0 mr-1.5" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="mt-2 flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status || 'active'}
                  </span>               
                </div>
              </div>
            </div>
            <div className="mt-4 flex ml-15">
              <button
                onClick={() => viewProfile(member.email)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiEye className="mr-1.5" />
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
