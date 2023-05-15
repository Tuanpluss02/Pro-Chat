import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../api/auth";

const Register = () => {
  const userRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        register,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        setSuccessMessage("User created successfully");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  const input_text_style =
    "px-10 py-2 w-96 rounded-md outline-none border-2 border-primary font-medium text-medium text-grey-400";

  return (
    <>
      <div className="p-16 h-screen bg-black text-center flex justify-end">
        <div className="space-y-8">
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-200 bg-clip-text">
            <h1 className="text-transparent h-20">Sign-up</h1>
          </div>
          {successMessage && (
            <div className="text-lg font-medium mb-1 text-white">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="text-lg font-medium mb-1 text-red-500">
              {errorMessage}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <h1 className="text-lg font-medium mb-1 text-white text-left">
                Username
              </h1>
              <input
                className={input_text_style}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                placeholder="Enter Username"
                name="uname"
                required
              />
            </div>
            <div>
              <h1 className="text-lg font-medium mb-1 text-white text-left">
                Password
              </h1>
              <input
                className={input_text_style}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="off"
                placeholder="Enter Password"
                name="psw"
                required
                ref={userRef}
              />
            </div>
            <div>
              <h1 className="text-lg font-medium mb-1 text-white text-left">
                Confirm your password
              </h1>
              <input
                className={input_text_style}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
               
                type="password"
                autoComplete="off"
                placeholder="Re-enter Password"
                required
              />
            </div>
            {!validMatch && (
              <div className="text-lg font-medium mb-1 text-red-500">
                Passwords do not match
              </div>
            )}
            <div>
              <button
                className="px-10 py-2 w-60 rounded-md bg-emerald-400 text-white font-medium text-medium"
                onClick={registerHandler}
              >
                Register
              </button>
              <h1 className="px-10 text-lg font-medium mb-1 text-white text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500">
                  Login
                </Link>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
