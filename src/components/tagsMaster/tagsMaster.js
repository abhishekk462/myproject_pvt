/* eslint-disable no-undef */
import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./tagMaster.css";
import Left from "../../Assets/images/arrow_left.png";
import Right from "../../Assets/images/arrow_right.png";
import CreateModal from "../../shared/modals/createModal/createTagMaster";
import Actions from "../../Assets/images/icn_actions.png";
import ActionsActive from "../../Assets/images/icn_actions_active.png";
import {TAG_MASTER_LIST, TAG_WS, ARCHIVE_TAG} from "../../shared/services/endPoints";
import axios from 'axios';

class TagsMaster extends Component {
    headers;
    token;
    constructor(props) {
        super(props);
        this.state={
            tagMasterList: [],
            showActions:[],
            isShowing:false,
            links:[],
            pageNumber:0,
            pageSize:13,
            currentPage:0,
            totalNoOfPages:0,
            pageList:[]
        }
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
    }
    
    show = [];

    getTagList = () => {
        let pageList = [];
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${TAG_WS}${TAG_MASTER_LIST}?page=0&size=50`,{"headers":this.headers})
        .then(res => {
               
            for(let i=0;i<res.data.data.response.page.totalPages;i++) {
                pageList.push({"pageNo":i+1,isActive:i===0?true:false});
            }
            
            this.setState({tagMasterList:res.data.data.response.content,totalNoOfPages:res.data.data.response.page.totalPages,pageList});
            
          
        })
    }

    
    handleClick = () => {
        this.setState({showActions:false});
    };
     showPopup = () => {
        this.setState({isShowing:true})
    }

     hidePopup = () => {
        this.setState({isShowing:false})
    }

    handleOverlayShow = (i,id,val) => {
        this.state.tagMasterList.forEach((tag,i) => {
            if(tag.tagEntityId === id) {
                this.show[i] = val;
            } else {
                this.show[i] = false;
            }
        })
        
        this.setState({showActions:this.show});
    }

    handleArchive = (tag,i) => {
       
        // let tags = this.state.tagMasterList;
        this.show[i] = false;
        this.setState({showActions: this.show});
        let input = {
            "tagEntityId": tag
        }
      
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${TAG_WS}${ARCHIVE_TAG}`,input,{"headers":this.headers})
        .then(res => {
            this.getTagList();
        })
        .catch((error) => {
            if(error.response.status === 403) {
                alert("Access Denied.");
                this.getTagList();
            } else {
                alert("Something went wrong,Please try again...");
            }
        })
    }

    getChildData = (data) => {
        this.setState({childData:data})
    }

    handleNextPage = () => {

    }
    
    handlePrevPage = () => {
        
    }

    onclickPage = (pageNo,label) => {
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
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${TAG_WS}${TAG_MASTER_LIST}?page=${currentPage}&size=50`,{"headers":this.headers})
        .then(res => {
         
              
            for(let i=0;i<pageList.length;i++) {
                if( i === currentPage) {
                    pageList[i].isActive = true;
                } else {
                    pageList[i].isActive = false; 
                }
            }
            
            this.setState({tagMasterList:res.data.data.response.content, pageList, currentPage});
         
        })
       }
    }

    componentDidMount() {
        this.getTagList();
    }

    render() {
        const {tagMasterList,isShowing,showActions,pageList,currentPage} = this.state;
        return(
            <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{padding:"0px"}}> 
                <CreateModal show={isShowing} onHide={this.hidePopup} title="Add New Tag Master" name="Master Name" dataFromChild={this.getChildData} label="tag"/>
                <div className="top-section">
                    <span className="tag-master">Tag Master</span>
                    <button className="buttons-label btn-mask" onClick={this.showPopup}>Add New</button>
                    {/* onClick={toggle} */}
                </div>
                {/* <span className="line-19"></span> */}
                <div className="mrgn-tp">
                <table className="table-1">
                    <thead>
                    <tr className="table-header">
                        <th className="name-title pad10 width-all">Name</th>
                        <th className="created-date pad10 width-all">Created date</th>
                        <th className="modified-date pad10 width-all">Modified date</th>
                    
                        <th className="actions-title actions pad10"><span className="last-col-title">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    {tagMasterList.map((item,i)=>{
                        
                        return(
                            <tr className="tabled-data" key={"master"+i}>
                                <td className="name-value pad10"><Link className="a" to={{pathname:"/tagMasterDetails", tagProps:item}}>{item.name}</Link></td>
                                <td className="cdate pad10">{item.createdDate}</td>
                                <td className="mdate pad10">{!item.updatedDate?"-":item.updatedDate}</td>
                                
                                {!showActions[i] &&
                                    <td className="rectangle-copy-7 pad10 ">
                                        <span className="last-col show-cursor" onClick={() => this.handleOverlayShow(i,item.tagEntityId,true)}>
                                            <img src={Actions} alt=""></img>
                                        </span>
                                    </td>}
                                {showActions[i] && <td>
                                    <div className="rectangle-copy-7 tag-td-action-rectangle">
                                        <div className="tag-combined-shape show-cursor" onClick={() => this.handleOverlayShow(i,item.tagEntityId,false)}><img src={ActionsActive} alt=""></img></div>
                                        <div className="tag-edit show-cursor"><Link className="aa1" to={{pathname:"/tagMasterDetails", tagProps:item}}>Edit</Link></div>
                                        <div className="tag-archive show-cursor"><button className="archive-btn" onClick={() => this.handleArchive(item.tagEntityId,i)}>Archive</button></div> 
                                    </div></td>
                                }
                            </tr>
                        )
                    })}
                    
                    </tbody>
                    </table>
                
                    <div className="pagination">
                        <div className="left-bounds" onClick={() => {this.onclickPage(currentPage,"left")}}><img src={Left} alt=""></img></div>
                        <div className="tag-pg-mrgns"> 

                        {pageList.map((data,i) =>{
                                return i < 33 && <span className={data.isActive?"active-page mrg7":"page1 mrg7"}
                                 key={"page"+i} onClick={() => {this.onclickPage(i)}}>{data.pageNo}</span>})
                            }
                           {pageList.length>33 && <span className="page1 mrg7">...</span>}
                        </div>
                        <div className="right-bounds" onClick={() => {this.onclickPage(currentPage,"right")}}><img src={Right} alt=""></img></div>
                    </div>
                </div>
            
            </section>
        )
    }
}
export default TagsMaster;