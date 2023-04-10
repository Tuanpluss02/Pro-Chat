import React from "react";
import {
  Box,
  Stack,
  Row,
  fontSizes,
  defaultTheme,
} from "luxor-component-library";
import { get_user_from_token, upload_profile_pic } from "../api/auth";
import axios from "axios";
import AWS from "aws-sdk";
import Avatar from "@material-ui/core/Avatar";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      new_user: {},
      isLoaded: false,
      s3_bucket: "jm-chat-app",
    };
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onEnterHandler = this.onEnterHandler.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
  }

  onUsernameChange(e) {
    this.setState({ new_user: { username: e.target.value } });
  }

  onPasswordChange(e) {
    console.log(e.target.value);
    this.setState({ new_user: { password: e.target.value } });
  }

  onEnterHandler(e) {
    e.preventDefault();
  }

  imageUpload(e) {
    e.preventDefault();
    console.log("Image Upload");
    const files = e.target.files;
    console.log(files[0]);
    const formData = new FormData();
    formData.append("file", files[0], files[0].name);

    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: {
        //"Content-Type": "multipart/form-data",
        "Content-Type": files[0].type,
        "Access-Control-Allow-Origin": "*",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .post(upload_profile_pic, formData)
      .then((response) => {
        this.setState({ user: response.data, isLoaded: true });
      })
      .catch((err) => {
        console.error("ERROR Uploading Profile Picture");
        console.error(err);
      });
  }

  componentDidMount() {
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .get(get_user_from_token)
      .then(async (response) => {
        this.setState({ user: response.data, isLoaded: true });
        const mimes = {
          jpeg: "data:image/jpeg;base64,",
          png: "data:image/png;base64,",
          jpg: "data:image/jpg;base64,",
        };
        function encode(data) {
          var str = data.reduce(function (a, b) {
            return a + String.fromCharCode(b);
          }, "");
          return btoa(str).replace(/.{76}(?=.)/g, "$&\n");
        }
        const s3_key = this.state.user.profile_pic_img_src;
        const s3_bucket = this.state.s3_bucket;
        let config = require("../config.json");
        AWS.config.update(config);
        AWS.config.credentials.get(
          function () {
            var bucket = new AWS.S3({ params: { Bucket: s3_bucket } });
            bucket.getObject(
              { Key: s3_key },
              function (err, file) {
                if (err) {
                  console.error(err);
                } else {
                  const result = mimes.jpeg + encode(file.Body);
                  this.setState({
                    user: { ...this.state.user, profile_pic_img_src: result },
                  });
                }
              }.bind(this)
            );
          }.bind(this)
        );
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING CURRENT USER and profile pic\n" + err);
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
      border: `2px solid ${defaultTheme.palette.error.main}`,
      fontWeight: 400,
      fontSize: fontSizes.medium,
      fontFamily: defaultTheme.typography.primaryFontFamily,
      color: defaultTheme.palette.grey[400],
    };
    const { isLoaded, user } = this.state;

    if (!isLoaded) {
      return <Box>Loading...</Box>;
    } else {
      return (
        <Box
          margin="none"
          padding="large"
          height="100vh"
          backgroundColor={defaultTheme.palette.grey[200]}
        >
          <Row>
            <Box padding="medium">
              <Stack space="medium" textAlign="center">
                <Box
                  styles={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    styles={{ margin: "0" }}
                    src={user.profile_pic_img_src}
                    alt={user.username}
                  />
                  <h1>{user.username}'s Profile</h1>
                </Box>

                <Box>
                  <input
                    type="file"
                    id="fileUpload"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={this.imageUpload}
                  />
                </Box>
              </Stack>
            </Box>
            <Box>
              <Stack space="medium">
                <Box>
                  <input
                    style={input_text_style}
                    value={this.state.new_user.username}
                    placeholder="New Username"
                    onChange={this.onUsernameChange}
                    autoComplete="off"
                  />
                </Box>
                <Box>
                  <input
                    style={input_text_style}
                    value={this.state.new_user.password}
                    onChange={this.onPasswordChange}
                    onKeyUp={(e) => this.onEnterHandler(e)}
                    type="password"
                    placeholder="New Password"
                    autoComplete="off"
                  />
                </Box>
              </Stack>
            </Box>
          </Row>
        </Box>
      );
    }
  }
}

export default Profile;
