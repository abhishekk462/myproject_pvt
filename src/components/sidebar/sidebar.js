/* eslint-disable no-undef */
import React, { Component } from "react";
import "./sidebar.css";
import Logo from "../../Assets/images/logo_small.png";
import Icon1 from "../../Assets/images/icon1.png";
import Tags from "../../Assets/images/icn_tags.png";
import Question from "../../Assets/images/icn_questions.png";
import Contents from "../../Assets/images/icn_content.png";
import Exam from "../../Assets/images/icn_exam.png";
import Tests from "../../Assets/images/icn_tests.png";
import Pack from "../../Assets/images/icn_pckg.png";
import Order from "../../Assets/images/icn_order.png";
import User from "../../Assets/images/icn_user.png";
import { Route, Switch, Link } from "react-router-dom";
import Dashboard from "../dashboard/dashboard";
import TagsMaster from "../tagsMaster/tagsMaster";
import TagMasterDetails from "../tagMasterDetails/tagMasterDetails";
import QuestionsList from "../questions/questionsList";
import AddQuestion from "../questions/addQuestion/addQuestion";
import UpdateQuestion from "../questions/addQuestion/editorDuplicateQuestion";
import AddTagMaster from "../tagsMaster/addTagMaster/addTagMaster";
import UserList from "../manageUser/userList";
import AddUser from "../manageUser/addUser/addUser";
import RolesList from "../manageUser/manageRoles/rolesList";
import AddRole from "../manageUser/manageRoles/addRole/createRole";
import ContentList from "../otherContent/contentList";
import AddContent from "../otherContent/addContent/addContent";
import UpdateContent from "../otherContent/addContent/updateContent";
import PackageList from "../packages/packageList";
import AddPackage from "../packages/addPackage/addPackage";
import ExamsList from "../exams/examsList";
import AddExam from "../exams/addExam/addExam";
import OrderList from "../order/orderList";
import AddOrder from "../order/addOrder/addOrder";
import ActiveTag from "../../Assets/images/Upload_Copy.png";
import ActiveQuestion from "../../Assets/images/Upload_Copy.png";
import ActiveContent from "../../Assets/images/Edit_Copy.png";
import ActiveExam from "../../Assets/images/activeExam.png";
import ActiveTest from "../../Assets/images/activeTest.png";
import ActivePack from "../../Assets/images/activePack.png";
import ActiveOrder from "../../Assets/images/activeOrder.png";
import ActiveUser from "../../Assets/images/activeUser.png";
// import ActiveIcon from "../../Assets/images/activeIcon.png";
import { LOGOUT, ACCOUNT_WS } from "../../shared/services/endPoints";
import axios from "axios";
import TestsList from "../testsCreator/TestsList";

class Sidebar extends Component {
  headers;
  token;
  constructor(props) {
    super(props);
    this.state={
      isActive:[],
      sidebarItems:[],
      name:"",
      initial:""
    }
    
  }

  sidebarItems = [
    {
      id: 1,
      label: "Dashboard",
      path: "/dashboard",
      icon: Icon1,
      isActive: false,
      activeIcon: Icon1,
    },
    {
      id: 2,
      label: "Tag Master",
      path: "/tagMaster",
      icon: Tags,
      isActive: false,
      activeIcon: ActiveTag,
    },
    {
      id: 3,
      label: "Questions",
      path: "/questions",
      icon: Question,
      isActive: false,
      activeIcon: Question,
    },
    {
      id: 4,
      label: "Other Content",
      path: "/content",
      icon: Contents,
      isActive: false,
      activeIcon: ActiveContent,
    },
    {
      id: 5,
      label: "Exams",
      path: "/exams",
      icon: Exam,
      isActive: false,
      activeIcon: ActiveExam,
    },
    {
      id: 6,
      label: "Tests",
      path: "/tests",
      icon: Tests,
      isActive: false,
      activeIcon: ActiveTest,
    },
    {
      id: 7,
      label: "Packages",
      path: "/packages",
      icon: Pack,
      isActive: false,
      activeIcon: ActivePack,
    },
    {
      id: 8,
      label: "Orders",
      path: "/orders",
      icon: Order,
      isActive: false,
      activeIcon: ActiveOrder,
    },
    {
      id: 9,
      label: "Manage Users",
      path: "/manageUsers",
      icon: User,
      isActive: false,
      activeIcon: ActiveUser,
    },
  ];

