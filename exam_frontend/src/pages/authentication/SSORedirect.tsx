import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

const SSORedirect = () => {
  const { setAuthenticated, setUserRole } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) {
        throw new Error("Invalid JWT token: Missing base URL segment");
      }
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const refresh_token = queryParams.get("refresh_token");
    const access_token = queryParams.get("access_token");

    if (access_token && refresh_token) {
      localStorage.setItem("jwt", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      const payload = decodeJWT(access_token);

      if (payload) {
        setAuthenticated(true);
        setUserRole(payload.user_scope);

        navigate("/exam/dashboard");
      } else {
        console.error("Invalid JWT token");
      }
    } else {
      console.error("Access token or refresh token not found");
    }
  }, [location.search, navigate, setAuthenticated, setUserRole]);

  return <div></div>;
};

export default SSORedirect;
