import axios from "axios";
import React from "react";
import { get_user_from_token } from "../api/auth";
import { ChatModule } from "../components/ChatModule";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isLoaded: false,
    };
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
      .then((response) => {
        this.setState({ currentUser: response.data.username, isLoaded: true });
      })
      .catch((err) => {
        localStorage.removeItem("token");
        console.log("ERROR FETCHING CURRENT USER\n" + err);
      });
  }

  render() {
    const room =
      window.location.pathname.split("/")[
        window.location.pathname.split("/").length - 1
      ];
    const { isLoaded, currentUser } = this.state;
    if (!isLoaded) {
      return <div className="loader" />;
    } else {
      return (
        <div className="flex flex-col">
          <div className="flex items-center justify-center bg-blue-200 h-16">
            <h1 className="text-3xl font-bold">
              Welcome to the {decodeURIComponent(room)} room
            </h1>
          </div>
          <div className="flex-grow bg-gray-100">
            <ChatModule room_name={room} user={currentUser} />
          </div>
        </div>
      );
    }
  }
}

export default Dashboard;
