import React, { createContext, useState, ReactNode } from "react";

type User = {
    email: string,
    first_name: string,
    last_name: string,
    mobile: string,
    user_scope: string,
    username: string,
}

type UserContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const initialUserContext: UserContextType = {
    user: null,
    setUser: () => null,
}

// Create a context object
const UserContext = createContext<UserContextType>(initialUserContext);

type UserContextProviderProps = {
    children: ReactNode;
}


// Create a provider component
export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const storedUser = localStorage.getItem('user')
  const [user, setUser] = useState<User | null>(storedUser? JSON.parse(storedUser) : null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
