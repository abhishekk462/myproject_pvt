import React, {Component} from 'react';
import {Modal} from "react-bootstrap";
import axios from 'axios';
import {QUESTION_WS, SEND_TO_TRANSLATOR, SEND_TO_VERIFIER,CONTENT_SEND_TO_VERIFIER,CONTENT_SEND_TO_TRANSLATOR} from "../../services/endPoints";
import "./sendModal.css";
import Down from "../../../Assets/images/Down.png";
import Checkbox from "../../utils/checkbox/checkbox";

export default class SendVerificationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ischecked:false,
            selectedValues:[],
            showOptions: false,
            options: this.options,
            selectedName:""
        }
       
    }
    // options = [{name:"English", id:1, isCheked:false},{name:"Hindi",id:2,isCheked:false},{name:"Kannada",id:3,isCheked:false},{name:"Telugu",id:4,isCheked:false},{name:"Tamil",id:5,isCheked:false}];
    options = [
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
    hidePopup = () => {
        this.props.onHide();
    }
    toggleCheckboxChange = () => {
        this.setState({ischecked:true});
    }

    handleChecked = (val, i) =>  {
        console.log("CB data", val,i)
        let options = this.state.options, selectedValues = [],selectedName="";
        if(i === 'All') {

        } else {
            options[i].isChecked = val;
            options.forEach((option,i) => {
                if(option.isChecked) {
                    selectedValues.push(option.valueCode);
                    selectedName = option.valueName;
                }
            })
            this.setState({options, selectedValues,selectedName});
        }
    }
    handleSendData = () => {
        const {data,title, parent} = this.props;
        let requestBody = data,input, endpoint,endpoint1,endpoint2;
        input = requestBody.map((data) => data.translationlanguages = this.state.selectedValues);
     
        endpoint1 = title === "Send to Verifier"?SEND_TO_VERIFIER:SEND_TO_TRANSLATOR;
        endpoint2 = title === "Send to Verifier"?CONTENT_SEND_TO_VERIFIER:CONTENT_SEND_TO_TRANSLATOR;
        endpoint = parent === "content"? endpoint2: endpoint1;
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${endpoint}`,requestBody,{"headers":this.headers})
        .then(res => {
         
            this.hidePopup();
            // window.location.reload();
        }).catch(() =>{
            this.hidePopup();
            // window.location.reload();
        })
    }
    render () {
        const {show,title,label1,label2} = this.props;
        const {showOptions,options,selectedValues,selectedName} = this.state;
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
          
                    <div className="dropdown">
                        <span className="qt-input-base" onClick={() => this.setState({showOptions: !showOptions})}> <span className="qt-select-placeholder">{selectedName!==""?selectedName:"Select Language"}  
                        <img className="send-down-img" src={Down} alt=""></img>  
                        </span> </span>   
                    
                        {showOptions &&  <ul className="send-option-base">
                            {options.map((option,i) =>{  return<li>
                                <Checkbox  handleChange={this.handleChecked} index={i}/>
                                    <span className="label-clr">{option.valueName}</span>
                                </li>})}
                            
                            </ul>
                        }
                    </div>           
           
                </Modal.Body>
            
                <span className="send-mrgns">
                    <button className="canxel-buttons-label send-cancel-mask" onClick={this.hidePopup}>
                        Cancel
                    </button>
                    <button className={selectedValues.length === 0?"add-buttons-label add-mask disable-btn":"add-buttons-label add-mask"} disabled={selectedValues.length === 0} onClick={() => this.handleSendData()}>
                        Send
                    </button>
                </span>
            
            </Modal>
        </div>
    }
}