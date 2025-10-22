import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
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
import { AuthContext } from "../../Authentication/AuthProvider";

const MemberDetails = () => {
  const { email } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fallbackImage = "https://i.ibb.co/CsNxKRrN/default-avatar.png";

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(
          `https://learn-and-earn-server-side.vercel.app/users/${encodeURIComponent(
            email
          )}`
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

  // --- Prepare Calculations ---
  const totalTeam = member?.totalTeam || member?.team || 0;
  const directTeam = member?.teamMembers?.length || 0;
  const profits = member?.profits || 0;

  const teamData = [
    { name: "Direct Team", value: directTeam },
    { name: "Total Network", value: Math.max(totalTeam - directTeam, 0) },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  const createdAtDate = member?.createdAt ? new Date(member.createdAt) : null;
  const createdAtText =
    createdAtDate && !isNaN(createdAtDate.getTime())
      ? createdAtDate.toLocaleDateString()
      : "N/A";

  // --- Dynamic Badges Logic ---
  const getAchievementBadge = () => {
    if (totalTeam > 50)
      return {
        level: "Gold",
        icon: <FiAward />,
        color: "bg-yellow-100 border-yellow-400 text-yellow-700",
      };
    if (totalTeam > 10)
      return {
        level: "Silver",
        icon: <FiAward />,
        color: "bg-gray-100 border-gray-400 text-gray-700",
      };
    if (totalTeam > 0)
      return {
        level: "Bronze",
        icon: <FiAward />,
        color: "bg-orange-100 border-orange-400 text-orange-700",
      };
    return {
      level: "Starter",
      icon: <FiUser />,
      color: "bg-gray-200 border-gray-400 text-gray-600",
    };
  };

  const getEarningBadge = () => {
    if (profits > 5000)
      return {
        text: "Top Earner",
        icon: <FiAward />,
        color: "bg-purple-100 border-purple-400 text-purple-700",
      };
    if (profits > 1000)
      return {
        text: "Growing Earner",
        icon: <FiDollarSign />,
        color: "bg-blue-100 border-blue-400 text-blue-700",
      };
    if (profits > 0)
      return {
        text: "Beginner Earner",
        icon: <FiTrendingUp />,
        color: "bg-green-100 border-green-400 text-green-700",
      };
    return {
      text: "No Earnings Yet",
      icon: <FiDollarSign />,
      color: "bg-gray-100 border-gray-400 text-gray-700",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ImSpinner8 className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-2xl text-red-500">Member Not Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Member Profile</h1>
        <p className="text-gray-600 mb-6">
          Detailed overview of member performance and statistics
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/*  Left Profile */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
            <div className="text-center">
              <img
                src={user?.photoURL || fallbackImage}
                onError={(e) => (e.target.src = fallbackImage)}
                alt="Profile"
                className="w-24 h-24 object-cover rounded-full border-4 border-blue-100 mx-auto mb-4"
              />
              <h2 className="text-xl font-bold">{member.name || "No Name"}</h2>
              <p className="text-gray-600 text-sm flex items-center justify-center">
                <FiMail className="mr-2" /> {member.email}
              </p>
            </div>

            <div className="space-y-4">
              <InfoRow icon={<FiUsers />} label="Direct Team" value={directTeam} />
              <InfoRow icon={<FiTrendingUp />} label="Total Network" value={totalTeam} />
              <InfoRow icon={<FiDollarSign />} label="Profits" value={`৳${profits}`} />
              <InfoRow icon={<FiCalendar />} label="Member Since" value={createdAtText} />
            </div>
          </div>

          {/*Charts + Badges */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <FiUsers className="mr-2 text-blue-500" /> Team Structure
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamData}
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {teamData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Dynamic Achievement & Earnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BadgeCard
                icon={getAchievementBadge().icon}
                title="Achievement Level"
                value={getAchievementBadge().level}
                color={getAchievementBadge().color}
              />
              <BadgeCard
                icon={getEarningBadge().icon}
                title="Earning Status"
                value={getEarningBadge().text}
                color={getEarningBadge().color}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
    <span className="flex items-center text-gray-700">{icon} <span className="ml-2">{label}</span></span>
    <span className="font-bold">{value}</span>
  </div>
);

const BadgeCard = ({ icon, title, value, color }) => (
  <div className={`rounded-xl border p-4 flex items-center space-x-3 shadow-sm ${color}`}>
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-sm">{title}</p>
      <p className="font-bold">{value}</p>
    </div>
  </div>
);

export default MemberDetails;
