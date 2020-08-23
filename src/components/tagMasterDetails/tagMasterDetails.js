import React,{Component} from "react";
import "./tagMasterDetails.css";
import CreateModal from "../../shared/modals/createModal/createTagMaster";
import Edit from "../../Assets/images/icn_edit.png";
import down from "../../Assets/images/Down.png";
import DeleteModal from "../../shared/modals/deleteModal/deletePopup";
import axios from 'axios';
import {TAG_WS, UPDATE_TAG_MASTER, GET_TAG_ITEMS} from "../../shared/services/endPoints";
import { Link } from "react-router-dom";

class TagMasterDetails extends Component {
    constructor(props) {
        super(props);
        this.state={
            isShowing:false,
            isEditable:false,
            showSubmit: false,
            // list: [{id:1,title:"SSC"}, {id:2,title:"SSC CGL"}, {id:2,title:"SSC CGL"}, {id:2,title:"SSC CGL"}, {id:2,title:"SSC CGL"}],
            showOptions:[],
            details: this.props.location.tagProps,
            isEditLevel:false,
            levelIndex:0,
            isAddLevelValues:false,
            levelValueIndex:0,
            selectedValues:[],
            isDelete:false,
            level: "",
            value:"",
            isEditLevelValues:false,
            parentLevel:1,
            tagItems:[],
            title:"",
            name:"",
            passValue:"",
            levelValue:"",
            valueSize:0,
            isSelected:false,
            initialValues:[],
            parentLevels:[],
            selectedParents:[],
            deleteRequest:{},
            deleteLevelIndex:0,
            deleteLevelValueIndex:0,
            selectedRequest:{}
        }

    }
    showPopup = () => {
        this.setState({ isShowing:true, levelIndex: this.state.tagItems.length })
    }
    hidePopup = () => {
        this.setState({ isShowing:false,isEditable:false, isEditLevel:false,isEditLevelValues:false,isAddLevelValues:false,isDelete:false })
    }

    handleDelete = (message) => {
        let details = this.state.tagItems,initialValues=this.state.initialValues,selectedValues=this.state.selectedValues;
        initialValues = [];
        selectedValues = [];
        // details[this.state.deleteLevelIndex].tagItemValues[this.state.deleteLevelValueIndex].name="";
        let input = Object.getOwnPropertyNames(this.state.selectedRequest).length === 0 || this.state.deleteLevelIndex === 0?  {
            "tagEntityId" : this.state.details.tagEntityId
        }:{
            "tagEntityId" : this.state.details.tagEntityId,
            "tagItemlevel":1,
            "tagItemValuelevel":  this.state.parentLevels[0]
        };
        
        if(message==="delete") {
            this.getTagItems(input,"onload");
        }
      
   
        // details[this.state.deleteLevelIndex].tagItemValues.splice(this.state.deleteLevelValueIndex,1);
       
    
        this.setState({isDelete:false,initialValues, selectedValues});
       
    }
    
