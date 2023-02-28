import React from "react";
import { Box, Button, defaultTheme } from "luxor-component-library";
import { twilio } from "../api/auth";
import { Redirect } from "react-router-dom";
import { get_room, put_user_into_room } from "../api/rooms";
import { get_user_from_token } from "../api/auth";
import Participant from "./Participant";

import axios from "axios";
const { connect } = require("twilio-video");

class VideoChatModule extends React.Component {
  constructor(props) {
    super(props);
    this.messagesEndRef = React.createRef();
    this.state = {
      isLoaded: false,
      redirectToDash: false,
      openEmoji: false,
      currentUser: this.props.user,
      identity: "",
      room: null,
    };
    this.leaveRoom = this.leaveRoom.bind(this);
    this.returnToLobby = this.returnToLobby.bind(this);
    this.addParticipant = this.addParticipant.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
  }

  leaveRoom() {
    try {
      this.state.room.disconnect();
    } catch (e) {
      console.error(e);
    }
    this.returnToLobby();
  }

  addParticipant(participant) {
    console.log(`${participant.identity} has joined the room.`);

    this.setState({
      remoteParticipants: [...this.state.remoteParticipants, participant],
    });
  }

  removeParticipant(participant) {
    console.log(`${participant.identity} has left the room`);

    this.setState({
      remoteParticipants: this.state.remoteParticipants.filter(
        (p) => p.identity !== participant.identity
      ),
    });
  }

  async joinRoom() {
    try {
      // Get access token
      let token = localStorage.getItem("token");
      const instance = axios.create({
        timeout: 1000,
        headers: {
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await instance.get(twilio + "/" + this.state.room_name);
      const data = response.data;
      console.log(data);

      // Join Room
      const room = await connect(data.accessToken, {
        name: this.state.room_name,
        audio: true,
        video: true,
      });
      this.setState({
        remoteParticipants: Array.from(room.participants.values()),
      });
      this.setState({ room: room, isLoaded: true });
      this.state.room.on("participantConnected", (participant) =>
        this.addParticipant(participant)
      );
      this.state.room.on("participantDisconnected", (participant) =>
        this.removeParticipant(participant)
      );
      this.state.room.on("disconnected", (room) => {
        // Detach the local media elements
        room.localParticipant.tracks.forEach((publication) => {
          const attachedElements = publication.track.detach();
          attachedElements.forEach((element) => element.remove());
        });
      });
      window.addEventListener("beforeunload", this.leaveRoom);
    } catch (err) {
      console.log(err);
    }
  }

  returnToLobby() {
    this.setState({ room: null, redirectToDash: true });
  }

  componentWillUnmount() {
    this.leaveRoom();
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
          identity: res.data.username,
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
              .then((room) => {
                this.setState({ ...room.data });
                this.joinRoom();
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

  render() {
    const { isLoaded, redirectToDash, room_name } = this.state;
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
    } else if (redirectToDash && room_name !== null) {
      return <Redirect push to={"/dashboard/" + room_name} />;
    } else {
      return (
        <Box
          padding="medium"
          roundedCorners
          style={{
            overflow: "scroll",
            height: "600px",
            width: "800px",
          }}
        >
          <div className="room">
            <div className="participants">
              <Participant
                key={this.state.room.localParticipant.identity}
                localParticipant="true"
                participant={this.state.room.localParticipant}
              />
              {this.state.remoteParticipants.map((participant) => (
                <Participant
                  key={participant.identity}
                  participant={participant}
                />
              ))}
            </div>
            <Button
              variant="solid"
              color={defaultTheme.palette.error.main}
              size="large"
              text="Leave Room"
              id="leaveRoom"
              onClick={this.leaveRoom}
            />
          </div>
        </Box>
      );
    }
  }
}
export { VideoChatModule };
