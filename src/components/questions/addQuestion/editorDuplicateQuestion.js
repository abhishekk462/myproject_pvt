import React,{ Component} from "react";
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
import { UPDATE_QUESTION, QUESTION_WS, GET_QUESTION_DETAILS, CREATE_QUESTION, GET_STATIC_DROPDOWNS,GET_DYNAMIC_DROPDOWNS,GET_INTERLINKS } from "../../../shared/services/endPoints";
import axios from 'axios';
import Autocomplete from "../../../shared/utils/autocomplete/autocomplete";

export default class UpdateQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content:"",
            taggingDropdowns1:this.staticDropdowns,
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
            noOfQuestions: 1,
            questionDetails:{},
            videoSolution:"",
            taggingData:{},
            taggingDropdowns:[],
            interlinkingVlaue:"",
            contentType:"",
            interlinkingEbooks:[],
            interlinkingVideos:[],
            videoIndex:0,
            verifyAnswers:[false,false,false,false,false],
            contentIDs:[],
            countFun:1,
            countFun1:1

        }
    }
    ddRequestData = ["Topic","Sub-Topic",];
    ddRequestData1 = ["Exam"];
    staticDropdowns =[{"dropdownLabel":"Language","dropdownMappingModels":[{"valueName":"English","valueCode":1010},{"valueName":"Hindi","valueCode":1020},{"valueName":"Bengali","valueCode":1030},{"valueName":"Tamil","valueCode":1040},{"valueName":"Telugu","valueCode":1050},{"valueName":"Marathi","valueCode":1060}]},
        {"dropdownLabel":"Used In","dropdownMappingModels":[{"valueName":"Paid","valueCode":1},{"valueName":"Free","valueCode":2}]},
        {"dropdownLabel":"Difficulty","dropdownMappingModels":[{"valueName":"L1","valueCode":1},{"valueName":"L2","valueCode":2},{"valueName":"L3","valueCode":3},{"valueName":"L4","valueCode":4},{"valueName":"L5","valueCode":5},{"valueName":"L6","valueCode":6},{"valueName":"L7","valueCode":7},{"valueName":"L8","valueCode":8},{"valueName":"L9","valueCode":9},{"valueName":"L10","valueCode":10}]},
        {"dropdownLabel":"Conceptual","dropdownMappingModels":[{"valueName":"Yes","valueCode":1},{"valueName":"No","valueCode":0}]},
        // {"dropdownLabel":"Content Type","dropdownMappingModels":[{"valueName":"Question","valueCode":1},{"valueName":"Video","valueCode":2},{"valueName":"Pdf","valueCode":3}]},
        // {"dropdownLabel":"Question Type","dropdownMappingModels":[{"valueName":"SCMC"},{"valueName":"MCMC"},{"valueName":"Comprehension"},{"valueName":"Cloze Test"}]},
        // {"dropdownLabel":"Status","dropdownMappingModels":[{"valueName":"Pending Creation","valueCode":1000},{"valueName":"Pending Verification","valueCode":1200},{"valueName":"Rejected Creation","valueCode":1300},{"valueName":"Pending Rejected Verification","valueCode":1400},{"valueName":"Approved","valueCode":2000},{"valueName":"Published","valueCode":3000},{"valueName":"Unpublished","valueCode":4000}]},
        // {"dropdownLabel":"Sub Content Type","dropdownMappingModels":[{"valueName":"Solution","valueCode":1},{"valueName":"Conceptual","valueCode":2},{"valueName":"Practice","valueCode":3},{"valueName":"MCQ Lectures","valueCode":4}]},
        // {"dropdownLabel":"Scope","dropdownMappingModels":[{"valueName":"High","valueCode":1},{"valueName":"Medium","valueCode":2},{"valueName":"Low","valueCode":3}]}
    ]

 
    getQuestionDetails = () => {
        if( this.props.location.questionProps.questionEntityId !==undefined)
       { 
           let requestBody = {
                "questionEntityId": this.props.location.questionProps.questionEntityId
            };
            this.token = sessionStorage.getItem("Token");
            this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
            axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_QUESTION_DETAILS}`,requestBody,{"headers":this.headers})
            .then(res => {
                if(res.data.data.response.parentQuestionType === "Comprehension" || res.data.data.response.parentQuestionType === "Cloze Test") {
                    this.setState({moreInformationFields:this.comprehensionOptions})
                }
                let data = res.data.data.response,verifyAnswers=this.state.verifyAnswers;
             
                data.answerChoices.sort((a, b) => {return a.optionNumber-b.optionNumber});
                data.answerChoices.forEach((item,i) => verifyAnswers[i] = item.isCorrect);
                let taggingResponse = res.data.data.response.questionTagEntity;
                let taggingData = taggingResponse;
               
                this.setState({questionDetails:data,taggingData, verifyAnswers},() =>{ this.setData();});
            
               
                // this.getDropdownStaticList();
                let input ={
                    "dropdownName" : "Subject"
                };
                this.getDropdownDynamicList(input,1);
                let input1 ={
                    "dropdownName" : "Exam Category"
                };
                
                this.getDropdownDynamicList1(input1,1);

                let input2 ={ "dropdownName" : "Topic",
                "dropdownValueId" :  taggingData.subjectId};
                this.getDropdownDynamicList(input2,2);
                let input3 ={ "dropdownName" : "Sub-Topic",
                "dropdownValueId" :  taggingData.topicId};
                this.getDropdownDynamicList(input3,3);

                let input4 ={ "dropdownName" : "Exam",
                "dropdownValueId" :  taggingData.examCategoryId};
                this.getDropdownDynamicList1(input4,2);
                // this.state.questionDetails.answerChoices.forEach((item,i) => item.isCorrect?document.getElementById("Correct"+i).style.display = "block":document.getElementById("Correct"+i).style.display = "none");
            }).catch(() =>{
                alert("Something went wrong Please try again");
                this.goBack();
            
            })
        }
    }

    setData = () => {
        const {taggingData} = this.state;
        if( taggingData) {
            document.getElementById("Language").value = taggingData.languageId !== undefined && taggingData.languageId !== 1? taggingData.languageId:"Language";
            document.getElementById("Difficulty").value =  taggingData.difficultyId  !== undefined? taggingData.difficultyId:"Difficulty";
            document.getElementById("Conceptual").value = taggingData.isConceptual  !== undefined? taggingData.isConceptual:"Conceptual";
            document.getElementById("Used In").value = taggingData.usedIn !== undefined ? taggingData.usedIn:"Used In";
            document.getElementById("Time").value = taggingData.timeToSolve  !== undefined ? taggingData.timeToSolve.substring(3):"";
            
        }
    }

    getDropdownDynamicList = (input,label) => {
        const {taggingData} = this.state;
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_DYNAMIC_DROPDOWNS}`,input,{"headers":this.headers})
        .then(res => {
            if(res.data.data.response.dropdownDataModel.length>0) {
                let taggingDropdowns = this.state.taggingDropdowns;
                for(let i=0;i<res.data.data.response.dropdownDataModel.length;i++) {
                    if(taggingDropdowns.length > 0 && taggingDropdowns.some(item => res.data.data.response.dropdownDataModel[i].dropdownLabel === item.dropdownLabel))
                    {
                        
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
            
                this.setState({taggingDropdowns},() => {
                    if(label === 1) {
                        document.getElementById("Subject").value = taggingData.subjectId ? taggingData.subjectId:"Subject";
                    }
                    if(label === 2) {
                        document.getElementById("Topic").value = taggingData.topicId ? taggingData.topicId:"Topic"
                    }
                    if(label === 3) {
                        document.getElementById("Sub-Topic").value = taggingData.subTopicId!==1? taggingData.subTopicId:"Sub-Topic"
                    }
                });
                // if(this.state.countFun === 1) {
                //     let input ={ "dropdownName" : "Topic",
                //     "dropdownValueId" :  taggingData.subjectId};
                //     this.getDropdownDynamicList(input);
                //     let input1 ={ "dropdownName" : "Sub-Topic",
                //     "dropdownValueId" :  taggingData.topicId};
                //     this.getDropdownDynamicList(input1);
                // }
                
                // this.setState({countFun:2});
                // this.setData1()
            } 
        })
    }

    // setData1 = () => {
    //     const {taggingData} = this.state;
    //     if( taggingData) {
    //         if(this.state.taggingDropdowns.length ===1 && document.getElementById("Subject").value !== null ) { document.getElementById("Subject").value = taggingData.subjectId !==1 ? taggingData.subjectId:"Subject";}
    //         if(this.state.taggingDropdowns.length ===2 && document.getElementById("Topic").value !== null ) { document.getElementById("Topic").value = taggingData.topicId !==1? taggingData.topicId:"Topic"};
    //         if(this.state.taggingDropdowns.length ===3 && document.getElementById("Sub-Topic").value !== null) { document.getElementById("Sub-Topic").value = taggingData.subTopicId!==1? taggingData.subTopicId:"Sub-Topic"};  
          
    //     }
    // }

    getDropdownDynamicList1 = (input,label) => {
        const {taggingData} = this.state;
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
                        this.setState({taggingDropdowns2:taggingDropdowns});
                       
                    } else {
                        taggingDropdowns.push(res.data.data.response.dropdownDataModel[i]);
                      
                        this.setState({taggingDropdowns2:taggingDropdowns},() =>{
                            if(label === 2) {
                                document.getElementById("Exam").value = taggingData.examId  !== undefined && taggingData.examId  !== 1? taggingData.examId:"Exam";
                            }
                            if(label === 1) {
                                document.getElementById("Exam Category").value = taggingData.examCategoryId !== undefined && taggingData.examCategoryId !== 1? taggingData.examCategoryId:"Exam Category";
                            }
                        });
                        // if(this.state.countFun1 === 1) {
                          
                        //     let input ={ "dropdownName" : "Exam",
                        //     "dropdownValueId" :  taggingData.examCategoryId};
                        //     this.getDropdownDynamicList1(input);
                            
                        // }
                      
                        // this.setState({countFun1:2},() => this.setData2());
                    }
                }
            }            
        })
    }

    // setData2 = () => {
    //     const {taggingData} = this.state;
    //     if( taggingData) {
    //        if(this.state.taggingDropdowns2.length ===1 &&  document.getElementById("Exam Category").value !== null) document.getElementById("Exam Category").value = taggingData.examCategoryId !== undefined && taggingData.examCategoryId !== 1? taggingData.examCategoryId:"Exam Category";
    //        if(this.state.taggingDropdowns2.length ===2 &&  document.getElementById("Exam").value !== null ) document.getElementById("Exam").value = taggingData.examId  !== undefined && taggingData.examId  !== 1? taggingData.examId:"Exam";
    //     }
    // }

    handleEditorData = (data,label) => { 
        let questionDetails = this.state.questionDetails;
        if(label === "instructions") {
            questionDetails.instructions = data;
            this.setState({instructions:data});
        }
        else if(label === "question") {
            questionDetails.question = data;
            this.setState({question:data});
        }
        else if(label === "description") {
            questionDetails.description = data;
            this.setState({description:data});
        }
        else if(label === "solution") {
            questionDetails.solution = data;
            this.setState({solution:data});
        } else {
          
            questionDetails.answerChoices[label].answerChoice = data;
            questionDetails.answerChoices[label].isCorrect= this.state.isCorrect;
            
        }
        this.setState({questionDetails});
      
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

    selectTaggingOptionsDynamic = (e, label,i) => {
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
        if(i<this.ddRequestData.length )
        { 
            let request = {"dropdownName" : this.ddRequestData[i],  "dropdownValueId" :  +(e.target.value)}
            this.getDropdownDynamicList(request);
        }
        this.setState({taggingData:selectedDropdowns})
    }

    selectTaggingOptionsDynamic1 = (e, label,i) => {
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
        this.setState({taggingData:selectedDropdowns})
    }
    x="";
    handleVideoSolutionONchange = (e) =>{
        this.setState({videoSolution: e.target.value});
    }
    solutions = [];
    addVideoSolution = () =>{
        const {videoSolution, videoIndex} = this.state;
        let solutions = this.state.questionDetails.otherContent, questionDetails = this.state.questionDetails;
        if (videoSolution.indexOf(',') > -1) { 
          
            videoSolution.split(',').forEach((solution,i) =>{
                solutions.push({ "otherContentId": solution})
            })
            
        } else {
            solutions.push({ "otherContentId": videoSolution});

        }
        questionDetails.otherContent = solutions;
        this.solutions = solutions;
        this.setState({videoSolutions:solutions,videoSolution:'', questionDetails});
    }

    removeVideoSolution = (i) => {
        let questionDetails = this.state.questionDetails;
        // questionDetails.otherContent.splice(i,1);
        document.getElementById("Video"+i).style.display = "none";
        // questionDetails.otherContent.forEach((v,j) =>{ i === j? v.action = "DELETE": v});
        questionDetails.otherContent[i]["action"] = "DELETE";
        
        this.setState({questionDetails:questionDetails});
    }
    comprehensionOptions = [ {id:1,label:"Question", content:""},
        {id:2,label:"Solution", content:""},
        {id:3,label:"Video Solution", content:""},
    ]

    handleQTypeChange = (e, label) => {
       
       let questionDetails = this.state.questionDetails;
        if(label === "QT"){
            // compList.push({})
            questionDetails.questionType = e.target.value
            this.setState({questionType: e.target.value, questionDetails});
        }
        
    }
    componentDidMount() {
        this.getQuestionDetails();
    }

    addAnswersHandler = () => {
        let questionDetails = this.state.questionDetails;
        questionDetails.answerChoices.push({ "answerChoice":"", "isCorrect": false,"optionNumber":questionDetails.answerChoices.length+1})
        this.setState({questionDetails});
    }

    removeAnswerHandler = (i) => {
        let questionDetails = this.state.questionDetails;
        Object.assign(questionDetails.answerChoices[i], {"action": "DELETE"});
        // questionDetails.answerChoices.splice(i, 1);
        document.getElementById("Option"+i).style.display = "none";
        
        this.setState({questionDetails});
    }

    handleAnswerSingleChoice = (e,i) =>{
      
        let questionDetails = this.state.questionDetails, verifyAnswers=this.state.verifyAnswers;
        questionDetails.answerChoices[i].isCorrect = e
        // questionDetails.answerChoices.forEach((answer,j) =>{
        //     i===j?answer.isCorrect = true:answer.isCorrect= false;
        // })
        verifyAnswers[i]=e
        verifyAnswers.forEach((item,k) => i==k? item = e:item=false);
    
        // this.setState({answersList: answers, isCorrect: e});
        this.setState({questionDetails,verifyAnswers});
    }

    handleAnswerMultipleChoice = (e,i) =>{

        let questionDetails = this.state.questionDetails, verifyAnswers=this.state.verifyAnswers;
        
        
        questionDetails.answerChoices.forEach((ans,j) => {
            ans.isCorrect = verifyAnswers[j];
        })
        questionDetails.answerChoices[i].isCorrect = e;
      
        verifyAnswers[i] = e;
        // this.setState({answersList: answers, isCorrect: e});
        this.setState({questionDetails,verifyAnswers});
    }

    formatComprehensionRequest = () => {
        const{questionDetails,taggingData} = this.state;  
        let user = sessionStorage.getItem("userId");
        questionDetails.answerChoices.forEach((item) => delete item.questionAnswerEntityId);
        let requestBody =  
           [ {
                "questionType": questionDetails.questionType,
                "instruction": questionDetails.instructions,
                "description": questionDetails.description,
                "question": questionDetails.question,
                "solution":questionDetails.solution,
                "createdBy": +(user),
                "questionTagEntity": taggingData,
                "otherContent": questionDetails.otherContent,
                "answerChoices": questionDetails.answerChoices
                
            }]
         
        return requestBody;
    }
    validateRequest = (request) => {
        let invalidFields = []
     
        if(!this.state.questionDetails.parentQuestionType) {
            if(request.question === "") {
                invalidFields.push(" Question")
            }
            if(request.solution === "") {
                invalidFields.push("Solution")
            }
           
           if( this.state.verifyAnswers.every((answer) => !answer)) {
            invalidFields.push("Please select Correct Answer\n")
           }
        }
       
        if( request.questionTagEntity.languageId === "") {
            invalidFields.push("Language")
        }
        if(  request.questionTagEntity.usedIn === "") {
            invalidFields.push("Used In")
        }
        if(  request.questionTagEntity.difficultyId === "") {
            invalidFields.push("Difficulty")
        }
        if(  request.questionTagEntity.isConceptual === "") {
            invalidFields.push("Conceptual")
        }
        if(  request.questionTagEntity.subjectId === "") {
            invalidFields.push("Subject")
        }
        if(  request.questionTagEntity.topicId === "") {
            invalidFields.push("Topic")
        }
        if(  request.questionTagEntity.subTopicId === "") {
            invalidFields.push("Sub-Topic\n")
        }
        if(this.state.questionDetails.parentQuestionType === "Comprehension" || this.state.questionDetails.parentQuestionType === "Cloze Test")
       
        {
          
            if(request.instruction === "") {
                invalidFields.push("Instructions")
            }
            if(this.props.location.questionProps.action !== 'edit')
          {
           
            if(request.solution === "") {
                invalidFields.push("Solution\n")
            }
            
            if( this.state.verifyAnswers.every((answer) => !answer)) {
                invalidFields.push("Please select Correct Answer for Question\n")
               }
        }
    }
        if(this.state.questionDetails.parentQuestionType === "Comprehension")
        {
                if(this.props.location.questionProps.action !== 'edit')
            {
                
                
                if(request.question === "") {
                    invalidFields.push("Question")
                }
                
            
        }}
        if(this.state.questionDetails.parentQuestionType === "Cloze Test")
        {
            if(this.state.questionDetails.description === "") {
                invalidFields.push("Description")
            }
           
        }
        console.log("invalidFields",invalidFields)
        return invalidFields;
    }

    addQuestionHandler = () => {
       let validate = [];
        const{questionDetails,taggingData} = this.state;
        this.token = sessionStorage.getItem("Token");
        let user = sessionStorage.getItem("userId");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        if(this.props.location.questionProps.action === 'edit')
        {  
            let request;
            
                request={
                    "questionType": questionDetails.questionType,
                    "instruction": questionDetails.instructions,
                    "question": questionDetails.question,
                    "description": questionDetails.description,
                    "solution":questionDetails.solution,
                    "questionEntityId":questionDetails.questionEntityId,
                    "createdBy": +(user),
                    "questionTagEntity": taggingData,
                    "otherContent": questionDetails.otherContent,
                    "answerChoices": questionDetails.answerChoices
                } 
                validate = this.validateRequest(request);
           
            
            if(validate.length === 0) {
                axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${UPDATE_QUESTION}`,request,{"headers":this.headers})
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
                let message = "Please fill mandatory fields \n"+validate.toString();
                alert(message);
            }

        } else {
            let request;
            if(questionDetails.parentQuestionType !== "Comprehension" && questionDetails.parentQuestionType !== "Cloze Test")
            { 
            questionDetails.answerChoices.forEach((item) => delete item.questionAnswerEntityId);
            request =
           [ {
                "questionType": questionDetails.questionType,
                "instruction": questionDetails.instructions,
                "question": questionDetails.question,
                "solution":questionDetails.solution,
                "createdBy": +(user),
                "questionTagEntity": taggingData,
                "otherContent": questionDetails.otherContent,
                "answerChoices": questionDetails.answerChoices
            }]
            validate = this.validateRequest(request[0]);
        } else {
            request= this.formatComprehensionRequest();   
            validate = this.validateRequest(request[0]);
        }
            if(validate.length === 0) {
            axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${CREATE_QUESTION}`,request,{"headers":this.headers})
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
                let message = "Please fill mandatory fields \n"+validate.toString();
                alert(message);
            }
        }
        
    }
    goBack = () => {
        this.props.history.push('/questions');
    }

    onChangeTime = (value) => {
        let taggingData = this.state.taggingData;
        taggingData.timeToSolve = "00:" + value;
        this.setState({taggingData});
    }

    onAddInterlinking = (e) => {
        e.preventDefault();
        const {interlinkingVlaue,videoIndex, contentType,questionDetails} = this.state;
        let solutions = [], details = questionDetails, interlinkingData=[], interlinkingVideos=[],interlinkingEbooks=[];
        if(interlinkingVlaue) {
            if (interlinkingVlaue.indexOf(',') > -1) { 
            
                interlinkingVlaue.split(',').forEach((solution,i) =>{
                    solutions.push({ "otherContentId": solution})
                })
                
            } else {
                solutions.push({ "otherContentId": interlinkingVlaue});

            }
        }    
        if(contentType === "Ebook") {
            interlinkingEbooks=solutions ;
            this.setState({interlinkingEbooks})
        } else
            {
              
                interlinkingVideos = solutions;
                this.setState({interlinkingVideos})
            }
        interlinkingData = interlinkingVideos.length>0?interlinkingVideos.concat(interlinkingEbooks):interlinkingEbooks;
        details.otherContent =  details.otherContent.concat(interlinkingData)
        this.setState({interlinkingData,interlinkingVlaue:'', questionDetails:details});
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

    onChangeId = (input) => {
       
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
        }).catch(() =>{
            alert("Something went wrong, Please try again...")
        })
    }

    getIds=(id) =>{
        this.setState({interlinkingVlaue:id})
    }


    render() {
        const {taggingDropdowns1, questionType ,moreInformationFields, questionDetails,videoSolution,taggingDropdowns,interlinkingVideos,interlinkingEbooks,taggingDropdowns2,verifyAnswers, contentIDs} = this.state;
        return (
            <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 main-section pad0">                 
                <div className="qt-add-top-section">               
                    <div className="qt-top-bar title-mrgn">
                        <span className="add-qt-title1"><Link className="a" to="/questions">Questions</Link></span><span className="exam-ma">/Add New Question</span>
                        <div className="qt-top">
                            <span className="add-new-question">Update Question</span>
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
                            <option className=" qt-select-input-base potion-tp" value="SCMC">{questionDetails.questionType === 'Comprehension'?questionDetails.answerType:questionDetails.questionType}</option>
                                {questionDetails.questionType !=="SCMC" && <option className=" qt-select-input-base potion-tp" value="SCMC">SCMC</option>}
                                {questionDetails.questionType !=="MCMC" &&<option className="qt-select-input-base" value="MCMC">MCMC</option>}
                                {/* <option className="qt-select-input-base" value="Comprehension">Comprehension</option>
                                <option className="qt-select-input-base" value="Close Test">Close Test</option> */}
                            </select>
                            <div className="qt-select-label">Question Type<span className="login-label">*</span></div>
                        </div> 
                      
                    </div>                   
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 qt-label-mrgn option-tp">
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <div className="rte-label">Instructions{(questionDetails.parentQuestionType === "Comprehension" || questionDetails.parentQuestionType === "Cloze Test") && <span className="login-label">*</span>}</div>
                           
                            <Editor onChange={this.handleEditorData} label="instructions" content={questionDetails.instruction}/>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 qt-rte2-mrgn">
                            <div className="rte-label">{(questionDetails.parentQuestionType === "Comprehension" || questionDetails.parentQuestionType === "Cloze Test")?"Description":"Question"}</div>
                            <Editor onChange={this.handleEditorData} label={(questionDetails.parentQuestionType === "Comprehension" || questionDetails.parentQuestionType === "Cloze Test")?"description":"question"} 
                            content={(questionDetails.parentQuestionType === "Comprehension" || questionDetails.parentQuestionType === "Cloze Test")?questionDetails.description:questionDetails.question}/>
                        </div>
                    </div>                   
                    {/* { questionType === "Comprehension" && compList.map((question,i) => { return
                    <div className="comp-rectangle">
                        <span className="comp-rectangle-lebel">{"Question"+(i+1)}</span>
                        <button className="comp-rectangle-btn">+</button>
                    </div>})} */}
                    {/* { questionType === "Comprehension" &&<div className="comp-rectangle">
                        <span className="comp-rectangle-lebel">Question2</span>
                        <button className="comp-rectangle-btn">-</button>
                    </div>} */}
                    {/* {compList.map((question,i) => { return
                         <div> */}
                        <div className="qt-label-mrgn option-tp">
                        <Container>
                            <Row xs="2"  sm="2" md="2">
                                {moreInformationFields.map((data,n) => { return<Col key={"More"+n}>    
                                    {data.label!=="Video Solution" && <div className="">
                                        <div className="rte-label">{data.label}</div>
                                        <div className="rte-box">
                                            <Editor onChange={this.handleEditorData} label={data.label.toLocaleLowerCase()} content={data.label === "Question"?questionDetails.question:questionDetails.solution}/>                                                
                                        </div>
                                    </div>}
                                    { data.label==="Video Solution" && <div className="">
                                        <div className="rte-label">{data.label}</div>
                                        <div className="rte-box video-solution-base">
                                        <Container className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{display:"flex"}}>
                                                <Row  xs="5"  sm="5" md="5">
                                                {questionDetails.otherContent && questionDetails.otherContent.map((video,k) => {
                                                    return(
                                                    <Col className ="col-lg-2 col-md-2 col-sm-2 col-xs-2 video-id-base" key={video.otherContentId+k} id={"Video"+k}>
                                                        <span className=" video-id-placeholder">{video.otherContentId && video.otherContentId.substring(0,5)} <span className="video-id-mrgn">
                                                            <img className="close-img" src={Close} alt="" onClick={() => this.removeVideoSolution(k)}></img></span>
                                                        </span>
                                                        </Col>
                                                    )}
                                                )}
                                                </Row>                                                
                                            </Container>                                        
                                            <div className="video-sol-input-base">
                                                <input className="video-sol-placeholder" placeholder="Enter Video ID" onChange={(e) => this.handleVideoSolutionONchange(e)} value={videoSolution}></input>
                                                <button className="vid-base-buttons-label vid-sol-mask" onClick={() => this.addVideoSolution()}>Add</button>
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
                                <Row xs="2"  sm="2" md="2">
                                    {questionDetails.answerChoices && questionDetails.answerChoices.map((item,i) => { 
                                        
                                        return <Col id={"Option"+i}>
                                            <div className="rte-label">
                                                {(questionDetails.questionType ==="SCMC" ||  questionDetails.answerType ==="SCMC") ?   <span  className="radio-display">
                                                        <RadioButton handleChange={(e) => this.handleAnswerSingleChoice(e,i)} checked={item.isCorrect} index={i}/>
                                                        <span className="radio-label-mrgn">{"Option "+(i+1)}</span>
                                                    </span>:
                                                    // questionDetails.answerType ==="SCMC"  ? <span  className="radio-display"> 
                                                    //     <RadioButton handleChange={(e) => this.handleAnswerSingleChoice(e,i)} checked={item.isCorrect}/>
                                                    //     <span className="radio-label-mrgn">{"Option "+(i+1)}</span>
                                                    // </span>:
                                                    <span className="cb-mrgn">
                                                        <Checkbox value={"Option "+i} handleChange={(e) => this.handleAnswerMultipleChoice(e,i)} checked={item.isCorrect} parent="edit"/>
                                                        <span className="cb-label-mrgn">{"Option "+(i+1)}</span>
                                                    </span>}
                                                {verifyAnswers[i] && <span className="correct-answer-label" id={"Correct"+i}>(Correct Answer)</span>}
                                                { i > 1 && <span className="delete-section show-cursor" onClick={() => this.removeAnswerHandler(i)}><img src={Delete} alt=""></img><span className="delete-label">Remove</span></span>}
                                            </div>
                                            <Editor onChange={this.handleEditorData} label={i} content={item.answerChoice}/>   
                                        </Col>})}
                                    </Row>
                                </Container>
                            </div>
                        {/* </div>})} */}
                        <div className="add-option-rectangle">
                            <button className="add-option-buttons-label add-option-mask" onClick={this.addAnswersHandler}>Add New Option</button>
                            <span className="base-buttons-side-label">Click this button to add "New Option" as an answer.</span>
                        </div>
                    </div>                  
               
                    <div className="tagging-section">
                        <div className="qt-rectangle4"> 
                            <div className="qt-rectangle5"><span className="qt-rectangle-text">Tagging</span>  <div className="sample-sq1 right"></div></div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dd-section-mrgn">
                            {taggingDropdowns1.length>0 &&taggingDropdowns1.map((item,i) => {
                                return(
                                
                                    <span className="col-lg-2 col-md-2 col-sm-2 col-xs-2 dd-mrgn">
                                        <select className="tagging-dd-base tagging-dd-subject"  id={item.dropdownLabel} onChange={(e) => this.selectTaggingOptions(e,item.dropdownLabel,i)}>
                                        <option value={item.dropdownLabel}>{item.dropdownLabel}</option>
                                            {item.dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>
                                )})
                            }
                             {taggingDropdowns.length>0 && taggingDropdowns.map((item,i) => {
                                
                                return(
                                
                                    <span className="col-lg-2 col-md-2 col-sm-2 col-xs-2 dd-mrgn" key={"Dynamic"+i}>
                                        <select className="tagging-dd-base tagging-dd-subject"  id={item.dropdownLabel} onChange={(e) => this.selectTaggingOptionsDynamic(e,item.dropdownLabel,i)}>
                                        <option value={item.dropdownLabel}>{item.dropdownLabel}</option>
                                            {item.dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>
                                )})
                            }
                            {taggingDropdowns2.length>0 && taggingDropdowns2.map((item,i) => {
                              
                                return(
                                
                                    <span className="col-lg-2 col-md-2 col-sm-2 col-xs-2 dd-mrgn" key={"Dynamic1"+i}>
                                        <select className="tagging-dd-base tagging-dd-subject"  id={item.dropdownLabel} onChange={(e) => this.selectTaggingOptionsDynamic1(e,item.dropdownLabel,i)}>
                                        <option value={item.dropdownLabel}>{item.dropdownLabel}</option>
                                            {item.dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>
                                )})
                            }
                            <span className="time-input-base1">
                                <span  className="tts-top"><label className="time-text-placeholder1">Time to solve this question</label></span>
                                <form><span  className="tts-top"><input id="Time" placeholder="MM:SS" className="mmss-input-base1 mmss-placeholder" onChange={(e) => this.onChangeTime(e.target.value)} pattern="^([0-5]?[0-9]):([0-5]?[0-9])" required></input></span></form>
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
                                  {interlinkingVideos.length>0 && <span className="il-video-text il-inner-mrgn">Video</span>}
                                    {interlinkingVideos.map((video,k) => {
                                        return(
                                        <div className ="col-lg-2 col-md-2 col-sm-2 col-xs-2 video-id-base" key={"link"+video.otherContentId}>
                                            <span className=" video-id-placeholder">{video.otherContentId.substring(0,5)}... <span className="video-id-mrgn"><img className="close-img" src={Close} alt="" onClick={() => this.removeInterlinking(k)}></img></span></span>
                                            </div>
                                        )}
                                    )}
                                </div>                                    
                            </div>
                            <div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{display:"flex"}}>
                                  {interlinkingEbooks.length>0 && <span className="il-ebook-text il-inner-mrgn">EBook</span>}
                                    {interlinkingEbooks.map((video,k) => {
                                        return(
                                            <div className ="col-lg-2 col-md-2 col-sm-2 col-xs-2 video-id-base" key={video.otherContentId}>
                                                <span className=" video-id-placeholder">{video.otherContentId.substring(0,5)}... <span className="video-id-mrgn"><img className="close-img" src={Close} alt=""  onClick={() => this.removeInterlinking(k)}></img></span></span>
                                            </div>
                                        )}
                                    )}
                                </div>                                    
                            </div>
                        </div>
                        <div className="il-inputs-base">
                            <select className="il-content-type-base il-content-type" name="Content Type" onChange={(e) => this.setState({contentType:e.target.value})}>
                                <option value="Content Type">Content Type</option>
                                <option value="Video">Video</option>
                                <option value="Ebook">Ebook</option></select>
                                <Autocomplete
                                options={contentIDs}
                                onChange={this.onChangeId}
                                getIds={this.getIds}
                            />
                            {/* <input className="il-content-id-base il-content-type-id" placeholder="Enter Content ID" onChange={(e) => this.setState({interlinkingVlaue:e.target.value})}></input> */}
                            <button className="il-add-button il-add-mask" onClick={(e) => this.onAddInterlinking(e)}>Add</button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}