import React from "react";
import { Redirect } from "react-router-dom";
import { login, register } from "../api/auth";
import {
  Box,
  Stack,
  Row,
  Button,
  defaultTheme,
  fontSizes,
} from "luxor-component-library";
import axios from "axios";

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
    //API Call then set token to response
    e.preventDefault();
    fetch(register, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response.access_token !== undefined) {
          localStorage.setItem("token", response.access_token);
          this.setState({ isLoggedIn: true });
        } else {
          this.setState({ error_message: "Please try again." });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const input_text_style = {
      padding: "10px",
      paddingLeft: "25px",
      paddingRight: "25px",
      width: "400px",
      borderRadius: "3em",
      outline: "none",
      border: `2px solid ${defaultTheme.palette.primary.main}`,
      fontWeight: 400,
      fontSize: fontSizes.medium,
      fontFamily: defaultTheme.typography.primaryFontFamily,
      color: defaultTheme.palette.grey[400],
    };
    const { isLoggedIn, error_message } = this.state;
    if (isLoggedIn) {
      return <Redirect push to="" />;
    } else {
      return (
        <Box
          padding="large"
          height="720px"
          backgroundColor={defaultTheme.palette.grey[100]}
          textAlign="center"
          style={{
            height: "100vh",
          }}
        >
          <Stack>
            <Box
              style={{ fontSize: "2rem" }}
              color={defaultTheme.palette.secondary.light}
              paddingBottom="large"
            >
              <span>
                <h1 style={{ color: defaultTheme.palette.secondary.light }}>
                  Minimal
                </h1>
                <h1 style={{ color: defaultTheme.palette.primary.main }}>
                  Chat.
                </h1>
              </span>
            </Box>
            <Stack space="medium" padding="medium">
              <Box>
                <input
                  style={input_text_style}
                  value={this.state.username}
                  onChange={(e) => this.usernameChange(e)}
                  autoComplete="off"
                  placeholder="Enter Username"
                  name="uname"
                  required
                />
              </Box>
              <Box>
                <input
                  style={input_text_style}
                  value={this.state.password}
                  onChange={(e) => this.passwordChange(e)}
                  autoComplete="off"
                  placeholder="Enter Password"
                  name="psw"
                  required
                  type="password"
                />
              </Box>
            </Stack>
            <Row>
              <Box>
                <Button
                  variant="solid"
                  color="primary"
                  size="medium"
                  text="Login"
                  onClick={this.loginHandler}
                />
              </Box>
              <Box>
                <Button
                  variant="outline"
                  color="primary"
                  size="medium"
                  text="Register"
                  onClick={this.registerHandler}
                />
              </Box>
            </Row>
            <Box color="red" padding="small">
              {error_message !== "" && <p>{error_message}</p>}
            </Box>
          </Stack>
        </Box>
      );
    }
  }
}

export default Login;
