/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import Loading from "../layouts/Loading";
import { FiCopy } from "react-icons/fi";
import { LuCrown } from "react-icons/lu";
import { GiCash } from "react-icons/gi";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../Authentication/AuthContext";

export default function MyProfile() {
  const axiosSecure = useAxiosSecure();
  const axios = useAxios();
  const { user, loading: authLoading, setUser } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [team, setTeam] = useState([]);
  const [referrer, setReferrer] = useState(null);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const displayName = profile.name || user?.displayName || user?.email || "";
  const avatar = profile.photoURL || user?.photoURL || null;

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

  //  Handle image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      toast.info("Uploading photo...");
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.success) {
        const imageUrl = data.data.url;

        // Update to backend with email + photoURL
        await axiosSecure.patch("/users/update-photo", {
          email: profile.email,
          photoURL: imageUrl,
        });

        toast.success("Profile photo updated!");
        setProfile((prev) => ({ ...prev, photoURL: imageUrl }));
      } else {
        toast.error("Upload failed!");
      }
    } catch (err) {
      toast.error("Error uploading image!");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 text-white py-4 px-4 sm:px-6 lg:px-8">

      {/* Profile Card */}
      <div className="bg-gray-700 p-6 my-5 rounded-2xl shadow-lg flex flex-col items-center">
        {avatar && (
          <img
            src={avatar}
            alt={displayName}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg mb-2 object-cover"
          />
        )}

        {/* Profile Photo Upload Section */}
        <div className="mt-3">
          <label
            htmlFor="photo-upload"
            className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 inline-block"
          >
            {uploading ? "Uploading..." : "Upload New Photo"}
          </label>

          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={uploading}
            className="hidden"
          />
        </div>

        <h1 className="text-lg font-bold flex items-center gap-2 mt-3">
          <GiCash className="-mr-1" />
          Balance:{" "}
          <span className="text-emerald-500 mt-0.5">{profile.balance}৳</span>
          <Link
            to="/withdraw"
            className="px-2 py-0.5 ml-2 bg-purple-500 hover:bg-purple-600 rounded-md text-sm font-medium"
          >
            Withdraw
          </Link>
        </h1>

        <h2 className="text-2xl font-bold mt-4 inline-flex gap-1">
          <LuCrown className="mt-0.5" />
          {displayName}
        </h2>
        <p className="text-gray-200">{profile.email || user?.email}</p>
        <p className="mt-2">
          <strong>ID:</strong> {profile.referralCode || "N/A"}
        </p>

        {referralLink && (
          <p className="flex items-center gap-2 mt-2">
            <strong>Referral Link:</strong>
            <a
              href={referralLink}
              className="text-purple-400 hover:underline break-all"
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
              <FiCopy className="text-white w-6 h-5" />
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
            {profile.profits || 0} ৳
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
