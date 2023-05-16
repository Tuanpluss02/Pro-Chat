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
        <div className="py-8 pt-0 max-h-[100vh] overflow-hidden bg-grey-100 text-black text-center">
          <div className="p-4 bg-[#1f3460] text-white">
            Welcome Home:{" "}
            <span className="font-semibold">{this.state.currentUser}</span>
          </div>
          <div className="flex flex-row w-full">
            <div className="w-1/3 max-h-[100vh] py-8 border-l border-r bg-gray-900 border-gray-700">
              <div>
                <h2 className="px-5 text-lg font-medium text-white">
                  Existed Room
                </h2>
                <div className="h-[calc(100vh-117px)] overflow-y-auto">
                  {rooms.map((room, index) => {
                    const isFavorite = user.favorites.includes(room.room_name);
                    return (
                      <div
                        className="border border-slate-500 rounded-sm text-gray-200 flex items-center w-full px-4 py-4 transition-colors duration-200 hover:bg-gray-800 gap-x-2 focus:outline-none"
                        key={index}
                      >
                        <div
                          className="py-4 text-sm font-medium capitalize text-white"
                          onClick={(e) => this.handleRoomClick(e)}
                          id={room.room_name}
                        >
                          {isFavorite && (
                            <div className="flex items-center text-sm font-medium capitalize text-white">
                              <FavoriteIcon />
                              <p className="ml-2">{room.room_name}</p>
                            </div>
                          )}
                          {!isFavorite && <p>{room.room_name}</p>}
                          {isFavorite && (
                            <button
                              className="text-secondary"
                              onClick={(e) =>
                                this.removeFavorite(e, room.room_name)
                              }
                            >
                              X
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="w-2/3">
              <div className="space-y-4 p-8 rounded-lg bg-white">
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
          </div>
        </div>
      );
    }
  }
}

export default Home;
