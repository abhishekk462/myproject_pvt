import React,{Component} from "react";
import axios from 'axios';
import "./package.css"
import { Link } from "react-router-dom";
import 'suneditor/dist/css/suneditor.min.css'; 
import Search from "../../Assets/images/icn_search.png";
import Filter from "../../Assets/images/icn_fliter.png";
import Filter1 from "../../Assets/images/icn_filter_active.png";
import Action from "../../Assets/images/icn_actions.png";
import Checkbox from "../../shared/utils/checkbox/checkbox";
import { Tooltip } from 'reactstrap';
import FilterModal from "../../shared/modals/filter/filter.js";
import { Container, Row } from 'reactstrap';
import {PACKAGE_WS,PACKAGE_LIST,PACKAGE_PUBLISH,PACKAGE_UNPUBLISH, PACKAGE_SEARCH_FILTER,PACKAGE_FILTER_DROPDOWNS} from "../../shared/services/endPoints";
import Left from "../../Assets/images/arrow_left.png";
import Right from "../../Assets/images/arrow_right.png";
import Close from "../../Assets/images/Close.png";

export default class PackageList extends Component {
    token;
    headers;
    constructor(props) {
        super(props);
        this.state = {
            showFiletr:false,
            filterDropdownData:[],
            noOfFilters:0,
            isChecked:false,
            showActions:[],
            packageList:[],
            pageList:[],currentPage:0,
            showValidities:[],
            finalData:[]
        }
    }

