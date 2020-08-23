import React, {Component} from 'react';
import {Modal} from "react-bootstrap";
import {Link} from "react-router-dom";
// import ReactDOM from 'react-dom';
import "./stage.css";
import Down from "../../../Assets/images/Down.png";
import Checkbox from "../../utils/checkbox/checkbox";

export default class CreateStage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValues:[],
            selectedName:"",
            options1:[{"valueName": "Priliminary"},{"valueName": "Mains"},{"valueName": "Descriptive Paper"},{"valueName": "Computer Proficiency Paper"}],
            options2:[{"valueName": "Priliminary"},{"valueName": "Mains"},{"valueName": "Descriptive Paper"},{"valueName": "Computer Proficiency Paper"}],
            showOptions:false,
            showOptions1:false,
        }
    }
    hidePopup = () => {
        this.props.onHide();
    }
    handleChecked= () =>{

    }
    render () {
        const {show,title,label1,label2} = this.props;
        const {showOptions,options1,selectedValues,selectedName,showOptions1,options2} = this.state;
        return <div className="">
            <Modal className="popup-mrgn" show={show} onHide={this.hidePopup}>
                <span className="send-title">{title}</span>
                <span className="line-title"></span>
        
                <Modal.Body>
                    <span className="qt-modal-label1">{label1}</span>
            
                    {label2 && <div className="modal-mrgn-tp">
                       
                        <Checkbox  handleChange={this.handleChecked} label="All"/>
                        <label className="cc-label" htmlFor="defaultChecked2">{label2}</label>
                    </div>}
            <div style={{"display":"flex"}}>
                    <div className="dropdown">
                        <span className="qt-input-base" onClick={() => this.setState({showOptions: !showOptions,showOptions1:false})}> <span className="qt-select-placeholder">{selectedName!==""?selectedName:"Select Stage"}  
                        <img className="send-down-img" src={Down} alt=""></img>  
                        </span> </span>   
                    
                        {showOptions &&  <ul className="send-option-base">
                            {options1.map((option,i) =>{  return<li>
                                <Checkbox  handleChange={this.handleChecked} index={i}/>
                                    <span className="label-clr">{option.valueName}</span>
                                </li>})}
                            
                            </ul>
                        }
                    </div>        
                    {/* <div className="dropdown1">
                        <span className="qt-input-base1" onClick={() => this.setState({showOptions1: !showOptions1,showOptions:false})}> <span className="qt-select-placeholder">{selectedName!==""?selectedName:"Copy Structure from"}  
                        <img className="send-down-img" src={Down} alt=""></img>  
                        </span> </span>   
                    
                        {showOptions1 &&  <ul className="stage-option-base">
                            {options2.map((option,i) =>{  return<li>
                                <Checkbox  handleChange={this.handleChecked} index={i}/>
                                    <span className="label-clr">{option.valueName}</span>
                                </li>})}
                            
                            </ul>
                        }
                    </div>    */}
                    </div>
                </Modal.Body>
            
                <span className="send-mrgns">
                    <button className="canxel-buttons-label send-cancel-mask" onClick={this.hidePopup}>
                        Cancel
                    </button>
                    <button className={selectedValues.length === 0?"add-buttons-label add-mask disable-btn":"add-buttons-label add-mask"} disabled={selectedValues.length === 0} onClick={() => this.handleSendData()}>
                        Add
                    </button>
                </span>
            
            </Modal>
        </div>
    }
}