import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "./Firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const UsersCrud = () => {
  const [users, setUsers] = useState([]);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const usersRef = collection(db, "users");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(usersRef);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }
  
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const adminStatus = data.role === "admin";
        setIsAdmin(adminStatus);
  
        if (adminStatus) {
          fetchUsers(); // ✅ เรียกหลัง setIsAdmin แน่ ๆ แล้ว
        }
      }
    });
  
    return () => unsubscribe();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullname || !email) return;

    try {
      if (editId) {
        await updateDoc(doc(db, "users", editId), {
          fullname,
          email,
          password, // เพิ่ม password ในการ update (ในระบบจริงควรเข้ารหัส)
        });
        alert("✅ User updated successfully!");
        setEditId(null);
      } else {
        await addDoc(usersRef, {
          fullname,
          email,
          password,
          createdAt: serverTimestamp(),
        });
        alert("✅ User added successfully!");
      }

      setFullname("");
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save user.");
    }
  };

  const handleEdit = (user) => {
    setFullname(user.fullname);
    setEmail(user.email);
    setPassword(user.password || "");
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure to delete this user?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "users", id));
        alert("🗑️ User deleted");
        fetchUsers();
      } catch (err) {
        console.error(err);
        alert("❌ Failed to delete user.");
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setFullname("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">👥 Users Management</h2>

      {/* ✅ Admin Form */}
      {isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-4 mb-8 bg-base-100 p-4 rounded-lg shadow-md"
        >
          <input
            type="text"
            placeholder="Full Name"
            className="input input-bordered w-full"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary w-full">
              {editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button type="button" onClick={handleCancel} className="btn btn-outline w-full">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* ✅ Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="table table-zebra w-full bg-white">
            <thead>
              <tr className="text-base text-gray-700">
                <th>#</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Created At</th>
                {isAdmin && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.fullname}</td>
                  <td>{u.email}</td>
                  <td className="text-xs text-gray-500">
                    {u.password ? "🔒 " + u.password : "N/A"}
                  </td>
                  <td>{u.createdAt?.toDate().toLocaleString() || "-"}</td>
                  {isAdmin && (
                    <td className="flex gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="btn btn-sm btn-warning"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="btn btn-sm btn-error"
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersCrud;
