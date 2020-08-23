import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './auto.css';
export default class Autocomplete extends Component {
  static propTypes = {
    options: PropTypes.instanceOf(Array).isRequired
  };
  state = {
    activeOption: 0,
    filteredOptions: [],
    showOptions: false,
    userInput: ''
  };
    onChange = (e) => {
        const { options } = this.props;
        const userInput = e.currentTarget.value;
        console.log("input and options", userInput,options)
        // if(userInput.length>0 && options!== undefined && options.length>0)
        // {
            const filteredOptions = options.filter(
        (option) => option.otherContentName.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );
        this.setState({
            activeOption: 0,
            filteredOptions,
            showOptions: true,
            userInput
            });
        // }
    
    this.props.onChange(userInput);
    };

  onClick = (e) => {
    this.setState({
      activeOption: 0,
      filteredOptions: [],
      showOptions: false,
      userInput: e.currentTarget.innerText
    },() => this.props.getIds(this.state.userInput));
  };

  onKeyDown = (e) => {
    const { activeOption, filteredOptions } = this.state;
    if (e.keyCode === 13) {
      this.setState({
        activeOption: 0,
        showSuggestions: false,
        userInput: filteredOptions[activeOption]
      },() => this.props.getIds(this.state.userInput));
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return;
      }
        this.setState({ activeOption: activeOption - 1 });
        } else if (e.keyCode === 40) {
            if (activeOption - 1 === filteredOptions.length) {
                return;
            }
        this.setState({ activeOption: activeOption + 1 });
        }
  };


   
  render() {
    const {
      onChange,
      onKeyDown,
      onClick,
      state: { activeOption, filteredOptions, showOptions,userInput }
    } = this;
    let optionList;
    if (showOptions && userInput) {
        if (filteredOptions.length) {
          optionList = (
            <ul className="custom-dd-options1">
              {filteredOptions.map((option, index) => {
                let className;
                if (index === activeOption) {
                  className = 'custom-dd-option-label1';
                }
                return (
                  <li className='custom-dd-option-label1 div-pos' key={option.otherContentName} onClick={onClick}>
                    {option.otherContentName}
                  </li>
                );
              })}
            </ul>
          );
        } else {
          optionList = (
            <div className="custom-dd-options1">
              <em  className="custom-dd-option-label1 div-pos">No Matches Found</em>
            </div>
          );
        }
      }
    return (
      <React.Fragment>
        <div className="div-pos">
          <input
            className="il-content-id-base1 il-content-type-id1"
            type="text"
            placeholder="Content Type ID"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />
          <input type="submit" value="" className="search-btn" />
          {optionList}
        </div>
      </React.Fragment>
    );
  }
}
