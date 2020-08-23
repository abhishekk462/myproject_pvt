import React, {Component} from 'react';
import {Modal} from "react-bootstrap";
// import {Link} from "react-router-dom";
// import ReactDOM from 'react-dom';
import "./deletePopup.css";
import axios from 'axios';
import {TAG_WS,DELETE_TAG_VALUE} from "../../services/endPoints";

export default class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    
  }
 
  hidePopup = () => {
    this.props.onHide();
  }

  handleDelete=() => {
    let requestBody = this.props.request;
    this.token = sessionStorage.getItem("Token");
    this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
    if(this.props.label === "add") {
      this.props.handleDelete("delete");
    } else {
      axios.post(`${process.env.REACT_APP_API_BASE_URL}${TAG_WS}${DELETE_TAG_VALUE}`,requestBody,{"headers":this.headers})
      .then(res => {
        console.log("DELETE:", res)
          this.props.handleDelete("delete");
          
      }).catch(() =>{
          this.props.handleDelete("cancel");
          
      })
    }
  }
 render () {
   const {level,value} = this.props;
   return <div className="">
    <Modal className="popup-mrgn" show={this.props.show} onHide={this.hidePopup}>
      {/* <Modal.Header > */}
        <span className="add-new-tag-master">Confirm Delete</span>
        <span className="line-19"></span>
      {/* </Modal.Header> */}
      <Modal.Body>
        <label className="">Are you sure want to delete "{value}" option from "{level}"</label>
        {/* <input className="forms-input-base input-label input-value" type="text" placeholder="Type here"></input> */}
      </Modal.Body>
      <Modal.Footer className="brdr">
        <button className="canxel-buttons-label cancel-mask" onClick={() => this.hidePopup()}>
          Cancel
        </button>
        <button className="add-buttons-label add-mask" onClick={() => this.handleDelete()}>
         {/* <Link className="linkt0" to="/tagMasterDetails">Add</Link> */}
         Delete
        </button>
      </Modal.Footer>
    </Modal>
  </div>
 }
}
