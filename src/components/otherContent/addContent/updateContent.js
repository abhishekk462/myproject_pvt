import React,{Component} from "react";
import "./addContent.css";
import { Link } from "react-router-dom";
import Editor from "../../../shared/utils/rte/richTextEditor";
import Close from "../../../Assets/images/Close.png";
import Upload from "../../../Assets/images/icn_browseupload.png";
import {QUESTION_WS,CREATE_CONTENT,GET_AUTOCOMPLETE_DATA, GET_URL_FROMS3,GET_DYNAMIC_DROPDOWNS,GET_CONTENT_DETAILS,GET_STATIC_DROPDOWNS} from "../../../shared/services/endPoints";
import axios from 'axios';
import Play from "../../../Assets/images/btn_play.png";
import Doc_added from "../../../Assets/images/icn_doc_added.png";
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import Autocomplete from "../../../shared/utils/autocomplete/autocomplete";

export default class UpdateContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content:"",
            taggingDropdowns:[],
            showFile:true,
            taggingData:{},
            interlinkingData:[],
            interlinkingVlaue:"",
            interlinkingEbooks:[],
            interlinkingVideos:[],
            contentType:"",
            contentUrl:"",
            previewFile:"",
            type:"",
            fileName:"",
            taggingDropdowns1:[],
            taggingDropdowns2:[],
            contentDetails:{},
            countFun1:1,
            countFun:1,
            contentIDs:[],
            interlinkingQuestions:[],
            showUrl:false,
            isUploadUrl:false
        }
    }

    ddRequestData = ["Topic","Sub-Topic",];
    ddRequestData1 = ["Exam"];
    staticDropdowns =[{"dropdownLabel":"Language","dropdownMappingModels":[{"valueName":"English","valueCode":1010},{"valueName":"Hindi","valueCode":1020},{"valueName":"Bengali","valueCode":1030},{"valueName":"Tamil","valueCode":1040},{"valueName":"Telugu","valueCode":1050},{"valueName":"Marathi","valueCode":1060}]},
        {"dropdownLabel":"Used In","dropdownMappingModels":[{"valueName":"Paid","valueCode":1},{"valueName":"Free","valueCode":2}]},
        {"dropdownLabel":"Difficulty","dropdownMappingModels":[{"valueName":"L1","valueCode":1},{"valueName":"L2","valueCode":2},{"valueName":"L3","valueCode":3},{"valueName":"L4","valueCode":4},{"valueName":"L5","valueCode":5},{"valueName":"L6","valueCode":6},{"valueName":"L7","valueCode":7},{"valueName":"L8","valueCode":8},{"valueName":"L9","valueCode":9},{"valueName":"L10","valueCode":10}]},
        // {"dropdownLabel":"Conceptual","dropdownMappingModels":[{"valueName":"Yes","valueCode":1},{"valueName":"No","valueCode":0}]},
        {"dropdownLabel":"Other Content Type","dropdownMappingModels":[{"valueName":"Question","valueCode":1},{"valueName":"Video","valueCode":2},{"valueName":"Pdf","valueCode":3}]},
        // {"dropdownLabel":"Question Type","dropdownMappingModels":[{"valueName":"SCMC"},{"valueName":"MCMC"},{"valueName":"Comprehension"},{"valueName":"Cloze Test"}]},
        // {"dropdownLabel":"Status","dropdownMappingModels":[{"valueName":"Pending Creation","valueCode":1000},{"valueName":"Pending Verification","valueCode":1200},{"valueName":"Rejected Creation","valueCode":1300},{"valueName":"Pending Rejected Verification","valueCode":1400},{"valueName":"Approved","valueCode":2000},{"valueName":"Published","valueCode":3000},{"valueName":"Unpublished","valueCode":4000}]},
        {"dropdownLabel":"Other Content Type2","dropdownMappingModels":[{"valueName":"Solution","valueCode":1},{"valueName":"Conceptual","valueCode":2},{"valueName":"Practice","valueCode":3},{"valueName":"MCQ Lectures","valueCode":4}]},
        {"dropdownLabel":"Scope","dropdownMappingModels":[{"valueName":"High","valueCode":1},{"valueName":"Medium","valueCode":2},{"valueName":"Low","valueCode":3}]}
    ]

    getDropdownData = () => {
        let taggingDropdowns=[];
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${ GET_STATIC_DROPDOWNS}`,{"headers":this.headers})
        .then(res => {
      
            let data = res.data.data.response.dropdownDataModel;
            for(let i=0;i<data.length;i++){
                if(data[i].dropdownLabel !== "Question Type" && data[i].dropdownLabel !== "Status" && data[i].dropdownLabel !== "Content Type" && data[i].dropdownLabel !== "Sub Content Type"&& data[i].dropdownLabel !== "Conceptual") {
                    taggingDropdowns.push(data[i]);
                }
                if (data[i].dropdownLabel == "Content Type") {
                    taggingDropdowns.push({"dropdownLabel":"Other Content Type","dropdownMappingModels":data[i].dropdownMappingModels})
                }
                if (data[i].dropdownLabel == "Sub Content Type") {
                    taggingDropdowns.push({"dropdownLabel":"Other Content Type2","dropdownMappingModels":data[i].dropdownMappingModels})
                }
            }
            this.setState({taggingDropdowns},() =>{this.setData();})
           
        })
    }


    getContentDetails = () => {
       let id = this.props.location.contentProps.contentEntityId;
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${ GET_CONTENT_DETAILS}${id}`,{"headers":this.headers})
        .then(res => {
            let taggingData = res.data.data.otherContentTags;
            let file = res.data.data.contentUrl.split('/').pop().split('#')[0].split('?')[0]
            // console.log("file:",res.data.data.contentUrl.split('/').pop().split('#')[0].split('?')[0])
            this.setState({contentDetails:res.data.data,previewFile:res.data.data.contentUrl,contentUrl:res.data.data.contentUrl, fileName:file, taggingData})
            this.getDropdownData();
            let request = {
                "dropdownName" : "Subject"
            };
            this.getDropdownDynamicList(request,1);
    
            let request1 = {
                "dropdownName" : "Exam Category"
            };
            this.getDropdownDynamicList1(request1,1);
            let input ={ "dropdownName" : "Topic",
                "dropdownValueId" :  taggingData.subjectId};
            this.getDropdownDynamicList(input,2);
            let input1 ={ "dropdownName" : "Sub-Topic",
                "dropdownValueId" :  taggingData.topicId};
            this.getDropdownDynamicList(input1,3);
            let input3 ={ "dropdownName" : "Exam",
                "dropdownValueId" :  taggingData.examCategoryId};
            this.getDropdownDynamicList1(input3,2);
          
      
        })
    }

    setData= () => {
        const {taggingData} = this.state;
        if( taggingData) {
            document.getElementById("Language").value = taggingData.languageId !== 1 ? taggingData.languageId:"Language";
            document.getElementById("Difficulty").value =  taggingData.difficulty  !== undefined? taggingData.difficulty:"Difficulty";
            // document.getElementById("Conceptual").value = taggingData.isConceptual  !== undefined? taggingData.isConceptual:"Conceptual";
            document.getElementById("Scope").value =  taggingData.scope !== undefined ? taggingData.scope:"Scope";
            document.getElementById("Used In").value = taggingData.usedIn !== undefined ? taggingData.usedIn:"Used In";
            document.getElementById("Other Content Type").value = taggingData.contentTypeId  !== undefined ? taggingData.contentTypeId:"Other Content Type";
            document.getElementById("Other Content Type2").value = taggingData.subContentTypeId  !== undefined ? taggingData.subContentTypeId:"Other Content Type2";
        }
    }

    getDropdownDynamicList = (input,label) => {
        // const {taggingData,countFun} = this.state;
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_DYNAMIC_DROPDOWNS}`,input,{"headers":this.headers})
        .then(res => {
        
            if(res.data.data.response.dropdownDataModel.length>0) {
                let taggingDropdowns = this.state.taggingDropdowns1;
                for(let i=0;i<res.data.data.response.dropdownDataModel.length;i++) {
                    if(taggingDropdowns.length > 0 && taggingDropdowns.some(item => res.data.data.response.dropdownDataModel[i].dropdownLabel === item.dropdownLabel))
                    {
                       
                        taggingDropdowns.map((item,k) =>{
                            if(k>0 && res.data.data.response.dropdownDataModel[i].dropdownLabel === item.dropdownLabel)
                            {
                                taggingDropdowns[k] = res.data.data.response.dropdownDataModel[i];
                    
                            }
                            //  else {
                            //     taggingDropdowns.push(res.data.data.response.dropdownDataModel[i]);
                            // }
                        })
                   
                    } else {
                        taggingDropdowns.push(res.data.data.response.dropdownDataModel[i]);
                    }
                }
               
                this.setState({taggingDropdowns1:taggingDropdowns},() =>{
                    const {taggingData} = this.state;
                    if(label === 1) {
                        document.getElementById("Subject").value = taggingData.subjectId !== 1 ? taggingData.subjectId:"Subject";
                    }
                    if(label === 2) {
                        document.getElementById("Topic").value = taggingData.topicId !== 1? taggingData.topicId:"Topic";
                    } 
                    if(label === 3) {
                        document.getElementById("Sub-Topic").value = taggingData.subTopicId !==1? taggingData.subTopicId:"Sub-Topic";
                    }
                });
               
               
            }            
        })
    }
  
    getDropdownDynamicList1 = (input,label) => {
        // const {taggingData,countFun1} = this.state;
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_DYNAMIC_DROPDOWNS}`,input,{"headers":this.headers})
        .then(res => {
     
            if(res.data.data.response.dropdownDataModel.length>0) {
                let taggingDropdowns = this.state.taggingDropdowns2;
                for(let i=0;i<res.data.data.response.dropdownDataModel.length;i++) {
                    if(taggingDropdowns.length > 0 && taggingDropdowns.some(item => res.data.data.response.dropdownDataModel[i].dropdownLabel === item.dropdownLabel))
                    {
                        
                        taggingDropdowns.map((item,k) =>{
                            if(k>0 && res.data.data.response.dropdownDataModel[i].dropdownLabel === item.dropdownLabel)
                            {
                                taggingDropdowns[k] = res.data.data.response.dropdownDataModel[i];
                               
                            } 
                            // else {
                            //     taggingDropdowns.push(res.data.data.response.dropdownDataModel[i]);
                            // }
                        })
                   
                    } else {
                        taggingDropdowns.push(res.data.data.response.dropdownDataModel[i]);
                    }
                }
               
                this.setState({taggingDropdowns2:taggingDropdowns},() =>{
                    const {taggingData} = this.state;
                    if(label === 1) {
                        document.getElementById("Exam Category").value = taggingData.examCategoryId? taggingData.examCategoryId:"Exam Category"
                    }
                    if(label === 2) {
                        document.getElementById("Exam").value = taggingData.examId ? taggingData.examId:"Exam"
                    }
                });
               
               
            }            
        })
    }

    // setData2 = () => {
    //     const {taggingData} = this.state;
    //     if( taggingData) {
    //        if(this.state.taggingDropdowns2.length ===1 &&  document.getElementById("Exam Category").value !== null) document.getElementById("Exam Category").value = taggingData.examCategoryId !== 1 ? taggingData.examCategoryId:"Exam Category";
    //        if(this.state.taggingDropdowns2.length ===2 &&  document.getElementById("Exam").value !== null ) document.getElementById("Exam").value = taggingData.examId  !== 1? taggingData.examId:"Exam";
    //     }
    // }

    handleEditorData = (data) => {
        let details = this.state.contentDetails;
        details.contentDescription = data;
        this.setState({content:data,contentDetails:details});
    }

    handleChangeTagging = (e) => {

    }
    onAddInterlinking = () => {
        const {interlinkingVlaue,videoIndex, contentType} = this.state;
        let solutions = [], compLists = this.state.compList, interlinkingData=[], interlinkingVideos=this.state.interlinkingVideos,interlinkingEbooks=this.state.interlinkingEbooks,interlinkingQuestions=this.state.interlinkingQuestions;
        if (interlinkingVlaue.indexOf(',') > -1) { 
    
            interlinkingVlaue.split(',').forEach((solution,i) =>{
                solutions.push({"otherContentEntityId":i+1, "otherContentId": solution})
            })
            
        } else {
            solutions.push({"otherContentEntityId":videoIndex+1, "otherContentId": interlinkingVlaue});

        }
        if(contentType === "Ebook") {
            interlinkingEbooks=interlinkingEbooks+solutions ;
            this.setState({interlinkingEbooks})
        }else if(contentType === "Ebook")
            {
                interlinkingVideos = interlinkingVideos+solutions;
                this.setState({interlinkingVideos})
            } else {
                interlinkingQuestions = interlinkingQuestions+solutions;
                this.setState({interlinkingQuestions})
            }
        interlinkingData = interlinkingVideos+interlinkingEbooks+interlinkingQuestions;
        this.setState({interlinkingData,interlinkingVlaue:'', compList:compLists});
    }

    removeInterlinking = (i) => {
        const { contentType} = this.state;
        let interlinkingEbooks,interlinkingVideos, interlinkingData= this.state.interlinkingData,interlinkingQuestions=this.state.interlinkingQuestions;
        if (contentType === "Ebook") {
            interlinkingEbooks=this.state.interlinkingEbooks ;
            interlinkingEbooks.splice(i,1);
            this.setState({interlinkingEbooks})
        } else if(contentType === "Ebook")
            {
                interlinkingVideos = this.state.interlinkingVideos;
                interlinkingVideos.splice(i,1);
                this.setState({interlinkingVideos})
            }else {
              
                interlinkingQuestions.splice(i,1);
                this.setState({interlinkingQuestions})
            }
            interlinkingData = interlinkingVideos+interlinkingEbooks+interlinkingQuestions;
            this.setState({interlinkingData});
    }

    selectTaggingOptions = (e,label,i) => {
       
        let selectedDropdowns = this.state.taggingData;
        if(label === "Other Content Type" ) {
            selectedDropdowns.ContentTypeId = +(e.target.value);

        } else if(label === "Other Content Type2") {
            selectedDropdowns.subContentTypeId =  +(e.target.value);

        } else if(label === "Language") {
            selectedDropdowns.languageId =  +(e.target.value);

        } else if(label === "Difficulty") {
            selectedDropdowns.difficulty = +(e.target.value);

        }
        //  else if(label === "Conceptual") {
        //     selectedDropdowns.isConceptual =  +(e.target.value);

        // } 
        else if(label === "Scope") {
            selectedDropdowns.scope =  +(e.target.value);

        } else if(label === "Used In") {
            selectedDropdowns.usedIn =  +(e.target.value);

        } else {
            selectedDropdowns[label] =  +(e.target.value);
        }
        this.setState({taggingData:selectedDropdowns})
    }

    selectTaggingDDOptions = (e, label,i) => {
        let selectedDropdowns = this.state.taggingData;
      
        if(label === "Subject") {
           
            selectedDropdowns.subjectId = +(e.target.value);
        }
        if(label === "Topic") {
            selectedDropdowns.topicId = +(e.target.value);
        }
        if(label === "Sub-Topic") {
            selectedDropdowns.subTopicId = +(e.target.value);
        }
    //     if(i<this.ddRequestData.length )
    //    { 
           let request = {"dropdownName" : this.ddRequestData[i],  "dropdownValueId" :+(e.target.value)}
            this.getDropdownDynamicList(request);
        // }
        
        this.setState({taggingData:selectedDropdowns});
    }

    selectTaggingDDOptions1 = (e, label,i) => {
        let selectedDropdowns = this.state.taggingData;
        if(label === "Exam Category") {
            selectedDropdowns.examCategoryId = +(e.target.value);
        }
        if(label === "Exam") {
            selectedDropdowns.examId = +(e.target.value);
        }
    //     if(i<this.ddRequestData1.length )
    //    { 
           let request = {"dropdownName" : this.ddRequestData1[i],  "dropdownValueId" : +(e.target.value)}
            this.getDropdownDynamicList1(request);
        // }
  
        this.setState({taggingData:selectedDropdowns});
    }

    handleSubmit = () => {
        const {content, contentUrl,taggingData,interlinkingData,contentDetails,type} = this.state;
        let user = sessionStorage.getItem("userId");
        let requestBody = {
            "contentUrl": contentUrl,
            "contentType": type === "doc" ||type === "docx" ?"Document":"Video",
            "contentDescription":content,
            "otherContentTags": taggingData,
            "otherContent": [],
            "otherContentEntityId": contentDetails.otherContentEntityId,
            "createdBy": +(user)
        }
        let validations = this.validateRequest(requestBody);
        if(validations.length===0) {
            this.token = sessionStorage.getItem("Token");
            this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
            
            axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${CREATE_CONTENT}`,requestBody,{"headers":this.headers})
            .then(res => {
        
                this.goBack();
            }).catch((error) => {
                if(error.response.status === 403) {
                    alert("Access Denied.");
                    this.goBack();
                } else {
                    alert("Something went wrong,Please try again...");
                }
            })
        } else {
            let message = "Please fill mandatory fields\n"+validations.toString();
            alert(message); 
        }
    }

    validateRequest = (request) => {
        let invalidFields = []
        console.log("tagging",this.state.taggingData);
       
        if(request.contentUrl === "") {
            invalidFields.push("Content Url")
        }
        if(request.contentDescription === "") {
            invalidFields.push("Description")
        }
        if( request.otherContentTags.languageId === undefined) {
            invalidFields.push("Language")
        }
        if(  request.otherContentTags.usedIn === undefined) {
            invalidFields.push("Used In")
        }
        if(  request.otherContentTags.difficulty === undefined) {
            invalidFields.push("Difficulty")
        }
        if(  request.otherContentTags.contentTypeId === undefined) {
            invalidFields.push("Other Content Type")
        }
        if(request.otherContentTags.subContentTypeId === undefined) {
            invalidFields.push("Other Content Type2");
        }
        if(  request.otherContentTags.subjectId === undefined) {
            invalidFields.push("Subject")
        }
        if(  request.otherContentTags.topicId === undefined) {
            invalidFields.push("Topic")
        }
        if(  request.otherContentTags.subTopicId === undefined) {
            invalidFields.push("Sub-Topic\n")
        }
      

        return invalidFields;
    }

    onAddInterlinking = (e) => {
        e.preventDefault();
        const {interlinkingVlaue,videoIndex, contentType} = this.state;
        let solutions = [], compLists = this.state.compList, interlinkingData=[], interlinkingVideos=[],interlinkingEbooks=[],interlinkingQuestions=[];
        if (interlinkingVlaue.indexOf(',') > -1) { 
          
            interlinkingVlaue.split(',').forEach((solution,i) =>{
                solutions.push({"otherContentEntityId":i+1, "otherContentId": solution})
            })
            
        } else {
            if(interlinkingVlaue.length>0) {
                solutions.push({"otherContentEntityId":videoIndex+1, "otherContentId": interlinkingVlaue});
            }
        }
        if(contentType === "Ebook") {
            interlinkingEbooks=solutions ;
            this.setState({interlinkingEbooks})
        }else if(contentType === "Video")
            {
                interlinkingVideos = solutions;
                this.setState({interlinkingVideos})
            } else
            {
                interlinkingQuestions = solutions;
                this.setState({interlinkingQuestions})
            } 
        interlinkingData = interlinkingVideos+interlinkingEbooks+interlinkingQuestions;
        this.setState({interlinkingData,interlinkingVlaue:''});
    }

    removeInterlinking = (i) => {
        const { contentType} = this.state;
        let interlinkingEbooks,interlinkingVideos, interlinkingData= this.state.interlinkingData,interlinkingQuestions;
        if (contentType === "Ebook") {
            interlinkingEbooks=this.state.interlinkingEbooks ;
            interlinkingEbooks.splice(i,1);
            this.setState({interlinkingEbooks})
        } else if(contentType === "Video")
            {
                interlinkingVideos = this.state.interlinkingVideos;
                interlinkingVideos.splice(i,1);
                this.setState({interlinkingVideos})
            } else  {
                interlinkingQuestions = this.state.interlinkingQuestions;
                interlinkingQuestions.splice(i,1);
                this.setState({interlinkingQuestions})
            }
            interlinkingData = interlinkingEbooks.length>0?interlinkingVideos+interlinkingEbooks+interlinkingQuestions:interlinkingVideos;
            this.setState({interlinkingData});
    }

    onFileSelect= (e) =>{
        const body = new FormData(this.form);
        body.append("file", e.target.files[0]);
        let contentDetails = this.state.contentDetails,type =  e.target.files[0].name.split('.').pop();
        contentDetails.contentType = type === "mp4"?"Video":"Document";
        this.setState({
            previewFile: URL.createObjectURL(e.target.files[0]),showFile:true,type, fileName:e.target.files[0].name,contentDetails
          })
    
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        this.toggleBlocking();
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_URL_FROMS3}`,body,{"headers":this.headers})
        .then(res => {
            this.toggleBlocking();
            // this.hidePopup();
            this.setState({contentUrl:res.data.message})
        })
    }
    componentDidMount() {
        this.getContentDetails();
        // this.getDropdownData();
       
    }

    goBack = () =>{
        this.props.history.push('/content');
    }

    handleChange(event) {
        this.setState({
          file: URL.createObjectURL(event.target.files[0])
        })
    }
    handleUploadUrl = () =>{
        let type = this.state.contentUrl.split('.').pop();
        if(type === 'mp4') {
            this.setState({previewFile:this.state.contentUrl,fileName:this.state.contentUrl,showFile:true, type,uploadUrl:""});
        } else 
        if(type === 'docx') {
            this.setState({fileName:this.state.contentUrl,showFile:true,type,uploadUrl:""});
        } else {
            this.setState({fileName:this.state.contentUrl,showUrl:true,showFile:true,uploadUrl:""});
        }
    }
    handleDownload = () => {
        if(this.state.type === "mp4") {
            var blob = this.state.previewFile;
            var link = document.createElement('a');
            link.href = blob;
            link.download = blob;
            // document.body.appendChild(link);
    
            link.click();
            // window.location.href=this.state.previewFile;
            // document.body.removeChild(link);
            }else {
            
                var blob = this.state.previewFile;
                var link = document.createElement('a');
                link.href =blob;
                link.download = blob;
        
                // document.body.appendChild(link);
        
                link.click();
        
                // document.body.removeChild(link);
            }
    }
    handleRemoveFile = () => {
        this.setState({showFile:false, previewFile:""});
    }
    toggleBlocking() {
        this.setState({blocking: !this.state.blocking});
      }

      onChangeId = (input) => {
       
        let request ={
            "contentType" : this.state.contentType,
            "contentId" : input
        }
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_AUTOCOMPLETE_DATA}`,request,{"headers":this.headers})
        .then(res => {
         
          console.log("content type:",res)
          this.setState({contentIDs:res.data.data.response})
        })
    }

    getIds=(id) =>{
      
        this.setState({interlinkingVlaue:id})
    }
    render() {
        const {taggingDropdowns, showFile, interlinkingVlaue, interlinkingVideos, interlinkingEbooks,taggingDropdowns1,taggingDropdowns2,contentDetails,contentIDs,interlinkingQuestions,isUploadUrl} = this.state;
        return (
            <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 content-main-section pad0">
                <BlockUi tag="div" blocking={this.state.blocking}>
                <div className="content-add-top-section">
                    <div className="content-top-bar ct-title-mrgn">
                        <span className="add-ct-title"><Link className="a" to="/content">Other Content</Link></span><span className="add-ct-title1">/Update Other Content</span>
                        <div className="ct-top">
                            <span className="add-new-content">Update Other Content</span>
                            <button className="ct-cancel-label ct-cancel-mask" onClick={() => this.goBack()}>Cancel</button>
                            <button className="ct-save-label ct-save-mask" onClick={() =>this.handleSubmit()}>Save</button>
                        </div>
                    </div>
                </div>
                <div className="ct-rectangle2"> 
                    <div className="ct-rectangle3"><span className="ct-rectangle-text">Content Info</span>  <div className="ct-sample-sq ct-right"></div></div>
                </div>
                <div className="content-group">
                    <div className="content-box">
                        <span className="label-content">Content</span>
                        <div className="ct-browse-file-box">
                        {!(showFile || contentDetails.contentType === "") &&<div className="dropzone uploadfuzone fuzone">
                                <div className="upload-row">
                                
                                    <div className="content-upload-image-base">
                                        <div className="upload-icn-mrgn"><img src={Upload} alt=""></img> </div>
                                        <div className="browse-forms-placeholder">Browse File </div>
                                    </div>

                                    <div className="">
                                        <div className="fu-text"> <span><i className="content-upload-text"></i> Please click browse to choose a file from your computer</span> </div>
                                    </div>
                                </div> <input type="file" className="input" accept=".mp4,.docx" onChange={(e) => this.onFileSelect(e)}/>
                            </div>}
                            {showFile &&
                            <div className="preview-main">
                              { (this.state.type === "mp4"|| contentDetails.contentType === "Video"  && !this.state.showUrl) && <div>
                                    <div className="preview-btns-section">
                                        <button className="prv-download-label prv-download-mask" onClick={() => this.handleDownload()}>Download</button>
                                        <button className="prv-remove-label prv-remove-mask" onClick={() => this.handleRemoveFile()}>Remove</button>
                                    </div>
                                    <div>
                                        {/* <img className="selected-file-base" src={this.state.previewFile} alt=""/> */}
                                        <video className="selected-file-base" controls>
                                        <source src={this.state.previewFile} type="video/mp4" />
                                        {/* <source src="movie.ogg" type="video/ogg" /> */}
                                        Your browser does not support the video tag.
                                    </video>
                                    </div>
                                    <div className="content-video-icon">
                                       <img className="img-container" src={Play} alt="" />
                                    </div>
                                </div>}
                                { (this.state.type === "docx" || contentDetails.contentType === "Document" && !this.state.showUrl) && <div>
                                    
                                    <div className="preview-btns-section">
                                            <button className="prv-download-label prv-download-mask">Download</button>
                                            <button className="prv-remove-label prv-remove-mask" onClick={() => this.handleRemoveFile()}>Remove</button>
                                    </div>
                                    <div className="content-video-icon">
                                        <img className="img-container" src={Doc_added} alt=""/>
                                        <div className="doc-file-name">{this.state.fileName.substring(0,27)}...</div>
                                      
                                    </div>
                                    
                                   
                                </div>}
                                { this.state.showUrl && <div>
                                    
                                   
                                    <div className="content-video-icon" onClick={() =>{window.open(this.state.fileName)}}>
                                        
                                        <div className="doc-upload-file-name">{this.state.fileName}</div>
                                      
                                    </div>
                                    
                                   
                                </div>}
                            </div>
                            }
                        </div>
                        <div className="ct-input-base-box">
                            <input className="ct-input-base place" placeholder="Paste a content URL here" onChange={(e) => this.setState({contentUrl:e.target.value,isUploadUrl:true})}/>
                            <button disabled={!isUploadUrl} className={!isUploadUrl?"ct-upload-button-label ct-upload-mask disable-btn":"ct-upload-button-label ct-upload-mask"} onClick={() => this.handleUploadUrl()}>Upload URL</button>
                        </div>
                    </div>
                    <div className="ct-editor">
                        <span className="ct-editor-label">Description</span>
                        <Editor  onChange={this.handleEditorData} label="description" content={contentDetails.contentDescription}/>
                    </div>
                </div>
                <div className="ct-tagging-section">
                    <div className="ct-rectangle4"> 
                        <div className="qt-rectangle5"><span className="ct-rectangle-text1">Tagging</span>  <div className="ct-sample-sq1 ct-right"></div></div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ct-section-mrgn">
                        {taggingDropdowns.map((item,i) => {
                        return(
                            <span className="col-lg-2 col-md-2 col-sm-2 col-xs-2 ct-dd-mrgn" key={item.id}>
                                <select className="ct-tagging-dd-base ct-tagging-dd-subject" id={item.dropdownLabel} onChange={(e) => this.selectTaggingOptions(e,item.dropdownLabel,i)}>
                                    <option value={item.dropdownLabel}>{item.dropdownLabel}</option>
                                    {item.dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                </select>
                            </span>
                        )})
                        }
                        {taggingDropdowns1.map((item,i) => {
                        return(
                            <span className="col-lg-2 col-md-2 col-sm-2 col-xs-2 ct-dd-mrgn" key={item.id}>
                                <select className="ct-tagging-dd-base ct-tagging-dd-subject" id={item.dropdownLabel} onChange={(e) => this.selectTaggingDDOptions(e,item.dropdownLabel,i)}>
                                    <option value={item.dropdownLabel}>{item.dropdownLabel}</option>
                                    {item.dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                </select>
                            </span>
                        )})
                        }
                        {taggingDropdowns2.map((item,i) => {
                        return(
                            <span className="col-lg-2 col-md-2 col-sm-2 col-xs-2 ct-dd-mrgn" key={item.id}>
                                <select className="ct-tagging-dd-base ct-tagging-dd-subject" id={item.dropdownLabel} onChange={(e) => this.selectTaggingDDOptions1(e,item.dropdownLabel,i)}>
                                    <option value={item.dropdownLabel}>{item.dropdownLabel}</option>
                                    {item.dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                </select>
                            </span>
                        )})
                        }
                       
                    </div>
                </div>
                <div className="il-bg"> 
                    <div className="il-rectangle"> 
                        <div className="il-rectangle1"><span className="il-text">Interlinking</span>  <div className="sample-sq2 right"></div></div>
                    </div>
                    <div className="il-base-box il-content-group">
                        <div> 
                        <div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{display:"flex"}}>
                                {interlinkingQuestions.length>0 && <span className="il-video-text il-inner-mrgn">Questions</span>}
                                    {interlinkingQuestions.map((video,k) => {
                                        return(
                                        <div className ="col-lg-2 col-md-2 col-sm-2 col-xs-2 video-id-base" key={"link"+video.otherContentEntityId}>
                                            <span className=" video-id-placeholder">{video.otherContentId} <span className="video-id-mrgn"><img className="close-img" src={Close} alt="" onClick={() => this.removeInterlinking(k)}></img></span></span>
                                            </div>
                                        )}
                                    )}
                                </div>                                 
                            </div>
                            <div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{display:"flex"}}>
                                    <span className="il-video-text il-inner-mrgn">Video</span>
                                    {interlinkingVideos.map((video,k) => {
                                        return(
                                        <div className ="col-lg-2 col-md-2 col-sm-2 col-xs-2 video-id-base" key={"link"+video.otherContentEntityId}>
                                            <span className=" video-id-placeholder">{video.otherContentId.substring(0,5)}... <span className="video-id-mrgn"><img className="close-img" src={Close} alt="" onClick={() => this.removeInterlinking(k)}></img></span></span>
                                            </div>
                                        )}
                                    )}
                                </div>                                 
                            </div>
                            <div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{display:"flex"}}>
                                    <span className="il-ebook-text il-inner-mrgn">EBook</span>
                                    {interlinkingEbooks.map((video,k) => {
                                        return(
                                            <div className ="col-lg-2 col-md-2 col-sm-2 col-xs-2 video-id-base" key={video.otherContentEntityId}>
                                                <span className=" video-id-placeholder">{video.otherContentId.substring(0,5)}... <span className="video-id-mrgn"><img className="close-img" src={Close} alt=""  onClick={() => this.removeInterlinking(k)}></img></span></span>
                                            </div>
                                        )}
                                    )}
                                        
                                    </div>
                                    
                            </div>
                        </div>
                        <div className="il-inputs-base1">
                            <select className="il-content-type-base il-content-type" name="Content Type" onChange={(e) => this.setState({contentType:e.target.value})}>
                                <option>Content Type</option>
                                <option value="Question">Question</option>
                                <option value="Video">Video</option>
                                <option value="Ebook">Ebook</option></select>
                            <Autocomplete
                                options={contentIDs}
                                onChange={this.onChangeId}
                                getIds={this.getIds}
                            />
                            {/* <input className="il-content-id-base il-content-type-id" placeholder="Enter Content ID" value={interlinkingVlaue} onChange={(e) => this.setState({interlinkingVlaue:e.target.value})}></input> */}
                            <button className="il-add-button1 il-add-mask" onClick={(e) => this.onAddInterlinking(e)}>Add</button>
                        </div>
                    </div>
                </div>
                </BlockUi>
            </section>
        )
    }
}