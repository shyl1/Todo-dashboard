import {auth} from "../Firebase/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,  
} from "firebase/auth";

import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }){
  // store user data after login / signup
  const [user , setUser] = useState(null);
  //const [user , setUser] = useState('')

  // track authentication status 
  const [isAuthenticated , setIsAuthenticated] = useState(false);

  // //loading state 
  // const [loading, setLoading] = useState(true);


  // init auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth , (firebaseUser)=> {
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
      // setLoading(false); // Set loading to false after checking auth state
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
      const userCredentail = await createUserWithEmailAndPassword(auth , email , password);


      // Update the user's profile with the username
      await updateProfile(userCredentail.user , {
        displayName: username,
      });

      // update user state 
      setUser({
        uid: userCredentail.user.uid,
        email: userCredentail.user.email,
        name: userCredentail.user.displayName,
      });

      setIsAuthenticated(true);

      return userCredentail; 
    } catch (error){
      throw new Error(error.message);
    }
  }

   // Login function
  async function login(email, password) {
    try {
      const userCredentail = await signInWithEmailAndPassword(auth, email, password);

      // Update user state
      setUser({
        uid: userCredentail.user.uid,
        email: userCredentail.user.email,
        name: userCredentail.user.displayName,
      });
      setIsAuthenticated(true);

      return userCredentail; // Return the user credential for further use if needed
    } catch (error) {
      throw new Error(error.message);
    }
  }
    
  // Logout function
  async function logout() {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      throw new Error(error.message);
    }
  }
    
  return (
    <AuthContext.Provider 
    value={{
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      validateEmail,
      validatePassword,
      login,
      logout,
      signUp,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export {AuthProvider };
export default AuthContext; // Default export