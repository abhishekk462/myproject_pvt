import React,{Component} from "react";
import "./addUser.css";
import { Link } from "react-router-dom";
import BrowseImage from "../../../Assets/images/icn_userimage.png";
import BrowseVideo from "../../../Assets/images/icn_uservideo.png";
import {ACCOUNT_WS,USER_DETAILS,UPDATE_USER,CREATE_USER,QUESTION_WS,GET_DYNAMIC_DROPDOWNS,GET_URL_FROMS3,GET_ROLETYPES} from "../../../shared/services/endPoints";
import axios from 'axios';
import BlockUi from 'react-block-ui';
import Down from "../../../Assets/images/Down.png";
import Checkbox from "../../../shared/utils/checkbox/checkbox";
import { Container,Row,Col } from 'reactstrap';

export default class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData :{
                "firstName": "",
                "lastName": "",
                "email": "",
                
                "phoneNo": "",
                "address": "",
                "panNo": "",
                "profileUrl": "",
                "videoUrl": "",
                "userTagEntity": {
                    "subjectId": 1,
                    "topicIds": [],
                    "primaryLangId": 1,
                    "secondaryLangIds": []
                },
                "bankAccounts": [
                    {
                        "accountNumber": ""
                    }
                ],
                "roleEntity": {
                    "roleEntityId": ""
                },
            },
            blocking:false,
            previewVideo:"",
            previewImage:"",
            showImage:false,
            showVideo:false,
            taggingData:this.taggingData,
            showTopics:false,
            showlang:false,
            showlabel1:"",
            showlabel2:"",
            roles:[]
        }
    }
    taggingData = [
        {"dropdownLabel":"Subject","dropdownMappingModels":[]},
        {"dropdownLabel":"Topic","dropdownMappingModels":[]},
        {"dropdownLabel":"Primary Language","dropdownMappingModels":[{"valueName":"English","valueCode":1010,"isChecked":false},{"valueName":"Hindi","valueCode":1020,"isChecked":false},{"valueName":"Bengali","valueCode":1030,"isChecked":false},{"valueName":"Tamil","valueCode":1040,"isChecked":false},{"valueName":"Telugu","valueCode":1050,"isChecked":false},{"valueName":"Marathi","valueCode":1060,"isChecked":false}]},
        {"dropdownLabel":"Secondary Language","dropdownMappingModels":[{"valueName":"English","valueCode":1010,"isChecked":false},{"valueName":"Hindi","valueCode":1020,"isChecked":false},{"valueName":"Bengali","valueCode":1030,"isChecked":false},{"valueName":"Tamil","valueCode":1040,"isChecked":false},{"valueName":"Telugu","valueCode":1050,"isChecked":false},{"valueName":"Marathi","valueCode":1060,"isChecked":false}]},
    ];
    updateRequest = {
        "firstName": "",
        "lastName": "",
        "email": "",
        "phoneNumber": "",
        "address": "",
        "pan": "",
        "profilePicUrl": "",
        "introVideoUrl": "",
        "userTagEntity": {
            "subjectId": 0,
            "topicIds": [],
            "primaryLangId": 0,
            "secondaryLangIds": []
        },
        "userEntityId":"",
        "roleEntity": {
            "roleEntityId": ""
        },
        "bankAccounts": [
            {
                "accountNumber": ""
            },
           
        ]
    }
    
    getRoles = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${GET_ROLETYPES}`,{"headers":this.headers})
        .then(res => {
            console.log("userresp",res);
            this.setState({roles:res.data.data.response.dropdownDataModel[0].dropdownMappingModels})
            // if(this.props.location.UserProps !== undefined) {
               
            //     this.setRole();
            // }
        })
    }
    getUserDetails = () => {
        let showlabel1,showlabel2;
        let requestBody={
            "userEntityId": this.props.location.UserProps.userEntityId
        },details = this.updateRequest;
       
        let url = `${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${USER_DETAILS}`;
        axios.post(url,requestBody, {"headers":this.headers})
        .then(res => {
            console.log("user details data:", res)
            details.firstName = res.data.data.response.firstName;
            details.lastName = res.data.data.response.lastName;
            details.email = res.data.data.response.email;
            details.address = res.data.data.response.address;
            details.phoneNumber = res.data.data.response.phoneNumber;
            details.pan = res.data.data.response.pan;
            details.bankAccounts = res.data.data.response.bankAccounts.length>0?res.data.data.response.bankAccounts:details.bankAccounts;
            details.userTagEntity = res.data.data.response.userTagEntity?res.data.data.response.userTagEntity:details.userTagEntity;
            details.profilePicUrl = res.data.data.response.profilePicUrl;
            details.introVideoUrl = res.data.data.response.introVideoUrl;
            details.userEntityId = this.props.location.UserProps.userEntityId;
            details.roleEntity.roleEntityId = res.data.data.response.roleEntity? res.data.data.response.roleEntity.roleEntityId:"";
            if(details.userTagEntity.topicIds.length > 1){
                details.userTagEntity.topicIds.sort((a, b) => {return a.topicId-b.topicId});
            }
            if(details.userTagEntity.secondaryLangIds.length > 1){
                details.userTagEntity.secondaryLangIds.sort((a, b) => {return a.languageId-b.languageId});
            }
            let request = {
                "dropdownName" : "Topic", "dropdownValueId" : details.userTagEntity? details.userTagEntity.subjectId:0
            };
            this.getDropdownDynamicList(request,"onload2");
            // this.state.taggingData[1].dropdownMappingModels.forEach((item,i) => {
            //     if(details.userTagEntity && details.userTagEntity.topicIds.length>0 && item.valueCode ===  details.userTagEntity.topicIds[i].topicId) {
            //         console.log("value:",item.valueName,item.valueCode)
            //         showlabel1 = item.valueName;
            //         item.isChecked = true;
            //     }
            // })
            this.state.taggingData[3].dropdownMappingModels.forEach((item,i) => {
                if(details.userTagEntity && details.userTagEntity.secondaryLangIds.length>0 && item.valueCode ===  details.userTagEntity.secondaryLangIds[0].languageId) {
                    showlabel2 = item.valueName;
                    // item.isChecked = true;
                }

                if(details.userTagEntity && details.userTagEntity.secondaryLangIds.length>0 ) {
                
                    details.userTagEntity.secondaryLangIds.forEach((data,j) =>{
                        if(item.valueCode ===  data.languageId)
                        {item.isChecked = true;}
                    })
                    // showlabel2 = item.valueName;
                    
                }
                  
            })
           
            this.setState({userData:details,previewVideo:details.introVideoUrl?details.introVideoUrl:"",
                previewImage:details.profilePicUrl?details.profilePicUrl:"",
                showImage:details.profilePicUrl?true:false,
                showVideo:details.introVideoUrl?true:false,showlabel1,showlabel2},() =>{this.setValue()})
               
        })
    }

    setValue=() =>{
       
        document.getElementById("Subject").value = this.state.userData.userTagEntity?this.state.userData.userTagEntity.subjectId:"Subject";
        document.getElementById("Primary Language").value = this.state.userData.userTagEntity?this.state.userData.userTagEntity.primaryLangId:"Primary Language";
        document.getElementById("Role").value = this.state.userData.roleEntity?this.state.userData.roleEntity.roleEntityId:"Role";
    }
    // setRole = () => {
        
    // }

    getDropdownDynamicList = (input,label) => {
       
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_DYNAMIC_DROPDOWNS}`,input,{"headers":this.headers})
        .then(res => {
            
            if(res)
            if(label === "onload1") {
                res.data.data.response.dropdownDataModel[0].dropdownMappingModels.forEach(item => item.isChecked = false)
                this.taggingData[0].dropdownMappingModels = res.data.data.response.dropdownDataModel[0].dropdownMappingModels;
            } else {
                if(res.data.data.response.dropdownDataModel.length>0) {
                res.data.data.response.dropdownDataModel[0].dropdownMappingModels.forEach(item => item.isChecked = false)
                this.taggingData[1].dropdownMappingModels = res.data.data.response.dropdownDataModel[0].dropdownMappingModels;
              
            }
            }
           
            this.setState({taggingData:this.taggingData},() => this.setTopic());
            if(this.props.location.UserProps !== undefined) {
                this.setValue();
            }
        })
    }
    setTopic = () => {
        let details = this.state.userData,showlabel1;
        if(this.props.location.UserProps !== undefined) {
            
            this.state.taggingData[1].dropdownMappingModels.forEach((item,i) => {
               
                if(details.userTagEntity && details.userTagEntity.topicIds.length>0 ) {
                    // if(item.valueCode === details.userTagEntity.topicIds[0].topicId)
                //    { showlabel1 = item.valueName;}
                    details.userTagEntity.topicIds.forEach((data,j) =>{
                        if(item.valueCode ===  data.topicId)
                        {item.isChecked = true; showlabel1 = item.valueName;}
                    })
                }
              
            })
        }
        this.setState({userData:details,taggingData:this.taggingData,showlabel1})
    }
    
    onFileSelect= (e,label) =>{
        let details = this.state.userData;
        const body = new FormData(this.form);
        body.append("file", e);
        this.toggleBlocking();
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_URL_FROMS3}`,body,{"headers":this.headers})
        .then(res => {
            console.log("S3:", res)
           
            if(this.props.location.UserProps === undefined) {
                if(label === "image") {
                    details.profileUrl = res.data.message;
                    this.setState({userData:details,isEnableSubmit:true})
                }
                if(label === "video") {
                    details.videoUrl = res.data.message;
                    this.setState({userData:details,isEnableSubmit:true})
                }
            } else {
                if(label === "image") {
                    details.profilePicUrl = res.data.message;
                    this.setState({userData:details,isEnableSubmit:true})
                }
                if(label === "video") {
                    details.introVideoUrl = res.data.message;
                    this.setState({userData:details,isEnableSubmit:true})
                }
            }
            this.toggleBlocking()
           
        }).catch((e) =>{
            
            this.toggleBlocking();
            alert("Failed to upload file,Please try again...")
        })
    }
    toggleBlocking() {
        this.setState({blocking: !this.state.blocking});
    }

    handleChangeText=(e,label,i)=>{
        let details = this.state.userData;
        if(this.props.location.UserProps !== undefined) {
        
            if(label === "phone") {
                details.phoneNumber = e.target.value;
            }
            if(label === "pan") {
                details.pan = e.target.value;
            }
        } else {
            
        
            if(label === "phone") {
                details.phoneNo = e.target.value;
            }
            if(label === "pan") {
                details.panNo = e.target.value;
            }
        }
        if(label === "lname") {
            details.lastName = e.target.value;
        }

        if(label === "email") {
            details.email = e.target.value;
        }
        if(label === "fname") {
            details.firstName = e.target.value;
        }
        if(label === "address") {
            details.address = e.target.value;
        }
        if(label === "acc") {
            details.bankAccounts[i]["accountNumber"]=e.target.value;
        }
        this.setState({userData:details});
    }
    onSelectProfileImage=(e)=>{
        console.log("e image",e.target.files)
        this.onFileSelect(e.target.files[0],"image");
        this.setState({previewImage:URL.createObjectURL(e.target.files[0]), showImage:true})
    }
    onSelectProfileVideo=(e)=>{
        
        this.onFileSelect(e.target.files[0],"video")
        this.setState({previewVideo:URL.createObjectURL(e.target.files[0]),showVideo:true})
    }
    goBack = () => {
        this.props.history.push("/manageUsers")
    }
    validateRequest = (request) => {
        let invalidFieds = [];
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(request.firstName === "") {
            invalidFieds.push("First Name")
        }
        if(request.lastName === "") {
            invalidFieds.push("Last Name")
        }
        if(request.email === "" || reg.test(request.email) == false) {
            invalidFieds.push("Please enter valid email")
        }
        return invalidFieds;
    }

    addUserHandler = (e) => {
        e.preventDefault();
       
        let endpoint = this.props.location.UserProps === undefined?CREATE_USER:UPDATE_USER;
        let url = `${process.env.REACT_APP_API_BASE_URL}${ACCOUNT_WS}${endpoint}`;
        let validate = this.validateRequest(this.state.userData);
        console.log("validateuserdat",validate);
            if(validate.length === 0) {
            axios.post(url,this.state.userData, {"headers":this.headers})
            .then(res => {
                if(res.data.status === 1001) {
                    alert(res.data.message);
                } else {
                
                this.goBack();
            }
                
            }).catch((error) => {
                if(error.response.status === 403) {
                    alert("Access Denied.");
                    this.goBack();
                } else {
                    alert("Something went wrong,Please try again...");
                }
            })
        } else {
            alert("Please fill required fields\n"+validate.toString());
        }
    }

    selectTaggingOptions = (e,label,i) => {
        let details = this.state.userData;
        if(label==="Subject") {
            details.userTagEntity.subjectId = e.target.value;
            details.userTagEntity.topicIds = [];
            let request = {"dropdownName" : "Topic",  "dropdownValueId" :+(e.target.value)}
            this.getDropdownDynamicList(request);
            this.setState({showlabel1:""})
        }
    
        if(label==="Primary Language") {
            details.userTagEntity.primaryLangId = e.target.value;
            details.userTagEntity.secondaryLangIds = [];
        }
      
        this.setState({userData:details,showTopics:false,showlang:false})
    }
    addAccountNumber=(e)=>{
        e.preventDefault();
        let details = this.state.userData;
        details.bankAccounts.push({"accountNumber":""});
        this.setState({userData:details})
    }

    componentDidMount() {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        let request = {
            "dropdownName" : "Subject"
        };
        this.getDropdownDynamicList(request,"onload1")
        this.getRoles();
        if(this.props.location.UserProps !== undefined) {
            // this.setState({userData:this.updateRequest});
            this.getUserDetails();
        }
        
    }

    showCheckboxes = (flag,i) =>{
        if(i === 1) {
            this.setState({showTopics:flag,showlang:false,tagIndex:i})
        } else {
            this.setState({showlang:flag,showTopics:false,tagIndex:i})
        }
    }
    selectedValues=[];
    onSelect = (e,i) => {
        // alert(i);
        let details = this.state.userData,showlabel2 = this.state.showlabel2,showlabel1=this.state.showlabel1;
        if(this.props.location.UserProps === undefined) {
            if(this.state.tagIndex === 3 && e) {
                this.taggingData[3].dropdownMappingModels[i].isChecked = e;
                details.userTagEntity.secondaryLangIds.push({"languageId":this.taggingData[3].dropdownMappingModels[i].valueCode});
                showlabel2 = this.taggingData[3].dropdownMappingModels[i].valueName;
            }
            if(this.state.tagIndex === 3 && !e) {
                this.taggingData[3].dropdownMappingModels[i].isChecked = e;
                details.userTagEntity.secondaryLangIds.splice(i,1);
                showlabel2=""
            }
            if(this.state.tagIndex === 1 && e) {
                this.taggingData[1].dropdownMappingModels[i].isChecked = e;
                details.userTagEntity.topicIds.push({"topicId":this.taggingData[1].dropdownMappingModels[i].valueCode})
                showlabel1 = this.taggingData[1].dropdownMappingModels[i].valueName
            }
            if(this.state.tagIndex === 1 && !e) {
                this.taggingData[1].dropdownMappingModels[i].isChecked = e;
                details.userTagEntity.topicIds.splice(i,1);
                showlabel1="";
            }
        } else {
            if(this.state.tagIndex === 3 && e) {
                this.taggingData[3].dropdownMappingModels[i].isChecked = e;
                details.userTagEntity.secondaryLangIds.push({"languageId":this.taggingData[3].dropdownMappingModels[i].valueCode});
                showlabel2 = this.taggingData[3].dropdownMappingModels[i].valueName;
            }
            if(this.state.tagIndex === 3 && !e) {
                this.taggingData[3].dropdownMappingModels[i].isChecked = e;
                details.userTagEntity.secondaryLangIds.forEach((item,j) => {
                    if(item.languageId === this.taggingData[3].dropdownMappingModels[i].valueCode) {
                        Object.assign(details.userTagEntity.secondaryLangIds[j], {"action": "DELETE"});
                    }
                })
               
                showlabel2=""
            }
            if(this.state.tagIndex === 1 && e) {
                this.taggingData[1].dropdownMappingModels[i].isChecked = e;
                details.userTagEntity.topicIds.push({"topicId":this.taggingData[1].dropdownMappingModels[i].valueCode})
                showlabel1 = this.taggingData[1].dropdownMappingModels[i].valueName
            }
            if(this.state.tagIndex === 1 && !e) {
                this.taggingData[1].dropdownMappingModels[i].isChecked = e;
                details.userTagEntity.topicIds.forEach((item,j) => {
                    if(item.topicId === this.taggingData[1].dropdownMappingModels[i].valueCode) {
                        Object.assign(details.userTagEntity.topicIds[j], {"action": "DELETE"});
                    }
                })
                // Object.assign(details.userTagEntity.topicIds[i], {"action": "DELETE"});
                showlabel1="";
            }
        }

        this.setState({userData:details,showlabel1,showlabel2,taggingData:this.taggingData});
    }
    onChangeRole=(e) => {
        let details = this.state.userData;
        details.roleEntity.roleEntityId = e.target.value;
        this.setState({userData:details});
    }

    render() {
        const {userData,previewVideo,showVideo,previewImage,showImage,taggingData,showTopics,showlang,showlabel1,showlabel2,roles} = this.state;
        return(
            <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 main-section pad0"> 
             <BlockUi tag="div" blocking={this.state.blocking}>
            <form>                
                <div className="user-add-top-section">               
                    <div className="user-top-bar title-mrgn">
                        <span className="add-user-title"><Link className="a" to="/manageUsers">Manage User</Link></span><span className="exam-ma">{this.props.location.UserProps !== undefined?"/Update User":"/Add New User"}</span>
                        <div className="user-top">
                            <span className="add-new-user">{this.props.location.UserProps !== undefined?"Update User":"Add New User"}</span>
                            <button className="user-cancel-label user-cancel-mask" onClick={() => this.goBack()}>Cancel</button>
                            <button className="user-save-label create-user-mask" onClick={(e) => this.addUserHandler(e)}>{this.props.location.UserProps !== undefined?"Update User":"Create User"}</button>
                        </div>
                    </div>
                </div>
                <div>
                
                    <div className="user-rectangle2"> 
                        <div className="user-rectangle3"><span className="user-rectangle-text title-mrgn">User Details</span>  <div className="sample-user right"></div></div>
                    </div>
                   
                        <div className="user-details-section">
                            <div>
                                <div className="inner-section inner-mrgn inner-mrgn-tp">
                                    <span className="first-name-box">
                                        <input 
                                            className="fname-input-base user-forms-placeholder inner-mrgn-rt" 
                                            type="text" 
                                            placeholder="First Name" 
                                            required 
                                            onChange={(e) => this.handleChangeText(e,"fname")}
                                            value={userData.firstName}
                                           
                                        />
                                    </span>
                                    <span className="first-name-box">
                                        <input 
                                            className="fname-input-base user-forms-placeholder inner-mrgn-rt" 
                                            type="text" 
                                            placeholder="Last Name" 
                                            required 
                                            onChange={(e) => this.handleChangeText(e,"lname")}
                                            value={userData.lastName}
                                            
                                        />
                                    </span>
                                    <span className="first-name-box">
                                        <input 
                                        className="fname-input-base user-forms-placeholder"  
                                        type="email" 
                                        placeholder="Email Address"
                                        required 
                                        onChange={(e) => this.handleChangeText(e,"email")}
                                        value={userData.email}
                                        disabled = {this.props.location.UserProps !== undefined}
                                        />
                                    </span>
                                </div>
                                <div className="inner-section inner-mrgn inner-mrgn-tp1">
                                    <span className="first-name-box">
                                        <input 
                                            className="fname-input-base user-forms-placeholder inner-mrgn-rt"  
                                            type="number" 
                                            placeholder="Phone Number" 
                                            onChange={(e) => this.handleChangeText(e,"phone")}
                                           
                                            minlength="10"
                                            required
                                            value={userData.phoneNumber}
                                            />
                                    </span>
                                    <span className="first-name-box">
                                        <select className="fname-input-base user-forms-placeholder inner-mrgn-rt" id="Role" onChange={(e) => this.onChangeRole(e)}>
                                            <option value="Role">Role</option>
                                            {roles.map((item,i) =>{ return <option key={item.valueCode} value={item.valueCode}>{item.valueName}</option>})}
                                        </select>
                                        
                                        </span>
                                    <span className="first-name-box">
                                        <input 
                                            className="fname-input-base user-forms-placeholder"  
                                            type="text" 
                                            placeholder="PAN" 
                                            onChange={(e) => this.handleChangeText(e,"pan")}
                                            value={this.props.location.UserProps === undefined?userData.panNo:userData.pan}
                                        />
                                    </span>
                                </div>
                                <div className="inner-section inner-mrgn inner-mrgn-tp1">
                                    <span className="first-name-box">
                                        <input 
                                            className="address-input-base user-forms-placeholder"  
                                            type="text" 
                                            placeholder="Address" 
                                            onChange={(e) => this.handleChangeText(e,"address")}
                                            value={userData.address}
                                        />
                                    </span>
                                   
                                </div>
                                {/* <div className="inner-section inner-mrgn inner-mrgn-tp1"> */}
                                <div className="inner-mrgn inner-mrgn-tp1" style={{display:"flex"}}>
                                    <div className="user-browse-image-box">
                                       {!showImage && <div className="dropzone uploadfuzone fuzone">
                                            <div className="upload-row">
                                            
                                                <div className="user-upload-image-base">
                                                    <div className="upload-icn-mrgn"><img src={BrowseImage} alt=""></img> </div>
                                                    <div className="browse-image-placeholder">Browse Image </div>
                                                </div>

                                                <div className="">
                                                    <div className="fu-text"> <span><i className="content-upload-text"></i> Please click browse to choose a file from your computer</span> </div>
                                                </div>
                                            </div> <input type="file" className="input" accept=".png,.jpeg" onChange={(e) => this.onSelectProfileImage(e)}/>
                                        </div>}
                                       {showImage && <div>
                                            <img className="user-browse-image-box" src={previewImage} alt=""/>
                                        </div>}
                                    </div>
                                    <div className="browse-video-base browse-mrgn">
                                       {!showVideo && <div className="dropzone uploadfuzone fuzone">
                                            <div className="upload-row">
                                            
                                                <div className="user-upload-video-base">
                                                    <div className="upload-icn-mrgn"><img src={BrowseVideo} alt=""></img> </div>
                                                    <div className="browse-forms-placeholder">Browse File </div>
                                                </div>

                                                <div className="">
                                                    <div className="fu-text"> <span><i className="content-upload-text"></i> Please click browse to choose a file from your computer</span> </div>
                                                </div>
                                            </div> <input type="file" className="input" accept=".mp4" onChange={(e) => this.onSelectProfileVideo(e)}/>
                                        </div>}
                                       {showVideo && <div>
                                            <video className="user-selected-file-base" controls>
                                                <source src={previewVideo} type="video/mp4" />
                                            
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>}
                                    </div>
                                    <div className="bank-acc-box browse-mrgn">
                                        {userData.bankAccounts.map((acc,i) =>{
                                            return  <div>
                                                <input 
                                                type="number"
                                                className="bank-acc-base bank-acc-placeholder" 
                                                placeholder="Bank Account Number" 
                                                value={acc.accountNumber} 
                                                onChange={(e) => this.handleChangeText(e,"acc",i)}
                                                />
                                            </div>
                                        })}
                                       
                                        <div><button className="add-acc-buttons-label add-acc-mask" onClick={(e) => this.addAccountNumber(e)}>Add New Account</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ct-tagging-section">
                            <div className="ct-rectangle4"> 
                                <div className="qt-rectangle5"><span className="ct-rectangle-text1">Tagging</span>  <div className="ct-sample-sq1 ct-right"></div></div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ct-section-mrgn">
                                <Container>
                                    <Row className="user-row">
                                {/* {taggingData.map((item,i) => {
                                return( */}
                                <Col>
                                    <span className="ct-dd-mrgn" key={taggingData[0].id}>
                                        <select className="ct-tagging-dd-base ct-tagging-dd-subject" id={taggingData[0].dropdownLabel} onChange={(e) => this.selectTaggingOptions(e,taggingData[0].dropdownLabel,0)}>
                                            <option>{taggingData[0].dropdownLabel}</option>
                                            {taggingData[0].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>
                                {/* )})
                                } */}
                                </Col>
                                <Col>
                                <div className="user-dd-base" onClick={() => this.showCheckboxes(!showTopics,1)}>
                                        <span className="filter-dd-subject">{showlabel1?showlabel1:taggingData[1].dropdownLabel}<img className="dd-icon" src={Down} alt=""></img>
                                            
                                        </span>                                               
                                    </div>
                                    {/* <div className="qt-select-label">details.dropdownLabel</div> */}
                                    
                                      { showTopics && <div className ="filter-options-base" id={"List"+"index"}><ul className ="fltr-dd-mrgn">
                                        {taggingData[1].dropdownMappingModels.map((value, j) => {
                                            return (<li key={j}>
                                                    <Checkbox  handleChange={this.onSelect} label="Filter" value={value.valueCode} checked={value.isChecked} index={j} parent="list"/>
                                                    {/* <input className="cb-rectangle" type="checkbox" value={value} onClick={(e) => this.onSelect(e,index,j)} /> */}
                                                    
                                                    <label htmlFor={j} className={!value.isChecked?"fltr-placeholder":"fltr-placeholder-active"}>{value.valueName}</label>
                                                </li>
                                            )})}
                                        </ul>
                                    </div>}
                                    </Col>
                                    <Col>
                                    <span className="ct-dd-mrgn" key={taggingData[2].dropdownLabel}>
                                        <select className="ct-tagging-dd-base ct-tagging-dd-subject" id={taggingData[2].dropdownLabel} onChange={(e) => this.selectTaggingOptions(e,taggingData[2].dropdownLabel,2)}>
                                            <option>{taggingData[2].dropdownLabel}</option>
                                            {taggingData[2].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>
                                {/* )})
                                } */}
                                </Col>
                                <Col>
                                <div className="user-dd-base" onClick={() => this.showCheckboxes(!showlang,3)}>
                                        <span className="filter-dd-subject">{showlabel2?showlabel2:taggingData[3].dropdownLabel}<img className="dd-icon" src={Down} alt=""></img>
                                            
                                        </span>                                               
                                    </div>
                                    {/* <div className="qt-select-label">details.dropdownLabel</div> */}
                                    
                                        {showlang  && <div className ="filter-options-base" id={"List"+"index"}><ul className ="fltr-dd-mrgn">
                                        {taggingData[3].dropdownMappingModels.map((value, j) => {
                                            return (<li key={j}>
                                                    <Checkbox  handleChange={this.onSelect} label="Filter" value={value.valueName} checked={value.isChecked} index={j}/>
                                                    {/* <input className="cb-rectangle" type="checkbox" value={value} onClick={(e) => this.onSelect(e,index,j)} /> */}
                                                    
                                                    <label htmlFor={j} className={!value.isChecked?"fltr-placeholder":"fltr-placeholder-active"}>{value.valueName}</label>
                                                </li>
                                            )})}
                                        </ul>
                                    </div>}
                                    </Col>
                            </Row>
                            </Container>
                            
                        </div>
                   
                    </div>
                    </div>
                </form>
                </BlockUi>
            </section>
        )
    }
}
