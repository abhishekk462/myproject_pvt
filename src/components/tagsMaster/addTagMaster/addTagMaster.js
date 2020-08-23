
import React,{Component} from "react";
import "./addTagMaster.css";
import CreateModal from "../../../shared/modals/createModal/createTagMaster";
import Edit from "../../../Assets/images/icn_edit.png";
// import Dropdown from "../../../shared/utils/deopdown/dropdown";
import down from "../../../Assets/images/Down.png";
import DeleteModal from "../../../shared/modals/deleteModal/deletePopup";
import axios from 'axios';
import {TAG_WS, CREATE_TAG_MASTER} from "../../../shared/services/endPoints";
import { Link } from "react-router-dom";

export default class AddTagsMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            levels:[],
            levelItems:[],
            showOptions:[],
            tagName: sessionStorage.getItem("tagName"),
            childData:"",
            isEditable:false,
            isAddLevelItem: false,
            levelIndex:0,
            itemIndex:0,
            val: false,
            isDelete:false,
            level:"",
            value:"",
            selectedValues:[],
            isEditLevelValues:false,
            parentLevel:0,
            isEditLevel:false,
            passValue:"",
            isDisable:false,
            deleteLevelIndex:0,
            deleteValueIndex:0
        }
      
    }

    hidePopup = () => {
      
        this.setState({isShow:false, isEditable:false, isAddLevelItem: false, isDelete:false,isEditLevelValues:false, isEditLevel:false});
     
    }

    formatData = () => {
        const {levels,childData, parentLevel, levelIndex} = this.state;
        let count = 0;
        // for(let i=0;i< levels.length;i++) {
          
   
            for(let j=0;j<childData.length;j++) {
            
                if(childData[j].levelId === levelIndex) {
                   
                    if(levels[levelIndex].tagItemValues.indexOf(childData[j].name) === -1) {
                        count += 1;
                        levels[levelIndex].tagItemValues.push({"name":childData[j].name,"level":levels[levelIndex].tagItemValues.length+1,"parentLevel":childData[j].parentLevel})
                    }
                     
                   
                } else {
                    count = 0;
                    levels[levelIndex].tagItemValues=[];
                    // this.setState(prevState => ({itemIndex:prevState.itemIndex}))
                }
            }
            this.setState({levels})
        // }
    
    }

    showPopup = () => {
        this.setState({isShow:true, levelIndex: this.state.levelIndex+1, isDisabled: true});
        this.setState({childData:[]});
    }

    addNewLevel = (data) => {
        const {isShow,levels} = this.state;
        this.setState({childData:[]});
        if(isShow) {
            levels.push({"name":data.name,"level":levels.length+1,"tagItemValues":[]});
            this.setState({levels});
        }
        
    }

    addNewLevelValue = (values) => {
       
        let levels = this.state.levels;
        const {levelIndex,parentLevel} = this.state;
      
        values.forEach((value) =>{
            if(values.levelId === levelIndex) {
                levels[levelIndex].tagItemValues.push({"name":value.name,"level":levels[levelIndex].tagItemValues.length+1,"parentLevel":parentLevel}) ; 
            }
    
        })
      
        this.setState({childData:values});
    }

    handleCreateTagSubmit = () => {
        this.formatData();
        const input = {
            "name": sessionStorage.getItem("tagName"),
            // "level": 0,
            "tagItems": this.state.levels
        }
        let token = sessionStorage.getItem("Token")
        let headers = {"Authorization":"Bearer "+token, "content-type":"application/json"};
       
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${TAG_WS}${CREATE_TAG_MASTER}`,input,{"headers":headers})
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
       
    }

    handleShowOptions = (i,val) => {
       
        const showOpt = [];
        showOpt[i] = val;
        this.setState({showOptions:showOpt,levelIndex: i});
        if(val === true) {  
            this.formatData();
        } else {
            this.setState({childData:[]});
        }
        
    }

    handleHideOptions = (i,val) => {
        
        const showOpt = [];
        showOpt[i] = val;
        this.setState({showOptions:showOpt,levelIndex: i,childData:[]});
    }

    handleDeleteItem = (i,j) => {
        let details = this.state.levels,selectedValues = this.state.selectedValues,showOptions = this.state.showOptions;
        // details[i].tagItemValues[j]["action"] = "DELETE";
        selectedValues.splice(i,1);
       
        this.setState({isDelete:true,level:details[i].name,value:details[i].tagItemValues[j].name,selectedValues});
        // details[i].tagItemValues.splice(j,1);
        showOptions[i] = false;
        this.setState({levels: details,showOptions,deleteLevelIndex:i,deleteValueIndex:j});
    }

    getChildData = (tagName) => {
        // sessionStorage.setItem("tagName", tagName);
        this.setState({tagName:tagName});
    }

    onSelect = (i,j,selectedValue) => {
        let selectedValues = this.state.selectedValues;
        selectedValues[i] = selectedValue.name;
        let showOptions = this.state.showOptions;
        showOptions[i] = false;
        this.setState({selectedValues,showOptions,childData:[], parentLevel:selectedValue.level});
        
    }

    editLevelValue = (value) => {
        const {levels,levelIndex,itemIndex} = this.state;
       
        let details = levels;
        details[levelIndex].tagItemValues[itemIndex].name = value;
       
        this.setState({levels: details});
    }

    updateTagLevelName = (levelName) => {
        let details = this.state.levels;
        details[this.state.levelIndex].name =levelName;
    
        this.setState({levels:details});
    }

    hideOptions = (i) => {
        let showOptions = this.state.showOptions;
        showOptions[i] = false;
        this.setState({showOptions});
    }
    goBack = () => {
        this.props.history.push('/tagMaster');
    }

    handleDelete = (message) => {
        let details = this.state.levels,initialValues=this.state.initialValues,selectedValues=this.state.selectedValues;
        initialValues = [];
        selectedValues = [];
        
        if(message==="delete") {
           
            details[this.state.deleteLevelIndex].tagItemValues.splice(this.state.deleteValueIndex,1)
        }
      
        this.setState({isDelete:false,initialValues, selectedValues,levels:details},() => { console.log("details:",details)});
       
    }

    render() {
        const {tagName, isEditable,isShow,levels,showOptions,isAddLevelItem, isEditLevelValues,levelIndex,isDelete,level,value,selectedValues,isEditLevel, passValue,isDisabled,parentLevel} = this.state;
        return(
            <div>
         <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pad0 add-tag-pad0">
             {/* Create and edit modals */}
            <CreateModal show={isShow} onHide={this.hidePopup} title="Add New Level" name="Level Name" dataFromChild={this.addNewLevel} label="level" index={levelIndex}/>
            <CreateModal show={isEditable} onHide={this.hidePopup} title="Edit Tag Master Name" name="Master Name" label="editTagName" dataFromChild={this.getChildData} value={passValue}/>
            <CreateModal show={isAddLevelItem} onHide={this.hidePopup} title={"Add New "+level} name="Option Name" dataFromChild={this.addNewLevelValue} label="levelItems" index={levelIndex} parentLevel={parentLevel}/>
            <CreateModal show={isEditLevelValues} onHide={this.hidePopup} title={"Edit "+level} name="Option Name" dataFromChild={this.editLevelValue} label="editLevelValue" value={passValue}/>
            <CreateModal show={isEditLevel} onHide={this.hidePopup} title="Edit Level Name" name="Level Name" dataFromChild={this.updateTagLevelName} label="editTagLevel" value={passValue}/>
                
            {/* Delete Modal */}
            <DeleteModal show={isDelete} onHide={this.hidePopup} level={level} value={value} handleDelete={this.handleDelete} label="add"/>

            <div className="top-section1">
                <div>
                    <span className="tag-ma title-mrgn"><Link className="a" to="/tagMaster">Tag Master</Link><span className="exam-ma">/{tagName}</span></span>
                    <div className="exam-master title-mrgn"><span>{tagName}</span>
                        <span onClick={() => this.setState({isEditable:true, passValue:tagName})}><img className="icn-edit show-cursor" src={Edit} alt=""></img></span>
                        <span className="edit">Edit</span>
                    </div>
                </div>
               <div className="add-tag-mrgns">
               <button className="canxel-buttons-label cancel-mask" onClick={() => this.goBack()}>
                    Cancel
                    </button>
                    <button className={!isDisabled?"add-buttons-label add-mask lft button-disable":"add-buttons-label add-mask lft"} disabled={!isDisabled} onClick={this.handleCreateTagSubmit}>
                        Submit
                    </button>
                </div>
            </div>
           
            <div>
               {levels.length > 0 && levels.map((level,i) =>{ 
               return (<div className="mrgn-tp" key={i}>
                        <span className="exam-ma">{level.name}</span><span><img className="icn-edit show-cursor" src={Edit} alt="" onClick={() => this.setState({isEditLevel:true, levelIndex:i,passValue:level.name
                            })}></img> </span>
                        <span className="edit">Edit</span>
                        <div className="dd-show">
                           {!showOptions[i] && <span className="custom-dd-base" onClick={() => this.handleShowOptions(i,true)}>
                               <span className={selectedValues[i] === undefined ?"custom-dd-label custom-dd-label-light":"custom-dd-label custom-dd-label-dark"}>
                                {selectedValues[i] === undefined ?"Select "+level.name :selectedValues[i]}
                               </span>
                                <img className="custom-dd-icon" src={down} alt=""></img> 
                            </span>}
                            {showOptions[i] && <span className="custom-dd-base" onClick={() => this.handleHideOptions(i,false)}>
                                <span className={selectedValues[i] === undefined ?"custom-dd-label custom-dd-label-light":"custom-dd-label custom-dd-label-dark"}>
                                    {selectedValues[i] === undefined ?"Select "+level.name :selectedValues[i]}
                                </span>
                                <img className="custom-dd-icon" src={down} alt=""></img> 
                            </span>}
                            {/* <span className=""><Dropdown list={this.state.list} headerTitle="Select Exam Catagory"/></span> */}
                            <button className={i!==0 && selectedValues[i-1] === undefined?"canxel-buttons-label cancel-mask add-btn-mrgn add-btn-wdt button-disable":"canxel-buttons-label cancel-mask add-btn-mrgn add-btn-wdt"} 
                            disabled={i!==0 && selectedValues[i-1] === undefined} onClick={() => this.setState({isAddLevelItem:true,levelIndex:i, level:level.name},() => this.hideOptions(i))}>Add {level.name}</button>
                            <span className="add-btn-mrgn side-buttons-label add-btn-wdt">Click this button to add "New {level.name}" to the list.</span>
                        </div>
                        {showOptions[i] && <div className="custom-dd-options">
                        {level.tagItemValues.length >0 && level.tagItemValues.map((item,j) => {
                            return(
                                <div className="custom-option-group" key={j}>
                                    <span className="custom-dd-option-label show-cursor" onClick={() => this.onSelect(i,j,item)}>{item.name}</span>
                                    <button className="custom-dd-edit-rectangle custon-dd-btn-text show-cursor" onClick={() => this.setState({isEditLevelValues:true,levelIndex:i,itemIndex:j,passValue:item.name,level:level.name})}>Edit</button>
                                    <button className="custom-dd-delete-rectangle custon-dd-btn-text show-cursor" onClick={() => this.handleDeleteItem(i,j)}>Delete</button>
                                </div>
                                )
                            })
                        }
                    </div>}
                   
                </div>)})}
               
                <div className="add-level-rectangle add-tag-mrgn-tp">
                    <span className="add-level-btn lft">
                        <button className="add-level-buttons-label add-level-mask" onClick={this.showPopup}>Add New Level</button>
                        <span className="side-buttons-label">Click this button to add "New Level" to this hierarchy.</span>
                    </span>
                    
                </div> 
            </div>
        </section>
    </div>
        )
    }
}