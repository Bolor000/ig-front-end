"use client";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  _id: string;
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
};

type AuthContext = {
  user: User | null;
  token: string | null;
  setUser: Dispatch<SetStateAction<null | User>>;
  setToken: Dispatch<SetStateAction<null | string>>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
};

type decodedTokenTyoe = {
  data: User;
};

export const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      const decodedToken: decodedTokenTyoe = jwtDecode(tokenData);
      setUser(decodedToken.data);
      setToken(tokenData)
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("https://ig-back-end-rgcc.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);

    setUser(data.user);
    setToken(data.token);
  };

  const signUp = async (email: string, password: string, username: string) => {
    const response = await fetch("https://ig-back-end-rgcc.onrender.com/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Sign up failed");
    }

    localStorage.setItem("token", data.token);
    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
  localStorage.removeItem("token"); 
  setUser(null);                  
  setToken(null);                  
};
  const values = { user, setUser, login, signUp, token, setToken, logout };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useUser = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthProvider need");
  }

  return authContext;
};
