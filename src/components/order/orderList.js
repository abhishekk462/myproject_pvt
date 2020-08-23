import React, { Component } from "react";
import axios from 'axios';
import "./order.css"
import { Link } from "react-router-dom";
//import '../orders/node_modules/suneditor/dist/css/suneditor.min.css'; 
import Search from "../../Assets/images/icn_search.png";
import Filter from "../../Assets/images/icn_fliter.png";
import Filter1 from "../../Assets/images/icn_filter_active.png";
import Action from "../../Assets/images/icn_actions.png";
import Checkbox from "../../shared/utils/checkbox/checkbox";
import { Tooltip } from 'reactstrap';
import FilterModal from "../../shared/modals/filter/filter.js";
import { Container, Row } from 'reactstrap';
import { ORDER_WS, PACKAGE_WS, ORDER_FILTER_DROPDOWNS, ORDER_LIST, ORDER_DETAILS, PACKAGE_PUBLISH, PACKAGE_UNPUBLISH, ORDER_SEARCH_FILTER, PACKAGE_SEARCH_FILTER, PACKAGE_FILTER_DROPDOWNS } from "../../shared/services/endPoints";
import Left from "../../Assets/images/arrow_left.png";
import Right from "../../Assets/images/arrow_right.png";
import Close from "../../Assets/images/Close.png";

export default class OrderList extends Component {
    token;
    headers;
    constructor(props) {
        super(props);
        this.state = {
            showFiletr: false,
            filterDropdownData: [],
            noOfFilters: 0,
            isChecked: false,
            showActions: [],
            orderList: [],
            pageList: [], currentPage: 0,
            showValidities: [],
            finalData: [],

            search: null
        }
    }

