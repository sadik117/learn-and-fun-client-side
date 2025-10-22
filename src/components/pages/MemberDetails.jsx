import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {
  FiUser,
  FiUsers,
  FiMail,
  FiCalendar,
  FiAward,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

const MemberDetails = () => {
  const { email } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackImage = "https://i.ibb.co/CsNxKRrN/default-avatar.png";

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

  const teamData = [
    { name: "Direct Team", value: member?.teamMembers?.length || 0 },
    {
      name: "Total Network",
      value: Math.max(
        (member?.totalTeam || member?.team || 0) -
          (member?.teamMembers?.length || 0),
        0
      ),
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const createdAtDate = member?.createdAt ? new Date(member.createdAt) : null;
  const createdAtText =
    createdAtDate && !isNaN(createdAtDate.getTime())
      ? createdAtDate.toLocaleDateString()
      : "N/A";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ImSpinner8 className="animate-spin text-4xl text-blue-600" />
        <p className="ml-4 text-xl text-gray-600">Loading member details...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FiUser className="text-6xl text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-red-600">Member Not Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Member Profile</h1>
          <p className="text-gray-600 mt-2">
            Detailed overview of member performance and statistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={member.photoURL || fallbackImage}
                  onError={(e) => (e.target.src = fallbackImage)}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-blue-100 mb-4 object-cover"
                />
                <h2 className="text-xl font-bold text-gray-900">
                  {member.name || "No Name"}
                </h2>
                <div className="flex items-center mt-1 text-gray-600 text-sm">
                  <FiMail className="mr-2" /> {member.email}
                </div>
              </div>

              {/* QUICK STATS */}
              <div className="mt-6 space-y-4">
                <InfoRow
                  icon={<FiUsers />}
                  label="Direct Team"
                  value={member.teamMembers?.length || 0}
                />
                <InfoRow
                  icon={<FiTrendingUp />}
                  label="Total Network"
                  value={member.totalTeam || member.team || 0}
                />
                <InfoRow
                  icon={<FiDollarSign />}
                  label="Profits"
                  value={`$৳{member.profits || 0}`}
                />
                <InfoRow
                  icon={<FiCalendar />}
                  label="Member Since"
                  value={createdAtText}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* TEAM CHART */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiUsers className="mr-2 text-blue-500" /> Team Structure
              </h3>
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
                      dataKey="value"
                    >
                      {teamData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-gray-600 mt-3">
                Total Network Size: {member.totalTeam || member.team || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center text-gray-700">
      <span className="mr-3">{icon}</span> {label}
    </div>
    <span className="font-bold text-gray-900">{value}</span>
  </div>
);

export default MemberDetails;
