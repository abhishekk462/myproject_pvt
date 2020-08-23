import React,{Component} from "react";
import "./contentList.css";
import Search from "../../Assets/images/icn_search.png";
import Filter from "../../Assets/images/icn_fliter.png";
import Filter1 from "../../Assets/images/icn_filter_active.png";
import Action from "../../Assets/images/icn_actions.png";
import { Tooltip } from 'reactstrap';
import { Container, Row } from 'reactstrap';
import FilterModal from "../../shared/modals/filter/filter.js";
import SendVerificationModal from "../../shared/modals/sendModal/sendModal";
import UploadModal from "../../shared/modals/uploadModal/uploadModal";
import Left from "../../Assets/images/arrow_left.png";
import Right from "../../Assets/images/arrow_right.png";
import Checkbox from "../../shared/utils/checkbox/checkbox";
import ActionsActive from "../../Assets/images/icn_actions_active.png";
import {QUESTION_WS,CONTENT_LIST,EXPORT_CONTENT_TO_WORD,GET_EXPORTED_FILE, GET_SAMPLE_TEMPLATE,SEARCH_FILTER_CONTENT,GET_FILTER_DROPDOWNS} from "../../shared/services/endPoints";
import axios from 'axios';
import { Link } from "react-router-dom";


export default class ContentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFiletr:false,
            contentList:[],
            filterDropdownData:this.filterDropdownData,
            isChecked:false,
            showActions:[],
            showVerification:false, showTranslation:false, showUpload:false,  showFiletr:false,
            selectedContents:[],
            buttonDisabled:false,
            selectedContentIds:[],
            totalNoOfPages:0,
            pageList:[],
            currentPage:0,
            noOfContents:0,
            searchInput:{},
            isSearch:false,
            noOfFilters:0
        }
    }

    filterDropdownData = [
        {"dropdownLabel":"Other Content Type","dropdownMappingModels":[{"valueName":"Question","valueCode":1},{"valueName":"Video","valueCode":2},{"valueName":"Pdf","valueCode":3}]},
        {"dropdownLabel":"Other Content Type2","dropdownMappingModels":[{"valueName":"Solution","valueCode":1},{"valueName":"Conceptual","valueCode":2},{"valueName":"Practice","valueCode":3},{"valueName":"MCQ Lectures","valueCode":4}]},
    ];

    getContentList= () => {
        let pageList = [];
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${CONTENT_LIST}?page=0&size=50`,{"headers":this.headers})
        .then(res => {
            if(res.data.message === "Operation completed successfully.") {
                res.data.data.response.map((question => question.isChecked=false));
                for(let i=0;i<res.data.data.totalPages;i++) {
                    pageList.push({"pageNo":i+1,isActive:i===0?true:false});
                }
                this.setState({contentList:res.data.data.response, totalNoOfPages:res.data.data.totalPages,pageList, noOfContents:res.data.data.totalElements,noOfFilters:0});
            }
        })
    }

    getFiletrData = () => {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_FILTER_DROPDOWNS}`,{"headers":this.headers})
        .then(res => {
            console.log("Filter data:", res)
            let data = this.state.filterDropdownData;
            res.data.data.response.dropdownDataModel.forEach((item) =>{
                if(item.dropdownLabel !== "Content Type" && item.dropdownLabel !== "Question Type" && item.dropdownLabel !== "Conceptual") {
                    data.push(item);
                }
            })
            this.setState({filterDropdownData:data})
        })
    }

    getPaginationList= (pageNo,label) => {
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
            if(!this.state.isSearch) {
                axios.get(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${CONTENT_LIST}?page=${currentPage}&size=50`,{"headers":this.headers})
                .then(res => {
                
                    if(res.data.message === "Operation completed successfully." ) {
                        res.data.data.response.map((question => question.isChecked=false));
                    
                        for(let i=0;i<pageList.length;i++) {
                            if( i === currentPage) {
                                pageList[i].isActive = true;
                            } else {
                                pageList[i].isActive = false; 
                            }
                        }
                        
                        this.setState({contentList:res.data.data.response, pageList, currentPage});
                    }
                })
            }
            if(this.state.isSearch) {
                axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${SEARCH_FILTER_CONTENT}?page=${currentPage}&size=50`,this.state.searchInput,{"headers":this.headers})
                .then(res => {
                
                  
                        res.data.data.response.reponse.map((question => question.isChecked=false));
                    
                        for(let i=0;i<pageList.length;i++) {
                            if( i === currentPage) {
                                pageList[i].isActive = true;
                            } else {
                                pageList[i].isActive = false; 
                            }
                        }
                        
                        this.setState({contentList:res.data.data.response.reponse, pageList, currentPage});
                    
                })
            }
        }
    }


    handleActionOverlay = (i,id,val) => {
        let contents = this.state.contentList, show=[];
        contents.forEach((content,i) => {
            if(content.otherContentEntityId === id) {
                show[i] = val;
            } else {
                show[i] = false;
            }
        })
       
        this.setState({showActions:show});
    }

    addContentHandler = () => {
        this.props.history.push('/addContent');
    }

    hidePopup = () => {
        this.setState({showVerification:false, showTranslation:false, showUpload:false,  showFiletr:false});
        this.getContentList();
    }

    handleChange = (e, label) => {
        let contentList = this.state.contentList, selectedContent=[], selectedContentIds=[];
        if(label=== "All") {
            contentList.forEach(question => question.isChecked = e);
            contentList.forEach(question => question.isChecked ?selectedContentIds.push(
                question.otherContentEntityId
            ):selectedContentIds);
            if(!e) { contentList.forEach(question => question.isInvalid = e);}
            this.setState({contentList, isChecked:e,buttonDisabled:e, selectedContentIds});
        } else {
            contentList[label].isChecked = e; 
            if(!e) {contentList[label].isInvalid = e};
            contentList.forEach(question => question.isChecked ?selectedContent.push( {
                "otherContentEntityId":question.otherContentEntityId,
                "translationlanguages" : []
            }):selectedContent);
            contentList.forEach(question => question.isChecked ?selectedContentIds.push(
                question.otherContentEntityId
            ):selectedContentIds);
            if(selectedContent.length === 0) {
                this.setState({ buttonDisabled: false});
            } else {
                this.setState({ buttonDisabled: true});
            }

            if(contentList.length === selectedContent.length) {
                this.setState({ isChecked: true});
            } else {
                this.setState({ isChecked: false});
            }
            this.setState({contentList, selectedContents:selectedContent,selectedContentIds});
        }
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

    componentDidMount() {
        this.getContentList();
        this.getFiletrData();
    }

    exportToWord = () => {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        let requestBody = {
            "otherContentEntityIds": this.state.selectedContentIds
        }
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${EXPORT_CONTENT_TO_WORD}`,requestBody, {"headers":this.headers})
        .then(res => {
     
            let file = res.data.fileDownloadURL;

            let url = `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_EXPORTED_FILE}?filename=${file}`;
            axios.get(url, {responseType: 'arraybuffer',headers: {'Authorization':"Bearer "+this.token}})
            .then(r => {
          
                var disposition = "attachment; filename=OtherContentTemplate.docx";
          
           
                var matches = /"([^"]*)"/.exec(disposition);
                var filename = (matches != null && matches[1] ? matches[1] : 'OtherContent.docx');
            
                var blob = new Blob([r.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessing' });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
        
                document.body.appendChild(link);
        
                link.click();
        
                document.body.removeChild(link);
            });
            
        })
    }

    downloadSampleTemplate = () => {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_SAMPLE_TEMPLATE}`,{responseType: 'arraybuffer',headers: {'Authorization':"Bearer "+this.token}})
        .then(res => {
            var disposition = "attachment; filename=OtherContentTemplate.docx";
 
            var matches = /"([^"]*)"/.exec(disposition);
            var filename = (matches != null && matches[1] ? matches[1] : 'OtherContentSampleTemplate.docx');
        
            var blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessing' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
    
            document.body.appendChild(link);
    
            link.click();
    
            document.body.removeChild(link);
        })
    }

    handleSendToVerifier = () => {
        let inValidData = [],contentList=this.state.contentList;
        contentList.forEach((question,i) => {
            if(question.isChecked && (question.status === "Pending Creation" || question.status === "Pending Rejected Creation")) {
                inValidData.splice(i,1);
                question.isInvalid = false;
                
            } 
            if(question.isChecked && (question.status === "Pending Verification" || question.status === "Rejected Creation" || question.status === "Approved" || question.status === "Published"|| question.status === "unpublished")) 
            {
        
                question.isInvalid = true;
                inValidData.push(question);
            }
        })

        if(inValidData.length === 0) {
            this.setState({showVerification:true})
        } else {
            alert("Selected Questions are under verification,Please Select the Valid Questions.");
        }
        this.setState({contentList});
    
    }

    handleSendToTranslator = () => {
        let inValidData = [],contentList=this.state.contentList;
        contentList.forEach((question,i) => {
            if(question.isChecked && question.status === "Approved") {
                inValidData.splice(i,1);
                question.isInvalid = false;
                
            } 
            if(question.isChecked && (question.status === "Pending Verification" || question.status === "Pending Rejected Creation" || question.status === "Pending Creation" || question.status === "Approved" || question.status === "Published"|| question.status === "unpublished")) 
            {
                question.isInvalid = true;
                inValidData.push(question);
            }
        })
       
        if(inValidData.length === 0) {
            this.setState({showVerification:false,showTranslation:true})
        } else {
            alert("Selected Questions are under verification,Please Select the Valid Questions.");
        }
        this.setState({contentList});
        
    }

    handleSearch = (e) => {
      
        if(e.target.value.length>0) {
            let requestBody = this.requestBody.searchText = e.target.value ,pageList = [];
            this.token = sessionStorage.getItem("Token");
            this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
            let url = `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${SEARCH_FILTER_CONTENT}?page=0&size=10`;
            axios.post(url,requestBody, {"headers":this.headers})
            .then(res => {
             
                res.data.data.response.reponse.map((question => question.isChecked=false));
                for(let i=0;i<res.data.data.response.totalPages;i++) {
                    pageList.push({"pageNo":i+1,isActive:i===0?true:false});
                }
            
                this.setState({contentList:res.data.data.response.reponse, totalNoOfPages:res.data.data.response.totalPages,pageList,noOfContents:res.data.data.response.totalElements,isSearch:true,searchInput:requestBody});
            
            })
        } else {
           
            this.getContentList()
        }
    }
    mydata = [];filters=[];
    selectedFilterData = (data) =>{
        this.mydata.push(data);
        this.filters.indexOf(data.dropdownLabel) === -1 && this.filters.push(data.dropdownLabel);
        this.setState({finalData: this.mydata,noOfFilters:this.filters.length})
    }

    requestBody = {
        "examCategoryId" : [],
        "examId" : [],
        "languageId" : [],
        "topicId" : [],
        "subTopicId" : [],
        "difficultyId" : [],
        "usedIn" : [],
        "contentTypeId" : [],
        "createdBy" : [],
        "subContentTypeId" : [],
        "status" : [],
      
        "subjectId":[],
        "searchText" :"",
    }

    handleApply = () => {
       
        this.state.finalData.forEach((item,i)=>{
            if(item.dropdownLabel === "Language") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.languageId.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Used In") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.usedIn.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Difficulty") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.difficultyId.push(data.valueCode)}
                })
            }
            // if(item.dropdownLabel === "Conceptual") {
            //     item.dropdownMappingModels.forEach((data,i) => {
            //         if(data.isChecked)
            //         {this.requestBody.isConceptual.push(data.valueCode)}
            //     })
            // }
            if(item.dropdownLabel === "Topic") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.topicId.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Sub-Topic") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.subTopicId.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Subject") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.subjectId.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Exam Category") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.examCategory.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Exam") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.examName.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Created By") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.createdBy.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Status") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.status.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Other Content Type") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.contentTypeId.push(data.valueCode)}
                })
            }
            if(item.dropdownLabel === "Other Content Type2") {
                item.dropdownMappingModels.forEach((data,i) => {
                    if(data.isChecked)
                    {this.requestBody.subContentTypeId.push(data.valueCode)}
                })
            }
        })
      
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        let url = `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${SEARCH_FILTER_CONTENT}?page=0&size=50`,pageList=[];
        axios.post(url,this.requestBody, {"headers":this.headers})
        .then(res => {
            console.log("Filter data:", res)
            res.data.data.response.reponse.map((question => question.isChecked=false));
            for(let i=0;i<res.data.data.response.totalPages;i++) {
                pageList.push({"pageNo":i+1,isActive:i===0?true:false});
            }
            this.filters=[];this.mydata = [];
            this.setState({contentList:res.data.data.response.reponse, totalNoOfPages:res.data.data.response.totalPages,pageList,noOfContents:res.data.data.response.totalElements,isSearch:true,searchInput:this.requestBody,showFiletr:false,noOfFilters:0});
        })
    // } else {
       
    //     this.getQuestionsList()
    // }
        // this.hidePopup();

       
    }
    

    render() {
        const {showFiletr,filterDropdownData,contentList, showActions,isChecked, showVerification, showTranslation, showUpload, selectedContents,buttonDisabled,pageList,currentPage, noOfContents} = this.state;
        return (
            <section className="">
                   
                 {showVerification && <SendVerificationModal  show={showVerification} onHide={this.hidePopup} title="Send to Verifier" 
                    label1="Please confirm to send selected other contents for verification." label2="I wish to pre-generate a ticket to translator before verification."
                    data = {selectedContents} parent="content"
                />}
                {showTranslation && <SendVerificationModal show={showTranslation} onHide={this.hidePopup} title="Send to Translator" label1="Please select translation language before sending it to a translator.." 
                     data = {selectedContents} parent="content"
                />}
                {showUpload && <UploadModal show={showUpload} onHide={this.hidePopup} title="Upload" label="Please click browse to choose an file from your computer" handleChangeFile={this.uploadFile} parent="content"/>}
                <div className="content-top-section">
                    <span className="content-header content-mrgn">Other Content</span>
                    <button className="content-buttons-label content-btn-mask" onClick={this.addContentHandler}>Add New</button>
                    <button className="content-upload-button-label content-upload-mask" onClick={() => this.setState({showUpload:true})}>Upload</button>
                    <span className="content-sample-template-label aa"><a className="" onClick={() => this.downloadSampleTemplate()}>Download Sample Template</a></span>
                </div>
                <div className="content-search-bar content-btn-section-mrgn">
                    <span className="content-search-rectangle">
                        <img className="content-baseline-search-icn" src={Search} alt=""></img>
                        <input className="content-search-input" placeholder="Search" onChange={(e) => this.handleSearch(e)}></input>
                    </span>
                    <span className="content-filter-mrgn" onClick={() => this.setState({showFiletr:!showFiletr})}>
                        <button className={!showFiletr?"content-filter-group-5 content-filter-label content-filter-mask":"content-filter-group-5 content-fltr-btn-base-label content-fltr-label-mask"}>Filter
                            <span className="content-filter-group-7">
                                <img className="content-filter-icon1" src={!showFiletr?Filter:Filter1} alt=""></img>
                            </span>
                        </button>
                    </span>
                    <span className="content-count">{noOfContents} Contents</span>
                    <span className="content-side-btn1"><button disabled={!buttonDisabled} className={!buttonDisabled?"content-side-btn1-label content-side-btn1-mask disable-btn":"content-side-btn1-label content-side-btn1-mask"} onClick={() => this.exportToWord()}>Export to Word</button></span>
                    <span className="content-side-btn2"><button disabled={!buttonDisabled}  className={!buttonDisabled?"content-side-btn2-label content-side-btn2-mask disable-btn":"content-side-btn2-label content-side-btn2-mask"} onClick={() => this.handleSendToTranslator()}>Send to Translator</button></span>
                    <span className="content-side-btn1"><button disabled={!buttonDisabled}  className={!buttonDisabled?"content-side-btn3-label content-side-btn3-mask disable-btn":"content-side-btn3-label content-side-btn3-mask"} onClick={() => this.handleSendToVerifier()}>Send to Verifier</button></span>
                    {showFiletr && <div className="content-fltr-box-list content-overlay content-fltr-combined-shape-list">
                        <div className="content-fltr-mrgn-list">
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
                                <span className="content-fltr-count-list">{this.state.noOfFilters} Filters Applied</span>
                                <button className="content-cancel-buttons-label content-fltr-cancel-mask" onClick={this.hidePopup}>
                                    Clear
                                </button>
                                <button className={this.state.noOfFilters===0?"content-add-buttons-label content-add-mask disable-btn":"content-add-buttons-label content-add-mask"} disabled={this.state.noOfFilters===0} onClick={this.handleApply}>
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>}
                </div>
                <div className="content-mrgn-tp">
                <table className="content-table-1">
                    <thead>
                        <tr className="content-table-header">
                            <th className="content-checkbox-rectangle content-checkbox-mrgn content-bg"><Checkbox label="All" handleChange={this.handleChange} value="all" parent="list" checked={isChecked}/></th>
                            <th className="content-id">Content ID</th>
                            <th className="content-child-id">Child ID</th>
                            {/* <th className="child-id">Child ID</th> */}
                            <th className="content-description">Description</th>
                            <th className="content-language">Language</th>
                            <th className="content-created-by">Created By</th>
                            <th className="content-creation-date">Creation Date</th>
                            <th className="content-status">Status</th>
                            <th className="content-to-translate">To Translate</th>
                            <th className="content-published-date">Published Date</th>
                            <th className="content-creation-date">Last Updated</th>
                            <th className="content-to-translate">Occurances/uses</th>
                            <th className="content-published-date">Linked Content ID</th>
                            <th className="content-actions-title content-actions"><span className="content-last-col-title">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {contentList.map((item,i)=>{
                            return(
                            <tr className={item.isChecked && !item.isInvalid?"content-td-row content-tr-rectangle row-bg":item.isInvalid?"content-td-row content-tr-rectangle row-bg1":"content-td-row content-tr-rectangle"} key={"master"+i}>
                                <td className="content-checkbox-mrgn">
                                    <Checkbox label="QID" handleChange={this.handleChange} value={item.qId} checked={item.isChecked} index={i} parent="list"/>
                                </td>
                                {/* <td className="td-comp-id">{item.compId}</td> */}
                                <td className="content-td-qid">{item.contentName}</td>
                                <td className="content-td-cid">{item.childId}</td>
                                <td className="content-td-description" id={"Tooltip-"+i}>{item.descriptionText? item.descriptionText.substring(0,25)+"...":"-"}</td>
                                {item.contentDescription && item.contentDescription.length>25 && <Tooltip className="inner" placement="right" isOpen={this.isToolTipOpen(`Tooltip-${i}`)} target={"Tooltip-"+i} toggle={() => this.toggle(`Tooltip-${i}`)}
                                dangerouslySetInnerHTML={{__html: item.contentDescription}}>
                                    {/* {item.contentDescription} */}
                                </Tooltip>}
                                <td className="content-td-language">{item.language}</td>
                                <td className="content-td-created-by">{item.createdBy?item.createdBy:"-"}</td>
                                <td className="content-td-created-date">{item.createdDate}</td>
                                <td className="content-td-status">{item.status}</td>
                                <td className="content-td-to-translate">{item.translationLanguages && item.translationLanguages.map((lang) => {return<span>{lang},</span>})}</td>
                                <td className="content-td-published-date">{item.publishedDate?item.publishedDate:"-"}</td>
                                <td className="content-td-created-date">{item.updatedDate?item.updatedDate:"-"}</td>
                                <td className="content-td-published-date">{item.occurances?item.occurances:"-"}</td>
                                <td className="content-td-to-translate">{item.linkedContents && item.linkedContents.map((lang) => {return<span>{lang},</span>})}</td>
                                {!showActions[i] && <td className="content-rectangle-copy-7 pad20 show-cursor">
                                    <span className="td-actions content-last-col" onClick={() => this.handleActionOverlay(i,item.otherContentEntityId,true)}><img src={Action} alt=""></img></span>
                                    </td>
                                }
                                {showActions[i] &&<td><div className="content-rectangle-copy-7 content-td-action-rectangle show-cursor">
                                        <div className="content-td-combined-shape" onClick={() => this.handleActionOverlay(i,item.otherContentEntityId,false)}><img src={ActionsActive} alt="" /></div>
                                        <div className="content-td-edit"><Link to={{pathname:"/updateContent", contentProps:{"contentEntityId":item.otherContentEntityId}}}>Edit</Link></div>
                                        {/* <div className="content-td-duplicate">Duplicate</div>  */}
                                    </div>
                                </td>}
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="content-pagination">
                    <div disabled={pageList.length === 1} className="content-left-bounds show-cursor"
                    onClick={() =>
                        this.getPaginationList(currentPage,"left")}
                    ><img src={Left} alt=""></img></div>
                    <div className="content-page-mrgn"> 
                    {pageList.map((data,i) =>{ return<span className={data.isActive?"content-active-page mrg7 show-cursor":"page1 mrg7 show-cursor"}
                        onClick={() =>{
                            this.getPaginationList(i);
                        }}
                    >{data.pageNo}</span>})}
                    </div>
                    <div disabled={pageList.length === 1} className="content-right-bounds show-cursor"
                    onClick={() =>
                        this.getPaginationList(currentPage,"right")}
                    ><img src={Right} alt=""></img></div>
                </div>
            </div>
           
            </section>
        )
    }
}
