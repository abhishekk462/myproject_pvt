
import React, {Component} from 'react';
import {Modal} from "react-bootstrap";
import {QUESTION_WS, UPLOAD_QUESTIONS, UPLOAD_CONTENT,GET_EXPORTED_FILE} from "../../services/endPoints";
import "./upload.css";
import axios from 'axios';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

export default class UploadModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ischecked:false,
            file:[],
            blocking:false,
            isDisabled:true
        }
       
    }
    
    hidePopup = () => {
        this.props.onHide();
    }
    file = []
    handleChange = (files) => {
        console.log("files:", files)
        this.setState({file:files[0].name, isDisabled:false});
        this.file = files;
    }
    header;
    downloadErrorFile=(file) => {
       
        let url = `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_EXPORTED_FILE}?filename=${file}`;
        axios.get(url, {responseType: 'arraybuffer',headers: {'Authorization':"Bearer "+this.token}})
        .then(r => {
         
            var disposition = "attachment; filename=OtherContentTemplate.docx";
      
            var matches = /"([^"]*)"/.exec(disposition);
            var filename = (matches != null && matches[1] ? matches[1] : 'QuestionContent.docx');
        
            var blob = new Blob([r.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessing' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = file;
    
            document.body.appendChild(link);
    
            link.click();
    
            document.body.removeChild(link);
        });
    }
    handleUpload = () => {
        const body = new FormData(this.form);
        body.append("file", this.file[0]);
        this.token = sessionStorage.getItem("Token");
        this.headers = {"Authorization":"Bearer "+this.token, "content-type":"application/json"};
        let endpoint = this.props.parent === "content"? UPLOAD_CONTENT :UPLOAD_QUESTIONS;
        this.toggleBlocking();
        axios.post(`${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${endpoint}`,body,{"headers":this.headers})
        .then(res => {
            this.toggleBlocking();
            this.hidePopup();
            console.log(res)
            if(res.data.status === 1001)
            { 
                if(this.props.parent === "content") {
                   
                    this.downloadErrorFile(res.data.responseFileUrl)
                    alert(res.data.message);
                } else {
                    this.downloadErrorFile(res.data.data.response.httpUrl)
                    alert(res.data.message);
                }
            } else {
                alert("Contents Uploaded Successfully.")
            }
        }).catch(() => {
            // alert("Something went wrong, Please try again...")
        })
    }

    toggleBlocking() {
        this.setState({blocking: !this.state.blocking});
      }

    render () {
        const {show,title,label} = this.props;
        return <div className="">
            {/* <BlockUi tag="div" blocking={this.state.blocking}> */}
            <Modal className="popup-mrgn" show={show} onHide={this.hidePopup}>
            {/* <Modal.Header > */}
                <span className="add-new-tag-master">{title}</span>
                <span className="line-19"></span>
            {/* </Modal.Header> */}
            <Modal.Body>
                <span className="qt-modal-label1">{label}</span>
                <div className="custom-file upload-mgrn">
                    <input
                        type="file"
                        className="custom-file-input"
                        id="inputGroupFile01"
                        aria-describedby="inputGroupFileAddon01"
                        accept=".DOCX"
                        onChange={(e) => this.handleChange(e.target.files)}
                    />
                    <label className="custom-file-label" htmlFor="inputGroupFile01">
                       {this.state.file}
                    </label>
                </div>
                <div>
                    <span className="label-note">Supported file format: .DOCX</span>
                </div>
            </Modal.Body>
            <Modal.Footer className="brdr">
                <button className="canxel-buttons-label cancel-mask" onClick={this.hidePopup}>
                Cancel
                </button>
                <button className={this.state.isDisabled?"add-buttons-label add-mask disable-btn":"add-buttons-label add-mask"} disabled={this.state.isDisabled} onClick={this.handleUpload}>
                {/* <Link className="linkt0" to="/tagMasterDetails"></Link> */}
                Upload
                </button>
            </Modal.Footer>
            </Modal>
            {/* </BlockUi> */}
        </div>
    }
}

