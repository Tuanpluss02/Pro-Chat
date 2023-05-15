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
          <div className="flex">
            <div className="flex items-center justify-center border-solid border border-blue-500 rounded-sm bg-blue-200 w-3/5 h-16">
              <h1 className="text-3xl font-bold">{decodeURIComponent(room)}</h1>
            </div>
            <div className="flex items-center justify-center border-solid border border-blue-500 rounded-sm bg-blue-200 w-2/5 h-16">
              <h1 className="text-3xl font-bold">Members</h1>
            </div>
          </div>
          <div className="flex-col bg-gray-100">
            <ChatModule className="w-3/5" room_name={room} user={currentUser} />
          </div>
        </div>
      );      
    }
  }
}

export default Dashboard;
