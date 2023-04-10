import React from "react";
import axios from "axios";
import { create_room, get_rooms, get_room, favorites } from "../api/rooms";
import { get_user_from_token } from "../api/auth";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Chip from "@material-ui/core/Chip";
import {
  Box,
  Stack,
  Row,
  Button,
  defaultTheme,
  fontSizes,
} from "luxor-component-library";
import { Redirect } from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      currentUser: null,
      roomNav: false,
      new_room_name: "",
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onEnterHandler = this.onEnterHandler.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
  }

  addFavorite(e, fav) {
    e.preventDefault();
    let body = {
      favorites: [fav],
      username: this.state.currentUser,
      type: "add",
    };
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .post(favorites, body)
      .then((response) => {
        if (response.data) {
          this.setState({ user: response.data });
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING SINGLE ROOM: \n" + err);
      });
  }

  removeFavorite(e, fav) {
    e.preventDefault();
    let body = {
      favorite: fav,
      username: this.state.currentUser,
      type: "remove",
    };
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .post(favorites, body)
      .then((response) => {
        if (response.data) {
          //console.log("Removed favorite:");
          //console.log(response.data);
          this.setState({ user: { favorites: response.data.favorites } });
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING SINGLE ROOM: \n" + err);
      });
  }

  onInputChange(event) {
    //console.log("Input: " + event.target.value);
    this.setState({ new_room_name: event.target.value });
  }

  onEnterHandler = (event) => {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      event.preventDefault();
      this.startNewRoomClick(event);
    }
  };

  startNewRoomClick(e) {
    e.preventDefault();
    let body = {
      room_name: this.state.new_room_name,
      username: this.state.currentUser,
    };
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .post(create_room, body)
      .then((response) => {
        if (response.data) {
          //console.log(response.data);
          this.setState({ roomNav: response.data.room_name });
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING SINGLE ROOM: \n" + err);
      });
  }

  handleRoomClick(e) {
    e.preventDefault();
    let room_name = e.currentTarget.textContent;
    let token = localStorage.getItem("token");
    const instance = axios.create({
      timeout: 1000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .get(get_room + "/" + room_name)
      .then((response) => {
        if (response.data) {
          //console.log(response.data);
          this.setState({ roomNav: response.data.room_name });
        }
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING SINGLE ROOM: \n" + err);
      });
  }

  componentDidMount() {
    // Setup redux and snag the current user and bring them into state
    // Fetch all rooms (need to setup credentials from current user)
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
      .then((response) => {
        this.setState({
          currentUser: response.data.username,
          user: { ...response.data },
        });
        instance
          .get(get_rooms)
          .then((response) => {
            this.setState({ rooms: response.data });
          })
          .catch((err) => {
            // clear token just in case
            localStorage.removeItem("token");
            console.log("ERROR FETCHING ROOMS: \n" + err);
          });
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING CURRENT USER\n" + err);
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
      border: `2px solid ${defaultTheme.palette.secondary.light}`,
      fontWeight: 400,
      fontSize: fontSizes.medium,
      fontFamily: defaultTheme.typography.primaryFontFamily,
      color: defaultTheme.palette.grey[400],
    };
    const { rooms, roomNav, user } = this.state;
    if (roomNav && roomNav !== "None") {
      return <Redirect push to={"/dashboard/" + roomNav} />;
    } else {
      return (
        <Box
          padding="small"
          paddingY="xlarge"
          style={{
            height: "100vh",
          }}
          backgroundColor={defaultTheme.palette.grey[100]}
          color={defaultTheme.palette.common.black}
          textAlign="center"
        >
          <Stack
            space="large"
            padding="medium"
            roundedCorners
            marginX="xxxlarge"
          >
            <Box padding="medium">
              <h1>Welcome Home: {this.state.currentUser}</h1>
            </Box>
            <Row
              space="none"
              width="50%"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              style={{ margin: "auto" }}
            >
              <Box>
                <input
                  id="messageText"
                  style={input_text_style}
                  value={this.state.new_room_name}
                  onChange={this.onInputChange}
                  onKeyUp={(e) => this.onEnterHandler(e)}
                  autoComplete="off"
                />
              </Box>
              <Box>
                <Button
                  variant="outline"
                  size="medium"
                  color="secondary"
                  text="Create Room"
                  onClick={(e) => this.startNewRoomClick(e)}
                />
              </Box>
            </Row>
            <Box>
              <h1>Rooms</h1>
              <Box
                textAlign="center"
                padding="small"
                style={{ justifyContent: "center", height: "300px" }}
              >
                {rooms.map((room, index) => {
                  if (user.favorites.includes(room.room_name)) {
                    return (
                      <Box margin="small">
                        <Chip
                          icon={FavoriteIcon}
                          onClick={(e) => this.handleRoomClick(e)}
                          label={room.room_name}
                          id={room.room_name}
                          key={index}
                          onDelete={(e) =>
                            this.removeFavorite(e, room.room_name)
                          }
                          deleteIcon={<FavoriteIcon />}
                        />
                      </Box>
                    );
                  } else {
                    return (
                      <Box margin="20px">
                        <Chip
                          icon={FavoriteBorderIcon}
                          onClick={(e) => this.handleRoomClick(e)}
                          label={room.room_name}
                          id={room.room_name}
                          key={index}
                          onDelete={(e) => this.addFavorite(e, room.room_name)}
                          deleteIcon={<FavoriteBorderIcon />}
                        />
                      </Box>
                    );
                  }
                })}
              </Box>
            </Box>
          </Stack>
        </Box>
      );
    }
  }
}

export default Home;
