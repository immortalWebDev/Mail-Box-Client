import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../store/authSlice";

import "./SignUp.css";

const SignUp = () => {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    let url;
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBtiN7vadJTitonU3zCdeZ1hv2HuGIZ-ts`;
    } else {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBtiN7vadJTitonU3zCdeZ1hv2HuGIZ-ts`;
    }

    try {
      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      const data = response.data;

      // Dispatch login action with user's email
      dispatch(login({ email: data.email, token: data.idToken }));

      setError(null);
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      console.log('Successfully authenticated & logged in')
      navigate("/home");
    

    } catch (err) {
      setError("Authentication failed: Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotPasswordLoading(true);
    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBtiN7vadJTitonU3zCdeZ1hv2HuGIZ-ts`,
        {
          requestType: "PASSWORD_RESET",
          email: email,
        }
      );
      setError("Password reset email sent successfully!");
    } catch (error) {
      setError("Error sending password reset email. Please enter valid email.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const toggleLogin = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
    setError(null);
  };

  return (
    <div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : isLogin ? "Log in" : "Sign up"}
        </button>
        {isLogin && (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={forgotPasswordLoading}
          >
            {forgotPasswordLoading ? "Sending link..." : "Forgot Password?"}
          </button>
        )}
        <div className="login-link">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            className="small-button"
            onClick={toggleLogin}
          >
            {isLogin
              ? "Create a new account"
              : "Log in with existing account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
