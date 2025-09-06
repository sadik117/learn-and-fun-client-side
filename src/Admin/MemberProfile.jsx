import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Loading from "../components/layouts/Loading";

export default function MemberProfile() {
  const { email } = useParams();
  const axiosSecure = useAxiosSecure();
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get(`/members/profile/${email}`);
        setMember(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch member profile");
      }
    };
    fetchProfile();
  }, [email, axiosSecure]);

  if (!member) return <Loading />;

  //  Handle photoURL and photoUrl fallback
  const avatar = member.photoURL || member.photoUrl || null;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-6 md:p-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {avatar ? (
            <img
              src={avatar}
              alt={member.name}
              className="w-32 h-32 rounded-full ring-4 ring-teal-500 object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xl font-bold">
              {member.name?.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{member.name}</h2>
            <p className="text-gray-300 mb-1">
              <strong>Email:</strong> {member.email}
            </p>
            {member.phone && (
              <p className="text-gray-300 mb-1">
                <strong>Phone:</strong> {member.phone}
              </p>
            )}
            <p className="text-gray-300 mb-1">
              <strong>Member ID:</strong> {member.referralCode}
            </p>
            {member.referrer && (
              <p className="text-gray-300 mb-1">
                <strong>Referred By:</strong> {member.referrer.name} (
                {member.referrer.email})
              </p>
            )}
            {/* Joined Date */}
            {member.createdAt && (
              <p className="text-gray-300 mb-1">
                <strong>Joined:</strong>{" "}
                {new Date(member.createdAt).toLocaleDateString()}
              </p>
            )}
            {member.profits !== undefined && (
              <p className="text-teal-400 font-medium mt-1">
                <strong>Total Profit:</strong> ৳{member.profits.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Team Section */}
        {member.team && member.team.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-3">Team Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {member.team.map((tm, idx) => (
                <div
                  key={idx}
                  className="bg-gray-700 p-4 rounded-xl flex flex-col items-center text-center hover:bg-gray-600 transition"
                >
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold mb-2">
                    {tm.name?.charAt(0)}
                  </div>
                  <p className="font-semibold">{tm.name}</p>
                  <p className="text-gray-300 text-sm">{tm.email}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link
            to="/admin-dashboard/members"
            className="inline-block bg-teal-600 hover:bg-teal-700 transition px-6 py-2 rounded-xl font-semibold"
          >
            Back to Members
          </Link>
        </div>
      </div>
    </div>
  );
}
