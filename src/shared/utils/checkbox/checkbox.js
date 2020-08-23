import React, { PureComponent } from 'react';
import "./checkbox.css";

export default class Checkbox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            checked: props.checked
        }
    }

    toggleCheckboxChange = (e) => {
        const { handleChange, label, index } = this.props;
        if(label === "All") {
           
            handleChange(e.target.checked, label);
        } else {
           
            handleChange(e.target.checked, index);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps.checked)
        this.setState({ checked: nextProps.checked })
    }

    // componentDidUpdate(prevProps) {
    //     if(prevProps.checked !== this.props.checked) {
    //       this.setState({checked: this.props.checked});
    //     }
    //   }

    render() {
        const { value,parent } = this.props;
        const{checked} = this.state;
       
        return (
       <label className="container1 checkbox-rectangle checkbox-mrgn">
            {parent === "list" &&<input
                className=""
                type="checkbox"
                value={value}
                defaultChecked={checked}
                checked={checked}
                onChange={this.toggleCheckboxChange}
            /> } 
            {parent !== "list" &&<input
                className=""
                type="checkbox"
                value={value}
                defaultChecked={checked}
                onChange={this.toggleCheckboxChange}
            /> } 
             <span className="checkmark"></span>      
        </label>
        );
    }
}
