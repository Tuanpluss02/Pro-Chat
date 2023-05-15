import FavoriteIcon from "@material-ui/icons/Favorite";
import axios from "axios";
import React from "react";
import { Redirect } from "react-router-dom";
import { get_user_from_token } from "../api/auth";
import { create_room, favorites, get_room, get_rooms } from "../api/rooms";

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
      timeout: 2000,
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
      timeout: 2000,
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
      timeout: 2000,
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
      timeout: 5000,
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
      timeout: 5000,
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
    const { rooms, roomNav, user } = this.state;
    if (roomNav && roomNav !== "None") {
      return <Redirect push to={"/dashboard/" + roomNav} />;
    } else {
      return (
        <div className="px-5 py-8 max-h-[100vh] overflow-hidden bg-grey-100 text-black text-center">
          <div className="pb-8 text-black">
            <h1>
              Welcome Home:{" "}
              <span className="font-semibold">{this.state.currentUser}</span>{" "}
            </h1>
          </div>
          {/* Divine to 2 section */}
          <div className="flex flex-row w-full">
            {/* One to create room has width = 25% */}
            <div className="w-1/2">
              <div
                className="space-y-4 p-8 rounded-lg bg-white"
              >
                <div
                  className="flex flex-row justify-center items-center"
                >
                  <div>
                    <input
                      id="messageText"
                      className="px-5 py-5 border-2 border-black rounded-md w-full"
                      value={this.state.new_room_name}
                      onChange={this.onInputChange}
                      onKeyUp={(e) => this.onEnterHandler(e)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div>
                    <button
                      className="border-2 border-secondary-light bg-blue-400 rounded-full px-4 py-2 text-medium text-secondary"
                      onClick={(e) => this.startNewRoomClick(e)}
                    >
                      Create Room
                    </button>
                </div>
              </div>
            </div>

            {/* One to display rooms has width = 75% */}
  <div className="w-1/3">
              <div>
                <h1 className="py-1">Existed Rooms</h1>
                <div className="justify-center h-screen overflow-y-scroll"
                >
                  {rooms.map((room, index) => {
                    if (user.favorites.includes(room.room_name)) {
                      return (
                        <div className="border-2 border-secondary-light bg-blue-400 rounded-md px-4 py-2 text-medium text-secondary">
                          <div
                            className="border-2 border-secondary-light bg-blue-400 rounded-md px-4 py-2 text-medium text-secondary"
                            onClick={(e) => this.handleRoomClick(e)}
                            id={room.room_name}
                            key={index}
                          >
                            <div className="flex items-center">
                              <FavoriteIcon />
                              <p className="ml-2">{room.room_name}</p>
                            </div>
                            <button
                              className="text-secondary"
                              onClick={(e) =>
                                this.removeFavorite(e, room.room_name)
                              }
                            >
                              X
                            </button>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="border-2 border-secondary-light bg-blue-400 rounded-full px-4 py-2 text-medium text-secondary">
                          <div
                            className="flex flex-col order-2 border-secondary-light rounded-md bg-blue px-4 py-2"
                            onClick={(e) => this.handleRoomClick(e)}
                            id={room.room_name}
                            key={index}
                          >
                            {room.room_name}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>

            {/* Creat */}
            <div className="w-1/2 ">
              <div className="space-y-4 p-8 rounded-lg bg-white ">
                <div className="flex flex-row justify-center items-center">
                  <div>
                    <input
                      id="messageText"
                      className="px-5 py-5 w-800 font-medium text-md font-primary info-panels input-color-group-one input-color"
                      value={this.state.new_room_name}
                      onChange={this.onInputChange}
                      onKeyUp={(e) => this.onEnterHandler(e)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div>
                  <button
                    className="border-2 border-secondary-light rounded-full px-4 py-2 text-medium text-secondary hover:bg-[#111827] hover:text-white"
                    onClick={(e) => this.startNewRoomClick(e)}
                  >
                    Create Room
                  </button>
                </div>
              </div>
            </div>

            {/* One to display rooms has width = 75% */}
          </div>
        </div>
      );
    }
  }
}

export default Home;
