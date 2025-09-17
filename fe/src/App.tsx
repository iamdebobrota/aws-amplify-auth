import React, { useEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { AuthForm } from "./components/AuthForm";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";
import { fetchUserAttributes } from "aws-amplify/auth";

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    fetchUserAttributes().then((userAttrs) => setEmail(userAttrs.email || ""));
  }, []);
console.log(email)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthForm />;
};

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
