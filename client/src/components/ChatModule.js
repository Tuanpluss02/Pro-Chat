import React from "react";
import { Redirect } from "react-router-dom";
import { animateScroll } from "react-scroll";

import axios from "axios";
import { get_user_from_token } from "../api/auth";
import { get_room, put_user_into_room } from "../api/rooms";

import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import Picker from "emoji-picker-react";
import EmojiConverter from "emoji-js";

var jsemoji = new EmojiConverter();
jsemoji.replace_mode = "unified";
jsemoji.allow_native = true;
var client = null;

function checkWebSocket(username, roomname) {
  if (client === null || client.readyState === WebSocket.CLOSED) {
    client = new WebSocket(
      "wss://api-pro-chat.onrender.com/ws/" + roomname + "/" + username
    );
  }
  return client;
}

class ChatModule extends React.Component {
  constructor(props) {
    super(props);
    this.messagesEndRef = React.createRef();
    this.state = {
      room: {},
      isLoaded: false,
      openEmoji: false,
      currentUser: this.props.user,
      message_draft: "",
      messages: [],
    };
    this.checkWebSocketConnection = this.checkWebSocketConnection.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onEnterHandler = this.onEnterHandler.bind(this);
    this.onOpenEmoji = this.onOpenEmoji.bind(this);
    this.onEmojiSelection = this.onEmojiSelection.bind(this);
    this.onOpenVideoChat = this.onOpenVideoChat.bind(this);
    this.emojiRef = React.createRef();
  }
  onInputChange(event) {
    this.setState({ message_draft: event.target.value });
  }
  checkWebSocketConnection() {
    if (client === null || client.readyState === WebSocket.CLOSED) {
      client = new WebSocket(
        "wss://api-pro-chat.onrender.com/ws/" +
          this.state.room_name +
          "/" +
          this.state.currentUser
      );
    }
  }

