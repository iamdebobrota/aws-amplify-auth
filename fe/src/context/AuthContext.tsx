import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  type SignUpInput,
} from "aws-amplify/auth";
import { AuthContextType, AuthState } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const user = await getCurrentUser();
      setAuthState({ isAuthenticated: true, user, loading: false });
    } catch {
      setAuthState({ isAuthenticated: false, user: null, loading: false });
    }
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      const { nextStep } = await signIn({
        username,
        password,
        options: {
          authFlowType: "USER_SRP_AUTH",
        },
      });

      if (nextStep.signInStep === "DONE") {
        const user = await getCurrentUser();
        setAuthState({ isAuthenticated: true, user, loading: false });
      }
      return nextStep;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const handleSignUp = async (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      const signUpParams: SignUpInput = {
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      };
      const { nextStep } = await signUp(signUpParams);
      return { nextStep };
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ global: true });
      setAuthState({ isAuthenticated: false, user: null, loading: false });
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
