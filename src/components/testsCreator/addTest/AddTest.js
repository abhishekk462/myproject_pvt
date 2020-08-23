import React, { Component } from "react";

import Editor from "../../../shared/utils/rte/richTextEditor";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "suneditor/dist/css/suneditor.min.css";

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

export class AddTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examCategory: ["A", "B", "C", "D", "A", "B"],
      exam: ["C", "D"],
      year: [2019, 2018],
      stage: ["Pre", "Post"],
      subject: ["sub", "sub2"],
      noOfQuestions: [2, 3, 4],
      timeLimit: "60:00",
      totalMarks: "50",
      language: ["Hindi", "English", "Tamil"],
    };
  }

  render() {
    const {
      examCategory,
      exam,
      year,
      stage,
      subject,
      noOfQuestions,
      timeLimit,
      totalMarks,
      language,
    } = this.state;
    const { showModal, addTestHandler } = this.props;
    return (
      <>
        <Modal isOpen={showModal} toggle={addTestHandler}>
          <div className="test-configuration">Test Configuration</div>
          {/* <ModalHeader className="test-configuration">
            Test Configuration
          </ModalHeader> */}
          <div className="line-19"></div>
          <ModalBody>
            <select
              className="dropdown qt-select-input-base select-forms-placeholder"
              id="mySelect"
              onChange={(e) => this.handleQTypeChange(e, "QT")}
            >
              <option
                className="qt-select-input-base potion-tp"
                value="Stage Mock Test"
              >
                Stage Mock Test
              </option>
              <option
                className="qt-select-input-base"
                value="Subject Practice Test"
              >
                Subject Practice Test
              </option>
              <option
                className="qt-select-input-base"
                value="Topic Practice Test"
              >
                Topic Practice Test
              </option>
              <option
                className="qt-select-input-base"
                value="Subtopic Practice Test"
              >
                Subtopic Practice Test
              </option>
            </select>
            <div className="qt-select-label">
              Test Type<span className="login-label"></span>
            </div>

            <div>
              {examCategory &&
                examCategory.map((item, i) => {
                  return (
                    <span className="dropdown mt20" key={"dropdown" + i}>
                      <select
                        className="mr20 mt20 tagging-dd-base tagging-dd-subject"
                        id={item}
                        onChange={(e) =>
                          this.selectTaggingOptions(e, item.dropdownLabel, i)
                        }
                        required="required"
                        aria-required="true"
                      >
                        <option>{item}</option>
                        {/* {item.dropdownMappingModels.map((option,k) =>{ return <option value={option.valueCode} key={k}>{option.valueName}</option>})} */}
                      </select>
                    </span>
                  );
                })}

              <span className="dropdown mt20 mr20" key={"dropdown"}>
                <label htmlFor="time" className="timeLimit">
                  Time Limit
                </label>
                <input
                  id="time"
                  type="text"
                  className="time"
                  placeholder="MM:SS"
                  aria-label="Username"
                />
              </span>
              <span className="dropdown mt20 mr20" key={"dropdown"}>
                <input
                  type="text"
                  placeholder="Total Marks"
                  className="totalMarks"
                  aria-label="Username"
                />
              </span>
            </div>
            <div>
              <select
                className="dropdown mt20 mb20 qt-select-input-base select-forms-placeholder"
                id="mySelect"
                onChange={(e) => this.handleQTypeChange(e, "QT")}
              >
                <option
                  className="qt-select-input-base potion-tp"
                  value="Language"
                >
                  Language
                </option>
                <option className="qt-select-input-base" value="Hindi">
                  Hindi
                </option>
                <option className="qt-select-input-base" value="English">
                  English
                </option>
                <option className="qt-select-input-base" value="Tamil">
                  Tamil
                </option>
              </select>
            </div>

            <label className="label">Instructions</label>
            <Editor
              onChange={this.handleEditorData}
              label="Instructions"
              innerIndex="{questionIndex}"
              content=""
              className="forms-input-copy-11"
            />
          </ModalBody>

          <div className="cancelAndAdd">
            <button
              className="base-buttons-label cancel-btn-mask"
              onClick={addTestHandler}
            >
              Cancel
            </button>{" "}
            <button
              className="base-buttons-label btn-mask"
              onClick={addTestHandler}
            >
              Create Test
            </button>
          </div>
        </Modal>
      </>
    );
  }
}

export default AddTest;
