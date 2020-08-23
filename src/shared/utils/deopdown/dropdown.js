import React,{Component} from "react";
import "./dropdown.css";

export default class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state={
            listOpen: false,
            value:"",
            control: (base, state) => ({
                ...base,
                border: '1px solid black',
                boxShadow: 'none',
                '&:hover': {
                    border: '1px solid black',
                }
            })
        }
    }

    handleClickOutside(){
        this.setState({
          listOpen: false
        })
      }
      toggleList(){
        this.setState(prevState => ({
          listOpen: !prevState.listOpen
        }))
      }

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }
    
    render() {
        const{list,headerTitle} = this.props
        const{listOpen, value} = this.state
        return (
            <div className="dropdown-base">
                <div className="dropdown-label">
                <select  className="dd-brdr" name={headerTitle} value={value} onChange={this.handleChange}>Select Catagory
                {list.map((item) => (
                    <option className="dd-list dd-list-item" value={item.title}>{item.title}</option>
                    // <option value="B">Banana</option>
                    // <option value="C">Cranberry</option>
                ))}
                </select>
                </div>
               
            </div>
          )
    }
}