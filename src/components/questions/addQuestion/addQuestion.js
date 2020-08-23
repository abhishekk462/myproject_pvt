import React,{Component} from "react";
import "./addQuestion.css";
import Editor from "../../../shared/utils/rte/richTextEditor";
import Close from "../../../Assets/images/Close.png";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'suneditor/dist/css/suneditor.min.css';
import { Container, Row, Col } from 'reactstrap';
import Delete from "../../../Assets/images/icn_delete.png";
import { Link } from "react-router-dom";
import RadioButton from "../../../shared/utils/radioButton/radio";
import Checkbox from "../../../shared/utils/checkbox/checkbox";
import { CREATE_QUESTION, QUESTION_WS, GET_STATIC_DROPDOWNS,GET_DYNAMIC_DROPDOWNS,GET_INTERLINKS} from "../../../shared/services/endPoints";
import axios from 'axios';
// import Autocomplete from "react-autocomplete";
import Autocomplete from "../../../shared/utils/autocomplete/autocomplete";

export default class AddQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content:"",
            taggingDropdowns1:[],
            taggingDropdowns2:[],
            uploader: "/uploads",
            editor: ClassicEditor,
            questionType:"SCMC",
            answersList: this.answers,
            answerType:"SCMC",
            moreInformationFields:[ {id:2,label:"Solution", content:""},
                {id:3,label:"Video Solution", content:""}
            ],
            instructions:"",
            question: "",
            description:"",
            solution:"",
            // answerChoices:[],
            isCorrect:false,
            noOfQuestions: 2,
            compList:[{"question": "",
            "solution": "",
            "otherContent": [
            ],
            "answerChoices": this.answers}],
            videoSolutions:[],
            videoIndex:0,
            videoSolution:"",
            questionIndex:0,
            selectedDropdowns:[],
            interlinkingVlaue:"",
            interlinkingData:[],
            contentType:"Video",
            interlinkingVideos:[],
            interlinkingEbooks:[],
            isMinimize:[],
            timeToSolve:"",
            taggingData:{"languageId":"","usedIn":"","difficultyId":"","isConceptual":"","subjectId":"","topicId":"","subTopicId":"","examCategoryId":"","examId":"","timeToSolve":""},
            taggingDropdowns:[],
            contentIDs:[]
        }
    }
    

    answers = [
        { answerChoice:"", isCorrect: false,optionNumber:1},
        { answerChoice:"", isCorrect: false,optionNumber:2},
        { answerChoice:"", isCorrect: false,optionNumber:3},
        { answerChoice:"", isCorrect: false,optionNumber:4},
        { answerChoice:"", isCorrect: false,optionNumber:5},
    ];

    ddRequestData = ["Topic","Sub-Topic",];
    ddRequestData1 = ["Exam"];

    handleEditorData = (data,label,index) => {
        const {question,solution,videoSolutions, answersList,questionType} = this.state;
        let answerChoices = this.state.answersList;
        let compLists = this.state.compList;
        this.setState({questionIndex:index});
        if(label === "instructions") {
            this.setState({instructions:data});
        }
        else if(label === "question" || label === "Question") {
            this.setState({question:data});
        }
        else if(label === "description") {
            this.setState({description:data});
        }
        else if(label === "Solution") {
            this.setState({solution:data});
        } else {
            compLists[index].answerChoices[label].answerChoice = data;
            // answerChoices[label].answerChoice = data;
            // compLists[index].answerChoices[label].isCorrect= this.state.isCorrect;
            this.setState({compList:compLists});
        }
        if(questionType=== "Comprehension" || questionType=== "Cloze Test")

       {
      
        compLists[index].question = question;
        compLists[index].solution = solution;
        
        this.setState({compList:compLists});}
    }

    x="";
    comprehensionOptions = [ {id:1,label:"Question", content:""},
        {id:2,label:"Solution", content:""},
        {id:3,label:"Video Solution", content:""},
    ];

    getDropdownStaticList = () => {
        let taggingDropdowns1 = [];
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_STATIC_DROPDOWNS}`,{"headers":this.headers})
        .then(res => {
            let data = res.data.data.response.dropdownDataModel;
            for(let i=0;i<data.length;i++){
                if(data[i].dropdownLabel !== "Content Type" && data[i].dropdownLabel !== "Question Type" && data[i].dropdownLabel !== "Sub Content Type" && data[i].dropdownLabel !== "Status" && data[i].dropdownLabel !== "Scope") {
                    taggingDropdowns1.push(data[i]);
                }
            }
            this.setState({taggingDropdowns1})
        })
    }

    getDropdownDynamicList = (input) => {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_DYNAMIC_DROPDOWNS}`,input,{"headers":this.headers})
        .then(res => {
            if(res.data.data.response.dropdownDataModel.length>0) {
                let taggingDropdowns = this.state.taggingDropdowns;
                for(let i=0;i<res.data.data.response.dropdownDataModel.length;i++) {
                    if(taggingDropdowns.length > 0 && taggingDropdowns.some(item => res.data.data.response.dropdownDataModel[i].dropdownLabel === item.dropdownLabel))
                    {
                        // alert("item",res.data.data.response[i].name)
                        taggingDropdowns.map((item,k) =>{
                            if(k>0 && res.data.data.response.dropdownDataModel[i].dropdownLabel === item.dropdownLabel)
                            {
                                taggingDropdowns[k] = res.data.data.response.dropdownDataModel[i];
                            }
                        })
                    } else {
                        taggingDropdowns.push(res.data.data.response.dropdownDataModel[i]);
                    }
                }
                this.setState({taggingDropdowns});
            }            
        })
    }

    getDropdownDynamicList1 = (input) => {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_DYNAMIC_DROPDOWNS}`,input,{"headers":this.headers})
        .then(res => {
            if(res.data.data.response.dropdownDataModel.length>0) {
                let taggingDropdowns = this.state.taggingDropdowns2;
                for(let i=0;i<res.data.data.response.dropdownDataModel.length;i++) {
                    if(taggingDropdowns.length > 0 && taggingDropdowns.some(item => res.data.data.response.dropdownDataModel[i].dropdownLabel === item.dropdownLabel))
                    {
                        // alert("item",res.data.data.response[i].name)
                        taggingDropdowns.map((item,k) =>{
                            if(k>0 && res.data.data.response.dropdownDataModel[i].dropdownLabel === item.dropdownLabel)
                            {
                                taggingDropdowns[k] = res.data.data.response.dropdownDataModel[i];
                            }
                        })
                    } else {
                        taggingDropdowns.push(res.data.data.response.dropdownDataModel[i]);
                    }
                }
                this.setState({taggingDropdowns2:taggingDropdowns});
            }            
        })
    }

    handleQTypeChange = (e, label) => {
        let compList = this.state.compList;
        if(label === "QT"){
            
            this.setState({questionType: e.target.value});
            if(e.target.value === "Comprehension" ||  e.target.value === "Cloze Test" && compList.length < 2) {
                compList.push({"question": "",
                "solution": "",
                "otherContent": [
                ],
                "answerChoices":[
                    { answerChoice:"", isCorrect: false,optionNumber:1},
                    { answerChoice:"", isCorrect: false,optionNumber:2},
                    { answerChoice:"", isCorrect: false,optionNumber:3},
                    { answerChoice:"", isCorrect: false,optionNumber:4},
                    { answerChoice:"", isCorrect: false,optionNumber:5},
                ]})
                this.setState({moreInformationFields:this.comprehensionOptions, compList});
            }

            if(e.target.value === "SCMC" ||  e.target.value === "MCMC") {
                let moreInformationFields = [ {id:2,label:"Solution", content:""},
                    {id:3,label:"Video Solution", content:""}
                ];
                document.getElementById("Question0").style.display = "block";
                compList=[{"question": "","solution": "","otherContent": [],"answerChoices": this.answers}]
                this.setState({moreInformationFields, compList});
            }
        }
        if(label === "AT"){
            this.setState({answerType: e.target.value});
        }
        if(label === "NOQ"){
            let isMinimize = this.state.isMinimize;
            let loopValue = +(e.target.value)-compList.length;
            if(loopValue>0) {
                for(let i=0;i<loopValue;i++){
                    compList.push({"question": "",
                    "solution": "",
                    "otherContent": [
                    ],
                    "answerChoices": [
                        { answerChoice:"", isCorrect: false,optionNumber:1},
                        { answerChoice:"", isCorrect: false,optionNumber:2},
                        { answerChoice:"", isCorrect: false,optionNumber:3},
                        { answerChoice:"", isCorrect: false,optionNumber:4},
                        { answerChoice:"", isCorrect: false,optionNumber:5},
                    ]})
                    isMinimize[compList.length+i] = false;
                }
                
                
            } else {
                compList.length = +(e.target.value);
            }   
           
            this.setState({noOfQuestions: e.target.value, compList,isMinimize});
        }
    }

    addAnswersHandler = (i) => {
        let questionsList = this.state.compList;
        questionsList[i].answerChoices.push({ "answerChoice":"", "isCorrect": false,"optionNumber":questionsList[i].answerChoices.length+1})
        this.setState({compList:questionsList});
    }

    removeAnswerHandler = (i,j) => {
        let questionsList = this.state.compList;
        questionsList[j].answerChoices.splice(i, 1);
        this.setState({compList:questionsList});
    }

    handleAnswerSingleChoice = (e,i,k) =>{
     
        let answers = this.state.answersList, compLists = this.state.compList;;
     
        compLists[k].answerChoices.map((answer,j) =>{i===j?answer.isCorrect = true:answer.isCorrect= false})
        
        // compLists[k].answerChoices = answers;
        // compLists[k].answerChoices[i].isCorrect = e;
      
        this.setState({answersList: answers, isCorrect: e, compList:compLists});
    }

    handleAnswerMultipleChoice = (e,i,k) =>{
       
        let answers = this.state.answersList, compLists = this.state.compList;;
        answers[i].isCorrect = e;
        // compLists[k].answerChoices = answers;
        compLists[k].answerChoices[i].isCorrect = e;
        this.setState({answersList: answers, isCorrect: e, compList:compLists});
    }

    handleVideoSolutionONchange = (e) =>{
        this.setState({videoSolution: e.target.value});
    }
    solutions = [];
    addVideoSolution = (j) =>{
        const {videoSolution, videoIndex,videoSolutions} = this.state;
        let solutions = videoSolutions, compLists = this.state.compList;
        if (videoSolution.indexOf(',') > -1) { 
          
            videoSolution.split(',').forEach((solution,i) =>{
                solutions.push({"otherContentEntityId":i+1, "otherContentId": solution})
            })
            
        } else {
            solutions.push({"otherContentEntityId":videoIndex+1, "otherContentId": videoSolution});

        }
        compLists[j]['otherContent'] = solutions;
        this.solutions = solutions;
        this.setState({videoSolutions:solutions,videoSolution:'', compList:compLists});
    }

    removeVideoSolution = (i,j) => {
        let compLists = this.state.compList;
        compLists[i].otherContent.splice(j,1);
        this.setState({compList:compLists});
    }
    selectTaggingOptions = (e,label,i) => {
       
        let selectedDropdowns = this.state.taggingData;
            if(label === "Language") {
                selectedDropdowns.languageId = +(e.target.value)

            } else if(label === "Difficulty") {
                selectedDropdowns.difficultyId =  +(e.target.value)

            } else if(label === "Conceptual") {
                selectedDropdowns.isConceptual = +(e.target.value)

            } else if(label === "Used In") {
                selectedDropdowns.usedIn =  +(e.target.value)

            } else {
                selectedDropdowns[label] =  +(e.target.value)
            }
          this.setState({taggingData:selectedDropdowns})
       
    }
    selectTaggingDDOptions = (e, label,i) => {
        let selectedDropdowns = this.state.taggingData;
        if(label === "Subject") {
            selectedDropdowns.subjectId =  +(e.target.value);
        }
        if(label === "Topic") {
            selectedDropdowns.topicId =  +(e.target.value);
        }
        if(label === "Sub-Topic") {
            selectedDropdowns.subTopicId =  +(e.target.value);
        }
        if(label === "Subject" )
        { 
           let request = {"dropdownName" : "Topic",  "dropdownValueId" :+(e.target.value)}
            this.getDropdownDynamicList(request);
        }
        if(label === "Topic" )
        { 
           let request = {"dropdownName" : "Sub-Topic",  "dropdownValueId" :+(e.target.value)}
            this.getDropdownDynamicList(request);
        }
       
        this.setState({taggingData:selectedDropdowns});
    }

    selectTaggingDDOptions1 = (e, label,i) => {
        let selectedDropdowns = this.state.taggingData;
        if(label === "Exam Category") {
            selectedDropdowns.examCategoryId =  +(e.target.value);
        }
        if(label === "Exam") {
            selectedDropdowns.examId =  +(e.target.value);
        }
        if(i<this.ddRequestData.length )
       { 
           let request = {"dropdownName" : this.ddRequestData1[i],  "dropdownValueId" : +(e.target.value)}
            this.getDropdownDynamicList1(request);
        }
        
        this.setState({taggingData:selectedDropdowns});
    }
    

    formatComprehensionRequest = () => {
        const{questionType,instructions,description,answerType,noOfQuestions,compList,interlinkingData,taggingData,question} = this.state;  
        let user = sessionStorage.getItem("userId");
        let requestBody =  [
            {
                "questionType": questionType,
                "instruction": instructions,
                "description": description,
                "createdBy": +(user),
                "answerType": answerType,
                "noOfQuestions": noOfQuestions,
                "questionTagEntity": taggingData,
                "otherContent": interlinkingData,
                "contentRequestModels": compList
            }
        ]   
        return requestBody;
    }

    validateRequest = (request) => {
        let invalidFields = []
    
        if(request[0].questionType === "SCMC" || request[0].questionType === "MCMC") {
           if( request[0].answerChoices.every((answer) => !answer.isCorrect)) {
                invalidFields.push("Select Correct Answer\n")
           }
           if(request[0].question === "") {
                invalidFields.push("Question")
            }
            if(request[0].solution === "") {
                invalidFields.push("Solution")
            }
        }
       
       
        if( request[0].questionTagEntity.languageId === "") {
            invalidFields.push("Language")
        }
        if(  request[0].questionTagEntity.usedIn === "") {
            invalidFields.push("Used In")
        }
        if(  request[0].questionTagEntity.difficultyId === "") {
            invalidFields.push("Difficulty")
        }
        if(  request[0].questionTagEntity.isConceptual === "") {
            invalidFields.push("Conceptual")
        }
        if(  request[0].questionTagEntity.subjectId === "") {
            invalidFields.push("Subject")
        }
        if(  request[0].questionTagEntity.topicId === "") {
            invalidFields.push("Topic")
        }
        if(  request[0].questionTagEntity.subTopicId === "") {
            invalidFields.push("Sub-Topic")
        }
        if(  request[0].questionTagEntity.timeToSolve === "") {
            invalidFields.push("Time To Solve \n")
        }
        if(request[0].questionType === "Comprehension")
        {
            request[0].contentRequestModels.forEach((question,i) => {
                if(question.question === "") {
                    invalidFields.push("Question"+(i+1)+"->Question")
                }})
          
        }
        if(request[0].questionType === "Cloze Test")
        {
            if(request[0].description === "") {
                invalidFields.push("Description")
            }
           
        }
        if(request[0].questionType === "Comprehension" || request[0].questionType === "Cloze Test")
        {
            if(request[0].instruction === "") {
                invalidFields.push("Instruction")
            }
            request[0].contentRequestModels.forEach((question,i) => {
             
                if(question.solution === "") {
                    invalidFields.push("Question"+(i+1)+"->Solution\n")
                }
                if( question.answerChoices.every((answer) => !answer.isCorrect)) {
                    invalidFields.push("Select Correct Answer for Question"+(i+1)+"\n")
                   }
                })
        }
       

        return invalidFields;
    }

    addQuestionHandler = () => {
        const{questionType,instructions,question,solution, compList,interlinkingData,taggingData} = this.state;
        let requestBody = [], validate =[];
        let user = sessionStorage.getItem("userId");
        if(questionType === "SCMC" || questionType === "MCMC") {
            requestBody =
                [{
                "questionType": questionType,
                "instruction": instructions,
                "question": question,
                "solution":solution,
                "createdBy": +(user),
                "questionTagEntity": taggingData,
                "otherContent": compList[0].otherContent.concat(interlinkingData),
                "answerChoices": compList[0].answerChoices
            }];
             validate = this.validateRequest(requestBody);
        } else {
            requestBody = this.formatComprehensionRequest();
            validate = this.validateRequest(requestBody);
        }
        
        if(validate.length === 0){
            this.token = sessionStorage.getItem("Token");
            this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
            axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${CREATE_QUESTION}`,requestBody,{"headers":this.headers})
            .then(res => {
                // if(res.data.status === 400){
                //     alert("Please fill mandatory data")
                // }
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
            let message = "Please fill mandatory fields \n"+validate.toString();
            alert(message);
        }
    }
    mainTags = [ "Subject","Exam Category"]
    componentDidMount(){
        this.getDropdownStaticList();
        let request = {
            "dropdownName" : "Subject"
        };
        this.getDropdownDynamicList(request);

        let request1 = {
            "dropdownName" : "Exam Category"
        };
        this.getDropdownDynamicList1(request1);
    }

    onAddInterlinking = (e) => {
        e.preventDefault();
        const {interlinkingVlaue,videoIndex, contentType} = this.state;
        let solutions = [], compLists = this.state.compList, interlinkingData=[], interlinkingVideos=[],interlinkingEbooks=[];
        if (interlinkingVlaue.indexOf(',') > -1) { 
           
            interlinkingVlaue.split(',').forEach((solution,i) =>{
                solutions.push({"otherContentEntityId":i+1, "otherContentId": solution})
            })
            
        } else {
            solutions.push({"otherContentEntityId":videoIndex+1, "otherContentId": interlinkingVlaue});

        }
        if(contentType === "Ebook") {
            interlinkingEbooks=solutions ;
            this.setState({interlinkingEbooks})
        }else
            {
                interlinkingVideos = solutions;
                this.setState({interlinkingVideos})
            }
        interlinkingData = interlinkingVideos.concat(interlinkingEbooks);
        this.setState({interlinkingData,interlinkingVlaue:'', compList:compLists});
    }

    removeInterlinking = (i) => {
        const { contentType} = this.state;
        let interlinkingEbooks,interlinkingVideos, interlinkingData= this.state.interlinkingData;
        if (contentType === "Ebook") {
            interlinkingEbooks=this.state.interlinkingEbooks ;
            interlinkingEbooks.splice(i,1);
            this.setState({interlinkingEbooks})
        } else
            {
                interlinkingVideos = this.state.interlinkingVideos;
                interlinkingVideos.splice(i,1);
                this.setState({interlinkingVideos})
            }
            interlinkingData = interlinkingVideos.concat(interlinkingEbooks);
            this.setState({interlinkingData});
    }

    handleMinimize = (i) => {
        let isMinimize= this.state.isMinimize;
        isMinimize[i] = true;
        this.setState({isMinimize})
        if(this.state.compList.length>1)
        { document.getElementById("Question"+i).style.display = "none";}
    }

    handleMaximize = (i) => {
        let isMinimize = this.state.isMinimize;
        isMinimize[i] = false;
        this.setState({isMinimize});
       
        document.getElementById("Question"+i).style.display = "block";
    }
    goBack= () => {
        this.props.history.push('/questions');
    }

    onChangeTime = (value) => {
        let taggingData = this.state.taggingData;
        taggingData.timeToSolve = "00:"+ value;
        this.setState({taggingData});
    }

    onChangeId = (input) => {
        console.log("user input:",input)
        let request ={
            "contentType" : this.state.contentType,
            "contentId" : input
        }
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_INTERLINKS}`,request,{"headers":this.headers})
        .then(res => {
         
          console.log("content type:",res)
          this.setState({contentIDs:res.data.data.response})
        })
    }

    getIds=(id) =>{
        this.setState({interlinkingVlaue:id})
    }

    render() {
        const {taggingDropdowns1, questionType, answerType,moreInformationFields, compList,videoSolution, contentIDs,questionIndex,interlinkingVlaue,interlinkingEbooks,interlinkingVideos,isMinimize,timeToSolve,taggingDropdowns,taggingDropdowns2} = this.state;
        return (
            <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 main-section pad0">                 
                <div className="qt-add-top-section">               
                    <div className="qt-top-bar title-mrgn">
                        <span className="add-qt-title1"><Link className="a" to="/questions">Questions</Link></span><span className="exam-ma">/Add New Question</span>
                        <div className="qt-top">
                            <span className="add-new-question">Add New Question</span>
                            <button className="qt-cancel-label qt-cancel-mask" onClick={() => this.goBack()}>Cancel</button>
                            <button className="qt-save-label qt-save-mask" onClick={this.addQuestionHandler}>Save</button>
                        </div>
                    </div>
                </div>               
                <div className="qt-rectangle2"> 
                    <div className="qt-rectangle3"><span className="qt-rectangle-text title-mrgn">Question & Answer</span>  <div className="sample-sq right"></div></div>
                </div>
                <div className="qt-details-mrgn">
                    <span className="qt-details-label"> Question details</span>
                </div>
                <div className=" qt-details-container">
                    <div style={{display:"flex"}}>
                        <div className="qt-select-mrgn">
                            <select className="qt-select-input-base select-forms-placeholder" id="mySelect" onChange={(e) =>this.handleQTypeChange(e,"QT")}>
                                <option className=" qt-select-input-base potion-tp" value="SCMC">SCMC</option>
                                <option className="qt-select-input-base" value="MCMC">MCMC</option>
                                <option className="qt-select-input-base" value="Comprehension">Comprehension</option>
                                <option className="qt-select-input-base" value="Cloze Test">Cloze Test</option>
                            </select>
                            <div className="qt-select-label">Question Type<span className="login-label">*</span></div>
                        </div> 
                        {(questionType === "Comprehension" || questionType === "Cloze Test") &&<div className="qt-select-mrgn">

                            <select className="qt-select-input-base select-forms-placeholder" id="mySelect" onChange={(e) =>this.handleQTypeChange(e,"AT")}>
                                <option className=" qt-select-input-base potion-tp" value="SCMC">SCMC</option>
                                <option className="qt-select-input-base" value="MCMC">MCMC</option>
                                {/* <option className="qt-select-input-base" value="Comprehension">Comprehension</option>
                                <option className="qt-select-input-base" value="Close Test">Close Test</option> */}
                            </select>
                            <div className="qt-select-label">Answer Type<span className="login-label">*</span></div>
                        </div> }
                        {(questionType === "Comprehension"|| questionType === "Cloze Test" ) &&<div className="qt-select-mrgn">
                            <select className="qt-select-input-base select-forms-placeholder" id="mySelect" onChange={(e) =>this.handleQTypeChange(e,"NOQ")}>
                                <option className=" qt-select-input-base potion-tp" value="2">2</option>
                                <option className="qt-select-input-base" value="3">3</option>
                                <option className="qt-select-input-base" value="4">4</option>
                                <option className="qt-select-input-base" value="5">5</option>
                            </select>
                            <div className="qt-select-label">No. of Questions<span className="login-label">*</span></div>
                        </div>}
                    </div>                   
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 qt-label-mrgn option-tp">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div className="rte-label">Instructions{( questionType === "Comprehension" || questionType === "Cloze Test") &&<span className="login-label">*</span>}</div>
                           
                            <Editor onChange={this.handleEditorData} label="instructions" innerIndex={questionIndex} content=""/>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 qt-rte2-mrgn">
                            <div className="rte-label">{(questionType === "Comprehension" || questionType === "Cloze Test")?"Description":"Question"}{questionType === "Cloze Test" &&<span className="login-label">*</span>}
                            {(questionType === "SCMC" || questionType === "MCMC" ) &&<span className="login-label">*</span>}
                            </div>
                            <Editor onChange={this.handleEditorData} label={questionType === "Comprehension" || questionType === "Cloze Test"?"description":"question"} innerIndex={questionIndex} content=""/>
                            
                        </div>
                    </div>                   
                  
                    {/* { questionType === "Comprehension" &&<div className="comp-rectangle">
                        <span className="comp-rectangle-lebel">Question2</span>
                        <button className="comp-rectangle-btn">-</button>
                    </div>} */}
                     
                    {compList.map((question,j) => { return <div key={j} >
                    {( questionType === "Comprehension" || questionType === "Cloze Test") && <div className="comp-rectangle">
                            <span className="comp-rectangle-lebel">{"Question"+(j+1)}</span>
                            {isMinimize[j] && <button className="comp-rectangle-btn" onClick={() => this.handleMaximize(j)}>+</button>}
                            {!isMinimize[j] && <button className="comp-rectangle-btn" onClick={() => this.handleMinimize(j)}>-</button>}
                        </div>}
                        <div id={"Question"+j}>
                        <div className="qt-label-mrgn option-tp">
                        <Container>
                            <Row xs="2"  sm="2" md="2">
                                {moreInformationFields.map((data) => { return<Col key={data.label}>    
                                    {data.label!=="Video Solution" && <div className="">
                                        <div className="rte-label">{data.label}{(questionType !== "Cloze Test" || data.label ==="Solution") && <span className="login-label">*</span>}</div>
                                        <div className="rte-box">
                                            <Editor onChange={this.handleEditorData} label={data.label} innerIndex={j} content=""/>                                                
                                        </div>
                                    </div>}
                                    { data.label==="Video Solution" && <div className="">
                                        <div className="rte-label">{data.label}</div>
                                        <div className="rte-box video-solution-base">
                                            <Container className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{display:"flex"}}>
                                                <Row  xs="5"  sm="5" md="5">
                                                {question.otherContent.map((video,k) => {
                                                    return(
                                                    <Col className ="col-lg-2 col-md-2 col-sm-2 col-xs-2 video-id-base" key={video.otherContentEntityId}>
                                                        <span className=" video-id-placeholder">{video.otherContentId.substring(0,5)}... <span className="video-id-mrgn">
                                                            <img className="close-img" src={Close} alt="" onClick={() => this.removeVideoSolution(j,k)}></img></span></span>
                                                        </Col>
                                                    )}
                                                )}
                                                </Row>                                               
                                            </Container>                                        
                                            <div className="video-sol-input-base">
                                                <input className="video-sol-placeholder" placeholder="Enter Video ID" onChange={(e) => this.handleVideoSolutionONchange(e)} value={videoSolution}></input>
                                                <button className="vid-base-buttons-label vid-sol-mask" onClick={() => this.addVideoSolution(j)}>Add</button>
                                            </div>
                                        </div>
                                        </div>}
                                    </Col>})}
                                </Row>
                            </Container>
                        </div>
                        <div className="ans-details-mrgn">
                            <span className="qt-details-label">Answer Options</span>
                        </div>
                        <div className="">
                            <Container>
                                <Row xs="2"  sm="2" md="2" style={{display:"flex"}}>
                                    {question.answerChoices.map((item,i) => { 
                                        return <Col key={i}>
                                            <div className="rte-label">
                                                { questionType === "SCMC" ?   <span  className="radio-display">
                                                        <RadioButton handleChange={(e) => this.handleAnswerSingleChoice(e,i,j)} checked={item.isCorrect}/>
                                                        <span className="radio-label-mrgn">{"Option "+(i+1)}</span>
                                                    </span>:
                                                    (questionType === "Comprehension" || questionType === "Cloze Test") && answerType === "SCMC" ? <span  className="radio-display"> 
                                                        <RadioButton handleChange={(e) => this.handleAnswerSingleChoice(e,i,j)} checked={item.isCorrect}/>
                                                        <span className="radio-label-mrgn">{"Option "+(i+1)}</span>
                                                    </span>:
                                                    <span className="cb-mrgn">
                                                        <Checkbox value={"Option "+i} handleChange={(e) => this.handleAnswerMultipleChoice(e,i,j)} checked={item.isCorrect}/>
                                                        <span className="cb-label-mrgn">{"Option "+(i+1)}</span>
                                                    </span>}
                                                { item.isCorrect && <span className="correct-answer-label">(Correct Answer)</span>}
                                                { i > 1 && <span className="delete-section show-cursor" onClick={() => this.removeAnswerHandler(i,j)}><img src={Delete} alt=""></img><span className="delete-label">Remove</span></span>}
                                            </div>
                                            <Editor onChange={this.handleEditorData} label={i} innerIndex={j} content=""/>   
                                        </Col>})}
                                    </Row>
                                </Container>
                            </div>
                       
                        <div className="add-option-rectangle">
                            <button className="add-option-buttons-label add-option-mask" onClick={() => this.addAnswersHandler(j)}>Add New Option</button>
                            <span className="base-buttons-side-label">Click this button to add "New Option" as an answer.</span>
                        </div> 
                        </div>
                        </div>})}
                    </div>                  
               
                    <div className="tagging-section">
                        <div className="qt-rectangle4"> 
                            <div className="qt-rectangle5"><span className="qt-rectangle-text">Tagging</span>  <div className="sample-sq1 right"></div></div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dd-section-mrgn">
                            {taggingDropdowns1 && taggingDropdowns1.map((item,i) => {
                                return(
                                
                                    <span className="col-lg-2 col-md-2 col-sm-2 col-xs-2 dd-mrgn" key={"dropdown"+i}>
                                        <select className="tagging-dd-base tagging-dd-subject" id={item.dropdownLabel} onChange={(e) => this.selectTaggingOptions(e,item.dropdownLabel,i)} required="required" aria-required="true">

                                            <option>{item.dropdownLabel}</option>
                                            {item.dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>
                                )})
                            }
                             {taggingDropdowns.length>0 && taggingDropdowns.map((item,i) => {
                                return(
                                
                                    <span className="col-lg-2 col-md-2 col-sm-2 col-xs-2 dd-mrgn" key={"dropdown"+i}>
                                        <select className="tagging-dd-base tagging-dd-subject" id={item.dropdownLabel} onChange={(e) => this.selectTaggingDDOptions(e,item.dropdownLabel,i)} required="required">

                                            <option>{item.dropdownLabel}</option>
                                            {item.dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>
                                )})
                            }
                            {taggingDropdowns2.length>0 && taggingDropdowns2.map((item,i) => {
                                return(
                                
                                    <span className="col-lg-2 col-md-2 col-sm-2 col-xs-2 dd-mrgn" key={"dropdown"+i}>
                                        <select className="tagging-dd-base tagging-dd-subject" id={item.dropdownLabel} onChange={(e) => this.selectTaggingDDOptions1(e,item.dropdownLabel,i)}>

                                            <option>{item.dropdownLabel}</option>
                                            {item.dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>
                                )})
                            }
                            <span className="time-input-base1">
                            <span  className="tts-top"><label className="time-text-placeholder1">Time to solve this question</label></span>
                            <span  className="tts-top"><input type="text" placeholder="MM:SS" className="mmss-input-base1 mmss-placeholder" onChange={(e)=>this.onChangeTime(e.target.value)}  pattern="^([0-5]?[0-9]):([0-5]?[0-9])" required></input></span>
                            </span>
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
                                  {interlinkingVideos.length>0  && <span className="il-video-text il-inner-mrgn">Video</span>}
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
                                  {interlinkingEbooks.length>0 &&<span className="il-ebook-text il-inner-mrgn">EBook</span>}
                                    { interlinkingEbooks.map((video,k) => {
                                        return(
                                            <div className ="col-lg-2 col-md-2 col-sm-2 col-xs-2 video-id-base" key={video.otherContentEntityId}>
                                                <span className=" video-id-placeholder">{video.otherContentId.substring(0,5)}... <span className="video-id-mrgn"><img className="close-img" src={Close} alt=""  onClick={() => this.removeInterlinking(k)}></img></span></span>
                                            </div>
                                        )}
                                    )}
                                </div>                                    
                            </div>
                        </div>
                        <div className="il-inputs-base">
                            <select className="il-content-type-base il-content-type" name="Content Type" onChange={(e) => this.setState({contentType:e.target.value})}>
                                <option>Content Type</option>
                                <option value="Video">Video</option>
                                <option value="Ebook">Ebook</option>
                            </select>
                            <Autocomplete
                                options={contentIDs}
                                onChange={this.onChangeId}
                                getIds={this.getIds}
                            />
                            {/* <input className="il-content-id-base il-content-type-id" id="myInput"  placeholder="Enter Content ID" value={interlinkingVlaue} onChange={(e) => this.setState({interlinkingVlaue:e.target.value})}></input> */}
                            <button className="il-add-button il-add-mask" onClick={(e) => this.onAddInterlinking(e)}>Add</button>
                        </div>
                       
                    </div>
                </div>
            </section>
        )
    }
}