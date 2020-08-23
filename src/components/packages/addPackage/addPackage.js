import React,{Component} from "react";
import "./addPackage.css";
import { Link } from "react-router-dom";
import BrowseImage from "../../../Assets/images/icn_userimage.png";
import BrowseVideo from "../../../Assets/images/icn_uservideo.png";
import {QUESTION_WS,PACKAGE_WS,CREATE_PACKAGE,PACKAGE_DETAILS,PACKAGE_UPDATE,GET_DYNAMIC_DROPDOWNS,STATIC_DROPDOWNS} from "../../../shared/services/endPoints";
import axios from 'axios';
import BlockUi from 'react-block-ui';
import Down from "../../../Assets/images/Down.png";
import Checkbox from "../../../shared/utils/checkbox/checkbox";
import { Container,Row,Col } from 'reactstrap';
import Editor from "../../../shared/utils/rte/richTextEditor";
import Delete from "../../../Assets/images/icn_delete.png";
import Edit from "../../../Assets/images/icn_edit.png";
import Show from "../../../Assets/images/icn_show.png";
import Hide from "../../../Assets/images/icn_hide.png";
import Table from 'react-bootstrap/Table';
import CreateModal from "../../../shared/modals/createModal/createTagMaster";

export default class AddPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taggingData:[],
            examTaggingData:[],
            highlight:"",
            packageData:{
                "packageTitle": "",
                "packageDescription": "",
                "packageSubscriptionType": 0,
                "examCategories": [
                  
                ],
                "packageHighLights": [
                   
                ],
                "examId": 0,
                "packageMetadata": [
                   
                ]
            },
            packageMetadata:{
                
            },
            packageMetadatas:[],
            isChecked:false,
            grace:"",
            days:"",
            mrp:"",
            sp:"",
            rp:"",
            isEditHighlight:false,
            index:0,
            isEditValidity:false,
            validityIndex:0,
            disableValidity:false,
            disableHighLight:false,
            selectedItem:0,
            selectedItem1:0,
            selectedItem2:0,
            isOnload:[]
        }
    }
    validities = {
        "validityType": 0,
        "validityPeriod": "",
        "validityUnit": 1,
        "maxRetailPrice": 0,
        "sellingPrice": 0,
        "repurchasePrice": 0,
        "gracePeriod": 0,
        "graceUnit": 1,
        "isHidden": false,
        "isRecommended": false
    }

    getStaticDropdowns=()=>{
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${STATIC_DROPDOWNS}`,{"headers":this.headers})
        .then(res => {
         
            this.setState({taggingData:res.data.response.dropdownDataModel})
            
        })
    }

    getPackageDetails = () => {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        let requestBody=this.props.location.PackageProps.packageEntityId
        ,details = this.state.packageData,packageMetadatas=[],showlabel1="";
       
        let url = `${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${PACKAGE_DETAILS}?id=${requestBody}`;
        axios.get(url, {"headers":this.headers})
        .then(res => {
          
            details.packageTitle= res.data.response.title;
            details.packageSubscriptionType = res.data.response.subscriptionType;
            this.props.location.PackageProps.action === "edit" && Object.assign(details, {"packageEntityId": res.data.response.packageEntityId});
            details.packageDescription = res.data.response.description;
            details.packageHighLights = res.data.response.packageHighlights;
            details.packageMetadata = res.data.response.packageMetadataEntity.sort((a, b) => {return a.packageMetadataId-b.packageMetadataId});
            details.examCategories = res.data.response.examCategories.sort((a, b) => {return a.examCategoryEntityId-b.examCategoryEntityId});
            details.examId = res.data.response.examId;
            // packageMetadatas = res.data.response.packageMetadataEntity;
            // let request1 = {
            //     "dropdownName" : "Exam Category"
            // };
            if(res.data.response.subscriptionType === 3) {
               
                let request = {
                    "dropdownName" : "Exam",  "dropdownValueId" : res.data.response.examCategories.length>0?res.data.response.examCategories[0].examCategoryId:0
                }
                this.getExamDropdownData(request,2);
                // this.getExamDropdownData(request1,1);
            }
           
            // if(res.data.response.subscriptionType !== 3 &&  this.state.examTaggingData.length>0) {
            //     this.getExamDropdownData(request1,"setValue");
                
            // }
            this.setState({packageData:details,packageMetadatas,showlabel1,selectedItem:res.data.response.subscriptionType},() =>{
                
                // if(document.getElementById("Subscription Type").value!== null )document.getElementById("Subscription Type").value = res.data.response.subscriptionType !== 0?res.data.response.subscriptionType:"Subscription Type";
            });
        })
    }

    // setValue =() => {
    //     if(this.props.location.PackageProps !== undefined) {
    //         document.getElementById("Subscription Type").value = this.state.packageData.packageSubscriptionType !== 0?this.state.packageData.packageSubscriptionType:"Subscription Type";
    //     }
    // } 

    // setValues = () => {
    //     document.getElementById("Exam Category").value = this.state.packageData.examCategories[0].examCategoryId;
    //     document.getElementById("Exam").value = this.state.packageData.examId !== 0 ?this.state.packageData.examId:"Select";
    // }

    getExamDropdownData= (request,label) =>{
        let categories = this.state.examTaggingData,packageData = this.state.packageData,showlabel1="";
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_DYNAMIC_DROPDOWNS}`,request,{"headers":this.headers})
        .then(res => {
         
            if(label === "onload") {
                categories[0] = res.data.data.response.dropdownDataModel[0];
            } else {
                if(res.data.data.response.dropdownDataModel.length>0) {
                categories[1] = res.data.data.response.dropdownDataModel[0];
            }
            }
            this.setState({examTaggingData:categories},() =>{
             
                if(packageData.packageSubscriptionType === 3 ) {
                    // let val = document.getElementById("Exam Category").value;
                    // if (val !== null) {
                     
                    // }
                    
                    this.setState({
                       
                        selectedItem2:packageData.examCategories.length>0?packageData.examCategories[0].examCategoryId:"Exam Category"
                    }, () => {
                        
                        this.afterSetStateFinished();

                    });
                    // this.setState({selectedItem2:125324})
                } 
                if(label === 2 ) {
                //     let val = document.getElementById("Exam").value 
                //    if( val !== null) val = this.state.packageData.examId;
                    this.setState({selectedItem1:packageData.examId})
                }
                if(this.props.location.PackageProps !== undefined && label === "onload") {
                
                    this.state.examTaggingData[0].dropdownMappingModels.forEach((item,i) => {
        
                        if(packageData.examCategories && packageData.examCategories.length>0 ) {
                        
                            packageData.examCategories.forEach((data,j) =>{
                                if(item.valueCode ===  data.examCategoryId)
                                {
                                    showlabel1 = item.valueName;
                                    item.isChecked = true;}
                            })
                            // showlabel2 = item.valueName;
                          
                        }
                          
                    })
                }
                    this.setState({packageData,showlabel1})
                    // document.getElementById("Exam Category").value = 125324;
           
            });
           
            // if(this.props.location.PackageProps !== undefined && label !== "onload") {
            //     this.setValues();
            // }
        })
    }
    afterSetStateFinished =() =>{
       
      
          document.getElementById("Exam Category").value = this.state.packageData.examCategories.length>0?this.state.packageData.examCategories[0].examCategoryId:"Select";
         
    }
    goBack = () => {
        this.props.history.push("/packages")
    }
    addUserHandler=(e) => {
        let request = this.state.packageData;
        e.preventDefault();
        if(this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "duplicate") {
            request.examCategories.forEach((item) => delete item.examCategoryEntityId);
            request.packageMetadata.forEach((item) => delete item.packageMetadataId);
            request.packageHighLights.forEach((item) => delete item.highlightEntityId);
        }
        
        if(this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "edit") {
            request.packageMetadata.forEach((item,i) =>{
                let validity = item.validityPeriod.toString().split(" ");
                let grace = item.gracePeriod.toString().split(" ")
             
                if(validity.length > 1) {
                    item.validityPeriod = validity[0];
                   
                    if(validity[1] === "Days") {
                       
                        Object.assign(request.packageMetadata[i],{"validityUnit":1});
                    }
                    if(validity[1] === "Months") {
                      
                        Object.assign(request.packageMetadata[i],{"validityUnit":2});
                    }
                    if(validity[1] === "Date/Time") {
                       
                        Object.assign(request.packageMetadata[i],{"validityUnit":3});
                    }
                }
                if(grace.length > 1) {
                    item.gracePeriod = grace[0];
                  
                    if(grace[1] === "Days") {
                       
                        Object.assign(request.packageMetadata[i],{"graceUnit":1});
                    }
                    if(grace[1] === "Months") {
                       
                        Object.assign(request.packageMetadata[i],{"graceUnit":2});
                    }
                    if(grace[1] === "Date/Time") {
                       
                        Object.assign(request.packageMetadata[i],{"graceUnit":3});
                    }
                }
            });
        }
      
        // if(this.props.location.PackageProps !== undefined && this.state.packageData.packageMetadata.length > 0) {
            let endpoint = this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "edit"? PACKAGE_UPDATE:CREATE_PACKAGE;
            axios.post(`${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${endpoint}`,request,{"headers":this.headers})
            .then(res => {
                console.log("Create packgae:response:-----<>",res);
                this.goBack();
               
            }).catch((error) => {
                if(error.response.status === 403) {
                    alert("Access Denied.");
                    this.goBack();
                } else {
                    alert("Something went wrong,Please try again...");
                }
            })
     
    }

    addHighlightHandler=(e) => {
        e.preventDefault();
        let data = this.state.packageData;
        data.packageHighLights.push({"highlightText":this.state.highlight});
        this.setState({packageData:data,highlight:""});
    }
    addValidityTypeHandler=(e) => {
        e.preventDefault();
        let packageMetadatas = this.state.packageMetadatas,packageMetadata=this.state.packageMetadata,packageData=this.state.packageData;
        let dataFormat = {
            "validityType": 0,
            "validityPeriod": "",
            "validityUnit": 1,
            "maxRetailPrice": 0,
            "sellingPrice": 0,
            "repurchasePrice": 0,
            "gracePeriod": 0,
            "graceUnit": 1,
            "isHidden": false,
            "isRecommended": false
        }
        if(!this.state.isEditValidity) {
            
            if(this.state.isChecked) {
                packageMetadata.repurchasePrice = packageMetadata.sellingPrice;
            }
            // packageMetadata.disaplyUnits =  packageMetadata.validityPeriod + " " + packageMetadata.validityUnit;
           
           
            // packageMetadata.validityPeriod =  this.showunits(packageMetadata);
            packageMetadatas.push(packageMetadata);
            packageData.packageMetadata.push(packageMetadata);
            
            this.setState({packageData,packageMetadatas,sp:"",rp:"",mrp:"",days:"",grace:"",isChecked:false,validityIndex:this.state.validityIndex+1},() =>{
               this.setData(dataFormat)
                });
            document.getElementById("Validity").value = "validity";
            // packageMetadata.validityPeriod = "2 lakshmi";
            document.getElementById("Days").value = 1;
            document.getElementById("Grace").value = "grace";
            
        } else {
            let onload =[];
            // packageMetadata.validityPeriod = packageMetadata.validityPeriod.toString().slice(0, packageMetadata.validityPeriod.toString().indexOf(" "));
            packageMetadatas.push(packageMetadata);
           
         
            packageData.packageMetadata[this.state.validityIndex]=packageMetadata;
            onload[this.state.validityIndex] = true
            this.setState({packageData,packageMetadatas,sp:"",rp:"",mrp:"",days:"",grace:"",isChecked:false,isEditValidity:false,isOnload:onload},() =>{
                this.setData(dataFormat)
                 });
            document.getElementById("Validity").value = "validity";
            document.getElementById("Days").value = 1;
            document.getElementById("Grace").value = "grace";
        }
       
    }
    setData = (data) =>{
       
        this.setState({packageMetadata:data})
    }
    removeHighlight = (i) => {
        let packageData = this.state.packageData;
        if((this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "duplicate") || this.props.location.PackageProps === undefined) {
            packageData.packageHighLights.splice(i,1);
        }
        if(this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "edit") {
            Object.assign(packageData.packageHighLights[i], {"action": "DELETE"});
            document.getElementById("Highlight"+i).style.display = "none";
        }
        this.setState({packageData})
    }
    handleEditorData = (value) => {
        let data = this.state.packageData;
        data.packageDescription = value;
        this.setState({packageData:data});
    }
    onChangeTextHandler=(e,label)=>{
        
        let data = this.state.packageData,packageMetadata=this.state.packageMetadata,grace,sp,rp,mrp,days,packageMetadatas = this.state.packageMetadatas;
       
        if(label === "name") {
            data.packageTitle = e.target.value;
        }
        if(label === "days") {
            // packageMetadatas[this.state.validityIndex].validityPeriod = e.target.value;
           
            packageMetadata.validityPeriod = +(e.target.value);
            days = e.target.value;
        }
        if(label === "mrp") {
            // packageMetadatas[this.state.validityIndex].maxRetailPrice = e.target.value;
            packageMetadata.maxRetailPrice = e.target.value;
            mrp = e.target.value;
        }
        if(label === "sp") {
            // packageMetadatas[this.state.validityIndex].sellingPrice = e.target.value;
            packageMetadata.sellingPrice = e.target.value;
            sp = e.target.value;
        }
        if(label === "rp") {
            // packageMetadatas[this.state.validityIndex].repurchasePrice = e.target.value;
            packageMetadata.repurchasePrice = e.target.value;
            rp = e.target.value;
        }
        if(label === "grace") {
            // packageMetadatas[this.state.validityIndex].gracePeriod = e.target.value;
            packageMetadata.gracePeriod = +(e.target.value);
            grace = e.target.value;
        }
        // data.packageMetadata = 
        this.setState({packageMetadata,packageMetadatas,sp,rp,mrp,days,grace,disableValidity:true});
    }
    componentDidMount() {
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        if(this.props.location.PackageProps !== undefined) {
            this.getPackageDetails();
        }
        this.getStaticDropdowns();
        // if(this.props.location.PackageProps === undefined) {
            let request1 = {
                "dropdownName" : "Exam Category"
            };
    
            this.getExamDropdownData(request1,"onload");
        // }
       this.setState({packageMetadata:this.validities});
    }
    selectTaggingOptions = (e,label,i) => {
        let data = this.state.packageData,packageMetadata=this.state.packageMetadata,selectedItem,selectedItem1,selectedItem2;
       
        if(label === "Subscription Type") {
            data.packageSubscriptionType = +(e.target.value);
            data.examCategories = [];
            selectedItem = +(e.target.value);
        }
        if(label === "Exam Category") {
            if(data.examCategories.length >0) {
            data.examCategories[0].examCategoryId = +(e.target.value);
        }
            data.examCategories.push({"examCategoryId":+(e.target.value)});
            // selectedItem1 = +(e.target.value);
         
            let request = {
                "dropdownName" : "Exam",  "dropdownValueId" : +(e.target.value)
            }
            this.getExamDropdownData(request,"exam");
        }
        if(label === "Exam") {

            data.examId = +(e.target.value);
            // selectedItem2 = +(e.target.value);
        }

        if(label === "Days") {
           
            // data.packageMetadata[0].validityUnit = +(e.target.value);
            packageMetadata.validityUnit = +(e.target.value);
        } 
        if(label === "Grace Days") {
            // data.packageMetadata[0].graceUnit = +(e.target.value);
            packageMetadata.graceUnit = +(e.target.value);
        } 
        if(label === "Validity Type") {
            // data.packageMetadata[0].validityType = +(e.target.value);
            packageMetadata.validityType = +(e.target.value);
        } 
        this.setState({packageData:data,packageMetadata,selectedItem2,selectedItem1,selectedItem,disableValidity:true});
    }

    showCheckboxes = (flag,i) =>{
        if(i === 1) {
            this.setState({showTopics:flag})
        } else {
            this.setState({showTopics:false})
        }
    }

    handleChange = (e, label) => {
        let packageMetadata = this.state.packageMetadata,isChecked,rp,details=this.state.packageData;
        if(label !== "price") {
          
            // packageMetadata.isRecommended = e;
            details.packageMetadata[label].isRecommended = e;
        }
        if(label === "price") {
            // packageMetadata.isHidden = e;
            isChecked = e;
            if(e) {
                rp = this.state.sp;
                if(this.state.isEditValidity) {
                    details.packageMetadata[this.state.validityIndex].repurchasePrice = details.packageMetadata[this.state.validityIndex].sellingPrice;
                }
            }
        }
        this.setState({packageData:details,packageMetadata,isChecked,rp});
    }

    onSelect = (e,i) => {
       
        let details = this.state.packageData,showlabel1=this.state.showlabel1;
        if(e) {
            showlabel1 = this.state.examTaggingData[0].dropdownMappingModels[i].valueName;
            details.examCategories.indexOf(this.state.examTaggingData[0].dropdownMappingModels[i].valueCode) === -1 && details.examCategories.push({"examCategoryId":this.state.examTaggingData[0].dropdownMappingModels[i].valueCode});
        }
        if(this.state.packageData.packageSubscriptionType !== 3 && (this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "edit") &&!e ) {
            Object.assign(details.examCategories[i], {"action": "DELETE"});
        }
        if((this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "duplicate") && !e) {
            details.examCategories.splice(i,1);
        }
        if(this.props.location.PackageProps === undefined && !e) {
            details.examCategories.splice(i,1);
        }
       
        this.setState({packageData:details,showlabel1});
    }

    removeValidityHandler = (i) => {
        let packageData = this.state.packageData,packageMetadatas=this.state.packageMetadatas;
       
        if((this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "duplicate") || this.props.location.PackageProps === undefined) {
            packageData.packageMetadata.splice(i,1);
            packageMetadatas.splice(i,1);
        }
        if(this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "edit") {
           
            Object.assign(packageData.packageMetadata[i], {"action": "DELETE"});
            // Object.assign(packageMetadatas[i], {"action": "DELETE"});
            document.getElementById("Validity"+i).style.display = "none";
        }
        this.setState({packageData,packageMetadatas})
    }

    handleHideShow = (flag,i) => {
        let packageMetadatas = this.state.packageMetadatas,packageData=this.state.packageData;
        packageData.packageMetadata[i].isHidden = !flag;
        this.setState({packageMetadatas,packageData})
    }

    updateHighlight = (data) =>{
        let packageData = this.state.packageData;
    
        packageData.packageHighLights[this.state.index].highlightText = data;
        this.setState({packageData});
    }
    hidePopup = () =>{
        this.setState({isEditHighlight:false});
    }
    validity={};
    editValidityHandler=(i)=>{
        let packageData = this.state.packageData;
        this.validity = packageData.packageMetadata[i];
        let unit = this.props.location.PackageProps !== undefined?packageData.packageMetadata[i].validityPeriod.toString().split(" ")[1]:packageData.packageMetadata[i].validityPeriod ;
        let unit1 = this.props.location.PackageProps !== undefined? packageData.packageMetadata[i].gracePeriod.toString().split(" ")[1]:packageData.packageMetadata[i].gracePeriod ;
        document.getElementById("Validity").value = packageData.packageMetadata[i].validityType;
        document.getElementById("Days").value = packageData.packageMetadata[i].validityUnit===undefined?unit === "Days"?1:unit === "Months"?2:unit === "Date/Time"?3:unit:packageData.packageMetadata[i].validityUnit;
        document.getElementById("Grace").value =packageData.packageMetadata[i].graceUnit===undefined? unit1 === "Days"?1:unit1 === "Months"?2:unit1 === "Date/Time"?3:unit1:packageData.packageMetadata[i].graceUnit;
        delete packageData.packageMetadata[i].validityTypeName;
        // validity.validityPeriod = +(validity.validityPeriod.split(" ")[0]);
        // validity.gracePeriod = +(validity.gracePeriod.split(" ")[0]);
        if(packageData.packageMetadata[i].validityUnit===undefined) {
            Object.assign(packageData.packageMetadata[i], {"validityUnit":packageData.packageMetadata[i].packageMetadataId? unit === "Days"?1:unit === "Months"?2:3:packageData.packageMetadata[i].validityUnit})
        }
        
        if(packageData.packageMetadata[i].graceUnit===undefined) {
            Object.assign(packageData.packageMetadata[i], {"graceUnit": packageData.packageMetadata[i].packageMetadataId? unit1 === "Days"?1:unit1 === "Months"?2:3:packageData.packageMetadata[i].graceUnit})
        }
        this.setState({isEditValidity:true,days:this.props.location.PackageProps !== undefined? +(packageData.packageMetadata[i].validityPeriod.toString().split(" ")[0]):packageData.packageMetadata[i].validityPeriod,
            mrp:packageData.packageMetadata[i].maxRetailPrice,sp:packageData.packageMetadata[i].sellingPrice,
            rp:packageData.packageMetadata[i].repurchasePrice,grace:this.props.location.PackageProps !== undefined?+(packageData.packageMetadata[i].gracePeriod.toString().split(" ")[0]):packageData.packageMetadata[i].gracePeriod,
            validityIndex:i, packageMetadata:this.validity,disableValidity:true});
          
    }

    showunits = (val) => {
       
        if(val.validityPeriod.toString().split(" ").length > 1) {
            return;
        } else
         {
            return val.validityUnit === 1?"Days":val.validityUnit === 2?"Months":"Date/Time"
        }

        // val.validityPeriod = val.validityPeriod.toString().slice(0, val.validityPeriod.toString().indexOf(" "));
     
    }
    showunits1 = (val) => {
       
        if(val.gracePeriod.toString().split(" ").length > 1) {
            return;
        } else
         {
            return val.graceUnit === 1?"Days":val.graceUnit === 2?"Months":"Date/Time"
        }

        // val.validityPeriod = val.validityPeriod.toString().slice(0, val.validityPeriod.toString().indexOf(" "));
     
    }

    render() {
        const {taggingData,showTopics,showlabel1,packageData,examTaggingData,packageMetadatas,isChecked,grace,days,mrp,sp,rp,highlight,isEditHighlight,passValue,isEditValidity,disableHighLight,disableValidity} = this.state;
       
        return(
            <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 main-section pad0"> 
            <CreateModal show={isEditHighlight} onHide={this.hidePopup} title="Edit Highlight" name="Highlight Text" dataFromChild={this.updateHighlight} label="editTagLevel" value={passValue}/>
                <BlockUi tag="div" blocking={this.state.blocking}>
                <form>                
                    <div className="user-add-top-section">               
                        <div className="user-top-bar title-mrgn">
                            <span className="add-user-title"><Link className="a" to="/packages">Packages</Link></span><span className="exam-ma">{this.props.location.PackageProps !== undefined?this.props.location.PackageProps.action === "edit"?"/Update Package":"/Duplicate Package":"/Add New Package"}</span>
                            <div className="user-top">
                                <span className="add-new-user">{this.props.location.PackageProps !== undefined?this.props.location.PackageProps.action === "edit"?"Update Package":"Duplicate Package":"Add New Package"}</span>
                                <button className="user-cancel-label user-cancel-mask" onClick={() => this.goBack()}>Cancel</button>
                                <button className={this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "duplicate"?"user-save-label create-package-mask duplicate-right":"user-save-label create-package-mask create-right"} 
                                onClick={(e) => this.addUserHandler(e)}>{this.props.location.PackageProps !== undefined?this.props.location.PackageProps.action === "edit"?"Update Package":"Duplicate Package":"Create Package"}</button>
                            </div>
                        </div>
                    </div>
                  
                    <div className="user-rectangle2"> 
                        <div className="user-rectangle3"><span className="user-rectangle-text title-mrgn">Package Details</span>  <div className="sample-user right"></div></div>
                    </div>
                   
                        <div className="user-details-section">
                            <div>
                                <div className="inner-section inner-mrgn inner-mrgn-tp">
                                    <span className="first-name-box">
                                        <input className="package-input-name-base user-forms-placeholder inner-mrgn-rt" 
                                            placeholder="Title" value={packageData.packageTitle}
                                            onChange={(e) => this.onChangeTextHandler(e,"name")}/></span>
                                   
                                </div>
                                <div className="pack-syb-box-mrgn">
                                    <span className="role-desc-label">Description</span>
                                    <div className="desc-editor-mrgn">
                                    <Editor  onChange={this.handleEditorData} label="description" content={packageData.packageDescription}/>
                                    </div>
                                    
                                </div>
                                <div className="package-dd-section-mrgn">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 user-dd-section-mrgn">
                                <Container className="pack-container">
                                    <Row className={packageData.packageSubscriptionType === 3?"package-dd-row":"package-dd-row1"}>
                                
                                <Col>
                                   {taggingData.length>0 && <span className="ct-dd-mrgn">
                                        <select className="ct-tagging-dd-base ct-tagging-dd-subject" value={this.state.selectedItem} id={taggingData[0].dropdownLabel} onChange={(e) => this.selectTaggingOptions(e,taggingData[0].dropdownLabel,0)}>
                                            <option>{taggingData[0].dropdownLabel}</option>
                                            {taggingData[0].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>}
                              
                                </Col>
                                {(packageData.packageSubscriptionType === 1 || packageData.packageSubscriptionType === 2) && <Col>
                               {examTaggingData.length>0 && <div className="user-dd-base" onClick={() => this.showCheckboxes(!showTopics,1)}>
                                        <span className="filter-dd-subject">{showlabel1?showlabel1:"Select"}<img className="dd-icon" src={Down} alt=""></img>
                                            
                                        </span>                                               
                                    </div>
                                  }
                                    
                                      { showTopics && <div className ="filter-options-base" id={"List"+"index"}><ul className ="fltr-dd-mrgn">
                                        {examTaggingData[0].dropdownMappingModels.map((value, j) => {
                                            return (<li key={j}>
                                                    <Checkbox  handleChange={this.onSelect} label="single" value={value.valueName} checked={value.isChecked} index={j}/>
                                                   
                                                    
                                                    <label htmlFor={j} className={!value.isChecked?"fltr-placeholder":"fltr-placeholder-active"}>{value.valueName}</label>
                                                </li>
                                            )})}
                                        </ul>
                                    </div>}
                                    </Col>}
                                    {packageData.packageSubscriptionType === 3 && <Col>
                                  {examTaggingData.length>0 && <span className="ct-dd-mrgn" >
                                       <select className="ct-tagging-dd-base ct-tagging-dd-subject" value={this.state.selectedItem2} id="Exam Category" onChange={(e) => this.selectTaggingOptions(e,"Exam Category",2)}>
                                            <option value="Select">Select</option>
                                            {examTaggingData[0].dropdownMappingModels !== undefined && examTaggingData[0].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>}
                               
                                </Col>}
                                {packageData.packageSubscriptionType === 3 && <Col>
                                    {examTaggingData.length>1 && <span className="ct-dd-mrgn" >
                                       <select className="ct-tagging-dd-base ct-tagging-dd-subject" value={this.state.selectedItem1} id="Exam" onChange={(e) => this.selectTaggingOptions(e,"Exam",2)}>
                                            <option value="Select">Select</option>
                                            {examTaggingData[1].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                        </select>
                                    </span>}
                               
                                </Col>}
                                </Row>
                                </Container>
                                </div>
                                </div>
                                <div className="pack-syb-box-mrgn">
                                   <div className="pack-highlights-label">
                                       Highlights
                                   </div>
                                   <div className="highlights-base">
                                   <ul className="ul-package-pad0">
                                        {packageData.packageHighLights.map((item,i) => {
                                            return (<li className="functionalities-base" key={i} id={"Highlight"+i}>
                                                    <div className="func-div">
                                                        <span className="data-placeholder1">{item.highlightText}</span>
                                                        {/* <span className="data-placeholder2">{item.pagePermission}</span> */}
                                                        <span className="func-buttons-box btn-right1 show-cursor" onClick={() => {this.setState({isEditHighlight:true, passValue:item.highlightText,index:i})}}><img className="img-padding" src={Edit} alt=""/></span>
                                                        <span className="func-buttons-box btn-right2 show-cursor" onClick={() => this.removeHighlight(i)}><img className="img-padding" src={Delete} alt=""/></span>
                                                       
                                                    </div>
                                                </li>)
                                            })
                                        }
                                        </ul>
                                        <span className="pack-rectangle-line"></span>
                                        <input placeholder="Highlight" className="base-highlight-label1" maxLength="50" value={highlight} onChange={(e) => this.setState({highlight:e.target.value,disableHighLight:true})}></input>
                                        <button className={disableHighLight?"base-highlight-label highlight-mask":"base-highlight-label highlight-mask disable-btn"} disabled={!disableHighLight} onClick={(e) => this.addHighlightHandler(e)}>Add Highlight</button>
                                   </div>
                                </div>

                                <div className="pack-syb-box-mrgn">
                                    <div className="highlights-base">
                                        <div className="ul-package-pad0">
                                    <Table size="sm" className="pack-table">
                                        
                                        <tbody>
                                            {packageData.packageMetadata.map((val,j) => {
                                            return( <tr className="add-pack-row" id={"Validity"+j}>
                                                <td className="paid-forms-placeholder" style={{"padding":"10px"}}>{val.validityType ===1 ? "Trial":"Paid"}</td>
                                            <td className="paid-forms-placeholder" style={{"padding":"10px"}}>{val.validityPeriod} {this.showunits(val)}</td>
                                                <td className="paid-forms-placeholder" style={{"padding":"10px"}}>MRP : INR {val.maxRetailPrice}</td>
                                                <td className="paid-forms-placeholder" style={{"padding":"10px"}}>SP : INR {val.sellingPrice}</td>
                                            
                                                <td className="paid-forms-placeholder" style={{"padding":"10px"}}>RP : INR {val.repurchasePrice}</td>
                                                <td className="paid-forms-placeholder" style={{"padding":"10px"}}>{val.gracePeriod} {this.showunits1(val)}</td>
                                                <td className="addpack-check add-pack-brdr">
                                                    <span style={{display: "flex"}}>
                                                    <Checkbox label="Single" handleChange={this.handleChange} parent="list" checked={val.isRecommended} index={j}></Checkbox>
                                                    <label htmlFor={j} className={!val.isRecommended?"fltr-placeholder":"fltr-placeholder-active"}>Recommended</label>
                                                    </span>
                                                </td>
                                                <td className="pack-icns-width add-pack-brdr add-pack-icn-padd" onClick={() => this.handleHideShow(val.isHidden,j)}>
                                                    <img className="add-pack-icn-padd show-cursor" src={val.isHidden?Hide:Show} alt="" />
                                                </td>
                                            
                                                <td className="pack-icns-width add-pack-brdr add-pack-icn-padd show-cursor" onClick={() => this.removeValidityHandler(j)}><img className="add-pack-icn-padd" src={Delete} alt="" /></td>
                                                <td className="pack-icns-width add-pack-brdr add-pack-icn-padd show-cursor" onClick={() => this.editValidityHandler(j)}><img className="add-pack-icn-padd" src={Edit} alt="" /></td>
                                            </tr>
                                            )})}
                                        </tbody>
                                    </Table>
                                    </div>
                                    <span className="pack-rectangle-line"></span>
                                    <div style={{display: "flex"}}>
                                        <span>
                                          { taggingData.length>0 &&  <select className="add-pack-bottom-field1 add-pack-bottom-placeholder1" id="Validity" onChange={(e) => this.selectTaggingOptions(e,"Validity Type",2)}>
                                                <option value="validity">Validity Type</option>
                                                {taggingData[1].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                            </select>}
                                        </span>
                                        <span>
                                           {taggingData.length>0 && <select className="add-pack-bottom-field2 add-pack-bottom-placeholder1"  id="Days" onChange={(e) => this.selectTaggingOptions(e,"Days",2)}>
                                                {/* <option value="days">Days</option> */}
                                                {taggingData[2].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                            </select>}
                                        </span>
                                        <span>
                                            <input type="number" 
                                                className="add-pack-forms-input-base add-pack-bottom-placeholder1"
                                                placeholder="00"
                                                onChange={(e) => this.onChangeTextHandler(e,"days")}
                                                value = {days}
                                            />
                                               
                                        </span>
                                        <span>
                                            <input className="add-pack-bottom-field3 mrp-forms-placeholder" placeholder="MRP" disabled />
                                        </span>
                                        <span>
                                            <input type="number" className="add-pack-bottom-field4 add-pack-bottom-placeholder1"
                                                placeholder="INR 00.000"
                                                onChange={(e) => this.onChangeTextHandler(e,"mrp")}
                                                value = {mrp}
                                            >
                                            </input>
                                        </span>
                                        <span>
                                            <input className="add-pack-bottom-field4 add-pack-bottom-placeholder1" placeholder="Selling Price" disabled></input>
                                        </span>
                                        <span>
                                            <input className="add-pack-bottom-field4 add-pack-bottom-placeholder1" 
                                             onChange={(e) => this.onChangeTextHandler(e,"sp")}
                                             value = {sp}
                                                placeholder="INR 00.000">
                                            </input>
                                        </span>
                                        <span className="add-pack-checkbox-base add-pack-check-mrgn">
                                           <Checkbox label="Single" handleChange={this.handleChange} value="single" parent="list" checked={isChecked} index="price"></Checkbox>
                                        </span>
                                        <span>
                                            <input className="add-pack-bottom-field44 add-pack-bottom-placeholder1" placeholder="Repurchase Price" disabled></input>
                                        </span>
                                        <span>
                                            <input className="add-pack-bottom-field4 add-pack-bottom-placeholder1" 
                                                 onChange={(e) => this.onChangeTextHandler(e,"rp")}
                                                placeholder="INR 00.000"
                                                value = {rp}>
                                            </input>
                                        </span>
                                        <span>
                                            {taggingData.length>0 && <select className="add-pack-bottom-field5 add-pack-bottom-placeholder1"  id="Grace" onChange={(e) => this.selectTaggingOptions(e,"Grace Days",2)}>
                                                <option value="grace">Grace Days</option>
                                                {taggingData[2].dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})}
                                            </select>}
                                        </span>
                                        <span>
                                            <input 
                                                className="add-pack-bottom-field6 add-pack-bottom-placeholder1" 
                                                onChange={(e) => this.onChangeTextHandler(e,"grace")}
                                                placeholder="00"
                                                value = {grace}
                                                />
                                               
                                        </span>
                                        <button className={disableValidity?"add-validity-label add-validity-mask add-pack-check-mrgn":"add-validity-label add-validity-mask add-pack-check-mrgn disable-btn"} disabled={!disableValidity}
                                        onClick={(e) => this.addValidityTypeHandler(e)}>{!isEditValidity?"Add Validity":"Update"}</button>
                                    </div>
                                    </div>
                                </div>
                               
                            </div>
                        </div>

                </form>
               </BlockUi>
              
            </section>
        )
    }
}