import { createContext, useState } from "react";
import { User, UserContextProviderProps, UserContextType } from "./types/types";

const initialUserContext: UserContextType = {
  user: null,
  setUser: () => null,
};

const UserContext = createContext<UserContextType>(initialUserContext);

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
