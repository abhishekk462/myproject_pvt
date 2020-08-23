import React,{Component} from "react";
import "./role.css";
import { Link } from "react-router-dom";
import Delete from "../../../../Assets/images/icn_delete.png";
import Edit from "../../../../Assets/images/icn_edit.png";
import Editor from "../../../../shared/utils/rte/richTextEditor";
import {ACCOUNT_WS,UPDATE_ROLE,ROLE_DETAILS,CREATE_ROLE} from "../../../../shared/services/endPoints";
import axios from 'axios';

export default class AddRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            functionalityData:[],
            function:"",
            permission:"",
            roleData : {
                "roleName": "",
                "description": "",
                "rolePermissions": [
                ]
            },
            isDisable:this.props.location.RoleProps?false:true
        }
    }
    // functionalities = [
    //     "Content Overview","Translate Content","Verify Content","Publish Content","View/Edit Profile","Generate Count/Reports","View Tags","Add/Edit Questions",
    //     "View Questions","Add/Edit Questions","Verify Questions","Translate Questions","Verify Translated Questions",
    //     "View Content","Add/Edit Content","Verify Content","Translate Content","Verify Translated Content","View Exams","Add/Edit Exams",
    //     "View Tests","Add/Edit Tests",
    //     "View Packages","Add/Edit Packages","View Orders","Add/Edit Orders","View Users","Add/Edit Users","Add/Edit Roles"
    // ];
    functionalities = ["Tag Master","Questions","Other Content","Exams", "Tests","Packages","Orders","Manage Users","Dashboard"];
    getRoleDetails = () => {
        let requestBody={
            "roleEntityId": this.props.location.RoleProps.roleEntityId
        },details = this.state.roleData;
       
        let url = `${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${ROLE_DETAILS}`;
        axios.post(url,requestBody, {"headers":this.headers})
        .then(res => {
            console.log("user details data:", res)
            details.roleName= res.data.data.response.roleName;
            details.roleEntityId = this.props.location.RoleProps.roleEntityId;
            details.description = res.data.data.response.description;
            details.rolePermissions = res.data.data.response.rolePermissions;
            this.setState({roleData:details});
        })
    }
    goBack = () => {
        this.props.history.push("/manageRoles")
    }

    onChangeName = (e) => {
        let details = this.state.roleData;
        details.roleName = e.target.value;
        this.setState({roleData:details});
    }

    handleEditorData = (data) => {
        let details = this.state.roleData;
        details.description = data;
        this.setState({roleData:details});
    }

    addPermissionHandler = (e) => {
        e.preventDefault();
        let functionalityData = this.state.functionalityData;
        let details = this.state.roleData;
        functionalityData.push({"label":this.state.function});
        details.rolePermissions.push({"pageName":this.state.function,"pagePermission":this.state.permission})
        this.setState({functionalityData,roleData:details});
    }

    addRoleHandler = (e) => {
        e.preventDefault();
       
        let endpoint = this.props.location.RoleProps === undefined?CREATE_ROLE:UPDATE_ROLE;
        let url = `${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${endpoint}`;
        axios.post(url,this.state.roleData, {"headers":this.headers})
        .then(res => {
            if(res.data.status === 1001) {
                alert(res.data.message)
            } else {
                console.log("user details data:", res);
                this.goBack();
            }
        }).catch((error) => {
            if(error.response.status === 403) {
                alert("Access Denied.");
                this.goBack();
            } else {
                alert("Something went wrong,Please try again...");
            }
        })
    }

    token="";headers;
    componentDidMount() {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        if(this.props.location.RoleProps !== undefined) {
            this.getRoleDetails();
        }
    }
    removeFunctionality = (i) => {
        let functionalityData = this.state.functionalityData;
        let details = this.state.roleData;
        if( this.props.location.RoleProps === undefined) {
            functionalityData.splice(i,1)
            details.rolePermissions.splice(i,1)
        } else {
            document.getElementById("Func"+i).style.display = "none";
            // functionalityData[i].action = "DELETE";
            // details.rolePermissions[i].action = "DELETE";
            Object.assign(details.rolePermissions[i], {"action": "DELETE"});
        }
        this.setState({functionalityData,roleData:details})
    }

    render() {
        const {functionalityData,roleData,isDisable} = this.state;
        return(
            <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 main-section pad0">                 
                <div className="user-add-top-section">               
                    <div className="user-top-bar title-mrgn">
                        <span className="add-user-title"><Link className="a" to="/manageRoles">Manage Roles</Link></span><span className="exam-ma">{this.props.location.RoleProps !== undefined?"/Update Role":"/Add New Role"}</span>
                        <div className="user-top">
                            <span className="add-new-user">{this.props.location.RoleProps !== undefined?"Update Role":"Add New Role"}</span>
                            <button className="user-cancel-label user-cancel-mask" onClick={() => this.goBack()}>Cancel</button>
                            <button className="user-save-label create-user-mask" onClick={(e) => this.addRoleHandler(e)}>{this.props.location.RoleProps !== undefined?"Update Role":"Create Role"}</button>
                        </div>
                    </div>
                </div>
                <div>
                <form>
                    <div className="user-rectangle2"> 
                        <div className="user-rectangle3"><span className="user-rectangle-text title-mrgn">Role Details</span>  <div className="sample-user right"></div></div>
                    </div>
                   
                        <div className="user-details-section">
                            <div>
                                <div className="inner-section inner-mrgn inner-mrgn-tp">
                                    <span className="first-name-box">
                                        <input className="fname-input-base user-forms-placeholder inner-mrgn-rt" 
                                            placeholder="Name" value={roleData.roleName}
                                            onChange={(e) => this.onChangeName(e)}/></span>
                                   
                                </div>
                                <div className="inner-section inner-mrgn inner-mrgn-tp1">
                                    <span className="role-desc-label">Description</span>
                                    <div className="desc-editor-mrgn">
                                    <Editor  onChange={this.handleEditorData} label="description" content={roleData.description}/>
                                    </div>
                                    
                                </div>
                             
                                {/* <div className="inner-section inner-mrgn inner-mrgn-tp1"> */}
                                <div className="add-role-base-bottom inner-section inner-mrgn role-bottom-mrgn">
                                    <div>
                                        <ul className="ul-pad0">
                                        {roleData.rolePermissions.map((item,i) => {
                                            return <li className={i===roleData.rolePermissions.length-1?"functionalities-base permission-li-mrgn":"functionalities-base"} key={"item"+i} id={"Func"+i}>
                                                <div className="func-div">
                                                    <span className="data-placeholder1">{item.pageName}</span>
                                                    <span className="data-placeholder2">{item.pagePermission}</span>
                                                    <span className="func-buttons-box btn-right1"onClick={() => this.removeFunctionality(i)}><img className="img-padding" src={Delete} alt=""/></span>
                                                    {/* <span className="func-buttons-box btn-right2"><img className="img-padding" src={Edit} alt=""/></span> */}
                                                </div>
                                            </li>
                                            })
                                        }
                                          
                                        </ul>
                                    </div>
                                    <div>
                                        <select className="role-dropdown-base role-dropdown-placeholder" onChange={(e) => this.setState({function:e.target.value,isDisable:false})}>
                                            <option>Functionalities</option>
                                            {this.functionalities.map((label) => {return <option value={label}>{label}</option>})}
                                          
                                        </select>
                                        <select className="role-dropdown-base role-dropdown-placeholder permission-dd-mrgn" onChange={(e) => this.setState({permission:e.target.value})}>
                                            <option>Permissions</option>
                                            <option value="View">View</option>
                                            <option value="View & Edit">View & Edit</option>
                                          
                                        </select>
                                        <span className="role-permission-base"></span>
                                        {/* <input className="role-permission-base role-input-placeholder" placeholder="Permissions"/> */}
                                        <button className={roleData.rolePermissions.length === 0 && isDisable?"add-permission-label add-permission-mask  disable-btn":"add-permission-label add-permission-mask"} 
                                            onClick={(e) => this.addPermissionHandler(e)}
                                            disabled={roleData.rolePermissions.length === 0&& isDisable}
                                        >Add Permission</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                       
                    </form>
                </div>
            </section>
        )
    }
}
