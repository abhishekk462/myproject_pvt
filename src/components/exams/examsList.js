import React,{Component} from "react";
import axios from 'axios';
import "./examList.css"
import { Link } from "react-router-dom";
import 'suneditor/dist/css/suneditor.min.css'; 
import Search from "../../Assets/images/icn_search.png";
import Filter from "../../Assets/images/icn_fliter.png";
import Filter1 from "../../Assets/images/icn_filter_active.png";
import Action from "../../Assets/images/icn_actions.png";
import Checkbox from "../../shared/utils/checkbox/checkbox";
// import { Tooltip } from 'reactstrap';
import FilterModal from "../../shared/modals/filter/filter.js";
import { Container, Row } from 'reactstrap';
import {EXAM_WS,EXAMS_LIST,EXAM_ARCHIVE,PUBLISH_EXAM,UNPUBLISH_EXAM,EXAM_FILTER_DROPDOWNS} from "../../shared/services/endPoints";
import Left from "../../Assets/images/arrow_left.png";
import Right from "../../Assets/images/arrow_right.png";


export default class ExamsList extends Component {
    token;
    headers;
    constructor(props) {
        super(props);
        this.state = {
            pageList:[],
            examsList:[],
            showActions:[],
            currentPage:0
        }
    }
    getExamsList = () => {
        let pageList = [];
      
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${EXAM_WS}${EXAMS_LIST}?page=0&size=50`,{"headers":this.headers})
        .then(res => {
            console.log("exams:",res)
            res.data.response.examViewModels.map((exam => exam.isChecked=false));
            for(let i=0;i<res.data.response.totalPages;i++) {
                pageList.push({"pageNo":i+1,isActive:i===0?true:false});
            }
            
            this.setState({examsList: res.data.response.examViewModels,pageList});
            
        })
    }

    getFilterDDList = () => {
        let pageList = [];
      
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${EXAM_WS}${EXAM_FILTER_DROPDOWNS}`,{"headers":this.headers})
        .then(res => {
            console.log("exams:filter dd",res)            
            // this.setState({examsList: res.data.response.examViewModels,pageList});
            
        })
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
            // if( !this.state.isSearch) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}${EXAM_WS}${EXAMS_LIST}?page=${currentPage}&size=50`,{"headers":this.headers})
            .then(res => {
            
                // if(res.data.message === "Operation completed successfully." ) {
                    res.data.response.examViewModels.map((exam => exam.isChecked=false));
                
                    for(let i=0;i<pageList.length;i++) {
                        if( i === currentPage) {
                            pageList[i].isActive = true;
                        } else {
                            pageList[i].isActive = false; 
                        }
                    }
                    
                    this.setState({examsList:res.data.response.examViewModels, pageList, currentPage});
                // }
            }).catch(() => {
                alert("Something went wrong,Please try again...")
            })
        } 
        // if(this.state.isSearch) {
        //     axios.post(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${FILTER_USER}?page=0&size=50`,this.state.searchInput,{"headers":this.headers})
        //     .then(res => {
        //         console.log("userresp",res);
        //         res.data.data.response.content.map((user => user.isChecked=false));
        //         for(let i=0;i<pageList.length;i++) {
        //             if( i === currentPage) {
        //                 pageList[i].isActive = true;
        //             } else {
        //                 pageList[i].isActive = false; 
        //             }
        //         }
            
        //         this.setState({userList:res.data.data.response.content,pageList,currentPage});
        //     })
        // }
        // }
    }
    show=[];
    handleActionOverlay = (i,id,val) => {
        this.state.examsList.forEach((exam,i) => {
            if(exam.examId === id) {
               
                this.show[i] = val;
            } else {
                this.show[i] = false;
            }
        })

        this.setState({showActions:this.show});
    } 
    handleArchiveExam = (id) => {
        let endpoint = EXAM_ARCHIVE
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${EXAM_WS}${endpoint}?id=${id}`,{"headers":this.headers})
        .then(res => {
           
            this.getExamsList();
        })
    }
    addExamHandler = () => {
        this.props.history.push('/addExam');
    }
    handleChange = (e, label) => {
        let examsList = this.state.examsList,selectedUsers=[];
        if(label=== "All") {
            examsList.forEach(exam => {
                exam.isChecked = e;
            }) 
            this.setState({examsList, isChecked:e});
        } else {
            examsList[label].isChecked = e;
            if(examsList.length === selectedUsers.length) {
                this.setState({ isChecked: true});
            } else {
                this.setState({ isChecked: false});
            }
            this.setState({examsList});
        }
    } 
    handleSearch = (e) =>{

    }

    componentDidMount() {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        this.getExamsList();
        this.getFilterDDList();
    }
    render() {
        const {showFiletr,filterDropdownData,noOfFilters,isChecked,showActions,pageList,currentPage,examsList} = this.state;
        return(
            <section className="">
                 <div className="top-section">
                    <span className="exam-header">Exams</span>
                    <button className="buttons-label btn-mask" onClick={this.addExamHandler}>Add New</button>
                </div>
                <div className="qt-search-bar qt-btn-section-mrgn">
                    <span className="qt-search-rectangle">
                        <img className="baseline-search-icn" src={Search} alt=""></img>
                        <input className="search-input" placeholder="Search" onChange={(e) => this.handleSearch(e)}></input>
                    </span>
                    <span className="filter-mrgn" onClick={() => this.setState({showFiletr:!showFiletr})}>
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
                                                <FilterModal item={item} index={i} key={i} selectedData={this.selectedFilterData}/>
                                            )
                                        })}
                                    </Row>
                                </Container>
                                <span className="fltr-count-list">{noOfFilters} Filters Applied</span>
                                <button className="canxel-buttons-label fltr-cancel-mask" onClick={this.hidePopup}>
                                    Clear
                                </button>
                                <button className={noOfFilters===0?"add-buttons-label add-mask disable-btn":"add-buttons-label add-mask"} disabled={noOfFilters===0} onClick={this.handleApply}>
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>}
                </div>
                <div className="qt-mrgn-tp">
                    <table className="package-table">
                        <thead>
                            <tr className="table-header">
                                <th className="pack-checkbox-rectangle checkbox-mrgn bg"><Checkbox label="All" handleChange={this.handleChange} value="all" parent="list" checked={isChecked}/></th>
                                <th className="pack-status">ID</th>
                                <th className="pack-title">Exam</th>
                                <th className="exam-description">Description</th>
                                <th className="exam-created">Created </th>
                                <th className="exam-created">Modified</th>
                                <th className="exam-created">Statuss</th>
                               
                                <th className="pack-actions-title qt-actions"><span className="last-col-title">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                        { examsList.map((item,i) =>{
                            return <tr className={item.isChecked?"qt-td-row qt-tr-rectangle row-bg":"qt-td-row qt-tr-rectangle"} key={"master"+i}>
                                    <td className="checkbox-mrgn">
                                        <Checkbox label="EXAMID" handleChange={this.handleChange} value={item.packageId} checked={item.isChecked} parent="list" index={i}/>
                                    </td>
                                    <td className="td-qid">{item.examId}</td>
                                    <td className="td-comp-id">{item.exam}</td>
                                    <td className="td-cid">{item.description}</td>
                                    {/* <td className="td-description" id={"Tooltip-"+"i"}>{"item.descriptionText.substring(0,29)"}...</td>
                                    <Tooltip className="inner" placement="right" isOpen={this.isToolTipOpen(`Tooltip-${i}`)} target={"Tooltip-"+i} toggle={() => this.toggle(`Tooltip-${i}`)} dangerouslySetInnerHTML={{__html: item.description}}>
                                        
                                    </Tooltip> */}
                                    <td className="td-language">{item.createdDate}</td>
                                    <td className="td-language">{item.modified?item.modified:"-"}</td>
                                    <td className="td-language">{item.status}</td>
                                    {!showActions[i] && 
                                        <td className="rectangle-copy-8 pad10 show-cursor">
                                        <span className="td-actions qt-last-col" onClick={() => this.handleActionOverlay(i,item.examId,true)}><img src={Action} alt=""></img></span>
                                        </td>
                                    }
                                    {showActions[i] &&<td><div className="rectangle-copy-8 package-action-rectangle show-cursor">
                                            <div className="td-combined-shape" onClick={() => this.handleActionOverlay(i,item.examId,false)}>...</div>
                                            <div className="exam-td-edit"><Link className="a-link" to={{pathname:"/addExam", PackageProps:{"examEntityId":item.examEntityId,"action":"edit"}}}>Send To Edit</Link></div>
                                            <div className="td-duplicate"><Link className="a-link" to={{pathname:"/addExam", PackageProps:{"examEntityId":item.examEntityId,"action":"duplicate"}}}>Duplicate</Link></div> 
                                            <div className="td-publish"  onClick={() => this.handleArchiveExam(item.examEntityId)}>Archive</div> 
                                        </div>
                                    </td>}
                                </tr>})
                            }
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