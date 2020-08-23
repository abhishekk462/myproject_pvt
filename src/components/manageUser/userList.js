import React,{Component} from "react";
import "./userList.css";
import Search from "../../Assets/images/icn_search.png";
import Filter from "../../Assets/images/icn_fliter.png";
import Filter1 from "../../Assets/images/icn_filter_active.png";
import Action from "../../Assets/images/icn_actions.png";
import FilterModal from "../../shared/modals/filter/filter.js";
import { Container, Row } from 'reactstrap';
import Checkbox from "../../shared/utils/checkbox/checkbox";
import axios from 'axios';
import {ACCOUNT_WS,USER_LIST,ARCHIVE_USER,FILTER_USER,GET_ROLETYPES} from "../../shared/services/endPoints";
import { Link } from "react-router-dom";
import Left from "../../Assets/images/arrow_left.png";
import Right from "../../Assets/images/arrow_right.png";
import Down from "../../Assets/images/Down.png";

export default class UsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFiletr:false,
            filterDropdownData:this.filterDropdownData,
            userList:[],
            isChecked:false,
            showActions:[],
            pageList:[],
            currentPage:0,
            showlabel:"",
            showOptions:false,
            isSearch:false,
            roles:{}
        }
    }
    rolesList =[];
    getUserList = () => {
        let pageList = [];
       
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${USER_LIST}?page=0&size=50`,{"headers":this.headers})
        .then(res => {
          
                res.data.data.response.content.map((user => user.isChecked=false));
                for(let i=0;i<res.data.data.response.page.totalPages;i++) {
                    pageList.push({"pageNo":i+1,isActive:i===0?true:false});
                }
              
                this.setState({userList:res.data.data.response.content,pageList,showActions:[]});
            
        })
    }

    getRoles = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${GET_ROLETYPES}`,{"headers":this.headers})
        .then(res => {
            
            this.rolesList = res.data.data.response.dropdownDataModel[0];
            this.setState({roles:res.data.data.response.dropdownDataModel[0]})
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
    show=[]
    handleActionOverlay = (i,id,val) => {
        this.state.userList.forEach((user,i) => {
            if(user.userId === id) {
                this.show[i] = val;
            } else {
                this.show[i] = false;
            }
        })
        // if(this.state.userList[i].userId === id) {
        //     this.show[i] = val;
        // }

        this.setState({showActions:this.show});
    } 

    handleArchiveUser = (id) => {
        let request = {
            "userEntityId": id
        };
       
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${ARCHIVE_USER}`,request,{"headers":this.headers})
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
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        this.getUserList();
        this.getRoles();
    }

    addUserHandler = () => {
        this.props.history.push('/addUser');
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
            if( !this.state.isSearch) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${USER_LIST}?page=${currentPage}&size=50`,{"headers":this.headers})
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
        if(this.state.isSearch) {
            axios.post(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${FILTER_USER}?page=0&size=50`,this.state.searchInput,{"headers":this.headers})
            .then(res => {
                console.log("userresp",res);
                res.data.data.response.content.map((user => user.isChecked=false));
                for(let i=0;i<pageList.length;i++) {
                    if( i === currentPage) {
                        pageList[i].isActive = true;
                    } else {
                        pageList[i].isActive = false; 
                    }
                }
            
                this.setState({userList:res.data.data.response.content,pageList,currentPage});
            })
        }
        }
    }

    showCheckboxes = (flag,i) => {
        this.setState({showOptions:flag})
    }
    goToRoles = () => {
        this.props.history.push("/manageRoles");
    }

    OnSearchHandler = (e) => {
        if(e.target.value.length >0) {
            let request = {
                "roleId": [],
                "searchText": e.target.value
            },pageList=[];

            axios.post(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${FILTER_USER}?page=0&size=50`,request,{"headers":this.headers})
            .then(res => {
              
                res.data.data.response.content.map((user => user.isChecked=false));
                for(let i=0;i<res.data.data.response.page.totalPages;i++) {
                    pageList.push({"pageNo":i+1,isActive:i===0?true:false});
                }
            
                this.setState({userList:res.data.data.response.content,pageList,isSearch:true,searchInput:request});
            })
        } else {
            this.getUserList();
        }
    }
    
    hidePopup = () => {
        this.setState({roles: this.rolesList});
        this.getUserList();
    }
    filetr={};
    selectedFilterData =(data) => {
      
        this.filetr=data;
    }
    handleApply = () =>{
        // this.filters.indexOf(data.dropdownLabel) === -1 && this.filters.push(data.dropdownLabel);
        let roleids = [];
        this.filetr.dropdownMappingModels.forEach((item,i) =>{
           if(item.isChecked) {
                roleids.push(item.valueCode)
           }
        })
        let request = {
            "roleId": roleids,
            "searchText": ""
        },pageList=[];

        axios.post(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${FILTER_USER}?page=0&size=50`,request,{"headers":this.headers})
        .then(res => {
            console.log("userresp",res);
            res.data.data.response.content.map((user => user.isChecked=false));
            for(let i=0;i<res.data.data.response.page.totalPages;i++) {
                pageList.push({"pageNo":i+1,isActive:i===0?true:false});
            }
        
            this.setState({userList:res.data.data.response.content,pageList,isSearch:true,searchInput:request,showFiletr:false});
        })
    }

    render() {
        const {showFiletr,filterDropdownData,userList,showActions,pageList,currentPage,showlabel,showOptions,roles,isChecked} = this.state;
        return (
            <section className="sect-width">
                <div className="user-top-section">
                    <span className="user-header">Manage Users</span>
                    <button className="user-add-button-label user-add-btn-mask" onClick={this.addUserHandler}>Add New</button>
                    <button className="user-role-button-label user-add-role-mask" onClick={this.goToRoles}>Manage Roles</button>
                
                </div>
                <div className="qt-search-bar qt-btn-section-mrgn">
                    <span className="qt-search-rectangle">
                        <img className="baseline-search-icn" src={Search} alt=""></img>
                        <input className="search-input" placeholder="Search" onChange={(e) => this.OnSearchHandler(e)}></input>
                    </span>
                    {/* onClick={() => this.setState({showFiletr:!showFiletr})} */}
                    <span className="filter-mrgn">
                        <button className={!showFiletr?"qt-filter-group-5 filter-label filter-mask":"qt-filter-group-5 fltr-btn-base-label fltr-label-mask"}
                            onClick={() => this.setState({showFiletr:!showFiletr})} 
                        >Filter
                            <span className="qt-filter-group-7">
                                <img className="filter-icon1" src={!showFiletr?Filter:Filter1} alt=""></img>
                            </span>
                        </button>
                    </span>
                    {showFiletr && <div className="user-fltr-box-list overlay fltr-combined-shape-list">
                        <div className="user-fltr-mrgn-list">
                            <div className="">
                                <Container>
                                    <Row xs="6"  sm="6" md="6" style={{width:"auto"}}>
                                        {/* {filterDropdownData.map((item,i) => {
                                            return( */}
                                                <FilterModal item={roles} index="0" selectedData={this.selectedFilterData}/>
                                            {/* ) */}
                                        {/* })} */}
                                    </Row>
                                </Container>
                                <span className="fltr-count-list"></span>
                                <span>
                                <button className="canxel-buttons-label user-fltr-cancel-mask user-filter-mrgn-btm" onClick={this.hidePopup}>
                                    Clear
                                </button>
                                <button className="add-buttons-label add-mask user-filter-mrgn-btm" onClick={this.handleApply}>
                                    Apply
                                </button>
                                </span>
                            </div>
                        </div>
                    </div>}
                </div>
                <div className="qt-mrgn-tp">
                    <table className="qt-table-1">
                        <thead>
                            <tr className="user-table-header">
                                <th className="user-checkbox-rectangle user-checkbox-mrgn bg"><Checkbox label="All" handleChange={this.handleChange} value="all" parent="list" checked={isChecked} /></th>
                                <th className="th-user-id">ID</th>
                                <th className="th-user-name">Name</th>
                                <th className="th-user-email">Email</th>
                                <th className="th-user-role">Role</th>
                                <th className="th-user-creation-date">Creation Date</th>
                                <th className="th-user-modified-date">Modified Date</th>
                                <th className="user-actions-title user-qt-actions"><span className="last-col-title">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                        {userList.map((item,i)=>{
                            return(
                            <tr className={item.isChecked?"qt-td-row qt-tr-rectangle row-bg":"qt-td-row qt-tr-rectangle"} key={"master"+i}>
                                <td className="checkbox-mrgn">
                                    <Checkbox label="QID" handleChange={this.handleChange} value={item.userId} checked={item.isChecked} index={i} parent="list"/>
                                </td>
                                <td className="user-id">{item.userId}</td>
                                <td className="user-name">{item.firstName+" "+item.lastName}</td>
                                
                                <td className="user-gmail">{item.email}</td>
                                <td className="user-role">{item.roleName?item.roleName.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),''):"-"}</td>
                                <td className="user-created-date">{item.createdDate}</td>
                                <td className="user-modified-date">{item.updatedDate?item.updatedDate:"-"}</td>
                                {!showActions[i] && <td className="rectangle-copy-8 pad10 show-cursor">
                                    <span className="td-actions qt-last-col" onClick={() => this.handleActionOverlay(i,item.userId,true)}><img src={Action} alt=""></img></span>
                                    </td>
                                }
                                {showActions[i] &&<td><div className="rectangle-copy-8 user-action-rectangle show-cursor">
                                        <div className="td-combined-shape" onClick={() => this.handleActionOverlay(i,item.userId,false)}>...</div>
                                        <div className="td-edit"><Link className="a-link" to={{pathname:"/addUser", UserProps:{"userEntityId":item.userEntityId,"action":"edit"}}}>Edit</Link></div>
                                        {/* <div className="td-duplicate"><Link className="a-link" to={{pathname:"/updateQuestion", UserProps:{"userEntityId":item.userId,"action":"duplicate"}}}>Duplicate</Link></div> 
                                         */}
                                          <div className="td-duplicate" onClick={() => this.handleArchiveUser(item.userEntityId,i)}>Archive</div> 
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