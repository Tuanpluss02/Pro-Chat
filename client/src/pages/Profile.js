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
    this.onLogout = this.onLogout.bind(this);
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
      timeout: 2000,
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

  onLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  componentDidMount() {
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 5000,
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
        const s3_key = this.state.user?.profile_pic_img_src;
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
        //localStorage.removeItem("token");
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
              <button
                onClick={this.onLogout}
                className="cursor-pointer font-bold font-sans transition-all duration-200 py-[10px] px-[20px] rounded-[100px] bg-[#cfef00] border border-solid border-transparent text-sm hover:bg-[#c4e201] active:scale-95"
              >
                <svg
                  className="ml-[10px] transition-transform duration-300 ease-in-out hover:translate-x-[5px]"
                  fill="#000000"
                  width="34px"
                  height="34px"
                  viewBox="0 0 2.21 2.21"
                  enable-background="new 0 0 52 52"
                >
                  <g>
                    <path d="M0.893 2.061v-0.128c0 -0.034 -0.03 -0.064 -0.064 -0.064h-0.425c-0.034 0 -0.064 -0.03 -0.064 -0.064v-1.403C0.34 0.37 0.37 0.34 0.404 0.34h0.425c0.034 0 0.064 -0.03 0.064 -0.064v-0.128c0 -0.034 -0.03 -0.064 -0.064 -0.064H0.255C0.162 0.085 0.085 0.162 0.085 0.255v1.7c0 0.094 0.077 0.17 0.17 0.17h0.574c0.034 0 0.064 -0.03 0.064 -0.064z" />
                    <path d="M2.108 1.148c0.026 -0.026 0.026 -0.064 0 -0.089L1.534 0.485c-0.026 -0.026 -0.064 -0.026 -0.089 0l-0.089 0.089c-0.026 0.026 -0.026 0.064 0 0.089l0.238 0.238c0.026 0.026 0.009 0.072 -0.03 0.072H0.659c-0.034 0 -0.064 0.026 -0.064 0.059v0.128c0 0.034 0.03 0.068 0.064 0.068h0.901c0.038 0 0.055 0.047 0.03 0.072l-0.238 0.238c-0.026 0.026 -0.026 0.064 0 0.089l0.089 0.089c0.026 0.026 0.064 0.026 0.089 0L2.108 1.148z" />
                  </g>
                </svg>
              </button>
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