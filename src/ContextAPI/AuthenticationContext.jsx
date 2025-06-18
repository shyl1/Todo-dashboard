import {auth, db} from "../Firebase/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,  
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { createContext, useEffect, useState } from "react";


const AuthContext = createContext();


function AuthProvider({ children }){
  // store user data after login / signup
  const [user , setUser] = useState(null);

  // track authentication status 
  const [isAuthenticated , setIsAuthenticated] = useState(false);

  //loading state 
  const [loading, setLoading] = useState(true);


  // init auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth , async (firebaseUser)=> {
      if(firebaseUser){
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false); // Set loading to false after checking auth state
    });

    return () => unsubscribe(); //clean up function to unsubscribe from the listener
  }, []);

  //validating email 
  function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email address";
    }
    return null; // No error
  }

  function validatePassword(password){
    //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return null; // No error
  }

  // signup function
  async function signUp(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth , email , password);
    
      // Update the user's profile with the username
      await updateProfile(userCredential.user , {
        displayName: username,
      });

      // create a firebase user document in the database 
      await setDoc(doc(db , "users", userCredential.user.uid), {
        email: userCredential.user.email,
        name : username,
        profileCompleted: true,
      });

      // // update user state 
      // setUser({
      //   uid: userCredential.user.uid,
      //   email: userCredential.user.email,
      //   name: userCredential.user.displayName,
      // });

      // setIsAuthenticated(true);

      return { success: true ,user: userCredential.user }; 
    } catch (error){
      return { success: false, error: error.message };
    }
  }

   // Login function
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle the user state update
      return { success: true ,user: userCredential.user }; 
    } catch (error){
      return { 
      success: false, 
      error: {
        code: error.code.replace('auth/', ''), // Remove 'auth/' prefix
        message: error.message
      }
    };
    }
  }



    
  // Logout function
  async function logout() {
    try {
      await signOut(auth);
      // setUser(null);
      // setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
    
  return (
    <AuthContext.Provider 
    value={{
      isAuthenticated,
      user,
      validateEmail,
      validatePassword,
      login,
      logout,
      signUp,
      loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export {AuthProvider };
export default AuthContext; // Default export