// src/components/AuthStatus.jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthStatus = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return user ? (
    <div className="p-4">
      Logged in as: <strong>{user.email}</strong>
      <button onClick={() => signOut(auth)} className="ml-4 btn btn-sm btn-error">Logout</button>
    </div>
  ) : (
    <div className="p-4">Not logged in</div>
  );
};

export default AuthStatus;