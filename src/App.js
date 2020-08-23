import React, { Component } from "react";
import "./App.css";
import Login from "./components/login/login";
import { BrowserRouter as Router, Route } from "react-router-dom";
//import Sidebar from "./components/sidebar/sidebar";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  initialValue = true;
  constructor(props) {
    super(props);
    this.state = {
      isloggedIn: this.initialValue,
    };
  }

  render() {
    const { isloggedIn } = this.state;
    return (
      <Router>
        <div className="app">
          {/* <Login /> */}

          {isloggedIn && <Login />}
          {/* {isloggedIn && <Sidebar />} */}
          {/* <div style={{height:"845px"}}> */}
          <Route path="/login" exact component={Login}></Route>
          {/* <Route path="/dashboard" component={Sidebar}></Route> */}
          {/* </div> */}
        </div>
      </Router>
    );
  }
}

export default App;
