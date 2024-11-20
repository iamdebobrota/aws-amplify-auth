import React, { useState } from "react";
import { LogIn, UserPlus, Lock, KeyRound, AlertCircle } from "lucide-react";
import { confirmSignUp } from "aws-amplify/auth";
import { useAuth } from "../context/AuthContext";

export const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    code: "",
  });
  const [error, setError] = useState("");
  const { signIn, signUp, user } = useAuth();
  console.log(user);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return false;
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar)
      return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp && !validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters"
      );
      return;
    }

    try {
      if (showConfirmation) {
        await confirmSignUp({
          username: formData.username,
          confirmationCode: formData.code,
        });
        setShowConfirmation(false);
        alert("Email verified successfully! Please sign in.");
        setIsSignUp(false);
        return;
      }

      if (isSignUp) {
        const { nextStep } = await signUp(
          formData.username,
          formData.password,
          formData.email
        );
        if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
          setShowConfirmation(true);
        }
      } else {
        const nextStep = await signIn(formData.username, formData.password);
        if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
          setShowConfirmation(true);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errorMessage = "An error occurred";
      if (err.name === "UserNotFoundException") {
        errorMessage = "User not found. Please sign up first.";
      } else if (err.name === "NotAuthorizedException") {
        errorMessage = "Incorrect username or password";
      } else if (err.name === "UsernameExistsException") {
        errorMessage = "Username already exists. Please choose another one.";
      } else if (err.name === "InvalidParameterException") {
        errorMessage = "Please check your input and try again.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  const renderConfirmationForm = () => (
    <>
      <h2 className="text-3xl font-bold text-center mb-8">Verify Your Email</h2>
      <p className="text-gray-600 text-center mb-6">
        Please check your email for the verification code
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <KeyRound className="w-5 h-5" />
          Verify Email
        </button>
      </form>
    </>
  );

  const renderAuthForm = () => (
    <>
      <h2 className="text-3xl font-bold text-center mb-8">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            minLength={3}
          />
          {isSignUp && (
            <p className="mt-1 text-sm text-gray-500">
              Username must be at least 3 characters long
            </p>
          )}
        </div>

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            minLength={8}
          />
          {isSignUp && (
            <p className="mt-1 text-sm text-gray-500">
              Password must be at least 8 characters long and contain uppercase,
              lowercase, numbers, and special characters
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          {isSignUp ? (
            <>
              <UserPlus className="w-5 h-5" />
              Sign Up
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setFormData({ username: "", password: "", email: "", code: "" });
          }}
          className="text-sm text-blue-600 hover:text-blue-500">
          {isSignUp
            ? "Already have an account? Sign in"
            : "Need an account? Sign up"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Lock className="w-12 h-12 text-blue-600" />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {showConfirmation ? renderConfirmationForm() : renderAuthForm()}
      </div>
    </div>
  );
};
