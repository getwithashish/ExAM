import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(localStorage.getItem("jwt") ? true : false);
  const [userRole, setUserRole] = useState("None");

  const login = () => {
    // Perform authentication logic (e.g., authenticate user with backend)
    setAuthenticated(true);
  };

  const logout = () => {
    // Perform logout logic
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        userRole,
        setUserRole,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
