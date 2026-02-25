import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/api";
import Navbar from "../components/Navbar";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending registration data:", {
        name,
        email,
        password,
        phone,
      });

      const data = await post("/auth/register", {
        name,
        email,
        password,
        phone,
      });

      console.log("Registration response:", data);

      // Check if registration successful (has token)
      if (data && data.token) {
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-6 md:mb-8 text-gray-900">
              Create Patient Account
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto max-h-[calc(100vh-250px)] md:max-h-none md:overflow-visible"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="mb-2 md:mb-0">
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="mb-2 md:mb-0">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="mb-2 md:mb-0">
                  <label className="block text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="hidden md:block"></div>

                <div className="mb-2 md:mb-0">
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="mb-2 md:mb-0">
                  <label className="block text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1E3A8A] text-white py-2 rounded hover:bg-[#1E3A8A]/90 disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Register"}
                </button>
              </div>
            </form>

            <p className="mt-4 text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1E3A8A] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
