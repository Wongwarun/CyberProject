import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./Firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        email,
        fullname,
        role: "user",
        createdAt: serverTimestamp(),
      });

      alert("Register Success ✅");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Register failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-fade-in">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">📝 Sign Up</h2>
          <p className="text-sm text-gray-500 mt-1">Create your account to continue</p>
        </div>

        {error && (
          <div className="alert alert-error text-sm mb-4 shadow">{error}</div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Full Name</span>
            </div>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full pl-10"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
          </label>

          {/* Email */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          {/* Password */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-3 text-gray-400 cursor-pointer transition transform hover:scale-110"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-full transition transform hover:scale-[1.03] active:scale-[0.98] duration-150"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="link link-primary transition hover:underline hover:opacity-80"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
