import { Navigate, Outlet, Route } from "react-router";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { authenticated } = useAuth(); // Custom hook to check authentication

  console.log("This is the value of Authenticated: ", authenticated)

  //   return authenticated ? <Outlet /> : <Navigate to="/exam/requests" />;
  return authenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
