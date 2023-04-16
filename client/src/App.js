import "./App.css";
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/dashboard" page={Dashboard} />
          <ProtectedRoute path="/favorites" page={Favorites} />
          <ProtectedRoute path="/profile" page={Profile} />
          <ProtectedRoute path="" page={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
// // day la FE
