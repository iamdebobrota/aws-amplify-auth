import React, { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
const BE_URL = "http://localhost:8080";

export const Dashboard: React.FC = () => {
  const { user, signOut, token } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  const handleGetUserData = async () => {
    axios
      .get(`${BE_URL}/api/auth/me`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.accessToken}`,
          "x-auth-type": "cognito",
        },
      })
      .then((response) => {
        console.log("response ", response);
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    handleGetUserData();
  }, [user]);
  console.log("userData", userData);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{user?.username}</span>
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
              <div>
                Token: {"    "}
                <p style={{ color: "red", margin: "10px" }}>
                  <b> Id token:</b> {token.idToken ? token.idToken : ""}
                </p>
                <p style={{ color: "green", margin: "10px" }}>
                  <b>Access token:</b>{" "}
                  {token.accessToken ? token.accessToken : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Welcome to Your Dashboard
            </h2>
            <p className="text-gray-600">
              You're successfully authenticated with AWS Amplify!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
