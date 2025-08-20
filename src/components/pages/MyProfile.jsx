import { useEffect, useState, useContext } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../layouts/Loading";
import { AuthContext } from "../../Authentication/AuthProvider";
import { FiCopy } from "react-icons/fi";
import { LuCrown } from "react-icons/lu";

export default function MyProfile() {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [team, setTeam] = useState([]);
  const [referrer, setReferrer] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.email) {
      axiosSecure
        .get("/my-profile")
        .then((res) => {
          setProfile(res.data);
          if (res.data.referrer) {
            setReferrer(res.data.referrer);
          }
        })
        .catch(() => setProfile(null));

      axiosSecure
        .get("/my-team")
        .then((res) => setTeam(res.data.team || []))
        .catch(() => setTeam([]));
    }
  }, [authLoading, user?.email, axiosSecure]);

  if (authLoading || !profile) return <Loading />;

  const referralLink = profile.referralCode
    ? `${window.location.origin}/auth/signup?ref=${profile.referralCode}`
    : null;

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-4 px-4 sm:px-6 lg:px-8"> 
      {/* Profile Card */}
      <div className="bg-gray-700 p-6 my-5 rounded-2xl shadow-lg flex flex-col items-center">
        {profile.photoURL && (
          <img
            src={profile.photoURL}
            alt={profile.name}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
          />
        )}
        
        <h1 className="text-lg font-bold">Balance: <span className="text-emerald-500">{profile.balance}৳ </span></h1>
        <h2 className="text-2xl font-bold mt-4 inline-flex gap-1"><span><LuCrown className="mt-0.5"></LuCrown></span>{profile.name}</h2>
        <p className="text-gray-200">{profile.email}</p>
        <p className="mt-2">
          <strong>ID:</strong> {profile.referralCode || "N/A"} 
        </p>

        {referralLink && (
          <p className="flex items-center gap-2 mt-2">
            <strong>Referral Link:</strong>
            <a
              href={referralLink}
              className="text-yellow-300 hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {referralLink}
            </a>
            <button
              onClick={handleCopy}
              className="ml-2 p-1 bg-gray-700 rounded hover:bg-gray-600"
              title="Copy Link"
            >
              <FiCopy className="text-white w-4 h-4" />
            </button>
            {copied && <span className="text-green-400 text-sm">Copied!</span>}
          </p>
        )}

        {referrer && (
          <p className="mt-2 text-sm text-gray-300">
            Referred by <span className="font-semibold">{referrer.name}</span>
          </p>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Profits */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Profits</h3>
          <p className="text-2xl font-bold text-green-400">
            {profile.balance || 0} ৳
          </p>
        </div>

        {/* Team */}
        <div className="bg-gray-700 p-6 rounded-2xl shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Team</h3>
          <p className="text-3xl font-bold text-blue-400">{team.length}</p>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mt-5">
        <h3 className="text-xl font-semibold mb-4">Team Members</h3>
        {team.length === 0 ? (
          <p className="text-gray-400">No team members yet.</p>
        ) : (
          <ul className="space-y-2">
            {team.map((member, idx) => (
              <li key={idx} className="flex items-center gap-3">
                {member.photoURL && (
                  <img
                    src={member.photoURL}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
