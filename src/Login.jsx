import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./Firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/shopping");
    } catch (err) {
      setError("Invalid email or password ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white text-gray-800 border border-gray-200 p-8 rounded-xl shadow-md animate-fade-in">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">🔐 Login</h2>
          <p className="text-sm text-gray-500">Welcome back! Please login.</p>
        </div>

        {error && <div className="alert alert-error text-sm mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                className="input input-bordered w-full pl-10 pr-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-3 text-gray-400 cursor-pointer hover:text-gray-600 transition"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full transition hover:scale-[1.02] duration-150"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="link link-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
