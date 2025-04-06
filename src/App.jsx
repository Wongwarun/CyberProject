import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";

// Pages
import Login from "./Login";
import Register from "./Register";
import Home from "./็Home";
import UserProfile from "./UserProfile";
import Shopping from "./page/Shopping";
import UsersCrud from "./CrudPage";
import LayoutMain from "./LayoutMain";

function App() {
  const [role, setRole] = useState(null); // null = loading, guest = ยังไม่ได้ login

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setRole("guest");
        return;
      }

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setRole(snap.data().role || "user");
        } else {
          setRole("user");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole("user");
      }
    });

    return () => unsubscribe();
  }, []);

  if (role === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Guest Routes */}
        {role === "guest" && (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* Authenticated Routes */}
        {role !== "guest" && (
          <Route element={<LayoutMain />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route
              path="/crud"
              element={
                role === "admin" ? (
                  <UsersCrud />
                ) : (
                  <div className="p-6 text-center text-error text-lg">⛔️ ไม่มีสิทธิ์เข้าถึง</div>
                )
              }
            />
            {/* Redirect ถ้าเข้าหน้าอื่น */}
            <Route path="*" element={<Navigate to="/shopping" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}

export default App;
