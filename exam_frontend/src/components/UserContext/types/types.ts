import { ReactNode } from "react";

export type User = {
    email?: string;
    first_name?: string;
    last_name?: string;
    mobile?: string;
    user_scope?: string;
    username?: string;
    };

export type UserContextType = {
    user?: User | null;
    setUser?: React.Dispatch<React.SetStateAction<User | null>>;
    };

export type UserContextProviderProps = {
    children?: ReactNode;
  };

