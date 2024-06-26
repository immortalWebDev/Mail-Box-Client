import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthenticated } from "./store/authSlice";
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import SignUp from "./components/SignUp";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(setIsAuthenticated(!!token));
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar">
            <div className="navbar-left">
              <div className="logo">Mailbox Client</div>
              <ul>
                <li>
                  <NavLink to="/home" end activeclassname="active">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about-us" end activeclassname="active">
                    About Us
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/home"
              element={isAuthenticated ? <Home /> : <Navigate to="/signup" />}
            />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
