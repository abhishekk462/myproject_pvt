/* eslint-disable no-undef */
import React,{Component} from "react";
import "./login.css";
import "bootstrap/dist/css/bootstrap.css";
import Illustration from "../../Assets/images/Illustration.png";
import Logo from "../../Assets/images/logo.png";
import { Redirect } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import {LOGIN, ACCOUNT_WS} from "../../shared/services/endPoints";
import axios from 'axios';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitted:null,
      username:"",
      password:"",
      showSidebar:false,
      firstName:"",
      lastName:"",
      permissions:[]
    }
    
  }

  validate(email, password) {
    // true means invalid, so our conditions got reversed
    return {
      email: email.length === 0, //true if email is empty
      password: password.length === 0, //true if password is empty
    };
  }

  login = (e) => {
    const {username, password, } = this.state;
    if(this.canBeSubmitted()) {
      e.preventDefault();
      let input = {
        "email": username,
        "password": password
      }
      axios.post(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${LOGIN}`,input)
        .then(res => {
          // if(res.data.message === "Operation completeted successfully.") {
            console.log("res.data.data.response:",res.data.data.response.rolePermissions)          
            sessionStorage.setItem("Token",res.data.data.response.authToken);
            sessionStorage.setItem("FirstName",res.data.data.response.firstName);
            sessionStorage.setItem("LastName",res.data.data.response.lastName);
            sessionStorage.setItem("userId",res.data.data.response.userEntityId);
            if(res.data.data.response.rolePermissions) {
              sessionStorage.setItem("permissions",JSON.stringify(res.data.data.response.rolePermissions));
            } else {
              sessionStorage.setItem("permissions",JSON.stringify(this.state.permissions));
            }
         
            this.setState({isSubmitted:res.data.data.response.authToken,firstName:res.data.data.response.firstName,lastName:res.data.data.response.lastName},
              () => this.renderRedirect());
            // this.props.history.push("/dashboard");
          // } else {
          
          // }
        })
        .catch(() => {
          alert("Invalid Username or Password");
        })
        // this.props.history.push("/dashboard");
      
    } else {
      console.log("Invalid Username or Password");
    }
    
  }

  renderRedirect = () => {
    // if (this.state.isSubmitted) {
    //   return <Redirect to='/dashboard' />
    // }
    // this.props.history.push("/dashboard");
  }

  canBeSubmitted() {
    const {username, password} = this.state;
    const errors = this.validate(username,password);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    return !isDisabled;
  }
  componentDidMount() {
    this.setState({isSubmitted: sessionStorage.getItem("Token")},()=>console.log("isSubmitted...", this.state.isSubmitted));
    window.scrollTo(0, 0);
  }
  render() {
    const {isSubmitted,firstName,lastName,permissions} = this.state;
   
    return (
      <div>
     { isSubmitted === null && <section
        id="login"
        className="col-lg-12 col-md-12 col-sm-12 col-xs-12 login-container backdrop login-mask" style={{width:"90vw"}}
      >
        <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7">
          <div className="">
            <img
              className="illustration"
              src={Illustration}
              alt="illustration"
            ></img>
          </div>
        </div>

        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 login mrgn-left">
          <div className="">
            <img className="login-logo" src={Logo} alt="Logo"></img>
          </div>
          <div className="welcome-to-adda-247 mrgn">
            <span className="welcome">Welcome to Adda247</span>
          </div>
          <form onSubmit={this.login}>
            <div className="forms-input-copy-username">
              <input
                type="text"
                className="forms-input-base1 forms-placeholder1"
                placeholder="Enter User/Email ID"
                onChange={(e) => this.setState({username:e.target.value})}
                required
              ></input>
              <div className="username-label">User/Email ID<span className="login-label">*</span></div>
            </div>
            <div className="forms-input-copy-7 mrgn ">
              <input
                type="password"
                className="forms-input-base-pass forms-placeholder1"
                placeholder="Enter Password"
                onChange={(e) => this.setState({password:e.target.value})}
                required
              ></input>
              {/* <div className="password-label">Password<span className="login-label">*</span></div> */}
            </div>
            <div className="group-5">
              {/* <Link className="link" to="/dashboard"> */}
                <button type="submit" className="login-buttons-label login-btn-mask" onClick={this.login}>
                  Login 
                </button>
              {/* </Link>   */}
            </div>
          </form>
        </div>
      </section>}
      {isSubmitted !== null && <Sidebar firstName={firstName} lastName={lastName} permissions={permissions}/>}
      </div>
    );
  }
}

export default Login;
