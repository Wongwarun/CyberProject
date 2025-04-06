// src/AdminRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setIsAdmin(data.role === "admin");
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  if (isAdmin === null) return <div>Loading...</div>;
  return isAdmin ? children : <Navigate to="/home" replace />;
};

export default AdminRoute;
