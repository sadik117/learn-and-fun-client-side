import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function WithdrawPage() {
  const axiosSecure = useAxiosSecure();
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState(""); // nagad or bkash
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!method) {
      setMessage("Please select a payment method (Nagad or bKash)");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosSecure.post("/withdraw", {
        amount: Number(amount),
        phone,
        method,
      });
      setMessage(res.data.message || "Withdraw successful");
      setAmount("");
      setPhone("");
      setMethod("");
    } catch (err) {
      console.error("Withdraw error:", err);
      setMessage(err.response?.data?.message || "Withdraw failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 text-white flex items-center justify-center px-4">

      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Withdraw Balance
        </h1>

        <form onSubmit={handleWithdraw} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block mb-1 text-sm">Amount (৳)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="20"
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter amount"
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label className="block mb-1 text-sm">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 018XXXXXXXX"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block mb-1 text-sm">Select Method</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="bkash"
                  checked={method === "bkash"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="form-radio text-pink-500"
                />
                bKash
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value="nagad"
                  checked={method === "nagad"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="form-radio text-orange-500"
                />
                Nagad
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.toLowerCase().includes("success")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