  onOpenVideoChat() {
    //const { room_name, currentUser } = this.state;
    this.setState({ openVideoChat: true });
  }

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "message-list",
      duration: "1ms",
    });
  }
  componentWillUnmount() {
    //Disconnect websocket (Should update room members in db)
    if (client !== null && client.readyState === WebSocket.OPEN) {
      // Send dismissal message to BE
      var message_obj = {
        content: this.state.currentUser + " has left the chat",
        user: { username: this.state.currentUser },
        room_name: this.state.room_name,
        type: "dismissal",
      };
      console.info("Sending Close Signal to BE");
      if (client !== null) {
        client.send(JSON.stringify(message_obj));
        this.setState({ message_draft: "" }, this.scrollToBottom);
      } else {
        client = checkWebSocket(this.state.currentUser, this.state.room_name);
        client.send(JSON.stringify(message_obj));
        this.setState({ message_draft: "" }, this.scrollToBottom);
      }
      client.close(3000, "Deliberate disconnection");
    }
    document.removeEventListener("click", this.handleDocumentClick);
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
    // Fetch user info and instantiates websocket
    instance
      .get(get_user_from_token)
      .then((res) => {
        this.setState({
          currentUser: res.data.username,
          user: res.data,
        });
        instance
          .put(
            put_user_into_room + "/" + decodeURIComponent(this.props.room_name)
          )
          .then(() => {
            // Fetch room, set messages, users
            instance
              .get(get_room + "/" + decodeURIComponent(this.props.room_name))
              .then((response) => {
                this.setState({ ...response.data });
                console.log("Connecting Websocket");
                client = checkWebSocket(
                  res.data.username,
                  response.data.room_name
                );
                client.onopen = () => {
                  this.setState({ isLoaded: true }, this.scrollToBottom);
                  console.log("WebSocket Client Connected");
                };
                client.onclose = () => {
                  console.log("Websocket Disconnected");
                };
                client.onerror = (err) => {
                  console.error(
                    "Socket encountered error: ",
                    err.message,
                    "Closing socket"
                  );
                  client.close();
                };
                client.onmessage = (event) => {
                  let message = JSON.parse(event.data);
                  if (
                    message.hasOwnProperty("type") &&
                    (message.type === "dismissal" ||
                      message.type === "entrance")
                  ) {
                    this.setState({
                      ...message["new_room_obj"],
                    });
                  } else {
                    let message_body = {
                      content: message["content"],
                      user: message["user"],
                    };
                    let messages_arr = this.state.messages;
                    messages_arr.push(message_body);
                    this.setState(
                      { messages: messages_arr },
                      this.scrollToBottom
                    );
                  }
                };
              })
              .catch((err) => {
                localStorage.removeItem("token");
                console.error("ERROR FETCHING ROOM\n" + err);
              });
          })
          .catch((err) => {
            console.error("Error adding user to room\n" + err);
          });
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.error("ERROR FETCHING CURRENT USER\n" + err);
      });
    document.addEventListener("click", this.handleDocumentClick);
  }
  handleDocumentClick = (event) => {
    if (
      this.emojiRef.current &&
      !this.emojiRef.current.contains(event.target)
    ) {
      this.setState({ openEmoji: false });
    }
  };
  onOpenEmoji() {
    this.setState({ openEmoji: !this.state.openEmoji });
  }
  onEmojiSelection(emoji_code, emoji_data) {
    let e = emoji_data.emoji;
    let _message =
      this.state.message_draft === undefined ? "" : this.state.message_draft;
    this.setState({ message_draft: _message + e });
  }

  onEnterHandler = (event) => {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      event.preventDefault();
      this.onClickHandler(event);
    }
  };

  onClickHandler(event) {
    event.preventDefault();
    var input = this.state.message_draft;
    if (input.length > 0) {
      var message_obj = {
        content: input,
        user: { username: this.state.currentUser },
        room_name: this.state.room_name,
      };
      if (client !== null) {
        client.send(JSON.stringify(message_obj));
        this.setState({ message_draft: "" }, this.scrollToBottom);
      } else {
        client = checkWebSocket(this.state.currentUser, this.state.room_name);
        client.send(JSON.stringify(message_obj));
        this.setState({ message_draft: "" }, this.scrollToBottom);
      }
    }
  }

  // sendMessage(event) {
  //   event.preventDefault();
  //   var input = this.state.message_draft;
  //   if (input.length > 0) {
  //     var message_obj = {
  //       content: input,
  //       user: { username: this.state.currentUser },
  //       room_name: this.state.room_name,
  //     };
  //     if (client !== null) {
  //       client.send(JSON.stringify(message_obj));
  //       this.setState({ message_draft: "" }, this.scrollToBottom);
  //     } else {
  //       client = checkWebSocket(this.state.currentUser, this.state.room_name);
  //       client.send(JSON.stringify(message_obj));
  //       this.setState({ message_draft: "" }, this.scrollToBottom);
  //     }
  //   }
  // };
  getUsernamesFromMessages() {
    const { messages } = this.state;
    const usernamesSet = new Set();

    messages.forEach((message) => {
      usernamesSet.add(message.user.username);
    });

    return Array.from(usernamesSet);
  }

  render() {
    // Emoji
    const {
      isLoaded,
      messages,
      // members,
      openVideoChat,
      room_name,
    } = this.state;
    const usernames = this.getUsernamesFromMessages();
    if (!isLoaded) {
      return <div className="loader" />;
    } else if (openVideoChat) {
      return <Redirect push to={"/video/" + room_name} />;
    } else {
      return (
        <div className="flex w-full h-full border-blue-500">
          <div className="flex-auto w-3/5 h-full mx-auto border-solid border-x rounded-sm border-blue-500">
            <div
              className="p-4 rounded-lg"
              style={{
                overflow: "scroll",
                height: "calc(100vh - 164px)",
                width: "w-full",
              }}
              id="message-list"
            >
              <div className="space-y-4 w-full">
                {messages.map((message, index) => {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection:
                          message.user.username === this.state.currentUser
                            ? "row"
                            : "row-reverse",
                        float:
                          message.user.username === this.state.currentUser
                            ? "right"
                            : "left",
                        textAlign:
                          message.user.username === this.state.currentUser
                            ? "right"
                            : "left",
                        marginLeft:
                          message.user.username === this.state.currentUser
                            ? "500px"
                            : "auto",
                        marginRight:
                          message.user.username === this.state.currentUser
                            ? "auto"
                            : "500px",
                      }}
                    >
                      <div
                        className={`flex flex-col p-2 rounded-lg ${
                          message.user.username === this.state.currentUser
                            ? "bg-blue-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        <div
                          padding="12px"
                          style={{
                            float:
                              message.user.username === this.state.currentUser
                                ? "right"
                                : "left",
                          }}
                          textAlign={
                            message.user.username === this.state.currentUser
                              ? "right"
                              : "left"
                          }
                        >
                          <div className="text-base font-bold text-white-400">
                            {message.user.username}
                          </div>
                          <div
                            className={`rounded-lg text-base text-white-300`}
                            textAlign={
                              message.user.username === this.state.currentUser
                                ? "right"
                                : "left"
                            }
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center p-4 rounded-md">
              <input
                placeholder="Type a message..."
                required=""
                type="text"
                name="text"
                className="px-5 py-5 pl-10 pr-10 mr-20 w-2/3 rounded-md font-medium text-md font-primary info-panels input-color-group-one input-color"
                value={this.state.message_draft}
                onChange={(event) =>
                  this.setState({ message_draft: event.target.value })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    this.onEnterHandler(event);
                  }
                }}
              />
              <div ref={this.emojiRef} className="absolute">
                <button
                  className="h-12 w-12"
                  onClick={() => {
                    this.onOpenEmoji();
                  }}
                >
                  <SentimentVerySatisfiedIcon />
                </button>
                {this.state.openEmoji && (
                  <Picker
                    onEmojiClick={this.onEmojiSelection}
                    disableAutoFocus={false}
                    disableSearchBar={false}
                    native
                    pickerStyle={{
                      position: "absolute",
                      bottom: "80px",
                      left: "30px",
                    }}
                  />
                )}
              </div>
              <send
                className="font-medium h-12"
                onClick={(event) => this.onClickHandler(event)}
              >
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg height="24" width="24" viewBox="0 0 24 24">
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </div>
                <span>SEND</span>
              </send>
            </div>
          </div>
          <div className="h-[calc(100vh-164px)] flex-auto w-2/5 border-solid border-x rounded-sm border-blue-500">
            <div className="flex-col justify-center items-center h-full overflow-hidden">
              <div className="h-full overflow-y-auto">
                {usernames.map((username, index) => (
                  <div
                    className="flex border rounded-xl m-6 border-blue-500 p-4 justify-start items-center"
                    key={index}
                  >
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 1.44 1.44"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h1.44v1.44H0z" fill="none" />
                      <g id="Shopicon">
                        <path d="M0.938 0.766C1.024 0.7 1.08 0.597 1.08 0.48c0 -0.199 -0.161 -0.36 -0.36 -0.36S0.36 0.281 0.36 0.48c0 0.117 0.056 0.22 0.142 0.286C0.295 0.856 0.15 1.07 0.15 1.32h1.14c0 -0.25 -0.145 -0.464 -0.352 -0.554zM0.48 0.48c0 -0.132 0.108 -0.24 0.24 -0.24s0.24 0.108 0.24 0.24 -0.108 0.24 -0.24 0.24 -0.24 -0.108 -0.24 -0.24zm0.24 0.36c0.209 0 0.386 0.153 0.436 0.36H0.284C0.334 0.993 0.511 0.84 0.72 0.84z" />
                      </g>
                    </svg>
                    <div className="ml-2">{username}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
export { ChatModule };
