import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";

const PaymentPage = () => {
  const axiosSecure = useAxiosSecure();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload to imgbb
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formDataImg = new FormData();
    formDataImg.append("image", file);

    setUploading(true);
    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        {
          method: "POST",
          body: formDataImg,
        }
      );
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.url);
        toast.success("Screenshot uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Error uploading screenshot: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl) return toast.error("Please upload your payment screenshot!");

    try {
      const paymentData = {
        ...formData,
        screenshot: imageUrl,
        status: "pending", // you can track pending/approved payments
        date: new Date(),
      };

      const res = await axiosSecure.post("/payments", paymentData);

      if (res.data.success) {
        toast.success("Your payment details have been submitted!");
        setFormData({ name: "", email: "", phone: "" });
        setImageUrl("");
        setPreview(null);
      } else {
        toast.error(res.data.message || "Failed to submit payment");
      }
    } catch (error) {
      toast.error("Error submitting payment: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <h1 className="text-2xl font-bold">Complete Your Payment</h1>
          <p className="mt-2 text-gray-200">
            Please make your payment to the following account:
          </p>
          <p className="text-lg font-semibold text-yellow-300 mt-2">
            Send Money 800৳ to this Nagad/Bkash Number:{" "}
            <span className="text-white">01704330646</span>
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 grid gap-6 md:grid-cols-2">
          {/* Name */}
          <div>
            <label className="block mb-2 text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Upload Screenshot
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-700 text-gray-300 rounded-lg shadow cursor-pointer hover:bg-gray-600">
                <FiUpload className="w-8 h-8 mb-2" />
                <span className="text-sm">
                  {uploading ? "Uploading..." : "Click to upload"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
            {preview && (
              <div className="mt-3">
                <p className="text-sm mb-2">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-600"
                />
              </div>
            )}
          </div>

          {/* Submit Button (full width) */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition duration-300 shadow-lg disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Submit Payment Info"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