    editTitle = () => {
        this.setState({ isEditable:true, passValue: this.state.details.name })
    }
    details = [];
    getTagItems = (input, label) => {
        let token = sessionStorage.getItem("Token");
        let headers = {"Authorization":"Bearer "+token, "content-type":"application/json"};
        let initialValues =this.state.initialValues,parentLevels=this.state.parentLevels;
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${TAG_WS}${GET_TAG_ITEMS}`,input,{"headers":headers})
        .then(res => {
            if(res.data.data.response.length>0) {
                
              
                for(let i=0;i<res.data.data.response.length;i++) {
                    if(this.details.length > 0 && this.details.some(item => res.data.data.response[i].name === item.name))
                    {
                        
                        this.details.forEach((item,k) =>{
                            // item.tagItemValues.sort((a, b) => {return a.level-b.level});
                            // initialValues[k] = item.tagItemValues.length>0?item.tagItemValues[0].name:"";
                            if( res.data.data.response[i].name === item.name)
                            {
                                this.details[k] = res.data.data.response[i];
                              
                            }
                        })
                      
                    } else {
                        this.details.push(res.data.data.response[i]);
                   
                       
                        // selectedValues[this.details.length+1] = this.details[this.details.length+1].tagItemValues?this.details[this.details.length+1].tagItemValues[0].name:undefined;
                    }
                }
              this.details.forEach((item,k) =>{
                    item.tagItemValues.sort((a, b) => {return a.level-b.level});
                    initialValues[k] = item.tagItemValues.length>0?item.tagItemValues[0].name:undefined;
                    if(label === "onload")
                    { 
                        parentLevels[k] = item.tagItemValues.length>0?item.tagItemValues[0].level:undefined;
                    } else {
                       
                        parentLevels[k] =  this.state.selectedParents[k]!==undefined?this.state.selectedParents[k]:item.tagItemValues.length>0?item.tagItemValues[0].level:undefined;
                    }
                    // this.showDefaultOption(item.tagItemValues);
                })
               
                this.setState({tagItems: this.details, initialValues,parentLevels});
            } else {
                // this.details.length = i+1;
                // this.setState({tagItems: this.details});
            }
        })
    }

    // selected Dropdown value refs to child component
    toggleSelected(id, val){
        let selectedValues = this.state.selectedValues,selectedParents=this.state.selectedParents;
        selectedValues[id] = val.name;
        // selectedValues.forEach((value,i) => id === i ?value = val.name:value=undefined);
        // selectedValues.forEach((value,i) => i!==0&&i===id? value=val.name:value=undefined)
        selectedValues.length = id+1;
      
        let showOptions = this.state.showOptions;
        showOptions[id] = false
        // selectedValues.length = id+1;
        this.parent = 0;
     
        selectedParents[id] = val.level;
       
        let input = {
            "tagEntityId" : this.state.details.tagEntityId,
            "tagItemlevel": this.state.tagItems[id].level,
            "tagItemValuelevel": val.level
        }
        this.setState({selectedValues,showOptions, parentLevel:val.level,selectedParents,selectedRequest:input});
        this.getTagItems(input,id);
    }

    handleSetParent(id, val){
      
        let parents;
        let showOptions = this.state.showOptions;
        showOptions[id] = false;
        parents.push(val.level);
        this.setState({showOptions, parentLevel:id===0?0:val.level});
       
    }

    componentDidMount() {
        if(this.state.details.tagEntityId) {
            let input = {
                "tagEntityId" : this.state.details.tagEntityId
            }
            this.getTagItems(input,"onload");
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.levelIndex !== prevState.levelIndex){
           
            //  this.setState({parentLevel:null})
        }
    }

    handleShowOptions = (i,val) => {
        let options = [];
        options[i] = val;
        this.setState({showOptions: options});
    }

    addNewLevel = (data) => {
       
        this.state.tagItems.push({"name":data.name,"level":this.state.tagItems.length+1,"tagItemValues":[]});
        
    }
    updateTagLevelName = (levelName) => {
        let details = this.state.tagItems;
        details[this.state.levelIndex].name =levelName;
        this.setState({tagItems:details});
    }
    updateTagName = (tagName) => {

        let details = this.state.details;
        details.name=tagName;
        this.setState({details});
    }

    addLevelValue = (levelData) => {
     
        let details = this.state.tagItems;
        let initialValues = this.state.initialValues;
        let value = {"name":levelData,"level":this.state.valueSize+1,}
        // this.toggleSelected(this.state.levelIndex,value);
       
        details[this.state.levelIndex].tagItemValues.push({"name":levelData,
            "level":this.state.valueSize ?this.state.valueSize+1:details[this.state.levelIndex].tagItemValues.length+1,
            "parentLevel":this.state.levelIndex === 0?0:this.state.parentLevels[this.state.levelIndex-1]
        });
    
        details[this.state.levelIndex].tagItemValueSize = this.state.valueSize+1;
        initialValues[this.state.levelIndex] = levelData;
        details[this.state.levelIndex].tagItemValues.sort((a, b) => {return a.level-b.level});
        this.setState({tagItems:details,});

    }

    showAddLevelValuePopup = (i,item,size) =>{
        let parentLevels = this.state.parentLevels;
      
        parentLevels[i] = item.tagItemValues.length>0? item.tagItemValues[0].level:size+1;
        this.setState({isAddLevelValues:true, levelIndex:i, title:item.name, name:item.name, valueSize:size,parentLevels})
    }

    handleSubmit = () => {
        const input = {
            "tagEntityId": this.state.details.tagEntityId,
            "name" : this.state.details.name,
            "tagItems": this.state.tagItems
        };
        console.log("submit:", input)
        let token = sessionStorage.getItem("Token")
        let headers = {"Authorization":"Bearer "+token, "content-type":"application/json"};
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${TAG_WS}${UPDATE_TAG_MASTER}`,input,{"headers":headers})
        .then(res => {console.log("Update Response;", res)
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
    handleDeleteItem = (i,j) => {
        let details = this.state.tagItems,showOptions=this.state.showOptions;
        showOptions[i] =false;
       
        let input = {
            "tagEntityId" : this.props.location.tagProps.tagEntityId,
            "tagItemlevel": details[i].level, 
            "tagItemValuelevel": details[i].tagItemValues[j].level
        }
     
        document.getElementById("Option"+j).style.display = "none";
        this.setState({ isDelete:true,level:details[i].name,value:details[i].tagItemValues[j].name,deleteRequest:input,deleteLevelIndex:i,deleteLevelValueIndex:j,showOptions});
      
    }
    editLevelValue = (value) => {
        const {levelIndex,levelValueIndex,tagItems} = this.state;
        let details1 = tagItems;
        details1[levelIndex].tagItemValues[levelValueIndex].name = value;       
        this.setState({tagItems: details1});
    }
   
    showDefaultOption = (values,val) => {
        let value = "";
      
        values.sort((a, b) => {return a.level-b.level});
        if(values.length>0) {
            for(let i=0; i< values.length; i++) {
            
             
                if(values[i].level === 1) {
                    value = values[i].name;
                  
                  
                } else {
                    value = values[0].name;
                    
                }                  
            }
        } else {
            value = "Select "+val;
        }
        return value;
    }

    goBack = () => {
        this.props.history.push('/tagMaster');
    }

    render() {
       
        const {details,tagItems,isShowing,isEditable,showOptions,isEditLevel,isAddLevelValues,selectedValues,isDelete,level,value,isEditLevelValues,title,name,passValue,initialValues,deleteRequest}  = this.state;
      
        return<div>
            <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pad0" style={{minHeight:"845px"}}>
                <CreateModal show={isShowing} onHide={this.hidePopup} title="Add New Level" name="Level Name" dataFromChild={this.addNewLevel} label="newLevel"/>
                <CreateModal show={isEditLevel} onHide={this.hidePopup} title="Edit Level Name" name="Level Name" dataFromChild={this.updateTagLevelName} label="editTagLevel" value={passValue}/>
                <CreateModal show={isEditable} onHide={this.hidePopup} title="Edit Tag Master Name" name="Master Name" dataFromChild={this.updateTagName} label="editTagName" value={passValue}/>
                <CreateModal show={isAddLevelValues} onHide={this.hidePopup} title={"Add "+ title} name={name} dataFromChild={this.addLevelValue} label="addLevelValues"/>
                <CreateModal show={isEditLevelValues} onHide={this.hidePopup} title={"Edit "+title} name={title} dataFromChild={this.editLevelValue} label="editLevelValue" value={passValue}/>
                
                 {/* Delete Modal */}
                <DeleteModal show={isDelete} onHide={this.hidePopup} level={level} value={value} request={deleteRequest} handleDelete={this.handleDelete} label="edit"/>

                <div className="top-section1">
                    <div>
                        <span className="tag-ma title-mrgn"><Link className="a" to="/tagMaster">Tag Master<span className="exam-ma">/{details.name}</span></Link></span>
                       <div className="exam-master title-mrgn"><span>{details.name}</span>
                            <span className="edit-icn-pos" onClick={this.editTitle}><img className="icn-edit show-cursor" src={Edit} alt="" ></img></span>
                            <span className="tag-details-title-edit">Edit</span>
                        </div>
                        
                    </div>
                    <div className="mrgns1">
                       <button className="canxel-buttons-label cancel-mask" onClick={() => this.goBack()}>
                            Cancel
                        </button>
                        <button className="add-buttons-label add-mask lft" onClick={this.handleSubmit}>
                            Submit
                        </button>
                    </div>
                </div>
                    
                <div>
                    {tagItems.length>0 && tagItems.map((item,i) =>{
                        
                        return (
                        <div className="mrgn-tp" key={i}>
                            <span className="exam-ma">{item.name}</span>
                            <span><img className="icn-edit show-cursor" src={Edit} alt="" onClick={() => this.setState({isEditLevel:true, levelIndex:i, passValue:item.name
                            })}></img></span>
                            <span className="edit">Edit</span>
                            <div className="dd-show">
                                {!showOptions[i] && <span className="custom-dd-base"  disabled={i!==0 && selectedValues[i-1] === undefined && initialValues[i-1] === undefined} 
                                    onClick={() => this.handleShowOptions(i, true)}>
                                    <span className={this.showDefaultOption(item.tagItemValues,item.name) ==="Select "+item.name?"custom-dd-label custom-dd-label-light":"custom-dd-label custom-dd-label-dark"}>
                                    {selectedValues[i] === undefined ? this.showDefaultOption(item.tagItemValues,item.name) :selectedValues[i]}
                                    </span>
                                    <img className="custom-dd-icon" src={down} alt=""></img> 
                                </span>}
                                {showOptions[i] && <span className="custom-dd-base"  disabled={i!==0 && selectedValues[i-1] === undefined && initialValues[i] === undefined} 
                                    onClick={() => this.handleShowOptions(i, false)}>
                                    <span className="custom-dd-label custom-dd-label-dark">
                                    {selectedValues[i] === undefined ? this.showDefaultOption(item.tagItemValues,item.name):selectedValues[i]}
                                    </span>
                                    <img className="custom-dd-icon" src={down} alt=""></img> 
                                </span>}
                                {/* <span className=""><Dropdown list={this.state.list} headerTitle="Select Exam Catagory"/></span> */}
                                <button className={i!==0 && selectedValues[i-1] === undefined  && initialValues[i-1] === undefined?"canxel-buttons-label cancel-mask add-btn-mrgn add-btn-wdt button-disable":"canxel-buttons-label cancel-mask add-btn-mrgn add-btn-wdt"} 
                                disabled={i!==0 && selectedValues[i-1] === undefined && initialValues[i-1] === undefined} onClick={() =>this.showAddLevelValuePopup(i,item,item.tagItemValueSize)}>Add {item.name}</button>
                                <span className="add-btn-mrgn side-buttons-label add-btn-wdt">Click this button to add "New {item.name}" to the list.</span>
                            </div>
                            {showOptions[i] && <div className="custom-dd-options">
                                {item.tagItemValues.length > 0 && item.tagItemValues.map((val,j) => {
                                    return(
                                        <div className="custom-option-group" id={"Option"+j} key={j}>
                                            <span className="custom-dd-option-label show-cursor" onClick={() => this.toggleSelected(i,val)}>{val.name}</span>
                                            <button className="custom-dd-edit-rectangle custon-dd-btn-text show-cursor" onClick={() => this.setState({isEditLevelValues: true, levelIndex:i,levelValueIndex:j,passValue:val.name,title:item.name})}>Edit</button>
                                            <button className="custom-dd-delete-rectangle custon-dd-btn-text show-cursor" onClick={() => this.handleDeleteItem(i,j) }>Delete</button>
                                        </div>
                                        )
                                    })
                                }
                            </div>}
                        </div>
                        )
                    })}
                        
                    <div className="add-level-rectangle edit-tag-mrgn-tp">
                        <span className="add-level-btn lft">
                            <button className="add-level-buttons-label add-level-mask" onClick={this.showPopup}>Add New Level</button>
                            <span className="side-buttons-label">Click this button to add "New Level" to this hierarchy.</span>
                        </span>
                        
                    </div> 
                </div>
            </section>
        </div>
    }
}
export default TagMasterDetails; 