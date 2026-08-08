"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      const auth = getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
        } else {
          const localUser = localStorage.getItem("medical-store-demo-user");
          if (localUser) {
            setUser(JSON.parse(localUser));
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      });
    } catch {
      const localUser = localStorage.getItem("medical-store-demo-user");
      if (localUser) {
        setUser(JSON.parse(localUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (email === "admin@medicalstore.com" && password === "admin123") {
      const mockUser = {
        uid: "demo-admin-uid",
        email: "admin@medicalstore.com",
        displayName: "Demo Admin",
      } as any;
      setUser(mockUser);
      localStorage.setItem("medical-store-demo-user", JSON.stringify(mockUser));
      return;
    }
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  };

  const logout = async () => {
    localStorage.removeItem("medical-store-demo-user");
    try {
      await signOut(getFirebaseAuth());
    } catch {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
