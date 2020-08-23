import React,{Component} from "react";
import "./addExam.css";
import { Link } from "react-router-dom";
import {QUESTION_WS,EXAM_WS,CREATE_EXAM,CREATE_STAGE,GET_DYNAMIC_DROPDOWNS} from "../../../shared/services/endPoints";
import axios from 'axios';
import BlockUi from 'react-block-ui';
import ActiveHierarchy from "../../../Assets/images/icn_hierarchy_active.png";
import Down from "../../../Assets/images/Down.png";
import Drag from "../../../Assets/images/icn_drag.png";
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
import { Container,Row,Col } from 'reactstrap';
import Editor from "../../../shared/utils/rte/richTextEditor";
import Calender from "../../../Assets/images/Calendar.png";
import Edit from "../../../Assets/images/icn_edit.png";
import Copy from "../../../Assets/images/icn_copy.png";
import Delete from "../../../Assets/images/icn_delete.png";
import Table from 'react-bootstrap/Table';
import CreateStage from "../../../shared/modals/createStage/addStage";
import moment from "moment";
import Checkbox from "../../../shared/utils/checkbox/checkbox";
import TreeViewComponent from "../../../shared/utils/hierarchy/hierarchy";

export default class AddExam extends Component {
    token;
    headers;
    constructor(props) {
        super(props);
        this.state = {
            startDate:"",
            endDate:"",
            noteDate:"",
            examData:[],
            request: {
                "description" : "",
                "examCatId" : 0,
                "examId" : 0,
                "howToApply" : "",
                "lastYearCutoff" : 0,
                "maxAge" : 0,
                "minAge" : 0,
                "notificationDate" : "",
                "otherEligibility" : "",
                "qualification" : "",
                "regEndDate" : "",
                "regStartDate" : "",
                "salary" : "",
                "vacancy" : "",
                "yearId" : 0
                },
                showStage:false,
                isTopic:false,
                isSubTopic:false,
                isImprovment:false,
                showHierarchy:false
        }
    }

    languages = [
        {
            "valueName": "English",
            "valueCode": 1010,
            "isChecked": false
        },
        {
            "valueName": "Hindi",
            "valueCode": 1020,
            "isChecked": false
        },
        {
            "valueName": "Bengali",
            "valueCode": 1030,
            "isChecked": false
        },
        {
            "valueName": "Tamil",
            "valueCode": 1040,
            "isChecked": false
        },
        {
            "valueName": "Telugu",
            "valueCode": 1050,
            "isChecked": false
        },
        {
            "valueName": "Marathi",
            "valueCode": 1060,
            "isChecked": false
        }
    ];

