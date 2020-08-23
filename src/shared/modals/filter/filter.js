import React, {Component} from 'react';
// import {Modal, } from "react-bootstrap";

// import {Link} from "react-router-dom";
// import ReactDOM from 'react-dom';
import "./filter.css";
// import Filter from "../../../Assets/images/icn_filter_active.png";
import Down from "../../../Assets/images/Down.png";
import { Col } from 'reactstrap';
import Checkbox from "../../utils/checkbox/checkbox";

export default class FilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isShow: true,
        target:"",
        showFilterOtions:[],
        showLabel:false,
        details: this.props.item,
        optionIndex:0,
        selectedLabel:"",
        selectedData:[]
    }
    console.log("DATA:", this.state.details);
  }
 
  hidePopup = () => {
    this.props.onHide();
  }

  expanded = [];

  showCheckboxes = (val,i) => {
      console.log("i==",val, i)
      this.expanded = this.state.showFilterOtions;
      this.expanded[i] = val;
      this.expanded.forEach((values,j) => i===j?values=val:values=false);
      console.log("Expanded==",this.expanded,document.getElementById("List"+i-1))
      // if(val === true && i) {
      //   document.getElementById("List"+i).style.display = "block";
      // } else {
      //   document.getElementById("List"+i).style.display = "none";
      // }
      this.setState({showFilterOtions: this.expanded}, () => console.log("showFilterOtions==", this.state.showFilterOtions))
    
  }
  selectedValues=[];
  onSelect = (e,i,value) => {
      let showLabel = [],selectedValue="", selectedData=this.state.selectedData;
      const { details } = this.state;
      showLabel = e;
      console.log("ONSELECT:", e,i,details)
      this.selectedValues = details;
      this.selectedValues.dropdownMappingModels[i].isChecked = e;
      if(e) {
        selectedValue = this.selectedValues.dropdownMappingModels[i].valueName;

      }else {
        selectedValue= "";
      }
      this.props.selectedData(this.selectedValues);
      this.setState({details:this.selectedValues, showLabel,  selectedLabel:selectedValue});
  }
  componentDidMount() {
    this.state.details.dropdownMappingModels.forEach((element) => {
      element.isChecked=false;
    });
  }

  componentWillReceiveProps(props) {
  
    props.item.dropdownMappingModels.forEach((element) => {
      element.isChecked=false;
    });
   
    this.setState({ details: props.item,selectedLabel:"",showLabel:false })
  }

  render () {
    const { index, key} = this.props;
    const { showLabel, showFilterOtions, details, selectedLabel } = this.state;
  
    return <Col key={key}>
    
      {!showFilterOtions[index] &&<div className="fltr-dd-base" onClick={() => this.showCheckboxes(true,index)}>
          <span className="filter-dd-subject">{selectedLabel?selectedLabel:details.dropdownLabel}<img className="dd-icon" src={Down} alt=""></img>
              
          </span>
          
      </div>}
      { showFilterOtions[index] && <div className="fltr-dd-base" onClick={() => this.showCheckboxes(false,index)}>
          <span className="filter-dd-subject">{selectedLabel?selectedLabel:details.dropdownLabel}<img className="dd-icon" src={Down} alt=""></img>
              
          </span>                                               
      </div>}
      {showLabel && <div className="qt-select-label">{details.dropdownLabel}</div>}
    
          {showFilterOtions[index]  && <div className ="filter-options-base" id={"List"+index}><ul className ="fltr-dd-mrgn">
          {details.dropdownMappingModels.map((value, j) => {
              return (<li key={j}>
                     <Checkbox  handleChange={this.onSelect} label="Filter" parent="list" value={value.valueName} checked={value.isChecked} index={j}/>
                      {/* <input className="cb-rectangle" type="checkbox" value={value} onClick={(e) => this.onSelect(e,index,j)} /> */}
                     
                      <label htmlFor={j} className={!value.isChecked?"fltr-placeholder":"fltr-placeholder-active"}>{value.valueName}</label>
                  </li>
              )})}
          </ul>
      </div>}
      
    </Col>
  }
}
