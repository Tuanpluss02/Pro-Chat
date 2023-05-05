import AWS from "aws-sdk";
import axios from "axios";
import React from "react";
import { get_user_from_token, upload_profile_pic } from "../api/auth";

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
    const input_text_style =
      "px-10 py-10 pl-25 pr-25 w-400 rounded-full outline-none border-2 border-red-500 font-medium text-md font-primary text-gray-400";
    const { isLoaded, user } = this.state;

    if (!isLoaded) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="loader" />
        </div>
      );
    } else {
      return (
        <div className="flex">
          <div className="p-4">
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center">
                <img
                  className="m-0"
                  src={user.profile_pic_img_src}
                  alt={user.username}
                />
                <h1>{user.username}'s Profile</h1>
              </div>

              <div>
                <input
                  type="file"
                  id="fileUpload"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={this.imageUpload}
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <input
                className={input_text_style}
                value={this.state.new_user.username}
                placeholder="New Username"
                onChange={this.onUsernameChange}
                autoComplete="off"
              />
            </div>
            <div>
              <input
                className={input_text_style}
                value={this.state.new_user.password}
                onChange={this.onPasswordChange}
                onKeyUp={(e) => this.onEnterHandler(e)}
                type="password"
                placeholder="New Password"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Profile;
