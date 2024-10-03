import React, { useEffect, useState } from "react";
import CustomIcon from "../../components/CustomIcon";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CustomInput from "../../components/CustomInput/CustomInput";
import { apiHandler } from "../../apis/index.js";
import { endpoint } from "../../apis/endpoint.js";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import CustomAlert from "../../components/CustomAlert/CustomAlert";

export default function SkAddQuestion({ onClose, setIsLoading, addVideoData }) {
  const [formData, setFormData] = useState({
    question: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correctAnswer: 1,
  });
  const authToken = useSelector((state) => state.auth.authToken);
  const [videoData, setVideoData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [setId, setSetId] = useState(null);
  const [edit, setEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCustomAlert = (setId) => {
    setShowAlert(true);
    setSetId(setId);
  };

  const getVideoData = async () => {
    setIsLoading(true);
    try {
      const res = await apiHandler({
        method: "POST",
        url: endpoint.QUESTION_BY_VIDEO_ID,
        data: {
          videoId: addVideoData._id,
          categoryId: addVideoData.categoryId._id,
        },
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        setVideoData(res.data?.data || { question: { questionset: [] } });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = async () => {
    setIsLoading(true);
    try {
      const res = await apiHandler({
        method: "POST",
        url: endpoint.QUESTION,
        data: {
          videoId: addVideoData._id,
          questionset: [
            {
              id: new Date().getTime().toString(),
              question: formData.question,
              option: [
                formData.answer1,
                formData.answer2,
                formData.answer3,
                formData.answer4,
              ],
              answer: formData.correctAnswer,
            },
          ],
          edit: " ",
        },
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        toast.success("Question added successfully");
        clearAll();
        getVideoData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuestion = async () => {
    setIsLoading(true);
    try {
      const res = await apiHandler({
        method: "DELETE",
        url: endpoint.QUESTION_DELETE,
        data: {
          questionID: videoData.question._id,
          setId: setId,
        },
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        toast.success("Question deleted successfully");
        getVideoData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuestion = async () => {
    setIsLoading(true);
    try {
      const res = await apiHandler({
        method: "POST",
        url: endpoint.QUESTION,
        data: {
          videoId: addVideoData._id,
          questionset: [
            {
              id: setId,
              question: formData.question,
              option: [
                formData.answer1,
                formData.answer2,
                formData.answer3,
                formData.answer4,
              ],
              answer: formData.correctAnswer,
            },
          ],
          edit: setId,
        },
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        toast.success("Question updated successfully");
        clearAll();
        getVideoData();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const setEditData = (question) => {
    setEdit(true);
    setSetId(question.id);
    setFormData({
      question: question.question,
      answer1: question.option[0],
      answer2: question.option[1],
      answer3: question.option[2],
      answer4: question.option[3],
      correctAnswer: question.answer,
    });
  };

  const clearAll = () => {
    setEdit(false);
    setFormData({
      question: "",
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: "",
      correctAnswer: 1,
    });
  };

  useEffect(() => {
    getVideoData();
  }, []);

  return (
    <div className="view-video add-q">
      <div className="video-details">
        <div className="video-header">
          <div className="title">
            <h1 className="h2-style">Add Question</h1>
          </div>
          <div className="icon" onClick={onClose}>
            <CustomIcon name="IoChevronBackCircleOutline" />
          </div>
        </div>
      </div>

      <CustomInput
        text="text"
        placeholder="Enter Question"
        value={formData.question}
        name="question"
        onChange={handleChange}
      />
      <div className="grid">
        <CustomInput
          label="Answer 1"
          text="text"
          placeholder="Enter Option 1"
          value={formData.answer1}
          name="answer1"
          onChange={handleChange}
        />
        <CustomInput
          label="Answer 2"
          text="text"
          placeholder="Enter Option 2"
          value={formData.answer2}
          name="answer2"
          onChange={handleChange}
        />
        <CustomInput
          label="Answer 3"
          text="text"
          placeholder="Enter Option 3"
          value={formData.answer3}
          name="answer3"
          onChange={handleChange}
        />
        <CustomInput
          label="Answer 4"
          text="text"
          placeholder="Enter Option 4"
          value={formData.answer4}
          name="answer4"
          onChange={handleChange}
        />
      </div>
      <FormControl fullWidth className="dropdown">
        <InputLabel id="demo-simple-select-label">
          Select Correct Answer
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formData.correctAnswer}
          label="Select Correct Answer"
          name="correctAnswer"
          onChange={handleChange}
        >
          {Array.from({ length: 4 }, (_, i) => i + 1).map((seq) => (
            <MenuItem key={seq} value={seq}>
              Answer {seq}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {edit ? (
        <button className="add-button" onClick={updateQuestion}>
          Update Question
        </button>
      ) : (
        <button className="add-button" onClick={addQuestion}>
          Save Question
        </button>
      )}
      <div>
        {videoData?.question?.questionset?.length > 0 ? (
          videoData.question.questionset.map((question, index) => (
            <div key={index} className="question-card">
              <div className="question">
                <div>
                  <p>{question.question}</p>
                </div>
                <div className="icons">
                  <div
                    className="icon blue"
                    onClick={() => setEditData(question)}
                  >
                    <CustomIcon name="MdEdit" tag="Edit Question" />
                  </div>
                  <div
                    className="icon red"
                    onClick={() => openCustomAlert(question.id)}
                  >
                    <CustomIcon name="MdDelete" tag="Delete Question" />
                  </div>
                </div>
              </div>
              <div className="answers">
                {question.option.map((option, index) => (
                  <div key={index} className="answer">
                    <p>
                      {index + 1}. {option}
                    </p>
                  </div>
                ))}
              </div>
              <div className="correct-answer">
                <p>Correct Answer: {question.answer}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No questions available. Add a new question to get started.</p>
        )}
      </div>
      {showAlert && (
        <CustomAlert
          show={showAlert}
          onClickFunction={deleteQuestion}
          onCancelFunction={() => setShowAlert(false)}
          message="Are you sure you want to delete this Question?"
          type="delete"
        />
      )}
    </div>
  );
}