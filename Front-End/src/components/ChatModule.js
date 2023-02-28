import React from "react";
import { animateScroll } from "react-scroll";
import EmojiPicker from "emoji-picker-react";
import EmojiConverter from "emoji-js";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import VideoCallIcon from "@material-ui/icons/VideoCall";
import { Redirect } from "react-router-dom";

import {
  Box,
  Button,
  Row,
  Stack,
  defaultTheme,
  fontSizes,
} from "luxor-component-library";
import { get_room, put_user_into_room } from "../api/rooms";
import { get_user_from_token } from "../api/auth";
import axios from "axios";

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
      timeout: 1000,
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

  render() {
    const input_text_style = {
      padding: "10px",
      paddingLeft: "25px",
      paddingRight: "25px",
      width: "600px",
      borderRadius: "3em",
      outline: "none",
      border: `2px solid ${defaultTheme.palette.error.main}`,
      fontWeight: 400,
      fontSize: fontSizes.medium,
      fontFamily: defaultTheme.typography.primaryFontFamily,
      color: defaultTheme.palette.grey[400],
    };
    const {
      isLoaded,
      messages,
      members,
      openVideoChat,
      room_name,
    } = this.state;
    if (!isLoaded) {
      return (
        <Box
          margin="xlarge"
          padding="large"
          width="600px"
          height="600px"
          roundedCorners
          backgroundColor={defaultTheme.palette.secondary.light}
        >
          <h1>Loading...</h1>
        </Box>
      );
    } else if (openVideoChat) {
      return <Redirect push to={"/video/" + room_name} />;
    } else {
      return (
        <Row width="100%">
          <Stack width="800px">
            <Box
              padding="medium"
              roundedCorners
              style={{
                overflow: "scroll",
                height: "600px",
                width: "800px",
              }}
              id="message-list"
            >
              <Stack space="medium" width="800px">
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
                      <Box
                        marginX="large"
                        padding="small"
                        backgroundColor={
                          message.user.username === this.state.currentUser
                            ? defaultTheme.palette.error.main
                            : defaultTheme.palette.primary.main
                        }
                        color={
                          message.user.username === this.state.currentUser
                            ? defaultTheme.palette.common.white
                            : defaultTheme.palette.common.white
                        }
                        roundedCorners
                        marginBottom="small"
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
                        key={{ index }}
                      >
                        {message.content}
                      </Box>
                      <Box
                        padding="small"
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
                        {message.user.username}
                      </Box>
                    </div>
                  );
                })}
              </Stack>
            </Box>
            <Row width="800px" padding="medium" space="small">
              <Box padding="small">
                <input
                  id="messageText"
                  style={input_text_style}
                  value={this.state.message_draft}
                  onChange={this.onInputChange}
                  onFocus={this.checkWebSocketConnection}
                  onKeyUp={(e) => this.onEnterHandler(e)}
                  autoComplete="off"
                />
              </Box>
              <Row
                paddingY="small"
                width="400px"
                style={{ position: "relative" }}
              >
                <Box
                  style={{
                    display: this.state.openEmoji ? "block" : "none",
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    marginBottom: "70px",
                  }}
                >
                  <EmojiPicker
                    preload
                    disableDiversityPicker
                    onEmojiClick={this.onEmojiSelection}
                  />
                </Box>
                <Button
                  variant="outline"
                  color="error"
                  size="small"
                  style={{
                    marginRight: "10px",
                    border: `2px solid ${defaultTheme.palette.error.main}`,
                  }}
                  onClick={this.onOpenEmoji}
                  text={<SentimentVerySatisfiedIcon />}
                />
                <Button
                  variant="outline"
                  color="error"
                  size="small"
                  style={{
                    marginRight: "10px",
                    border: `2px solid ${defaultTheme.palette.error.main}`,
                  }}
                  onClick={this.onOpenVideoChat}
                  text={<VideoCallIcon />}
                />
                <Button
                  variant="outline"
                  color="primary"
                  size="medium"
                  text="Send"
                  onClick={this.onClickHandler}
                />
              </Row>
            </Row>
          </Stack>
          <Box
            padding="medium"
            roundedCorners
            style={{
              overflow: "scroll",
              height: "600px",
              width: "800px",
            }}
          >
            <Stack space="small">
              <Box>
                <h1>Room Members</h1>
              </Box>
              {members.map((member, index) => {
                return (
                  <Box
                    padding="small"
                    color={defaultTheme.palette.common.black}
                    marginBottom="small"
                    textAlign="center"
                    key={{ index }}
                    roundedCorners
                  >
                    {member.username}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Row>
      );
    }
  }
}
export { ChatModule };
