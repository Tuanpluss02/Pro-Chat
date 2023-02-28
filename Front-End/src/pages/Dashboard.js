import React from "react";
import { Box, Stack, Row, defaultTheme } from "luxor-component-library";
import { ChatModule } from "../components/ChatModule";
import { get_user_from_token } from "../api/auth";
import axios from "axios";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
    };
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
    const room = window.location.pathname.split("/")[
      window.location.pathname.split("/").length - 1
    ];
    const { isLoaded, currentUser } = this.state;
    if (!isLoaded) {
      return <Box>Loading...</Box>;
    } else {
      return (
        <Box
          margin="none"
          padding="large"
          paddingBottom="none"
          height="100vh"
          backgroundColor={defaultTheme.palette.secondary.light}
        >
          <Row>
            <Stack>
              <Box textAlign="center">
                <h1>Welcome to the {decodeURIComponent(room)} room</h1>
                <ChatModule room_name={room} user={currentUser} />
              </Box>
            </Stack>
          </Row>
        </Box>
      );
    }
  }
}

export default Dashboard;
