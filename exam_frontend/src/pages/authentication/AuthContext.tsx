import { ReactNode, createContext, useContext, useState } from "react";
interface AuthContextType {
  authenticated: boolean;
  setAuthenticated: (auth: boolean) => void,
  userRole: string,
  setUserRole: (role: string) => void,
  login: () => void,
  logout: () => void,
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("jwt") ? true : false
  );
  const [userRole, setUserRole] = useState("None");
  const login = () => {
    setAuthenticated(true);
  };
  const logout = () => {
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth is not used within AuthProvider')
  }
  return context
}