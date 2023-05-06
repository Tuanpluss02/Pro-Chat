import "./App.css";
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/dashboard" page={Dashboard} />

          <ProtectedRoute path="/profile" page={Profile} />
          <ProtectedRoute path="" page={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
// // day la FE