    getExamDropdownData= (request,label) =>{
        let examData = this.state.examData;
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_DYNAMIC_DROPDOWNS}`,request,{"headers":this.headers})
        .then(res => {
            if(label==="onload") {
                examData[0] = res.data.data.response.dropdownDataModel[0];
            } if(label==="exam" && res.data.data.response.dropdownDataModel.length>0) {
                examData[1] = res.data.data.response.dropdownDataModel[0];
            }
            if(label==="year" && res.data.data.response.dropdownDataModel.length>0) {
                examData[2] = res.data.data.response.dropdownDataModel[0];
            }
            console.log("examData:",res.data.data.response.dropdownDataModel);
            this.setState({examData});
        })
       
    }

    goBack = () => {
        this.props.history.push("/exams")
    }
    handleEditorData = (data,label) => {
        let request = this.state.request;
        if(label === "description") {
            request.description = data;
        }
        if(label === "apply") {
            request.howToApply = data;
        }
        if(label === "eligibility") {
            request.otherEligibility = data;
        }
        this.setState({request});
    }
    setStartDate = (date,label) => {
        let request = this.state.request;
        if(label === "START") {
            request.regStartDate = moment(date).format('DD-MM-YYYY');
            this.setState({startDate:date});
        }
        if(label === "END") {
            request.regEndDate = moment(date).format('DD-MM-YYYY');
            this.setState({endDate:date});
        }
        if(label === "NOTE") {
            request.notificationDate = moment(date).format('DD-MM-YYYY');
            this.setState({noteDate:date});
        }
        this.setState({request});
    }
    onChangeText = (e,label) => {
        let request = this.state.request;
        if(label === "vacancy") {
            request.vacancy = e.target.value;
        }
        if(label === "salary") {
            request.salary = e.target.value;
        }
        if(label === "minage") {
            request.minAge = +(e.target.value);
        }
        if(label === "maxage") {
            request.maxAge = +(e.target.value);
        }
        if(label === "cutoff") {
            request.lastYearCutoff = +(e.target.value);
        }
        if(label === "Qualification") {
            request.qualification = e.target.value;
        }
        this.setState({request});
    
    }
    createExamHandler = (e) =>{
        e.preventDefault();
        console.log("request:",this.state.request);
        let request = this.state.request;
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${EXAM_WS}${CREATE_EXAM}`,request,{"headers":this.headers})
        .then(res => {
            console.log("Create Exam:response:-----<>",res);
            this.goBack();
            
        })
    }

    selectTaggingOptions = (e,label,i) => {
        let request = this.state.request;
       
       
        if(label === "Exam Category") {
           
            request.examCatId = +(e.target.value);
         
            let request1 = {
                "dropdownName" : "Exam",  "dropdownValueId" : +(e.target.value)
            }
            this.getExamDropdownData(request1,"exam");
        }
        if(label === "Exam") {

            request.examId = +(e.target.value);
            let request1 = {
                "dropdownName" : "Year",  "dropdownValueId" : +(e.target.value)
            }
            this.getExamDropdownData(request1,"year");
            // selectedItem2 = +(e.target.value);
        }

        if(label === "Year") {

            request.yearId = +(e.target.value);
            // selectedItem2 = +(e.target.value);
        }
        this.setState({request});
    }

    componentDidMount() {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        let request1 = {
            "dropdownName" : "Exam Category"
        };

        this.getExamDropdownData(request1,"onload");
    }

    addStageHandler = (e) => {
        e.preventDefault();
        this.setState({showStage:true})
    }
    hidePopup = () => {
        this.setState({showStage:false})
    }

    render() {
        const {startDate,endDate,noteDate,examData,showStage,isImprovment,isTopic,isSubTopic,showHierarchy} = this.state;
       console.log("examData:",examData)
        return(
            <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 main-section pad0"> 
            <CreateStage show={showStage} onHide={this.hidePopup} title="Select Stage" label1="Please select a stage you want to add with this exam."/>
                  <form>                
                    <div className="user-add-top-section">               
                        <div className="user-top-bar title-mrgn">
                            <span className="add-user-title"><Link className="a" to="/exams">Exams</Link></span><span className="exam-ma">/Add New Exam</span>
                            <div className="user-top">
                                <span className="add-new-user">Add New Exam</span>
                                <button className="user-cancel-label exam-cancel-mask" onClick={() => this.goBack()}>Cancel</button>
                                <button className="user-cancel-label exam-save-mask" onClick={() => this.goBack()}>Save</button>
                                <button className="user-save-label create-exam-mask"
                                onClick={(e) => this.createExamHandler(e)}>Create Exam</button>
                            </div>
                        </div>
                    </div>
                  
                    <div className="user-rectangle2"> 
                        <div className="exam-rectangle3"><span className="user-rectangle-text title-mrgn">Exam Details</span>  <div className="sample-exam right"></div></div>
                    </div>
                    <div className="main-container-mrgn-top">
                        <div className="section1-mrgn-lft">
                            <Container className="exam-container">
                                <Row className="" xs="6"  sm="6" md="6" style={{width:"auto"}}>
                                    <Col>
                                   
                                         <span className="ct-dd-mrgn" >
                                       <select className="exam-cat-dd-base exam-cat-dd-label" value={this.state.selectedItem1} id="Exam Category" onChange={(e) => this.selectTaggingOptions(e,"Exam Category",0)}>
                                            <option value="Select">Exam Category</option>
                                            {examData.length>0&& examData[0].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>
                                        
                                    </Col>
                                    <Col>
                                        <span className="ct-dd-mrgn" >
                                        <select className="exam-cat-dd-base exam-cat-dd-label" value={this.state.selectedItem1} id="Exam" onChange={(e) => this.selectTaggingOptions(e,"Exam",1)}>
                                                <option value="Select">Exam Name</option>
                                                {(examData.length>1 && examData[1].dropdownMappingModels !== undefined)&& examData[1].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                            </select>
                                        </span>
                                    </Col>
                                    <Col>
                                        <span className="ct-dd-mrgn" >
                                        <select className="exam-cat-dd-base exam-cat-dd-label" value={this.state.selectedItem1} id="Year" onChange={(e) => this.selectTaggingOptions(e,"Year",2)}>
                                                <option value="Select">Year</option>
                                                {examData.length>2&& examData[2].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                            </select>
                                        </span>
                                    </Col>
                                    <Col><div className ="exam-dd-base"><span >
                                    <input type="text" className="add-exam-data-placeholder"
                                        onChange={(e) => this.onChangeText(e,"vacancy")}
                                        placeholder="Vacancy" />
                                        </span></div>
                                    </Col>
                                    <Col><div className ="exam-dd-base">
                                        <DatePicker
                                            closeOnScroll={true}
                                            selected={noteDate}
                                            onChange={date => this.setStartDate(date,"NOTE")}
                                            customInput={<span><input className="add-exam-data-placeholder-DP example-custom-input" value={moment(noteDate).format('DD/MM/YYYY')==="Invalid date"?"Notification Date":moment(noteDate).format('DD/MM/YYYY')} 
                                            placeholder="Notification Date" />
                                            <img className="cal-icon" src={Calender} alt=""/>
                                            </span>}
                                            />
                                   
                                        </div>
                                    </Col>
                                    <Col><div className ="exam-dd-base">
                                        <DatePicker
                                            closeOnScroll={true}
                                            selected={startDate}
                                            onChange={date => this.setStartDate(date,"START")}
                                            customInput={<span><input className="add-exam-data-placeholder-DP example-custom-input" value={moment(startDate).format('DD/MM/YYYY')==="Invalid date"?"Reg.Start Date":moment(startDate).format('DD/MM/YYYY')} 
                                            placeholder="Reg.Start Date" />
                                            <img className="cal-icon" src={Calender} alt=""/>
                                            </span>}
                                            />
                                      
                                        </div>
                                    </Col>
                                    <Col><div className ="exam-dd-base">
                                        <DatePicker
                                            closeOnScroll={true}
                                            selected={endDate}
                                            onChange={date => this.setStartDate(date,"END")}
                                            customInput={<span><input className="add-exam-data-placeholder-DP example-custom-input" value={moment(endDate).format('DD/MM/YYYY')==="Invalid date"?"Reg.End Date":moment(endDate).format('DD/MM/YYYY')} 
                                            placeholder="Reg.End Date" />
                                            <img className="cal-icon" src={Calender} alt=""/>
                                            </span>}
                                        />
                                        
                                        </div>
                                    </Col>
                                    <Col><div className ="exam-dd-base"><span>
                                    <input  className="add-exam-data-placeholder"
                                        onChange={(e) => this.onChangeText(e,"cutoff")}
                                        placeholder="Last Year's Cutoff" />
                                        </span></div>
                                    </Col>
                                    <Col><div className ="exam-dd-base"><span >
                                        <input type="number" className="add-exam-data-placeholder" 
                                            onChange={(e) => this.onChangeText(e,"minage")}
                                            placeholder="Minimum Age" />
                                        </span></div>
                                    </Col>
                                    <Col><div className ="exam-dd-base"><span >
                                        <input type="number" className="add-exam-data-placeholder" 
                                            onChange={(e) => this.onChangeText(e,"maxage")}
                                            placeholder="Maximum Age" />
                                        </span></div>
                                    </Col>
                                    <Col><div className ="exam-dd-base"><span >
                                    <input type="text" className="add-exam-data-placeholder" 
                                            onChange={(e) => this.onChangeText(e,"Qualification")}
                                            placeholder="Qualification" />
                                    {/* <select className="add-exam-data-placeholder">
                                            <option>Qualification</option>
                                        </select> */}
                                        </span></div>
                                    </Col>
                                    <Col><div className ="exam-dd-base"><span >
                                        <input type="text" className="add-exam-data-placeholder" 
                                            onChange={(e) => this.onChangeText(e,"salary")}
                                            placeholder="Salary" />
                                        </span></div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        <div className="section1-mrgn-lft">
                        <Container className="exam-container">
                                <Row  xs="2"  sm="" md="" style={{width:"auto"}}>
                                    <Col className="col-mrgn-tp">
                                        <span className="role-desc-label">Other Eligibility</span>
                                        <div className="desc-editor-mrgn">
                                            <Editor  onChange={this.handleEditorData} label="eligibility" content=""/>
                                        </div>
                                    </Col>
                                    <Col className="col-mrgn-tp">
                                        <span className="role-desc-label">How To Apply</span>
                                        <div className="desc-editor-mrgn">
                                            <Editor  onChange={this.handleEditorData} label="apply" content=""/>
                                        </div>
                                    </Col>
                                    <Col className="col-mrgn-tp">
                                        <span className="role-desc-label">Description</span>
                                        <div className="desc-editor-mrgn">
                                            <Editor  onChange={this.handleEditorData} label="description" content=""/>
                                        </div>
                                    </Col>
                                </Row>
                        </Container>
                        </div>
                    </div>
                    <div>
                        <div className="user-rectangle2"> 
                            <div className="exam-stage-rectangle"><span className="user-rectangle-text title-mrgn">All Stages,Subjects,Topics & Sub Topics</span>  <div className="exam-square right"></div>
                                <div className="hierarchy-label" onClick={() => this.setState({showHierarchy:!this.state.showHierarchy})}><img className="hierarchy-icon" src={ActiveHierarchy} alt="" />Hierarchy View</div>
                               {showHierarchy && <div className="subtwo-div">
             
                                    <div className="tree-div"><span className="hierarchy-stage-label">Stages</span>
                                    <div className="line-stage"></div>
                                    <TreeViewComponent/></div>
                                </div>}
                            </div>
                        </div>
                        <div  className="all-stages">All Stages/...</div>
                        <div  className="all-stages1">All Stages</div>
                        <div className="stages-box-mrgn">
                            <div className="stage-rectangle">
                                <span className="comp-rectangle-lebel"><img className="drag-icn" src={Drag} alt="" />Priliminary</span>
                                <span className="add-stage-delete-group"><img src={Delete} alt="" /> <span className="stage-delete-label">Remove</span></span>
                                <span className="add-stage-copy-group"><img src={Copy} alt="" /> <span className="stage-copy-label">Copy Structure From</span></span>
                                <span><img className="down-icn" src={Down} alt=""></img></span>
                            </div>
                            <div>
                                <div style={{"display":"flex"}}>
                                    <span className="stage-priliminary">Priliminary</span>
                                    <span><Checkbox></Checkbox></span><span className="stage-pre-label">Locked Subject Time</span>
                                </div>
                                <div>
                                    <div className="section1-mrgn-lft">
                                        <Container className="exam-container">
                                            <Row className="" xs="6"  sm="6" md="6" style={{width:"auto"}}>
                                           
                                                <Col><div className ="exam-dd-base">
                                                        <DatePicker
                                                            closeOnScroll={true}
                                                            selected={noteDate}
                                                            onChange={date => this.setStartDate(date,"NOTE")}
                                                            customInput={<span><input className="add-exam-data-placeholder-DP example-custom-input" value={moment(noteDate).format('DD/MM/YYYY')==="Invalid date"?"Notification Date":moment(noteDate).format('DD/MM/YYYY')} 
                                                            placeholder="Notification Date" />
                                                            <img className="cal-icon" src={Calender} alt=""/>
                                                            </span>}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col><div className ="exam-dd-base">
                                                    <DatePicker
                                                        closeOnScroll={true}
                                                        selected={startDate}
                                                        onChange={date => this.setStartDate(date,"START")}
                                                        customInput={<span><input className="add-exam-data-placeholder-DP example-custom-input" value={moment(startDate).format('DD/MM/YYYY')==="Invalid date"?"Reg.Start Date":moment(startDate).format('DD/MM/YYYY')} 
                                                        placeholder="Reg.Start Date" />
                                                        <img className="cal-icon" src={Calender} alt=""/>
                                                        </span>}
                                                        />
                                                
                                                    </div>
                                                </Col>
                                                <Col><div className ="exam-dd-base"><span >
                                                    <input type="number" className="add-exam-data-placeholder" 
                                                        onChange={(e) => this.onChangeText(e,"minage")}
                                                        placeholder="No. Of Questions" />
                                                    </span></div>
                                                </Col>
                                                <Col><div className ="exam-dd-base"><span >
                                                    <input type="number" className="add-exam-data-placeholder" 
                                                        onChange={(e) => this.onChangeText(e,"maxage")}
                                                        placeholder="Max Marks" />
                                                    </span></div>
                                                </Col>
                                                <Col><div className ="exam-dd-base">
                                                    <span className="stage-time-placeholder">Total Time</span>
                                                    <span>
                                                    <input type="text" className="add-stage-data-placeholder1" 
                                                        onChange={(e) => this.onChangeText(e,"Qualification")}
                                                        placeholder="MM:SS" />
                                            
                                                    </span></div>
                                                </Col>
                                                <Col>
                                                    <select className="exam-cat-dd-base exam-cat-dd-label" value={this.state.selectedItem1} id="Exam Category" onChange={(e) => this.selectTaggingOptions(e,"Exam Category",0)}>
                                                        <option value="Select">Language</option>
                                                        {this.languages.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                                    </select>
                                                
                                                </Col>
                                                <Col><div className ="exam-dd-base"><span>
                                                <input  className="add-exam-data-placeholder"
                                                    onChange={(e) => this.onChangeText(e,"cutoff")}
                                                    placeholder="Last Year's Cutoff" />
                                                    </span></div>
                                                </Col>
                                                <Col><div className ="exam-dd-base">
                                                    <DatePicker
                                                        closeOnScroll={true}
                                                        selected={endDate}
                                                        onChange={date => this.setStartDate(date,"END")}
                                                        customInput={<span><input className="add-exam-data-placeholder-DP example-custom-input" value={moment(endDate).format('DD/MM/YYYY')==="Invalid date"?"Reg.End Date":moment(endDate).format('DD/MM/YYYY')} 
                                                        placeholder="Reg.End Date" />
                                                        <img className="cal-icon" src={Calender} alt=""/>
                                                        </span>}
                                                    />
                                                    
                                                    </div>
                                                </Col>

                                            </Row>
                                            <Row>
                                                <Col className="col-mrgn-tp1">
                                                    <span className="role-desc-label">Description</span>
                                                    <div className="desc-editor-mrgn">
                                                        <Editor  onChange={this.handleEditorData} label="description" content=""/>
                                                    </div>
                                                </Col>
                                            </Row>
                                           
                                        </Container>
                                    </div>
                                  
                                        
                                </div>
                            </div>
                        </div>
                        <div className="add-stage-rectangle">
                            <button className="add-option-buttons-label add-option-mask" onClick={(e) => this.addStageHandler(e)}>Add New Stage</button>
                            <span className="base-buttons-side-label">Click this button to add "New Stage" to the list.</span>
                        </div> 
                    </div>
                </form>
            </section>
        )
    }
}