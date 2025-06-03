import { useContext } from "react";
import {  Navigate , Outlet } from "react-router-dom";
import AuthContext from "../ContextAPI/AuthenticationContext";

export function ProtectedRoutes(){
  const {isAuthenticated } = useContext(AuthContext);
  //1- Add a state to track if the user has attempted to authenticate.

  if(!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return <Outlet/>;
}