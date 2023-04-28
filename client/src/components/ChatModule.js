import EmojiConverter from "emoji-js";
import React from "react";
import { Redirect } from "react-router-dom";
import { animateScroll } from "react-scroll";

import axios from "axios";
import { get_user_from_token } from "../api/auth";
import { get_room, put_user_into_room } from "../api/rooms";

var jsemoji = new EmojiConverter();
jsemoji.replace_mode = "unified";
jsemoji.allow_native = true;
var client = null;

function checkWebSocket(username, roomname) {
  if (client === null || client.readyState === WebSocket.CLOSED) {
    client = new WebSocket(
      "ws://localhost:8000/ws/" + roomname + "/" + username
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
  }
  onInputChange(event) {
    this.setState({ message_draft: event.target.value });
  }
  checkWebSocketConnection() {
    if (client === null || client.readyState === WebSocket.CLOSED) {
      client = new WebSocket(
        "ws://localhost:8000/ws/" +
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
      client.close(1000, "Deliberate disconnection");
    }
  }
  onOpenEmoji() {
    let currentState = this.state.openEmoji;
    this.setState({ openEmoji: !currentState });
  }
  onEmojiSelection(emoji_code, emoji_data) {
    let e = emoji_data.emoji;
    let _message =
      this.state.message_draft === undefined ? "" : this.state.message_draft;
    this.setState({ message_draft: _message + e });
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


  render() {
    const {
      isLoaded,
      messages,
      // members,
      openVideoChat,
      room_name,
    } = this.state;
    if (!isLoaded) {
      return (
        <div className="m-8 p-4 w-600 h-600 rounded-lg bg-secondary-light">
          <h1>Loading...</h1>
        </div>
      );
    } else if (openVideoChat) {
      return <Redirect push to={"/video/" + room_name} />;
    } else {
      return (
        <div className="w-2/3">
          <div className="w-800px mx-auto">
            <div
              className="p-4 rounded-lg"
              style={{
                overflow: "scroll",
                height: "600px",
                width: "800px",
              }}
              id="message-list"
            >
              <div className="space-y-4 w-800px">
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
                            ? "400px"
                            : "auto",
                        marginRight:
                          message.user.username === this.state.currentUser
                            ? "auto"
                            : "400px",
                      }}
                    >
                      <div
                        className={`mx-8 p-2 rounded-lg ${message.user.username === this.state.currentUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-500 text-white"
                          }`}
                      >
                        {message.content}
                      </div>
                      <div
                        padding="10px"
                        style = {{
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
                        {message.user.username}
                    </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div 
              className="p-4 rounded-lg"
            >
              <input
                type="text"
                className = "px-5 py-5 pl-10 pr-10 mr-20 w-1/2 rounded-lg outline-none border-2 border-blue-500 font-medium text-md font-primary text-gray-400"
                placeholder="Type a message..."
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
              <button
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium"
                onClick={(event) => this.onClickHandler(event)
                }
              >
                Send
              </button>
            </div>
          </div>
        </div>
      );
    }
  }


}
export { ChatModule };