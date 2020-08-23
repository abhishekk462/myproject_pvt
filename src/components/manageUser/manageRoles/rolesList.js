import React,{Component} from "react";
import "./roles.css";
import Search from "../../../Assets/images/icn_search.png";

import Action from "../../../Assets/images/icn_actions.png";
import FilterModal from "../../../shared/modals/filter/filter.js";
import { Container, Row } from 'reactstrap';
import Checkbox from "../../../shared/utils/checkbox/checkbox";
import axios from 'axios';
import {ACCOUNT_WS,ROLES_LIST,ARCHIVE_ROLE} from "../../../shared/services/endPoints";
import { Link } from "react-router-dom";
import Left from "../../../Assets/images/arrow_left.png";
import Right from "../../../Assets/images/arrow_right.png";
import { Tooltip } from 'reactstrap';

export default class RolesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFiletr:false,
            filterDropdownData:this.filterDropdownData,
            userList:[],
            isChecked:false,
            showActions:[],
            pageList:[],
            currentPage:0
        }
    }

    getUserList = () => {
        let pageList = [];
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${ROLES_LIST}?page=0&size=50`,{"headers":this.headers})
        .then(res => {
            console.log("userresp",res);
                res.data.data.response.content.map((user => user.isChecked=false));
                for(let i=0;i<res.data.data.response.page.totalPages;i++) {
                    pageList.push({"pageNo":i+1,isActive:i===0?true:false});
                }
              
                this.setState({userList:res.data.data.response.content,pageList,showActions:[]});
            
        })
    }

    handleChange = (e, label) => {
        let userList = this.state.userList,selectedUsers=[];
        if(label=== "All") {
            userList.forEach(question => {
                question.isChecked = e;
            }) 
            this.setState({userList, isChecked:e});
        } else {
            userList[label].isChecked = e;
            if(userList.length === selectedUsers.length) {
                this.setState({ isChecked: true});
            } else {
                this.setState({ isChecked: false});
            }
            this.setState({userList});
        }
    } 
    show = [];
    handleActionOverlay = (i,id,val) => {
        this.state.userList.forEach((role,i) => {
            if(role.roleId === id) {
                this.show[i] = val;
            } else {
                this.show[i] = false;
            }
        })
        this.setState({showActions:this.show});
    } 

    handleArchiveRole = (id) => {
        let request = {
            "roleEntityId": id
        };
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${ARCHIVE_ROLE}`,request,{"headers":this.headers})
        .then(res => {
            this.getUserList();
        }).catch((error) => {
            if(error.response.status === 403) {
                alert("Access Denied.");
                this.getUserList();
            } else {
                alert("Something went wrong,Please try again...");
            }
        })
    }

    componentDidMount() {
        this.getUserList();
    }

    addRoleHandler = () => {
        this.props.history.push('/addRole');
    }

    getPaginationData = (pageNo,label) => {
        let pageList = this.state.pageList,currentPage=pageNo;
       
        if(label === "left" && currentPage>0) {
            currentPage = pageNo -1;
        }
        if(label === "right" && currentPage < pageList.length) {
            currentPage = pageNo +1;
        }
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};

        if(currentPage>=0 && currentPage < pageList.length)
        {
            
            axios.get(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${ROLES_LIST}?page=${currentPage}&size=50`,{"headers":this.headers})
            .then(res => {
            
                // if(res.data.message === "Operation completed successfully." ) {
                    res.data.data.response.content.map((question => question.isChecked=false));
                
                    for(let i=0;i<pageList.length;i++) {
                        if( i === currentPage) {
                            pageList[i].isActive = true;
                        } else {
                            pageList[i].isActive = false; 
                        }
                    }
                    
                    this.setState({userList:res.data.data.response.content, pageList, currentPage});
                // }
            }).catch(() => {
                alert("Something went wrong,Please try again...")
            })
        }
    }
    goBack = () =>{
        this.props.history.push("/manageUsers")
    }
    toggle = (targetName) => {
        if (!this.state[targetName]) {
            this.setState({
              ...this.state,
              [targetName]: {
                tooltipOpen: true
              }
            });
        } else {
            this.setState({
              ...this.state,
              [targetName]: {
                tooltipOpen: !this.state[targetName].tooltipOpen
              }
            });
        }
    }

    isToolTipOpen = targetName => {
        return this.state[targetName] ? this.state[targetName].tooltipOpen : false;
    }

    render() {
        const {showFiletr,isChecked,userList,showActions,pageList,currentPage} = this.state;
        return (
            <section className="sect-width">
                <div className="user-top-section">
                    <span className="user-header">Manage Roles</span>
                    <button className="user-add-button-label user-add-btn-mask" onClick={this.addRoleHandler}>Add New</button>
                    <button className="user-back-button-label user-back-mask" onClick={this.goBack}>Back To Manage Users</button>
                
                </div>
                {/* <div className="qt-search-bar qt-btn-section-mrgn">
                    <span className="qt-search-rectangle">
                        <img className="baseline-search-icn" src={Search} alt=""></img>
                        <input className="search-input" placeholder="Search"></input>
                    </span>
                    onClick={() => this.setState({showFiletr:!showFiletr})}
                    <span className="">
                        <button className={!showFiletr?"qt-filter-group-5 filter-label filter-mask":"qt-filter-group-5 fltr-btn-base-label fltr-label-mask"}>Filter
                            <span className="qt-filter-group-7">
                                <img className="filter-icon1" src={!showFiletr?Filter:Filter1} alt=""></img>
                            </span>
                        </button>
                    </span>
                    {showFiletr && <div className="fltr-box-list overlay fltr-combined-shape-list">
                        <div className="fltr-mrgn-list">
                            <div className="">
                                <Container>
                                    <Row xs="6"  sm="6" md="6" style={{width:"auto"}}>
                                        {filterDropdownData.map((item,i) => {
                                            return(
                                                <FilterModal item={item} index={i} key={i}/>
                                            )
                                        })}
                                    </Row>
                                </Container>
                                <span className="fltr-count-list">2 Filters Applied</span>
                                <button className="canxel-buttons-label fltr-cancel-mask" onClick={this.hidePopup}>
                                    Clear
                                </button>
                                <button className="add-buttons-label add-mask" onClick={this.hidePopup}>
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>}
                </div> */}
                <div className="qt-mrgn-tp">
                    <table className="qt-table-1">
                        <thead>
                            <tr className="user-table-header">
                                <th className="user-checkbox-rectangle user-checkbox-mrgn bg"><Checkbox label="All" handleChange={this.handleChange} value="all" parent="list" checked={isChecked}/></th>
                                <th className="th-user-id">ID</th>
                                <th className="th-user-role">Role</th>
                                {/* <th className="th-user-name">Name</th> */}
                               
                                <th className="th-role-description">Description</th>
                                
                                <th className="th-role-creation-date">Creation Date</th>
                                <th className="th-role-modified-date">Modified Date</th>
                                <th className="user-actions-title user-roles-actions"><span className="last-col-title">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                        {userList.map((item,i)=>{
                            return(
                            <tr className={item.isChecked?"qt-td-row qt-tr-rectangle row-bg":"qt-td-row qt-tr-rectangle"} key={"master"}>
                                <td className="checkbox-mrgn">
                                    <Checkbox label="QID" handleChange={this.handleChange} value={item.roleId} checked={item.isChecked} index={i} parent="list"/>
                                </td>
                                <td className="user-id">{item.roleId}</td>
                                <td className="user-role">{item.roleName.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')}</td>
                                {/* <td className="user-name">{item.firstName+" "+item.lastName}</td> */}
                                
                                <td className="user-gmail" id={"Tooltip-"+i}>{item.descriptionText.substring(0,54)}{item.descriptionText.length>54?"...":""}</td>
                                {item.descriptionText && item.descriptionText.length>54 && <Tooltip className="inner" placement="right" isOpen={this.isToolTipOpen(`Tooltip-${i}`)} target={"Tooltip-"+i} toggle={() => this.toggle(`Tooltip-${i}`)}
                                dangerouslySetInnerHTML={{__html: item.descriptionText}}>
                                    {/* {item.contentDescription} */}
                                </Tooltip>}
                                <td className="user-created-date">{item.createdDate}</td>
                                <td className="user-modified-date">{item.updatedDate?item.updatedDate:"-"}</td>
                                {!showActions[i] && <td className="rectangle-copy-8 pad10 show-cursor">
                                    <span className="td-actions qt-last-col" onClick={() => this.handleActionOverlay(i,item.roleId,true)}><img src={Action} alt=""></img></span>
                                    </td>
                                }
                                {showActions[i] &&<td><div className="rectangle-copy-8 td-action-rectangle show-cursor">
                                        <div className="td-combined-shape" onClick={() => this.handleActionOverlay(i,item.roleId,false)}>...</div>
                                        <div className="td-edit"><Link className="a-link" to={{pathname:"/addRole", RoleProps:{"roleEntityId":item.roleEntityId,"action":"edit"}}}>Edit</Link></div>
                                        {/* <div className="td-duplicate"><Link className="a-link" to={{pathname:"/updateQuestion", UserProps:{"userEntityId":item.userId,"action":"duplicate"}}}>Duplicate</Link></div> 
                                         */}
                                          <div className="td-duplicate" onClick={() => this.handleArchiveRole(item.roleEntityId)}>Archive</div> 
                                    </div>
                                </td>}
                            </tr>)
                        })}    
                        </tbody>
                    </table>
                    {pageList.length > 0 && <div className="qt-pagination">
                    <div className="qt-left-bounds"  onClick={() =>
                        this.getPaginationData(currentPage,"left")}><img src={Left} alt=""></img></div>
                    <div className="user-pagination"> 
                   {pageList.map((data,i) =>{ return<span className={data.isActive?"active-page mrg7":"qt-page1 mrg7"} 
                        onClick={() =>{
                            this.getPaginationData(i);
                        }} key={"Page"+i}>{data.pageNo}</span>})} </div>
                   
                    <div className="user-right-bounds" onClick={() =>
                        this.getPaginationData(currentPage,"right")}><img src={Right} alt=""></img></div>
                </div>}
                </div>
            </section>
        )    
    }
}