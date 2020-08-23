import React,{Component} from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import "./richTextEditor.css";

export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    config = [
        // Submenu
        ["bold","italic","underline","strike","subscript","superscript"],
           [ "align","textStyle", "removeFormat"],
        // "font",
        ["fontColor"],
        // "fontSize",
        // "formatBlock",
        ["blockquote"],
        ["hiliteColor",
      
       "lineHeight",
        "list",
        "paragraphStyle",
        "table",
       ],
       
        // Dialog
       [ "image",
        "link",],
        // audio,
        // ["math"] 
        // ['preview']
    ];

    handleChange = (data) => {
        console.log(data);
        this.props.onChange(data, this.props.label,this.props.innerIndex)
    }
    
    render() {
       
        return(
            <div className="rte-box">
                <SunEditor className="" name="my-editor"
                    setOptions={{
                 
                    buttonList:  this.config
                    
                    }} 
                    onChange={data => this.handleChange(data)}
                    // onImageUpload={img => this.handleImage(img)}
                    setContents={this.props.content}
                />
                    
            </div>
        )
    }
}