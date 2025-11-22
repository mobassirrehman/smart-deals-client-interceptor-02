import React, { useEffect, useState } from "react";
import { AuthContexts } from "./AuthContexts";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signOutUser = () => {
    setLoading(true);
    return auth.signOut(auth);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetch("", {})
          .then((res) => res.json())
          .then((data) => {
            console.log("after getting token", data);
          });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const authInfo = {
    createUser,
    signInUser,
    signInWithGoogle,
    signOutUser,
    user,
    loading,
  };
  return (
    <AuthContexts.Provider value={authInfo}>{children}</AuthContexts.Provider>
  );
};

export default AuthProvider;
