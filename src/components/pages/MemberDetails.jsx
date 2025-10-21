import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { 
  FiUser, 
  FiUsers, 
  FiMail, 
  FiCalendar,
  FiAward,
  FiTrendingUp
} from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const MemberDetails = () => {
  const { email } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(
          `https://learn-and-earn-server-side.vercel.app/users/${encodeURIComponent(email)}`
        );
        const data = await res.json();
        setMember(data);
      } catch (err) {
        console.error("Error fetching member:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [email]);

  // Team chart data
  const teamData = [
    { name: "Direct Team", value: member?.teamMembers?.length || 0 },
    { name: "Total Network", value: Math.max((member?.totalTeam || member?.team || 0) - (member?.teamMembers?.length || 0), 0) }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // Safe formatted "Member Since"
  const createdAtDate = member?.createdAt ? new Date(member.createdAt) : null;
  const createdAtValid = createdAtDate && !isNaN(createdAtDate.getTime());
  const createdAtText = createdAtValid ? createdAtDate.toLocaleDateString() : "N/A";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ImSpinner8 className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiUser className="text-6xl text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Member Not Found</h2>
          <p className="text-gray-600">The member you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Member Profile</h1>
          <p className="text-gray-600 mt-2">Detailed overview of member performance and statistics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={
                    member.photoURL ||
                    "https://i.ibb.co/CsNxKRrN/default-avatar.png"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-blue-100 mb-4 object-cover"
                />
                <h2 className="text-xl font-bold text-gray-900">{member.name || "No Name"}</h2>
                <div className="flex items-center mt-1 text-gray-600">
                  <FiMail className="mr-2" />
                  <span className="text-sm">{member.email || "N/A"}</span>
                </div>
                <div className="mt-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Active Member
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FiUsers className="text-blue-500 mr-3" />
                    <span className="text-gray-700">Direct Team</span>
                  </div>
                  <span className="font-bold text-blue-600">{member.teamMembers?.length || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FiTrendingUp className="text-purple-500 mr-3" />
                    <span className="text-gray-700">Total Network</span>
                  </div>
                  <span className="font-bold text-purple-600">{member.totalTeam || member.team || 0}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <FiUser className="text-gray-700 mr-3" />
                    <span className="text-gray-700">Member Since</span>
                  </div>
                  <span className="font-medium text-gray-800">{createdAtText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Charts & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team Structure Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Team Structure</h3>
                <FiUsers className="text-blue-500" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {teamData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                Total Network Size: {member.totalTeam || member.team || 0} members
              </div>
            </div>

            {/* Additional Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <FiAward className="text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Achievement Level</p>
                    <p className="font-semibold">Bronze</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <FiCalendar className="text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold">{createdAtText}</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default MemberDetails;
