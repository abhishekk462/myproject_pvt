import React,{Component} from 'react';
// import { MultiSelectComponent, CheckBoxSelection, Inject } from '@syncfusion/ej2-react-dropdowns';
// import { SampleBase } from '../common/sample-base';
// import { PropertyPane } from '../common/property-pane';
// import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
// import './checkbox.css';
// import Select from "react-select";
export default class MultiSelect extends Component {
    constructor() {
        super(...arguments);
        //define the data with category
        this.state = {
          optionsdata : [
             {key:'101',value:'Lion'},
             {key:'102',value:'Giraffe'},
             {key:'103',value:'Zebra'},
             {key:'104',value:'Hippo'},
             {key:'105',value:'Penguin'}
           ],
          selectedValue: null // store selected value
        }
        this.countries = [
            { Name: 'Australia', Code: 'AU' },
            { Name: 'Bermuda', Code: 'BM' },
            { Name: 'Canada', Code: 'CA' },
            { Name: 'Cameroon', Code: 'CM' },
            { Name: 'Denmark', Code: 'DK' },
            { Name: 'France', Code: 'FR' },
            { Name: 'Finland', Code: 'FI' },
            { Name: 'Germany', Code: 'DE' },
            { Name: 'Greenland', Code: 'GL' },
            { Name: 'Hong Kong', Code: 'HK' },
            { Name: 'India', Code: 'IN' },
            { Name: 'Italy', Code: 'IT' },
            { Name: 'Japan', Code: 'JP' },
            { Name: 'Mexico', Code: 'MX' },
            { Name: 'Norway', Code: 'NO' },
            { Name: 'Poland', Code: 'PL' },
            { Name: 'Switzerland', Code: 'CH' },
            { Name: 'United Kingdom', Code: 'GB' },
            { Name: 'United States', Code: 'US' }
        ];
        // maps the appropriate column to fields property
        this.checkFields = { text: 'Name', value: 'Code' };
    }
    handleChange = (e) => {
     
      var value = this.state.optionsdata.filter(function(item) {
        return item.key === e.target.value
      })
      this.setState({ selectedValue: value[0].value }); // set state
     
    }
    render() {
        return (
          <select onChange={this.handleChange}>
            <oprion>Select Catagory</oprion>
          {this.state.optionsdata.map(function(data, key) {  return (
            <option key={key} value={data.key}>{data.value} <span>Edit</span></option> )
          })}
        </select>
        );
    }
}