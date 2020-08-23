import React, { Component } from "react";
import Left from "../../Assets/images/arrow_left.png";
import Right from "../../Assets/images/arrow_right.png";
import Checkbox from "../../shared/utils/checkbox/checkbox";
import Editor from "../../shared/utils/rte/richTextEditor";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "suneditor/dist/css/suneditor.min.css";
import Search from "../../Assets/images/icn_search.png";
import Filter from "../../Assets/images/icn_fliter.png";
import Filter1 from "../../Assets/images/icn_filter_active.png";
import Action from "../../Assets/images/icn_actions.png";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { Tooltip } from "reactstrap";
import FilterModal from "../../shared/modals/filter/filter.js";
import {
  QUESTIONS_LIST,
  QUESTION_WS,
  EXPORT_TO_WORD,
  GET_EXPORTED_FILE,
  DOWNLOAD_SAMPLE_TEMPLATE,
  SEARCH_AND_FILTER,
  GET_FILTER_DROPDOWNS,
} from "../../shared/services/endPoints";
import axios from "axios";
import "./testsList.css";
import { Link } from "react-router-dom";
import AddTest from "./addTest/AddTest";

export class TestsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFilter: false,
      testsList: [],
      selectedAll: false,
      showVerification: false,
      showTranslation: false,
      showUpload: false,
      editor: "",
      content: "",
      showEdit: false,
      showActions: [],
      showFiletr: false,
      filterDropdownData: [],
      taggingDropdowns1: this.dropdowns1,
      showFilterOtions: [],
      showOption: false,
      showLabel: [],
      tooltipOpen: false,
      isChecked: false,

      pageList: [],
      currentPage: 0,
      isSearch: false,
      searchInput: {},
      noOfFilters: 0,

      showModal: false,
    };
  }
  getTestsList = () => {
    const data = [
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
      {
        id: "TID21982",
        subId: "STID1231",
        title: "SBP Exam Test Year 2018 Pre,",
        language: "Tamil",
        created: "12 Dec 2011",
        lastUpdated: "13 April 2019",
        published: "29 Aug 2020",
        status: "Published",
        occurances: 20,
      },
    ];
    this.setState({ ...this.state, testsList: data });
  };
  getFiletrData = () => {
    this.token = sessionStorage.getItem("Token");
    this.headers = {
      Authorization: "Bearer " + this.token,
      "content-type": "application/json",
    };
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_FILTER_DROPDOWNS}`,
        { headers: this.headers }
      )
      .then((res) => {
        let data = [];
        res.data.data.response.dropdownDataModel.forEach((item) => {
          if (
            item.dropdownLabel !== "Content Type" &&
            item.dropdownLabel !== "Used In" &&
            item.dropdownLabel !== "Difficulty" &&
            item.dropdownLabel !== "Conceptual" &&
            item.dropdownLabel !== "Question Type" &&
            item.dropdownLabel !== "Created By" &&
            item.dropdownLabel !== "Used In"
          ) {
            data.push(item);
          }
        });
        this.setState({ filterDropdownData: data });
      });
  };
  //  Add test Button Click
  addTestHandler = () => {
    this.setState({ ...this.state, showModal: !this.state.showModal });
  };

  // handle editor data
  handleEditorData = (data, label, index) => {
    console.log(data);
    console.log(label);
    console.log(index);
  };
  hidePopup = () => {
    this.setState({
      showVerification: false,
      showTranslation: false,
      showUpload: false,
      showFilter: false,
    });
  };
  componentDidMount() {
    this.getFiletrData();
    this.getTestsList();
  }
  render() {
    const {
      showFilter,
      isChecked,
      showActions,
      currentPage,
      pageList,
      testsList,
      filterDropdownData,
      noOfFilters,
      showModal,
    } = this.state;

    return (
      <div>
        <div className="top-section">
          <span className="qt-header">Tests</span>
          <div className="group-5">
            <button
              className="buttons-label btn-mask"
              onClick={this.addTestHandler}
            >
              Add New
            </button>
          </div>
        </div>

        {/* Add Test Modal  */}

        <div className="modalRectangle">
          <AddTest showModal={showModal} addTestHandler={this.addTestHandler} />
        </div>

        {/* Search bar */}

        <div className="qt-search-bar qt-btn-section-mrgn">
          <span className="qt-search-rectangle">
            <img className="baseline-search-icn" src={Search} alt=""></img>
            <input
              className="search-input"
              placeholder="Search"
              // onChange={(e) => this.handleSearch(e)}
            ></input>
          </span>
          <span
            className="filter-mrgn"
            onClick={() => this.setState({ showFilter: !showFilter })}
          >
            <button
              className={
                !showFilter
                  ? "qt-filter-group-5 filter-label filter-mask"
                  : "qt-filter-group-5 fltr-btn-base-label fltr-label-mask"
              }
            >
              Filter
              <span className="qt-filter-group-7">
                <img
                  className="filter-icon1"
                  src={!showFilter ? Filter : Filter1}
                  alt=""
                ></img>
              </span>
            </button>
          </span>
        </div>

        {/* Show Filter  */}
        {showFilter && (
          <div className="fltr-box-list overlay ml20 fltr-combined-shape-list">
            <div className="fltr-mrgn-list">
              <div className="">
                <Container>
                  <Row xs="6" sm="6" md="6" style={{ width: "auto" }}>
                    {filterDropdownData.map((item, i) => {
                      return (
                        <FilterModal
                          item={item}
                          index={i}
                          key={i}
                          selectedData={this.selectedFilterData}
                        />
                      );
                    })}
                  </Row>
                </Container>
                <span className="fltr-count-list mb20">
                  {noOfFilters} Filters Applied
                </span>
                <button
                  className="canxel-buttons-label fltr-cancel-mask mb20 "
                  onClick={this.hidePopup}
                >
                  Clear
                </button>
                <button
                  className={
                    noOfFilters === 0
                      ? "add-buttons-label add-mask disable-btn"
                      : "add-buttons-label add-mask"
                  }
                  disabled={noOfFilters === 0}
                  onClick={this.handleApply}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table  */}

        <div className="qt-mrgn-tp">
          <table className="qt-table-1">
            <thead>
              <tr className="table-header">
                <th className="checkbox-rectangle checkbox-mrgn bg">
                  <Checkbox
                    label="All"
                    handleChange={this.handleChange}
                    value="all"
                    parent="list"
                    checked={isChecked}
                  />
                </th>
                <th className="comp-id">ID</th>
                <th className="qid">SubID</th>
                <th className="child-id">Title</th>

                <th className="language">Language</th>
                <th className="to-translate">Created</th>
                <th className="to-translate">Last Updated</th>
                <th className="to-translate">Published</th>
                <th className="to-translate">Status</th>

                <th className="to-translate">Occurances/uses</th>

                <th className="actions-title qt-actions">
                  <span className="last-col-title">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.testsList.length > 0 &&
                this.state.testsList.map((item, i) => {
                  return (
                    <tr
                      className={
                        item.isChecked && !item.isInvalid
                          ? "qt-td-row qt-tr-rectangle row-bg"
                          : item.isInvalid
                          ? "qt-td-row qt-tr-rectangle row-bg1"
                          : "qt-td-row qt-tr-rectangle"
                      }
                      key={"master" + i}
                    >
                      <td className="checkbox-mrgn">
                        <Checkbox
                          label="QID"
                          handleChange={this.handleChange}
                          value={item.id}
                          checked={item.isChecked}
                          parent="list"
                          index={i}
                        />
                      </td>
                      <td className="tid">{item.id}</td>
                      <td className="stid">{item.subId}</td>

                      <td className="td-title" id={"Tooltip-" + i}>
                        {item.title.substring(0, 29)}...
                      </td>
                      {/* <Tooltip
                        className="inner"
                        placement="right"
                        isOpen={this.isToolTipOpen(`Tooltip-${i}`)}
                        target={"Tooltip-" + i}
                        toggle={() => this.toggle(`Tooltip-${i}`)}
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      > */}
                      {/* {item.description} */}
                      {/* </Tooltip> */}
                      <td className="td-language">{item.language}</td>
                      <td className="td-created-by">
                        {item.created ? item.created : "-"}
                      </td>

                      <td className="td-status">{item.lastUpdated}</td>
                      {/* <td className="td-to-translate">
                        {item.translationLanguages
                          ? item.translationLanguages.map((lang, i) => {
                              return <span>{lang},</span>;
                            })
                          : "-"}
                      </td> */}
                      <td className="td-published-date">
                        {item.published ? item.published : "-"}
                      </td>
                      <td className="td-created-date">{item.status}</td>
                      <td className="td-status">{item.occurances}</td>
                      {/* <td className="td-to-translate">
                        {item.linkedContents
                          ? item.linkedContents.map((lang, i) => {
                              return <span>{lang},</span>;
                            })
                          : "-"}
                      </td> */}
                      {!showActions[i] && (
                        <td className="rectangle-copy-8 pad10 show-cursor">
                          <span
                            className="td-actions qt-last-col"
                            onClick={() =>
                              this.handleActionOverlay(i, item.questionId, true)
                            }
                          >
                            <img src={Action} alt=""></img>
                          </span>
                        </td>
                      )}
                      {showActions[i] && (
                        <td>
                          <div className="rectangle-copy-8 td-action-rectangle show-cursor">
                            <div
                              className="td-combined-shape"
                              onClick={() =>
                                this.handleActionOverlay(
                                  i,
                                  item.questionId,
                                  false
                                )
                              }
                            >
                              ...
                            </div>
                            <div className="td-edit">
                              <Link
                                className="a-link"
                                to={{
                                  pathname: "/updateQuestion",
                                  questionProps: {
                                    questionEntityId: item.questionEntityId,
                                    action: "edit",
                                  },
                                }}
                              >
                                Edit
                              </Link>
                            </div>
                            <div className="td-duplicate">
                              <Link
                                className="a-link"
                                to={{
                                  pathname: "/updateQuestion",
                                  questionProps: {
                                    questionEntityId: item.questionEntityId,
                                    action: "duplicate",
                                  },
                                }}
                              >
                                Duplicate
                              </Link>
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {/* Pagination  */}

          {pageList.length > 0 && (
            <div className="qt-pagination">
              <div
                className="qt-left-bounds"
                onClick={() => this.getPaginationData(currentPage, "left")}
              >
                <img src={Left} alt=""></img>
              </div>
              <div className="pages-align">
                {pageList.map((data, i) => {
                  return (
                    i < 33 && (
                      <span
                        className={
                          data.isActive ? "active-page mrg7" : "qt-page1 mrg7"
                        }
                        onClick={() => {
                          this.getPaginationData(i);
                        }}
                        key={"Page" + i}
                      >
                        {data.pageNo}
                      </span>
                    )
                  );
                })}{" "}
              </div>
              {pageList.length > 33 && (
                <span className="qt-page1 mrg7">...</span>
              )}
              <div
                className="qt-right-bounds"
                onClick={() => this.getPaginationData(currentPage, "right")}
              >
                <img src={Right} alt=""></img>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default TestsList;
