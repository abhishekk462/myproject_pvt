import React, { Component } from "react";
import "./addOrder.css";
import { Link } from "react-router-dom";
import BrowseImage from "../../../Assets/images/icn_userimage.png";
import BrowseVideo from "../../../Assets/images/icn_uservideo.png";
import { QUESTION_WS, ORDER_WS, CREATE_ORDER, PACKAGE_WS, ORDER_DETAILS, ORDER_UPDATE, GET_DYNAMIC_DROPDOWNS, STATIC_DROPDOWNS } from "../../../shared/services/endPoints";
import axios from 'axios';
import BlockUi from 'react-block-ui';
import Down from "../../../Assets/images/Down.png";
import Checkbox from "../../../shared/utils/checkbox/checkbox";
import { Container, Row, Col, Input } from 'reactstrap';
import Editor from "../../../shared/utils/rte/richTextEditor";

import Delete from "../../../Assets/images/icn_delete.png";
import Edit from "../../../Assets/images/icn_edit.png";
import Show from "../../../Assets/images/icn_show.png";
import Hide from "../../../Assets/images/icn_hide.png";
import Table from 'react-bootstrap/Table';
import CreateModal from "../../../shared/modals/createModal/createTagMaster";


export default class AddOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taggingData: [],
            show: true,
            rowPackage: {},
            rowPackageId: '',
            tempArray: [],
            // examTaggingData:[],
            // highlight:"",
            createnewArray: [],

            createOrder:
            {
                name: "",
                phNum: "",
                email: "",
                paymentGateway: "payu",
                transactionId: "",
                status: "REFUNDED",
                packages:
                {
                    packageId: "",
                    validityType: "PAID",
                    amount: "",
                    discountAmount: "",
                    validiDays: ""

                }
            },
            disableValidity: false,
            createRow: [],
            transDisableStatus: true

        }
    }

    getStaticDropdowns = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${STATIC_DROPDOWNS}`, { "headers": this.headers })
            .then(res => {

                this.setState({ taggingData: res.data.response.dropdownDataModel })

            })
    }

    getPropsValue = () => {

        this.setState(prevState => ({
            createOrder: {                   // object that we want to update
                ...prevState.createOrder,    // keep all other key-value pairs
                name: this.props.location.PackageProps.name,
                email: this.props.location.PackageProps.email,  // update the value of specific key   
                phNum: this.props.location.PackageProps.phNum,
                packageId: this.props.location.PackageProps.packageId,
                amount: this.props.location.PackageProps.amount



            }
        }))
        if (this.props.location.PackageProps.action == 'Edit') {
            this.setState({
                transDisableStatus: false
            })
        }


    }

    addPackageHandler = (e) => {
        e.preventDefault();
        let obj = {
            "packageID": this.state.rowPackageId,
            "Amount": this.state.rowPackageAmount,
            "DiscountAmount": this.state.rowPackageDiscountAmount,
            "Days": this.state.rowPackageDays

        }
        this.state.tempArray.push(obj);

        console.log(this.state.tempArray);

        this.setState({
            createnewArray: this.state.tempArray
        })


        //let newArray= this.state.createnewArray.push(obj);
        //this.setState({createnewArray:newArray})
        //let createRow = this.state.createRow;
        // createOrder = this.state.createOrder.packages;

        //// createRow.push(createRow.length); // data.length is one more than actual length since array starts from 0.
        // Every time you call append row it adds new element to this array. 
        // You can also add objects here and use that to create row if you want.
        // this.setState({ createRow: createRow });
        // this.state.rowPackageId=createOrder.packageId;

    }

    componentDidMount() {
        this.token = sessionStorage.getItem("Token");
        this.headers = { "Authorization": "Bearer " + this.token, "content-type": "application/json" };
        if (this.props.location.PackageProps != undefined) {
            this.getPropsValue();
        }
        this.getStaticDropdowns();
    }

    goBack = () => {
        this.props.history.push("/orders")
    }
    validateRequest = (request) => {
        let invalidFieds = [];
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (request.name === "") {
            invalidFieds.push("Name")
        }
        if (request.phNum === "") {
            invalidFieds.push("please enter phone number")
        }
        if (request.email === "" || reg.test(request.email) == false) {
            invalidFieds.push("Please enter valid email")
        }
        return invalidFieds;
    }

    addUserHandler = (e) => {
        e.preventDefault();
        let endpoint = this.props.location.PackageProps === undefined ? CREATE_ORDER : ORDER_UPDATE;
        let url = `${process.env.REACT_APP_API_BASE_URL}${ORDER_WS}${endpoint}`;
        // let validate = this.validateRequest(this.state.createOrder);
        // console.log("validate1111", validate);
        // if (validate.length === 0) {
        axios.post(url, this.state.createOrder, { "headers": this.headers })
            .then(res => {
                if (res.data.status === 1001) {
                    alert(res.data.message);
                } else {

                    this.goBack();
                }

            }).catch((error) => {
                if (error.response.status === 403) {
                    alert("Access Denied.");
                    this.goBack();
                } else {
                    alert("Something went wrong,Please try again...");
                }
            })
        // } else {
        //     alert("Please fill required fields\n" + validate.toString());
        // }
    }
    handleChangeText = (e) => {
        console.log(e.target.name);
        this.setState({ name: e.target.name });
    }
    handleChangeTextName = (txt) => {
        console.log(txt.target.value);
        let nametext = txt.target.value;
        // console.log(this.state.createOrder.name);
        this.setState(prevState => ({
            createOrder: {                   // object that we want to update
                ...prevState.createOrder,    // keep all other key-value pairs
                name: nametext     // update the value of specific key
            }
        }))

    }
    handleChangeTextPhone = (txt) => {
        console.log(txt.target.value);
        let phonetext = txt.target.value;
        // console.log(this.state.createOrder.name);
        this.setState(prevState => ({
            createOrder: {                   // object that we want to update
                ...prevState.createOrder,    // keep all other key-value pairs
                phNum: phonetext     // update the value of specific key
            }
        }))

    }
    handleChangeTextEmail = (txt) => {
        console.log(txt.target.value);
        let emailtext = txt.target.value;
        // console.log(this.state.createOrder.name);
        this.setState(prevState => ({
            createOrder: {                   // object that we want to update
                ...prevState.createOrder,    // keep all other key-value pairs
                email: emailtext     // update the value of specific key
            }
        }))

    }
    handleChangeTransactionID = (txt) => {
        let TransactionIdtext = txt.target.value;
        // console.log(this.state.createOrder.name);
        this.setState(prevState => ({
            createOrder: {                   // object that we want to update
                ...prevState.createOrder,    // keep all other key-value pairs
                transactionId: TransactionIdtext     // update the value of specific key
            }
        }))

    }

    handleChangePackageID = (txt) => {

        let packageidtext = txt.target.value;
        this.state.rowPackageId = txt.target.value;
        console.log(this.state.rowPackageId);
        this.setState(prevState => ({
            createOrder: {
                ...prevState.createOrder,
                packages: {
                    ...prevState.createOrder.packages,
                    packageId: packageidtext
                },
                disableValidity: true

            }
        }))

    }


    handleChangePackageDays = (txt) => {

        let validiDaystext = txt.target.value;
        this.state.rowPackageDays = txt.target.value;
        // console.log(this.state.createOrder.name);
        this.setState(prevState => ({
            createOrder: {
                ...prevState.createOrder,
                packages: {
                    ...prevState.createOrder.packages,
                    validiDays: validiDaystext
                }
            }
        }))

    }

    handleChangePackageAmount = (txt) => {

        let amounttext = txt.target.value;
        this.state.rowPackageAmount = txt.target.value;
        // console.log(this.state.createOrder.name);
        this.setState(prevState => ({
            createOrder: {
                ...prevState.createOrder,
                packages: {
                    ...prevState.createOrder.packages,
                    amount: amounttext
                }
            }
        }))

    }

    handleChangePackageDiscount = (txt) => {

        let discountamounttext = txt.target.value;
        this.state.rowPackageDiscountAmount = txt.target.value;
        // console.log(this.state.createOrder.name);
        this.setState(prevState => ({
            createOrder: {
                ...prevState.createOrder,
                packages: {
                    ...prevState.createOrder.packages,
                    discountAmount: discountamounttext
                }

            }
        }))

    }
    selectTaggingOptions = (e, label, i) => {
        let data = this.state.createOrder;

        if (label === "Days") {


            data.validityUnit = e.target.value;
        }

        if (label === "Validity Type") {
            data.validityType = e.target.value;
        }
        // if(label ==="packageId"){
        //     data.packageId = e.target.value; 
        // }
        this.setState({ orderData: data, disableValidity: true });
    }

    validity = {};
    editValidityHandler = (i) => {
    }


    handleHideShow = (flag, i) => {
        // let packageMetadatas = this.state.createRow,
        // packageData=this.state.createOrder;
        // packageData.createRow[i].isHidden = !flag;
        // this.setState({packageMetadatas,packageData})
    }
    //delete the row of package table

    deletePackagesRow = (i) => {

        let rows = [...this.state.createnewArray]
        rows.splice(i, 1)
        this.setState({
            createnewArray: rows
        })
        let deleteRow = [...this.state.tempArray]
        deleteRow.splice(i, 1)
        this.setState({
            tempArray: deleteRow
        })

    }

    render() {
        const { createOrder, createRow, taggingData, showTopics, showlabel1, packageData, examTaggingData, packageMetadatas, isChecked, grace, days, mrp, sp, rp, highlight, isEditHighlight, passValue, isEditValidity, disableHighLight, disableValidity } = this.state;

        return (
            <section className="col-lg-12 col-md-12 col-sm-12 col-xs-12 main-section pad0">
                <CreateModal show={isEditHighlight} onHide={this.hidePopup} title="Edit Highlight" name="Highlight Text" dataFromChild={this.updateHighlight} label="editTagLevel" value={passValue} />
                <BlockUi tag="div" blocking={this.state.blocking}>
                    <form>
                        <div className="user-add-top-section">
                            <div className="user-top-bar title-mrgn">
                                <span className="add-user-title">
                                    <Link className="a" to="/orders">Orders</Link></span>
                                <span className="exam-ma">{this.props.location.PackageProps !== undefined ? this.props.location.PackageProps.action === "edit" ? "/Update Order" : "/Duplicate Order" : "/Add New Order"}</span>
                                <div className="user-top">
                                    <span className="add-new-user">{this.props.location.PackageProps !== undefined ? this.props.location.PackageProps.action === "edit" ? "Update Order" : "Duplicate Order" : "Add New Order"}</span>
                                    <button className="user-cancel-label user-cancel-mask" onClick={() => this.goBack()}>Cancel</button>
                                    <button className={this.props.location.PackageProps !== undefined && this.props.location.PackageProps.action === "duplicate" ? "user-save-label create-package-mask duplicate-right" : "user-save-label create-package-mask create-right"}
                                        onClick={(e) => this.addUserHandler(e)}>{this.props.location.PackageProps !== undefined ? this.props.location.PackageProps.action === "edit" ? "Update Order" : "Duplicate Order" : "Create Order"}</button>
                                </div>
                            </div>
                        </div>

                        <div className="user-rectangle2">
                            <div className="user-rectangle3">
                                <span className="user-rectangle-text title-mrgn">Order Details</span>
                                <div className="sample-user right"></div>
                            </div>
                        </div>

                        <div className="user-details-section">

                            {/* start input box for name,phone number,transacion id */}
                            <div className="inner-section inner-mrgn inner-mrgn-tp">
                                <span className="first-name-box">
                                    <input
                                        className="fname-input-base user-forms-placeholder inner-mrgn-rt"
                                        type="text"
                                        name="Name"
                                        value={createOrder.name}
                                        placeholder="Name"
                                        required
                                        onChange={(value) => this.handleChangeTextName(value)}
                                    // onChange={this.handleChangeText}


                                    />

                                </span>
                                <span className="first-name-box">
                                    <input
                                        className="fname-input-base user-forms-placeholder inner-mrgn-rt"
                                        type="text"
                                        placeholder="Phone Number"
                                        minlength="10"
                                        required
                                        name="phNum"
                                        value={createOrder.phNum}
                                        onChange={(value) => this.handleChangeTextPhone(value)}

                                    />
                                </span>
                                <span className="first-name-box">
                                    <input
                                        className="fname-input-base user-forms-placeholder"
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        name="email"
                                        value={createOrder.email}
                                        // onChange={(e) => this.handleChangeText(e, "email")}
                                        onChange={(value) => this.handleChangeTextEmail(value)}

                                    // disabled = {this.props.location.UserProps !== undefined}
                                    />
                                </span>
                            </div>
                            <div className="inner-section inner-mrgn inner-mrgn-tp1">

                                <span className="first-name-box">
                                    <select className="fname-input-base user-forms-placeholder inner-mrgn-rt" id="Role">
                                        <option value="Payment">Select Payment Gateway</option>
                                        <option value="payu"> payu</option>
                                        <option value="razorpay"> razorpay</option>
                                        <option value="mobikwik"> mobikwik</option>
                                        <option value="paytm"> paytm</option>
                                    </select>

                                </span>
                                <span className="first-name-box">
                                    <input
                                        className="fname-input-base user-forms-placeholder inner-mrgn-rt"
                                        type="text"
                                        name="Transactionid"
                                        placeholder="Transaction ID"
                                        // onChange={(e) => this.handleChangeText(e, "transactionId")}
                                        onChange={(value) => this.handleChangeTransactionID(value)}
                                        minlength="10"
                                        required
                                        disabled={this.state.transDisableStatus}


                                    />
                                </span>
                            </div>
                        </div> {/* end input box for name,phone number,transacion id */}

                        <div className="pack-syb-box-mrgn">
                            <div className="highlights-base">
                                <div className="ul-package-pad0">
                                    <Table size="sm" className="pack-table">

                                        <tbody>
                                            {this.state.createnewArray.map((val, j) => {

                                                return (


                                                    <tr className="add-pack-row" id={"packageId" + j}>
                                                        <td className="paid-forms-placeholder" style={{ "padding": "10px" }}>{val.packageID}</td>
                                                        <td className="paid-forms-placeholder" style={{ "padding": "10px" }}>{val.validityType === 1 ? "Paid" : "Trail"}</td>
                                                        <td className="paid-forms-placeholder" style={{ "padding": "10px" }}>Days:{val.Days}</td>
                                                        <td className="paid-forms-placeholder" style={{ "padding": "10px" }}>Amount:{val.Amount} </td>
                                                        <td className="paid-forms-placeholder" style={{ "padding": "10px" }}>Discount Amount:{val.DiscountAmount}</td>



                                                        <td className="addpack-check add-pack-brdr">
                                                            <span style={{ display: "flex" }}>
                                                                <Checkbox label="Single" handleChange={this.handleChange} parent="list" checked={val.isRecommended} index={j}></Checkbox>
                                                                <label htmlFor={j} className={!val.isRecommended ? "fltr-placeholder" : "fltr-placeholder-active"}>Recommended</label>
                                                            </span>
                                                        </td>
                                                        <td className="pack-icns-width add-pack-brdr add-pack-icn-padd" onClick={() => this.handleHideShow(val.isHidden, j)}>
                                                            <img className="add-pack-icn-padd show-cursor" src={val.isHidden ? Hide : Show} alt="" />
                                                        </td>

                                                        <td className="pack-icns-width add-pack-brdr add-pack-icn-padd show-cursor" onClick={() => this.deletePackagesRow(j)}><img className="add-pack-icn-padd" src={Delete} alt="" /></td>
                                                        <td className="pack-icns-width add-pack-brdr add-pack-icn-padd show-cursor" onClick={() => this.editValidityHandler(j)}><img className="add-pack-icn-padd" src={Edit} alt="" /></td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </Table>
                                </div>


                                {/* start down row table created {validity type,package ID,DAYS,AMOUNT} */}
                                <span className="pack-rectangle-line"></span>
                                <div style={{ display: "flex" }} >
                                    <span className="pack-table-size">

                                        <input type="text"
                                            className="add-pack-bottom-field1 add-pack-bottom-placeholder1"
                                            value={createOrder.packageId}
                                            placeholder="Package ID"
                                            name="packageId"
                                            id="packageId"
                                            onChange={(value) => this.handleChangePackageID(value, "package")}

                                        />

                                    </span>
                                    <span className="pack-table-size">
                                        {taggingData.length > 0 && <select className="add-pack-bottom-field1 add-pack-bottom-placeholder1" id="Validity"
                                            onChange={(e) => this.selectTaggingOptions(e, "Validity Type", 2)}>
                                            <option value="validity">Validity Type</option>
                                            {taggingData[1].dropdownMappingModels.map((option, k) => { return <option value={option.valueCode} key={k}>{option.valueName}</option> })}
                                        </select>}
                                    </span>
                                    <span className="pack-table-size">
                                        {taggingData.length > 0 && <select className="add-pack-bottom-field4 add-pack-bottom-placeholder1" id="Days"
                                            onChange={(e) => this.selectTaggingOptions(e, "Days", 2)}>

                                            {taggingData[2].dropdownMappingModels.map((option, k) => { return <option value={option.valueCode} key={k}>{option.valueName}</option> })}
                                        </select>}
                                    </span>
                                    <span className="pack-table-size">
                                        <input type="number"
                                            className="add-pack-bottom-field4 add-pack-bottom-placeholder1"
                                            placeholder="00"
                                            onChange={(value) => this.handleChangePackageDays(value)}
                                            name="days"
                                        />

                                    </span>
                                    <span className="pack-table-size">
                                        <input className="add-pack-bottom-field4 add-pack-bottom-placeholder1" placeholder="Amount" disabled />
                                    </span>
                                    <span className="pack-table-size">
                                        <input type="text" className="add-pack-bottom-field4 add-pack-bottom-placeholder1"
                                            value={createOrder.amount}
                                            placeholder="INR 00.000"
                                            onChange={(value) => this.handleChangePackageAmount(value)}
                                            name="amount"
                                        >
                                        </input>
                                    </span>
                                    <span className="pack-table-size">
                                        <input className="add-pack-bottom-field4 add-pack-bottom-placeholder1" placeholder="Discount Price" disabled></input>
                                    </span>
                                    <span className="pack-table-size">
                                        <input className="add-pack-bottom-field4 add-pack-bottom-placeholder1"
                                            onChange={(value) => this.handleChangePackageDiscount(value)}
                                            name="discountamount"
                                            placeholder="INR 00.000">
                                        </input>
                                    </span>

                                    <div>
                                        <button className={disableValidity ? "add-validity-label add-validity-mask add-pack-check-mrgn" : "add-validity-label add-validity-mask add-pack-check-mrgn disable-btn"} disabled={!disableValidity}
                                            onClick={(e) => this.addPackageHandler(e)}>{!isEditValidity ? "Add Package" : "Update"}</button>
                                    </div>

                                </div> {/* end down row table created {validity type,package ID,DAYS,AMOUNT} */}

                            </div>

                        </div>
                    </form>
                </BlockUi>

            </section>
        )
    }
}