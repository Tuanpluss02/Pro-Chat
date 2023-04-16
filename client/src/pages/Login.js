import axios from "axios";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { login, register } from "../api/auth";

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
      if (response.status !== 200) return null;
    } catch (error) {
      console.error(error);
    }
  };

  const input_text_style =
    "px-10 py-2 w-96 rounded-full outline-none border-2 border-primary font-medium text-medium text-grey-400";

  if (isLoggedIn) {
    return <Redirect push to="" />;
  } else {
    return (
      <>
        <div className="p-16 h-screen bg-grey-100 text-center">
          <div className="space-y-8">
            <div className="text-2xl font-bold text-secondary-light">
              <h1 className="text-secondary-light">Minimal</h1>
              <h1 className="text-primary-main">Chat.</h1>
            </div>
            <div className="space-y-4">
              <div>
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
                  className="px-10 py-2 w-96 rounded-full bg-primary-main text-white font-medium text-medium"
                  onClick={loginHandler}
                >
                  Login
                </button>
              </div>
              <div>
                <button
                  className="px-10 py-2 w-96 rounded-full bg-secondary-light text-white font-medium text-medium"
                  onClick={registerHandler}
                >
                  Register
                </button>
              </div>
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

