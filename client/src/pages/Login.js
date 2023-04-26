import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { login} from "../api/auth";

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loginHandler = (e) => {
    e.preventDefault();
    console.log(username);
    console.log(password);
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    let config = {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
    axios
      .post(login, params, config)
      .then((response) => {
        console.log(response.data.access_token);
        if (response.data.access_token !== undefined) {
          localStorage.setItem("token", response.data.access_token);
          setIsLoggedIn(true);
        } else {
          setErrorMessage("Please try again.");
        }
      })
      .catch((err) => {
        console.log("ERROR LOGIN: \n" + err);
        setErrorMessage("error with logging in, check console");
      });
  };
  const input_text_style =
    "px-10 py-2 w-96 rounded-md outline-none border-2 border-primary font-medium text-medium text-grey-400";

  if (isLoggedIn) {
    return <Redirect push to="" />;
  } else {
    return (
      <>
        <div className="p-16 h-screen bg-black text-center flex justify-end">
          <div className="space-y-8">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-200 bg-clip-text">
              <h1 className="text-transparent">Pro Chat</h1>
              <h1 className="text-transparent">Login</h1>
            </div>
            <div className="space-y-4">
              <div>
              <h1 class="text-lg font-medium mb-1 text-white text-left">Username</h1>
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
              <h1 class="text-lg font-medium mb-1 text-white text-left">Password</h1>
                <input
                  className={input_text_style}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="off"
                  placeholder="Enter Password"
                  name="psw"
                  required
                />
              </div>
              <div>
                <button
                  className="px-10 py-2 w-36 rounded-full bg-emerald-400 text-white font-medium text-medium"
                  onClick={loginHandler}
                >
                  Login
                </button>
              </div>
              <h1 class="text-lg font-medium mb-1 text-white text-left">
                "Need an account?" <Link to="/register" className="text-blue-500">Register</Link>
              </h1>
              <div>
                <p className="text-red-500">{errorMessage}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};
export default Login;

