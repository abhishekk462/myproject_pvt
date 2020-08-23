import React, { Component } from "react";
import "./questionsList.css";
import Left from "../../Assets/images/arrow_left.png";
import Right from "../../Assets/images/arrow_right.png";
import Checkbox from "../../shared/utils/checkbox/checkbox";
import SendVerificationModal from "../../shared/modals/sendModal/sendModal";
import UploadModal from "../../shared/modals/uploadModal/uploadModal";
import "suneditor/dist/css/suneditor.min.css";
import Search from "../../Assets/images/icn_search.png";
import Filter from "../../Assets/images/icn_fliter.png";
import Filter1 from "../../Assets/images/icn_filter_active.png";
import Action from "../../Assets/images/icn_actions.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row } from "reactstrap";
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
import { Link } from "react-router-dom";

export default class QuestionsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
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
      selectedQuestionToSend: [],
      buttonDisabled: false,
      totalNoOfPages: 0,
      pageList: [],
      currentPage: 0,
      isSearch: false,
      searchInput: {},
      noOfFilters: 0,
    };
    this.wrapperRef = React.createRef();
    // this.setWrapperRef = this.setWrapperRef.bind(this);
    //    this.handleClickOutside(this);
  }

  show = [];

  // filterDropdownData = [
  //     {id:1,label:"Subject",options:[{name:"Subject", isChecked:false}]},
  //     {id:11,label:"Exam Name",options:[{name:"Exam Name", isChecked:false}]},
  //     {id:2,label:"Question Type",options:[{name:"Question Type", isChecked:false},{name:"SCMC", isChecked:false},{name:"MCMC", isChecked:false}, {name:"Comprehension", isChecked:false}]},
  //     {id:3,label:"Topic/Sub Topic",options:[{name:"Topic", isChecked:false}]},
  //     {id:4,label:"Difficulty",options:[{name:"Difficulty", isChecked:false}]},
  //     {id:5,label:"Used In",options:[{name:"Used In", isChecked:false},{name:"Free", isChecked:false},{name:"Paid", isChecked:false}]},
  //     {id:6,label:"Conceptual",options:[{name:"Conceptual", isChecked:false},{name:"Y", isChecked:false},{name:"N", isChecked:false}]},
  //     {id:7,label:"Language",options:[{name:"Language", isChecked:false}]},
  //     {id:8,label:"Status",options:[{name:"Status", isChecked:false},{name:"Pending", isChecked:false},{name: "Aprroved", isChecked:false},{name: "Rejected", isChecked:false}]},
  //     {id:9,label:"Created By",options:[{name:"Created By", isChecked:false}]},
  //     {id:10,label:"Exam Catagory",options:[{name:"Exam Catagory", isChecked:false}]},
  //     {id:11,label:"Exam Name",options:[{name:"Exam Name", isChecked:false}]},
  // ];

  getQuestionsList = () => {
    let pageList = [];
    this.token = sessionStorage.getItem("Token");
    this.headers = {
      Authorization: "Bearer " + this.token,
      "content-type": "application/json",
    };
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${QUESTIONS_LIST}?page=0&size=50`,
        { headers: this.headers }
      )
      .then((res) => {
        if (res.data.message === "Operation completed successfully.") {
          res.data.data.response.contentViewModels.map(
            (question) => (question.isChecked = false)
          );
          for (let i = 0; i < res.data.data.response.totalPages; i++) {
            pageList.push({ pageNo: i + 1, isActive: i === 0 ? true : false });
          }

          this.setState({
            questions: res.data.data.response.contentViewModels,
            totalNoOfPages: res.data.data.response.totalPages,
            pageList,
            totalQuestions: res.data.data.response.totalElements,
            isSearch: false,
            noOfFilters: 0,
            buttonDisabled: false,
          });
        }
      });
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
        console.log("Filter data:", res);
        let data = [];
        res.data.data.response.dropdownDataModel.forEach((item) => {
          if (item.dropdownLabel !== "Content Type") {
            data.push(item);
          }
        });
        this.setState({ filterDropdownData: data });
      });
  };

  getPaginationData = (pageNo, label) => {
    let pageList = this.state.pageList,
      currentPage = pageNo;

    if (label === "left" && currentPage > 0) {
      currentPage = pageNo - 1;
    }
    if (label === "right" && currentPage < pageList.length) {
      currentPage = pageNo + 1;
    }
    this.token = sessionStorage.getItem("Token");
    this.headers = {
      Authorization: "Bearer " + this.token,
      "content-type": "application/json",
    };

    if (currentPage >= 0 && currentPage < pageList.length) {
      if (!this.state.isSearch) {
        axios
          .get(
            `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${QUESTIONS_LIST}?page=${currentPage}&size=50`,
            { headers: this.headers }
          )
          .then((res) => {
            if (res.data.message === "Operation completed successfully.") {
              res.data.data.response.contentViewModels.map(
                (question) => (question.isChecked = false)
              );

              for (let i = 0; i < pageList.length; i++) {
                if (i === currentPage) {
                  pageList[i].isActive = true;
                } else {
                  pageList[i].isActive = false;
                }
              }

              this.setState({
                questions: res.data.data.response.contentViewModels,
                pageList,
                currentPage,
              });
            }
          });
      }
      if (this.state.isSearch) {
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${SEARCH_AND_FILTER}?page=${currentPage}&size=50`,
            this.state.searchInput,
            { headers: this.headers }
          )
          .then((res) => {
            if (res.data.message === "Operation completed successfully.") {
              res.data.data.response.contentViewModels.map(
                (question) => (question.isChecked = false)
              );

              for (let i = 0; i < pageList.length; i++) {
                if (i === currentPage) {
                  pageList[i].isActive = true;
                } else {
                  pageList[i].isActive = false;
                }
              }

              this.setState({
                questions: res.data.data.response.contentViewModels,
                pageList,
                currentPage,
              });
            }
          });
      }
    }
  };

  handleChange = (e, label) => {
    let questions = this.state.questions,
      selectedQuestions = [],
      selectedQuestionToSend = [];
    if (label === "All") {
      questions.forEach((question) => {
        question.isChecked = e;
        if (e === true) {
          selectedQuestionToSend.push({
            compId: question.comprehensionId ? question.comprehensionId : null,
            questionId: question.questionId,
            childId: question.childId,
            translationlanguages: [],
          });
        } else {
          question.isInvalid = false;
        }
      });
      this.setState({
        questions,
        isChecked: e,
        buttonDisabled: e,
        selectedQuestionToSend,
      });
    } else {
      if (!questions[label].comprehensionId) {
        questions[label].isChecked = e;
        questions[label].isInvalid = false;
      }
      if (questions[label].comprehensionId) {
        questions.forEach((question, i) => {
          if (questions[label].comprehensionId === question.comprehensionId) {
            question.isChecked = e;
          } else {
            question.isChecked = question.isChecked;
            question.isInvalid = false;
          }
        });
      }
      questions.forEach((question) =>
        question.isChecked
          ? selectedQuestions.push({
              compId: question.comprehensionId
                ? question.comprehensionId
                : null,
              questionId: question.questionId,
              childId: question.childId,
              translationlanguages: [],
            })
          : selectedQuestions
      );

      if (selectedQuestions.length === 0) {
        this.setState({ buttonDisabled: false });
      } else {
        this.setState({ buttonDisabled: true });
      }
      if (questions.length === selectedQuestions.length) {
        this.setState({ isChecked: true });
      } else {
        this.setState({ isChecked: false });
      }
      this.setState({ questions, selectedQuestionToSend: selectedQuestions });
    }
  };

  hidePopup = () => {
    this.setState({
      showVerification: false,
      showTranslation: false,
      showUpload: false,
      showFiletr: false,
    });
    this.getQuestionsList();
    // window.location.reload();
  };

  addQuestionHandler = () => {
    this.props.history.push("/addQuestion");
  };

  handleActionOverlay = (i, id, val) => {
    this.state.questions.forEach((question, i) => {
      if (question.questionId === id) {
        this.show[i] = val;
      } else {
        this.show[i] = false;
      }
    });

    this.setState({ showActions: this.show, actionIndex: i });
  };

  expanded = [];
  showCheckboxes = (val, i) => {
    this.expanded[i] = val;
    this.setState({ showFilterOtions: this.expanded });
  };

  selectedValues = [];
  onSelect = (e, i, j) => {
    let showLabel = [];
    showLabel[i] = true;

    this.selectedValues.push(e.target.value);
    this.setState({ showLabel });
  };

  toggle = (targetName) => {
    if (!this.state[targetName]) {
      this.setState({
        ...this.state,
        [targetName]: {
          tooltipOpen: true,
        },
      });
    } else {
      this.setState({
        ...this.state,
        [targetName]: {
          tooltipOpen: !this.state[targetName].tooltipOpen,
        },
      });
    }
  };

  isToolTipOpen = (targetName) => {
    return this.state[targetName] ? this.state[targetName].tooltipOpen : false;
  };

  componentDidMount() {
    this.getQuestionsList();
    this.getFiletrData();
    // document.addEventListener('mousedown', this.handleClickOutside);
  }

  // componentWillUnmount() {
  //     document.removeEventListener('mousedown', this.handleClickOutside);
  // }

  exportToWord = () => {
    this.token = sessionStorage.getItem("Token");
    this.headers = {
      Authorization: "Bearer " + this.token,
      "content-type": "application/json",
    };
    let requestBody = this.state.selectedQuestionToSend;
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${EXPORT_TO_WORD}`,
        requestBody,
        { headers: this.headers }
      )
      .then((res) => {
        let file = res.data.data.response.downloadContentFileName;
        let url = `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${GET_EXPORTED_FILE}?filename=${file}`;
        axios
          .get(url, {
            responseType: "arraybuffer",
            headers: { Authorization: "Bearer " + this.token },
          })
          .then((r) => {
            var disposition = "attachment; filename=OtherContentTemplate.docx";

            var matches = /"([^"]*)"/.exec(disposition);
            var filename =
              matches != null && matches[1]
                ? matches[1]
                : "QuestionContent.docx";

            var blob = new Blob([r.data], {
              type:
                "application/vnd.openxmlformats-officedocument.wordprocessing",
            });
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
          });
      })
      .catch(() => {
        this.ServiceErrorAlert();
      });
  };
  ServiceErrorAlert() {
    return alert("Something went wrong, Please try again...");
  }

  downloadSampleTemplate = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${DOWNLOAD_SAMPLE_TEMPLATE}`,
        {
          responseType: "arraybuffer",
          headers: { Authorization: "Bearer " + this.token },
        }
      )
      .then((r) => {
        var disposition = "attachment; filename=OtherContentTemplate.docx";

        var matches = /"([^"]*)"/.exec(disposition);
        var filename =
          matches != null && matches[1] ? matches[1] : "sampleTemplate.docx";

        var blob = new Blob([r.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessing",
        });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      })
      .catch(() => {
        this.ServiceErrorAlert();
      });
  };

  handleSendToVerifier = () => {
    let inValidData = [],
      questions = this.state.questions;
    questions.forEach((question, i) => {
      if (
        question.isChecked &&
        (question.status === "Pending Creation" ||
          question.status === "Pending Rejected Creation")
      ) {
        inValidData.splice(i, 1);
        question.isInvalid = false;
      }
      if (
        question.isChecked &&
        (question.status === "Pending Verification" ||
          question.status === "Rejected Creation" ||
          question.status === "Approved" ||
          question.status === "Published" ||
          question.status === "unpublished")
      ) {
        question.isInvalid = true;
        inValidData.push(question);
      }
    });

    if (inValidData.length === 0) {
      this.setState({ showVerification: true });
    } else {
      alert(
        "Selected Questions are under verification,Please Select the Valid Questions."
      );
    }
    this.setState({ questions });
  };

  handleSendToTranslator = () => {
    let inValidData = [],
      questions = this.state.questions;
    questions.forEach((question, i) => {
      if (question.isChecked && question.status === "Approved") {
        inValidData.splice(i, 1);
        question.isInvalid = false;
      }
      if (
        question.isChecked &&
        (question.status === "Pending Verification" ||
          question.status === "Pending Rejected Creation" ||
          question.status === "Pending Creation" ||
          question.status === "Approved" ||
          question.status === "Published" ||
          question.status === "unpublished")
      ) {
        question.isInvalid = true;
        inValidData.push(question);
      }
    });

    if (inValidData.length === 0) {
      this.setState({ showVerification: false, showTranslation: true });
    } else {
      alert(
        "Selected Questions are under verification,Please Select the Valid Questions."
      );
    }
    this.setState({ questions });
  };

  handleSearch = (e) => {
    console.log("e.target.value.length:", e.target.value.length);
    if (e.target.value.length > 0) {
      let requestBody = {
          examCategory: [],
          examName: [],
          languageId: [],
          topicId: [],
          subTopicId: [],
          difficultyId: [],
          usedIn: [],
          isConceptual: [],
          createdBy: [],
          quesTypeId: [],
          status: [],
          searchText: e.target.value,
        },
        pageList = [];
      this.token = sessionStorage.getItem("Token");
      this.headers = {
        Authorization: "Bearer " + this.token,
        "content-type": "application/json",
      };
      let url = `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${SEARCH_AND_FILTER}?page=0&size=50`;
      axios
        .post(url, requestBody, { headers: this.headers })
        .then((res) => {
          res.data.data.response.contentViewModels.map(
            (question) => (question.isChecked = false)
          );
          for (let i = 0; i < res.data.data.response.totalPages; i++) {
            pageList.push({ pageNo: i + 1, isActive: i === 0 ? true : false });
          }

          this.setState({
            questions: res.data.data.response.contentViewModels,
            totalNoOfPages: res.data.data.response.totalPages,
            pageList,
            totalQuestions: res.data.data.response.totalElements,
            isSearch: true,
            searchInput: requestBody,
          });
        })
        .catch(() => {
          this.ServiceErrorAlert();
        });
    } else {
      this.getQuestionsList();
    }
  };

  // handleClickOutside = (event) => {

  //     // let showActions = [] ;
  //     // showActions[this.state.actionIndex]  =false
  //     if (this.wrapperRef) {
  //         this.setState({showFiletr:false})
  //     }
  // }
  mydata = [];
  requestBody = {
    examCategory: [],
    examName: [],
    languageId: [],
    topicId: [],
    subTopicId: [],
    difficultyId: [],
    usedIn: [],
    isConceptual: [],
    createdBy: [],
    quesTypeId: [],
    status: [],

    subjectId: [],
    searchText: "",
  };
  filters = [];
  selectedFilterData = (data) => {
    this.mydata.push(data);

    this.filters.indexOf(data.dropdownLabel) === -1 &&
      this.filters.push(data.dropdownLabel);

    this.setState({ finalData: this.mydata, noOfFilters: this.filters.length });
  };
  handleApply = () => {
    this.mydata.forEach((item, i) => {
      if (item.dropdownLabel === "Language") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.languageId.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Used In") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.usedIn.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Difficulty") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.difficultyId.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Conceptual") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.isConceptual.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Topic") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.topicId.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Sub-Topic") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.subTopicId.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Subject") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.subjectId.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Exam Category") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.examCategory.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Exam") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.examName.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Created By") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.createdBy.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Status") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.status.push(data.valueCode);
          }
        });
      }
      if (item.dropdownLabel === "Question Type") {
        item.dropdownMappingModels.forEach((data, i) => {
          if (data.isChecked) {
            this.requestBody.quesTypeId.push(data.valueName);
          }
        });
      }
    });
    console.log("Filter resquest:", this.requestBody);
    this.token = sessionStorage.getItem("Token");
    this.headers = {
      Authorization: "Bearer " + this.token,
      "content-type": "application/json",
    };
    let url = `${process.env.REACT_APP_API_BASE_URL}${QUESTION_WS}${SEARCH_AND_FILTER}?page=0&size=50`,
      pageList = [];
    axios
      .post(url, this.requestBody, { headers: this.headers })
      .then((res) => {
        console.log("Filter data:", res);
        res.data.data.response.contentViewModels.map(
          (question) => (question.isChecked = false)
        );
        for (let i = 0; i < res.data.data.response.totalPages; i++) {
          pageList.push({ pageNo: i + 1, isActive: i === 0 ? true : false });
        }
        this.filters = [];
        this.mydata = [];
        this.setState({
          questions: res.data.data.response.contentViewModels,
          totalNoOfPages: res.data.data.response.totalPages,
          pageList,
          totalQuestions: res.data.data.response.totalElements,
          isSearch: true,
          searchInput: this.requestBody,
          showFiletr: false,
          noOfFilters: 0,
        });
      })
      .catch(() => {
        this.ServiceErrorAlert();
      });
    // } else {

    //     this.getQuestionsList()
    // }
    // this.hidePopup();
  };

  render() {
    const {
      showVerification,
      showTranslation,
      showUpload,
      showActions,
      showFiletr,
      filterDropdownData,
      isChecked,
      selectedQuestionToSend,
      buttonDisabled,
      pageList,
      currentPage,
      totalQuestions,
      noOfFilters,
    } = this.state;
    return (
      <section ref={this.wrapperRef} className="">
        {showVerification && (
          <SendVerificationModal
            show={showVerification}
            onHide={this.hidePopup}
            title="Send to Verifier"
            label1="Please confirm to send selected questions for verification."
            label2="I wish to pre-generate a ticket to translator before verification."
            data={selectedQuestionToSend}
          />
        )}
        {showTranslation && (
          <SendVerificationModal
            show={showTranslation}
            onHide={this.hidePopup}
            title="Send to Translator"
            label1="Please select translation language before sending it to a translator.."
            data={selectedQuestionToSend}
          />
        )}
        {showUpload && (
          <UploadModal
            show={showUpload}
            onHide={this.hidePopup}
            title="Upload"
            label="Please click browse to choose an file from your computer"
            handleChangeFile={this.uploadFile}
          />
        )}

        <div className="top-section">
          <span className="qt-header">Questions</span>
          <button
            className="buttons-label btn-mask"
            onClick={this.addQuestionHandler}
          >
            Add New
          </button>
          <button
            className="upload-buttons-label upload-mask"
            onClick={() => this.setState({ showUpload: true })}
          >
            Upload
          </button>
          <span
            className="sample-template-label aa"
            onClick={() => this.downloadSampleTemplate()}
          >
            <a>Download Sample Template</a>
          </span>
        </div>
        <div className="qt-search-bar qt-btn-section-mrgn">
          <span className="qt-search-rectangle">
            <img className="baseline-search-icn" src={Search} alt=""></img>
            <input
              className="search-input"
              placeholder="Search"
              onChange={(e) => this.handleSearch(e)}
            ></input>
          </span>
          <span
            className="filter-mrgn"
            onClick={() => this.setState({ showFiletr: !showFiletr })}
          >
            <button
              className={
                !showFiletr
                  ? "qt-filter-group-5 filter-label filter-mask"
                  : "qt-filter-group-5 fltr-btn-base-label fltr-label-mask"
              }
            >
              Filter
              <span className="qt-filter-group-7">
                <img
                  className="filter-icon1"
                  src={!showFiletr ? Filter : Filter1}
                  alt=""
                ></img>
              </span>
            </button>
          </span>
          <span className="qt-count">{totalQuestions} Questions</span>
          <span className="side-btn1">
            <button
              disabled={!buttonDisabled}
              className={
                !buttonDisabled
                  ? "side-btn1-label side-btn1-mask disable-btn"
                  : "side-btn1-label side-btn1-mask"
              }
              onClick={() => this.exportToWord()}
            >
              Export to Word
            </button>
          </span>
          <span className="side-btn2">
            <button
              disabled={!buttonDisabled}
              className={
                !buttonDisabled
                  ? "side-btn2-label side-btn2-mask disable-btn"
                  : "side-btn2-label side-btn2-mask"
              }
              onClick={() => this.handleSendToTranslator()}
            >
              Send to Translator
            </button>
          </span>
          <span className="side-btn1">
            <button
              disabled={!buttonDisabled}
              className={
                !buttonDisabled
                  ? "side-btn3-label side-btn3-mask disable-btn"
                  : "side-btn3-label side-btn3-mask"
              }
              onClick={() => this.handleSendToVerifier()}
            >
              Send to Verifier
            </button>
          </span>
          {showFiletr && (
            <div className="fltr-box-list overlay fltr-combined-shape-list">
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
                  <span className="fltr-count-list">
                    {noOfFilters} Filters Applied
                  </span>
                  <button
                    className="canxel-buttons-label fltr-cancel-mask"
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
        </div>
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
                <th className="comp-id">Comp ID</th>
                <th className="qid">QID</th>
                <th className="child-id">Child ID</th>
                <th className="description">Description</th>
                <th className="language">Language</th>
                <th className="to-translate">Created By</th>
                <th className="to-translate">Creation Date</th>
                <th className="to-translate">Status</th>
                <th className="to-translate">To Translate</th>
                <th className="published-date">Published Date</th>
                <th className="creation-date">Last Updated</th>
                <th className="to-translate">Occurances/uses</th>
                <th className="to-translate">Linked Content ID</th>
                <th className="actions-title qt-actions">
                  <span className="last-col-title">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.questions.length > 0 &&
                this.state.questions.map((item, i) => {
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
                          value={item.questionId}
                          checked={item.isChecked}
                          parent="list"
                          index={i}
                        />
                      </td>
                      <td className="td-comp-id">{item.comprehensionId}</td>
                      <td className="td-qid">{item.questionId}</td>
                      <td className="td-cid">{item.childId}</td>
                      <td className="td-description" id={"Tooltip-" + i}>
                        {item.descriptionText.substring(0, 29)}...
                      </td>
                      <Tooltip
                        className="inner"
                        placement="right"
                        isOpen={this.isToolTipOpen(`Tooltip-${i}`)}
                        target={"Tooltip-" + i}
                        toggle={() => this.toggle(`Tooltip-${i}`)}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      >
                        {/* {item.description} */}
                      </Tooltip>
                      <td className="td-language">{item.language}</td>
                      <td className="td-created-by">
                        {item.createdBy ? item.createdBy : "-"}
                      </td>
                      <td className="td-created-date">{item.createdDate}</td>
                      <td className="td-status">{item.status}</td>
                      <td className="td-to-translate">
                        {item.translationLanguages
                          ? item.translationLanguages.map((lang, i) => {
                              return <span>{lang},</span>;
                            })
                          : "-"}
                      </td>
                      <td className="td-published-date">
                        {item.publishedDate ? item.publishedDate : "-"}
                      </td>
                      <td className="td-created-date">{item.updatedDate}</td>
                      <td className="td-status">{item.occurances}</td>
                      <td className="td-to-translate">
                        {item.linkedContents
                          ? item.linkedContents.map((lang, i) => {
                              return <span>{lang},</span>;
                            })
                          : "-"}
                      </td>
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
      </section>
    );
  }
}
