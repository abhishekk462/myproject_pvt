import React, { Component,PureComponent } from 'react';
import "./radio.css";

export default class RadioButton extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
        }
        this.selectedCheckboxes = [];
    }

    toggleCheckboxChange = (e) => {
        this.setState(({ isChecked }) => (
        {
            isChecked: !isChecked,
        }
        ));
        this.props.handleChange(e.target.checked, this.props.index); 
    }

    toggleCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
          this.selectedCheckboxes.delete(label);
        } else {
          this.selectedCheckboxes.add(label);
        }
        this.props.handleChange(this.selectedCheckboxes);
    }

    render() {
        const { label,checked } = this.props;

        return (
        <label className="container2 radio-mrgn">
            <input
                className=""
                type="radio"
                value={label}
                defaultChecked={checked}
                onChange={this.toggleCheckboxChange}
                name="options" 
            />  
             <span className="checkmark1"></span>      
        </label>
        );
    }
}