    getPackageList = () => {
        let pageList = [];
      
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${PACKAGE_LIST}?page=0&size=50`,{"headers":this.headers})
        .then(res => {
         
            res.data.response.packageEntity.map((user => user.isChecked=false));
            for(let i=0;i<res.data.response.totalPages;i++) {
                pageList.push({"pageNo":i+1,isActive:i===0?true:false});
            }
            
            this.setState({packageList: res.data.response.packageEntity,pageList, showValidities:[]});
            
        })
    }
    addQuestionHandler = () => {
        this.props.history.push('/addPackage');
    }
    getFilterDropdowns = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${PACKAGE_FILTER_DROPDOWNS}`,{"headers":this.headers})
        .then(res => {
            console.log("Filter:",res)
         
            this.setState({filterDropdownData: res.data.response.dropdownDataModel, showValidities:[]});
            
        })
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
            axios.get(`${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${PACKAGE_LIST}?page=${currentPage}&size=50`,{"headers":this.headers})
            .then(res => {
            
                // if(res.data.message === "Operation completed successfully." ) {
                    res.data.response.packageEntity.map((question => question.isChecked=false));
                
                    for(let i=0;i<pageList.length;i++) {
                        if( i === currentPage) {
                            pageList[i].isActive = true;
                        } else {
                            pageList[i].isActive = false; 
                        }
                    }
                    
                    this.setState({packageList:res.data.response.packageEntity, pageList, currentPage});
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
        this.state.packageList.forEach((pack,i) => {
            if(pack.packageId === id) {
               
                this.show[i] = val;
            } else {
                this.show[i] = false;
            }
        })

        this.setState({showActions:this.show});
    } 
    validities =[];
    handleShowValidities = (i,id,val) => {
        
        this.state.packageList.forEach((pack,i) => {
            if(pack.packageId === id) {
                this.validities[i] = val;
            } else {
                this.validities[i] = false;
            }
        })

        this.setState({showValidities:this.validities});
    } 
    handlePublishPackage = (id,status) => {
      
        let endpoint = status === "Unpublished"?PACKAGE_PUBLISH:PACKAGE_UNPUBLISH;
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${endpoint}?id=${id}`,{"headers":this.headers})
        .then(res => {
           
            this.getPackageList();
        }).catch((error) => {
            if(error.response.status === 403) {
                alert("Access Denied.");
                this.getPackageList();
            } else {
                alert("Something went wrong,Please try again...");
            }
        })
    }
    filter = [];filters=[];
    selectedFilterData =(data) => {
        console.log("filter selected data:",data);
        this.filter.push(data);
        this.filters.indexOf(data.dropdownLabel) === -1 && this.filters.push(data.dropdownLabel);
        this.setState({finalData:this.filter,noOfFilters:this.filters.length})
    }
    handleChange = (e, label) => {
        let packageList = this.state.packageList,selectedUsers=[];
        if(label=== "All") {
            packageList.forEach(pack => {
                pack.isChecked = e;
            }) 
            this.setState({packageList, isChecked:e});
        } else {
            packageList[label].isChecked = e;
            if(packageList.length === selectedUsers.length) {
                this.setState({ isChecked: true});
            } else {
                this.setState({ isChecked: false});
            }
            this.setState({packageList});
        }
    } 
    request = {
        "status": [
            
          ],
          "subscriptionType": [
           
          ],
          "validity": [
          
          ],
          "validityType": [
           
          ],
        "searchText": ""
    }
    OnSearchHandler = (e) => {
        if(e.target.value.length >0) {
            let request = this.request.searchText =  e.target.value,pageList=[];

            axios.post(`${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${PACKAGE_SEARCH_FILTER}?page=0&size=50`,request,{"headers":this.headers})
            .then(res => {
                console.log("userresp",res);
                // res.data.response.reponse.map((user => user.isChecked=false));
                // for(let i=0;i<res.data.response.totalPages;i++) {
                //     pageList.push({"pageNo":i+1,isActive:i===0?true:false});
                // }
            
                // this.setState({packageList:res.data.response.reponse,pageList,isSearch:true,searchInput:request});
            })
        } else {
            this.getPackageList();
        }
    }
    handleApply = () => {
       
        this.state.finalData.forEach((item,i)=>{
            if(item.dropdownLabel === "Subscription Type") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.request.subscriptionType.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Status") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.request.status.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Validity Type") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.request.validityType.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Validity") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.request.validity.push(data.valueCode)}
                })
            }
           
        })
      
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        let url = `${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${PACKAGE_SEARCH_FILTER}?page=0&size=50`,pageList=[];
        axios.post(url,this.requestBody, {"headers":this.headers})
        .then(res => {
            console.log("Filter data: response:package", res)
            // res.data.data.response.reponse.map((question => question.isChecked=false));
            // for(let i=0;i<res.data.data.response.totalPages;i++) {
            //     pageList.push({"pageNo":i+1,isActive:i===0?true:false});
            // }
            // this.filters=[];this.mydata = [];
            // this.setState({contentList:res.data.data.response.reponse, totalNoOfPages:res.data.data.response.totalPages,pageList,noOfContents:res.data.data.response.totalElements,isSearch:true,searchInput:this.requestBody,showFiletr:false,noOfFilters:0});
        })
    // } else {
       
    //     this.getQuestionsList()
    // }
        // this.hidePopup();

       
    }
    componentDidMount() {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        this.getPackageList();
        this.getFilterDropdowns();
    }
    render() {
        const {showFiletr,filterDropdownData,noOfFilters,isChecked,showActions,packageList,pageList,currentPage,showValidities} = this.state;
        return(
            <section className="">
                <div className="top-section">
                    <span className="qt-header">Packages</span>
                    <button className="buttons-label btn-mask" onClick={this.addQuestionHandler}>Add New</button>
                </div>
                <div className="qt-search-bar qt-btn-section-mrgn">
                    <span className="qt-search-rectangle">
                        <img className="baseline-search-icn" src={Search} alt=""></img>
                        <input className="search-input" placeholder="Search" onChange={(e) => this.OnSearchHandler(e)}></input>
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
                                <th className="pack-title">Title</th>
                                <th className="pack-status">Subscription Type</th>
                                <th className="pack-status">Created Date</th>
                                <th className="pack-status">Status</th>
                                <th className="pack-validity">Validity & Price Details</th>
                               
                                <th className="pack-actions-title qt-actions"><span className="last-col-title">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                           { packageList.map((item,i) =>{
                            return <tr className={item.isChecked?"qt-td-row qt-tr-rectangle row-bg":"qt-td-row qt-tr-rectangle"} key={"master"+i}>
                                    <td className="checkbox-mrgn">
                                        <Checkbox label="PID" handleChange={this.handleChange} value={item.packageId} checked={item.isChecked} parent="list" index={i}/>
                                    </td>
                                    <td className="td-qid">{item.packageId}</td>
                                    <td className="td-comp-id">{item.title}</td>
                                    <td className="td-cid">{item.subscriptionType}</td>
                                    {/* <td className="td-description" id={"Tooltip-"+"i"}>{"item.descriptionText.substring(0,29)"}...</td>
                                    <Tooltip className="inner" placement="right" isOpen={this.isToolTipOpen(`Tooltip-${i}`)} target={"Tooltip-"+i} toggle={() => this.toggle(`Tooltip-${i}`)} dangerouslySetInnerHTML={{__html: item.description}}>
                                        
                                    </Tooltip> */}
                                    <td className="td-language">{item.createdDate}</td>
                                    <td className="td-language">{item.status}</td>
                               {   item.packageMetadataEntity.length>0 &&   <td className="td-created-by">{item.packageMetadataEntity[0].validityTypeName},
                                        {item.packageMetadataEntity[0].validityPeriod},
                                        MRP:{item.packageMetadataEntity[0].maxRetailPrice},
                                        SP:{item.packageMetadataEntity[0].sellingPrice},
                                        RP:{item.packageMetadataEntity[0].repurchasePrice}...
                                       <span className="pack-validity-more show-cursor" onClick={() => this.handleShowValidities(i,item.packageId,true)}>More</span>
                                       {showValidities[i] && <div className="pack-action-rectangle">
                                           <table>
                                               <thead>
                                                   <tr className="more-tr">
                                                       <th className="more-validity-type">Validity Type</th>
                                                       <th className="more-validity">Validity</th>
                                                       <th className="more-mrp">MRP</th>
                                                       <th className="more-sp">Selling Price</th>
                                                       <th className="more-rp">Repurchase Price</th>
                                                       <th className="more-gp">Grace Period</th>
                                                       <th className="more-img" onClick={() => this.handleShowValidities(i,item.packageId,false)}><img className="more-close show-cursor" src={Close} alt=""/></th>
                                                   </tr>
                                               </thead>
                                          
                                           <tbody>
                                                   {item.packageMetadataEntity.map((data,k) =>{return<tr className="more-tr more-tr-brdr">
                                                       <td className="more-validity-type">{data.validityTypeName}</td>
                                                       <td className="more-validity">{data.validityPeriod.split(" ")[0]+" "+data.validityPeriod.split(" ")[1]}</td>
                                                       <td className="more-mrp">INR {data.maxRetailPrice}</td>
                                                       <td className="more-sp">INR {data.sellingPrice}</td>
                                                       <td className="more-rp">INR {data.repurchasePrice}</td>
                                                       <td className="more-gp">{data.gracePeriod.split(" ")[0]+" "+data.gracePeriod.split(" ")[1]}</td>
                                                       <td className="more-img"></td>
                                                   </tr>})}
                                               </tbody>
                                               </table>
                                        </div>}
                                    </td>}
                                    {item.packageMetadataEntity.length === 0 &&<td className="td-created-by">-</td>}
                                    {!showActions[i] && <td className="rectangle-copy-8 pad10 show-cursor">
                                    <span className="td-actions qt-last-col" onClick={() => this.handleActionOverlay(i,item.packageId,true)}><img src={Action} alt=""></img></span>
                                    </td>
                                }
                                {showActions[i] &&<td><div className="rectangle-copy-8 package-action-rectangle show-cursor">
                                        <div className="td-combined-shape" onClick={() => this.handleActionOverlay(i,item.packageId,false)}>...</div>
                                        <div className="td-edit"><Link className="a-link" to={{pathname:"/addPackage", PackageProps:{"packageEntityId":item.packageEntityId,"action":"edit"}}}>Edit</Link></div>
                                        <div className="td-duplicate"><Link className="a-link" to={{pathname:"/addPackage", PackageProps:{"packageEntityId":item.packageEntityId,"action":"duplicate"}}}>Duplicate</Link></div> 
                                        <div className="td-publish"  onClick={() => this.handlePublishPackage(item.packageEntityId,item.status)}>{item.status === "Unpublished"?"Publish":"Unpublish"}</div> 
                                    </div>
                                </td>}
                                </tr>
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