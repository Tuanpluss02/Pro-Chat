import "./App.css";
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import VideoChatPage from "./pages/VideoChatPage";
import NavBar from "./components/NavBar";
import Profile from "./pages/Profile";

import { Route, BrowserRouter, Switch } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/dashboard" page={Dashboard} />
          <ProtectedRoute path="/favorites" page={Favorites} />
          <ProtectedRoute path="/video/" page={VideoChatPage} />
          <ProtectedRoute path="/profile" page={Profile} />
          <ProtectedRoute path="" page={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
