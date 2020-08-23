import React, {Component} from 'react';
import {Modal} from "react-bootstrap";
import {Link} from "react-router-dom";
// import ReactDOM from 'react-dom';
import "./modal.css";

export default class CreateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        tagName:"",
        // levels:[],
        levelItems:[],
        name:"",
        levelCount: 0,
        levelItemCount: 0,
        levelName:"",
        levelValue:"",
        isEnable:false
    }
  }
  level ={};

  hidePopup = () => {
    const {label,index,dataFromChild,value,parentLevel} = this.props;

    const {levelItems,name,levelItemCount,tagName,levelName,levelValue} = this.state;
    if((label === "level" || label === "newLevel") && name) {
      this.levels = {"name":name,"level":index};
      this.setState({name:""})
      this.props.dataFromChild(this.levels);
      // sessionStorage.setItem("levels", levels)
    } 
    if(label === "levelItems" && name)
    {
      let uniqueData = [];
     
        levelItems.push({"name":name,"level":levelItemCount,levelId:index,"parentLevel":parentLevel});
     
      for(let i=0;i<levelItems.length;i++) {
        if(levelItems.indexOf(levelItems[i].name) === -1) {
          uniqueData.push(levelItems[i]);
        }
      }
      this.setState({name:""})
      dataFromChild(levelItems);
    }
    if(label === "editTagName" && (tagName || value)) {
      dataFromChild(tagName?tagName:value);
    }
    if(label === "editTagLevel" && (levelName || value)) {
      dataFromChild(levelName?levelName:value);
    }
    if((label === "addLevelValues" || label === "editLevelValue") && (levelValue || value)) {
      dataFromChild(levelValue?levelValue:value);
    }
    
    this.props.onHide();
  }

  handleChange = (e) => {
    const {label} = this.props;
    // const {name,levels,levelItems} = this.state;
    this.setState({isEnable:true})
    if(label === "tag") {
      this.setState({tagName:e.target.value},()=>{sessionStorage.setItem("tagName",this.state.tagName)});
    } else if(label === "level" || label === "levelItems" || label === "newLevel") {
      this.setState({name:e.target.value});
    } else {
      
    } 
    if(label === "editTagName") {
      this.setState({tagName:e.target.value},()=>{sessionStorage.setItem("tagName",this.state.tagName)});
    }
    if(label === "editTagLevel") {
      this.setState({levelName:e.target.value})
    }
    if(label === "addLevelValues" || label === "editLevelValue") {
      this.setState({levelValue: e.target.value})
    }
  }

  handleCancel = () => {
    this.props.onHide();
  }

  render () {
    const {label, value} = this.props;
    return <div className="">
      <Modal className="popup-mrgn" show={this.props.show} onHide={this.hidePopup}>
        {/* <Modal.Header > */}
          <span className="add-new-tag-master">{this.props.title}</span>
          <span className="line-19"></span>
        {/* </Modal.Header> */}
        <Modal.Body>
          <label className="">{this.props.name}<span className="label">*</span></label>
          <input className="forms-input-base input-label input-value" type="text" placeholder="Type here" onChange={(e)=> this.handleChange(e)} defaultValue={value}></input>
        </Modal.Body>
        <Modal.Footer className="brdr">
          <button className="canxel-buttons-label cancel-mask" onClick={this.handleCancel}>
            Cancel
          </button>
          {/* {label !== "editTagLevel"  && label !== "editTagName"  &&  */}
          {label === "tag" &&  <Link className="linkt0 al" to="/addTagMaster"><button className="add-buttons-label add-mask" disabled={!this.state.isEnable} onClick={this.hidePopup}>
         
            Add
          </button> </Link>}
          {/* } */}
          {/* {label === "newLevel" && <button className="add-buttons-label add-mask" onClick={this.hidePopup}>
            Add
          </button>} */}
          {label !== "tag" && <button className="add-buttons-label add-mask" onClick={this.hidePopup}>
            {label === "editTagLevel" || label === "editTagName" || label === "editLevelVlues" || label === "editLevelValue" ?"Update":"Add"}
          </button>}
        </Modal.Footer>
      </Modal>
    </div>
  }
}