  handleClick = (k) => {
    let sidebarItems = this.state.sidebarItems;
    for(let i=0;i<sidebarItems.length;i++) {
        if(i === k ) {
          sidebarItems[i].isActive = true;
        } else {
          sidebarItems[i].isActive = false;
        }
    }
    this.setState({sidebarItems});
    // this.props.history.push(path);
  };

  logout = () => {
    // this.props.history.push('/login');
    this.token = sessionStorage.getItem("Token");
    this.headers = {
      Authorization: "Bearer " + "this.token",
      "content-type": "application/json",
    };
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${LOGOUT}`,
        {},
        { headers: this.headers }
      )
      .then((res) => {
        console.log("logout:", res, window.location);
        sessionStorage.clear("Taken");
        sessionStorage.clear()
        window.location.reload();
    }).catch((error) => {
      window.location.reload();

      sessionStorage.clear("Taken");
      sessionStorage.clear()
      window.scroll(0,0);
    })
  }

  getPermissions = (permissions) => {
    let sidebarItems = this.state.sidebarItems;
    permissions.sort((a, b) => {return a.rolePermissionEntityId-b.rolePermissionEntityId});
    permissions.forEach((permission,k) => {
      this.sidebarItems.forEach((item,i) => {
        
        if(permission.pageName === item.label) {
          // alert(item.label+permission.pageName)
          sidebarItems.push(item);
        }
      });

    })
    
    this.setState({sidebarItems})
  }

  componentDidMount() {
    let fname = this.props.firstName?this.props.firstName:sessionStorage.getItem("FirstName");
    let lastName = this.props.lastName?this.props.lastName:sessionStorage.getItem("LastName");
    let initial = fname.substring(0,1).concat(lastName.substring(0,1));
    let permissions = this.props.permissions.length>0?this.props.permissions:JSON.parse(sessionStorage.getItem("permissions"));
    this.getPermissions(permissions);
    console.log("permissions:",permissions,this.props.permissions)
    this.setState({name:fname,initial});
  }

  render() {
    const { sidebarItems, name, initial } = this.state;
    return (
      <div className="wrapper">
        <div className="sidebar">
          <div className="logo">
            <img className="logo-small" src={Logo} alt=""></img>
          </div>
          <ul className="menu ul">
            {sidebarItems.map((item, i) => {
              return (
                <Link className="a text-style" to={item.path} key={item.id}>
                  <li
                    className={sidebarItems[i].isActive ? "active li" : "li"}
                    key={item.id}
                    onClick={() => this.handleClick(i)}
                  >
                    <img
                      src={
                        sidebarItems[i].isActive ? item.activeIcon : item.icon
                      }
                      alt=""
                    ></img>
                    <span className="mrgn-lft">{item.label}</span>
                  </li>
                </Link>
              );
            })}
          </ul>
          <div className="top-bar">
            <div className="oval">
              <span className="top-bar-text">{initial}</span>
              <span className="username">{name}</span>
            </div>
            <div className="mgn-tp" onClick={() => this.logout()}>
              <Link to="/">
                <button className="mask-btn logout">Logout</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="main-content">
          <Switch>
            <Route path="/dashboard" exact component={Dashboard}></Route>
            <Route path="/tagMaster" exact component={TagsMaster}></Route>
            <Route path="/questions" exact component={QuestionsList}></Route>
            <Route path="/content" exact component={ContentList}></Route>
            <Route path="/exams" exact component={ExamsList}></Route>
            <Route path="/packages" exact component={PackageList}></Route>
            <Route path="/orders" exact component={OrderList}></Route>
            <Route path="/manageUsers" exact component={UserList}></Route>
            <Route
              path="/tagMasterDetails"
              exact
              component={TagMasterDetails}
            ></Route>
            <Route path="/addQuestion" exact component={AddQuestion}></Route>
            <Route path="/addTagMaster" exact component={AddTagMaster}></Route>
            <Route
              path="/updateQuestion"
              exact
              component={UpdateQuestion}
            ></Route>
            <Route path="/addContent" exact component={AddContent}></Route>
            <Route
              path="/updateContent"
              exact
              component={UpdateContent}
            ></Route>
            <Route path="/addUser" exact component={AddUser}></Route>
            <Route path="/manageRoles" exact component={RolesList}></Route>
            <Route path="/addRole" exact component={AddRole}></Route>
            <Route path="/addPackage" exact component={AddPackage}></Route>
            <Route path="/addOrder" exact component={AddOrder}></Route> 
            <Route path="/addExam" exact component={AddExam}></Route>
            <Route path="/tests" exact component={TestsList}></Route>
          </Switch>
        </div>
      </div>
    );
  }
}
export default Sidebar;
