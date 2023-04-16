import axios from "axios";
import React from "react";
import { Redirect } from "react-router-dom";
import { login, register } from "../api/auth";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      username: "",
      password: "",
      error_message: "",
    };
    this.loginHandler = this.loginHandler.bind(this);
    this.registerHandler = this.registerHandler.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.usernameChange = this.usernameChange.bind(this);
  }

  usernameChange(e) {
    e.preventDefault();
    this.setState({
      username: e.target.value,
    });
  }

  passwordChange(e) {
    e.preventDefault();
    this.setState({
      password: e.target.value,
    });
  }

  loginHandler(e) {
    //API Call then set token to response
    e.preventDefault();
    console.log(this.state.username);
    console.log(this.state.password);
    const params = new URLSearchParams();
    params.append("username", this.state.username);
    params.append("password", this.state.password);

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
          this.setState({ isLoggedIn: true });
        } else {
          this.setState({ error_message: "Please try again." });
        }
      })
      .catch((err) => {
        console.log("ERROR LOGIN: \n" + err);
        this.setState({
          error_message: "error with logging in, check console",
        });
      });
  }

  registerHandler(e) {
    async function signupRequest(username, password) {
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
    }
    signupRequest(this.state.username, this.state.password);
  }

  render() {
    const input_text_style =
      "px-10 py-2 w-96 rounded-full outline-none border-2 border-primary font-medium text-medium text-grey-400";
    const { isLoggedIn, error_message } = this.state;
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
                    value={this.state.username}
                    onChange={(e) => this.usernameChange(e)}
                    autoComplete="off"
                    placeholder="Enter Username"
                    name="uname"
                    required
                  />
                </div>
                <div>
                  <input
                    className={input_text_style}
                    value={this.state.password}
                    onChange={(e) => this.passwordChange(e)}
                    autoComplete="off"
                    placeholder="Enter Password"
                    name="psw"
                    type="password"
                    required
                  />
                </div>
                <div>
                  <button
                    className="px-10 py-2 rounded-full bg-stone-700 text-red-400 font-medium text-medium"
                    onClick={(e) => this.loginHandler(e)}
                  >
                    Sign In
                  </button>
                </div>
                <div>
                  <button
                    className="px-10 py-2 rounded-full bg-stone-700 text-red-400 font-medium text-medium"
                    onClick={(e) => this.registerHandler(e)}
                  >
                    Register
                  </button>
                </div>
                <div className="text-red-600">{error_message}</div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}

export default Login;