    getPackageList = () => {
        let pageList = [];

        axios.get(`${process.env.REACT_APP_API_BASE_URL}${ORDER_WS}${ORDER_LIST}?page=0&size=50`, { "headers": this.headers })
            .then(res => {

                console.log("resssss");
                console.log(res.data.response);
                res.data.response.response.map((user => user.isChecked = false));
                for (let i = 0; i < res.data.response.length; i++) {
                    pageList.push({ "pageNo": i + 1, isActive: i === 0 ? true : false });
                }

                this.setState({ orderList: res.data.response.response, pageList, showValidities: [] });

            })
    }
    addOrderHandler = () => {
        this.props.history.push('/addOrder');
    }
    getFilterDropdowns = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${PACKAGE_WS}${ORDER_FILTER_DROPDOWNS}`, { "headers": this.headers })
            .then(res => {
                console.log("Filter:", res)

                this.setState({ filterDropdownData: res.data.response.dropdownDataModel, showValidities: [] });

            })
    }

    getPaginationData = (pageNo, label) => {
        let pageList = this.state.pageList, currentPage = pageNo;
        console.log("11111==", pageList);

        if (label === "left" && currentPage > 0) {
            currentPage = pageNo - 1;
        }
        if (label === "right" && currentPage < pageList.length) {
            currentPage = pageNo + 1;
        }
        this.token = sessionStorage.getItem("Token");
        this.headers = { "Authorization": "Bearer " + this.token, "content-type": "application/json" };

        if (currentPage >= 0 && currentPage < pageList.length) {
            // if( !this.state.isSearch) {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}${ORDER_WS}${ORDER_LIST}?page=${currentPage}&size=50`, { "headers": this.headers })
                .then(res => {

                    // if(res.data.message === "Operation completed successfully." ) {
                    res.data.response.packageEntity.map((question => question.isChecked = false));

                    for (let i = 0; i < pageList.length; i++) {
                        if (i === currentPage) {
                            pageList[i].isActive = true;
                        } else {
                            pageList[i].isActive = false;
                        }
                    }

                    this.setState({ orderList: res.data.response.response, pageList, currentPage });
                    // }
                }).catch(() => {
                    alert("Something went wrong,Please try again...")
                })
        }


    }
    show = [];
    handleActionOverlay = (i, id, val) => {
        this.state.orderList.forEach((pack, i) => {
            if (pack.orderId === id) {

                this.show[i] = val;
            } else {
                this.show[i] = false;
            }
        })

        this.setState({ showActions: this.show });
    }

    handleRefundPackage = (id, status) => {

        let endpoint = status === "REFUNDED" ? ORDER_DETAILS : ORDER_LIST;
        axios.get(`${process.env.REACT_APP_API_BASE_URL}${ORDER_WS}${endpoint}?id=${id}`, { "headers": this.headers })
            .then(res => {

                this.getPackageList();
            })
    }

    handleChange = (e, label) => {
        let orderList = this.state.orderList, selectedUsers = [];
        if (label === "All") {
            orderList.forEach(pack => {
                pack.isChecked = e;
            })
            this.setState({ orderList, isChecked: e });
        } else {
            orderList[label].isChecked = e;
            if (orderList.length === selectedUsers.length) {
                this.setState({ isChecked: true });
            } else {
                this.setState({ isChecked: false });
            }
            this.setState({ orderList });
        }
    }
    request = {
        "status": [

        ],
        "subscriptionType": [

        ],
        "validity": [

        ],
        "validityType": [

        ],
        "searchText": ""
    }

    OnSearchHandler = (e) => {
        if (e.target.value.length > 0) {
            let request = this.request.searchText = e.target.value, pageList = [];

            axios.post(`${process.env.REACT_APP_API_BASE_URL}${ORDER_WS}${ORDER_SEARCH_FILTER}?page=0&size=50`, request, { "headers": this.headers })
                .then(res => {
                    console.log("userresp", res);
                    res.data.response.reponse.map((user => user.isChecked = false));
                    for (let i = 0; i < res.data.response.totalPages; i++) {
                        pageList.push({ "pageNo": i + 1, isActive: i === 0 ? true : false });
                    }

                    this.setState({ packageList: res.data.response.reponse, pageList, isSearch: true, searchInput: request });
                })
        } else {
            this.getPackageList();
        }
    }
    componentDidMount() {
        this.token = sessionStorage.getItem("Token");
        this.headers = { "Authorization": "Bearer " + this.token, "content-type": "application/json" };
        this.getPackageList();
        this.getFilterDropdowns();

    }



    render() {
        const { showFiletr, filterDropdownData, noOfFilters, isChecked, showActions, orderList, pageList, currentPage, showValidities } = this.state;
        return (
            <section className="">
                <div className="top-section">
                    <span className="qt-header">Orders</span>
                    <button className="buttons-label btn-mask" onClick={this.addOrderHandler}>Add New</button>
                </div>
                <div className="qt-search-bar qt-btn-section-mrgn">
                    <span className="qt-search-rectangle">
                        <img className="baseline-search-icn" src={Search} alt=""></img>
                        <input className="search-input"

                            placeholder="Search"
                            onChange={(e) => this.OnSearchHandler(e)}></input>
                    </span>
                    <span className="filter-mrgn" onClick={() => this.setState({ showFiletr: !showFiletr })}>
                        <button className={!showFiletr ? "qt-filter-group-5 filter-label filter-mask" : "qt-filter-group-5 fltr-btn-base-label fltr-label-mask"}>Filter
                            <span className="qt-filter-group-7">
                                <img className="filter-icon1" src={!showFiletr ? Filter : Filter1} alt=""></img>
                            </span>
                        </button>
                    </span>
                    {showFiletr && <div className="fltr-box-list overlay fltr-combined-shape-list">
                        <div className="fltr-mrgn-list">
                            <div className="">
                                <Container>
                                    <Row xs="6" sm="6" md="6" style={{ width: "auto" }}>
                                        {filterDropdownData.map((item, i) => {
                                            return (
                                                <FilterModal item={item} index={i} key={i} selectedData={this.selectedFilterData} />
                                            )
                                        })}
                                    </Row>
                                </Container>
                                <span className="fltr-count-list">{noOfFilters} Filters Applied</span>
                                <button className="canxel-buttons-label fltr-cancel-mask" onClick={this.hidePopup}>
                                    Clear
                                </button>
                                <button className={noOfFilters === 0 ? "add-buttons-label add-mask disable-btn" : "add-buttons-label add-mask"} disabled={noOfFilters === 0} onClick={this.handleApply}>
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>}
                </div>
                <div className="qt-mrgn-tp">
                    <table className="package-table">
                        <thead>
                            <tr className="table-header">
                                <th className="pack-checkbox-rectangle checkbox-mrgn bg"><Checkbox label="All" handleChange={this.handleChange} value="all" parent="list" checked={isChecked} /></th>
                                <th className="pack-status">ID</th>
                                <th className="pack-status">Name</th>
                                <th className="pack-status">Phone</th>
                                <th className="pack-status">Email</th>
                                <th className="pack-status">Package ID</th>
                                <th className="pack-status">Package Name</th>
                                <th className="pack-status">Exam Category</th>
                                <th className="pack-validity">Validity Type</th>
                                <th className="pack-validity">Validity</th>
                                <th className="pack-status">Coupon Used</th>
                                <th className="pack-status">Creation date</th>
                                <th className="pack-status">Updation date</th>
                                <th className="pack-status">Amount Paid</th>
                                <th className="pack-status">Status</th>
                                <th className="pack-actions-title qt-actions">
                                    <span className="last-col-title">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderList.map((item, i) => {
                                return <tr className={item.isChecked ? "qt-td-row qt-tr-rectangle row-bg" : "qt-td-row qt-tr-rectangle"} key={"master" + i}>
                                    <td className="checkbox-mrgn">
                                        <Checkbox label="PID" handleChange={this.handleChange} value={item.packageId} checked={item.isChecked} parent="list" index={i} />
                                    </td>

                                    <td className="td-qid">{item.orderId}</td>
                                    <td className="td-comp-id">{item.name}</td>
                                    <td className="td-comp-id">{item.phone}</td>
                                    <td className="td-comp-id">{item.email}</td>
                                    <td className="td-comp-id">{item.packageId}</td>
                                    <td className="td-comp-id">packgname</td>
                                    <td className="td-comp-id">excateg</td>
                                    <td className="td-comp-id">{item.validityType}</td>
                                    <td className="td-comp-id">{item.validityDays}</td>
                                    <td className="td-comp-id">{item.couponUsed}</td>
                                    <td className="td-comp-id">{item.createdDate}</td>
                                    <td className="td-comp-id">{item.updatedDate}</td>
                                    <td className="td-comp-id">{item.amountPaid}</td>
                                    <td className="td-comp-id">{item.status}</td>



                                    {/* {item.packageMetadataEntity.length === 0 &&<td className="td-created-by">-</td>} */}
                                    {!showActions[i] && <td className="rectangle-copy-8 pad10 show-cursor">
                                        <span className="td-actions qt-last-col" onClick={() => this.handleActionOverlay(i, item.orderId, true)}><img src={Action} alt=""></img></span>
                                    </td>
                                    }
                                    {showActions[i] && <td><div className="rectangle-copy-8 package-action-rectangle show-cursor">
                                        <div className="td-combined-shape" onClick={() => this.handleActionOverlay(i, item.orderId, false)}>...</div>
                                        <div className="td-edit"><Link className="a-link" to={{ pathname: "/addOrder", PackageProps: { "name": item.name, "phNum": item.phone, "email": item.email, "packageId": item.packageId, "amount": item.amountPaid, "transactionId": item.transactionId, "action": "edit" } }}>Edit</Link></div>
                                        {/* <div className="td-duplicate"><Link className="a-link" to={{pathname:"/addOrder", PackageProps:{"packageEntityId":item.packageEntityId,"action":"duplicate"}}}>Duplicate</Link></div>  */}
                                        <div className="td-publish" onClick={() => this.handleRefundPackage(item.orderId, item.status)}>{item.status === "REFUNDED" ? "Refunded" : "Abandoned"}</div>
                                    </div>
                                    </td>}
                                </tr>
                            })}
                        </tbody>
                    </table>

                    {/* <div className="qt-pagination">
                        <div className="qt-left-bounds" onClick={() =>
                            this.getPaginationData(currentPage, "left")}><img src={Left} alt=""></img></div>
                        <div className="user-pagination">
                           { console.log(pageList)}
                           { console.log("pageList")}
                           
                            {pageList.map((data, i) => {
                                return <span className={data.isActive ? "active-page mrg7" : "qt-page1 mrg7"}
                                    onClick={() => {
                                        this.getPaginationData(i);
                                    }} key={"Page" + i}></span>
                            })} </div>

                        <div className="user-right-bounds" onClick={() =>
                            this.getPaginationData(currentPage, "right")}><img src={Right} alt=""></img></div>
                    </div> */}
                </div>
            </section>
        )
    }

}