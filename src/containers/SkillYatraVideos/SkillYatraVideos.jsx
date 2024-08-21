import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Boilers/Header";
import CustomTable from "../../components/CustomTable/CustomTable.jsx";
import Spinner from "../../components/Spinner/Spinner";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { apiHandler } from "../../apis/index";
import { endpoint } from "../../apis/endpoint";
import "./SkillYatraVideos.css";
import { fullDateAndTime } from "../../utils/Utils";
import CustomIcon from "../../components/CustomIcon";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import SkViewVideo from "./SkViewVideo";
import toast from "react-hot-toast";
import SkPostVideo from "./SkPostVideo";
import SkAddQuestion from "./SkAddQuestion";
import { useSelector } from "react-redux";
import Pagination from "../../components/Pagination/Pagination";

export default function SkillYatraVideos() {
  const [isPosting, setIsPosting] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filterApplied, setFiltersApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [catId, setCatId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [viewVideoDetails, setViewVideoDetails] = useState(null);
  const [deleteId, setDeleteId] = useState("");
  const [userId, setUserId] = useState("");
  const tableRef = useRef();
  const authToken = useSelector((state) => state.auth.authToken);
  const userIdh = useSelector(state => state.user.userId);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [addQuestion, setAddQuestion] = useState(false);
  const [addQuestionData, setAddQuestionData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 5;

  const headers = [
    "Title",
    "Video URL",
    "Category",
    "Sequence",
    "Timestamp",
    "Status",
    "Actions",
  ];


  const filterTypes = ["text", "text", "text", "range", "range", "text", ""];
  const textAlign = ["left", "left", "left", "center", "center", "left", ""];

  const [rows, setRows] = useState([]);

  const handleIsPosting = () => {
    setIsPosting(!isPosting);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setCatId(value);
  };

  const triggerClearFilter = () => {
    if (tableRef.current) {
      tableRef.current.clearAllFilters();
    }
  };

  const handleViewVideo = (video) => {
    setViewVideoDetails(video);
    setIsViewing(true);
  };

  const handleAddQuestion = (video) => {
    setAddQuestion(true);
    setAddQuestionData(video);
  };

  const getCategoryList = async () => {
    setIsLoading(true);
    try {
      const result = await apiHandler({
        url: endpoint.CATEGORY,
        method: "POST",
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result.status === 200) {
        setCategory(result.data?.data?.category);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const getAllVideosByCategory = async (cat_id) => {
    setIsLoading(true);
    try {
      const result = await apiHandler({
        url: endpoint.CATEGORY_VIDEOS,
        method: "PUT",
        data: {
          category: cat_id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (result.status === 200) {
        const rows = result.data.data.Categoryvideos.map((video) => {
          return [
            video.title,
            video.link,
            video.categoryId.name,
            video.seqs,
            fullDateAndTime(video.uploadTimestamp),
            video.status,
            <div className="icons-options">
              {true && (
                <div
                  className="icon1"
                  onClick={() => {
                    handleAddQuestion(video);
                  }}
                >
                  <CustomIcon name="FaRegQuestionCircle" tag="Add Question" />
                </div>
              )}
              <div
                className="icon1"
                onClick={() => {
                  handleViewVideo(video);
                }}
              >
                <CustomIcon name="FaRegEye" tag="View Video" />
              </div>
              {true && (
                <div className="icon1" onClick={() => handleEditButton(video)}>
                  <CustomIcon name="MdEdit" tag="Edit Category" />
                </div>
              )}
              {true && (
                video?.status === "Published" ? (
                  <div
                    className="icon3"
                    onClick={() => {
                      updateVideoStatus(video._id, "Rejected");
                    }}
                  >
                    <CustomIcon name="IoIosPause" tag="Unpublish Video" />
                  </div>
                ) : (
                  <div
                    className="icon4"
                    onClick={() => {
                      updateVideoStatus(video._id, "Published");
                    }}
                  >
                    <CustomIcon name="IoIosPlay" tag="Publish Video" />
                  </div>
                )
              )}
              {true && (
                <div
                  className="icon2"
                  onClick={() => {
                    openCustomAlert(video._id, video.uploadedBy._id);
                  }}
                >
                  <CustomIcon name="MdDelete" tag="Delete Video" />
                </div>
              )}
            </div>,
          ];
        });
        setRows(rows);
        setTotalPages(Math.ceil(rows.length / rowsPerPage));
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const openCustomAlert = (id, userId) => {
    setShowAlert(true);
    setDeleteId(id);
    setUserId(userId);
  };

  const deleteVideo = async () => {
    setIsLoading(true);
    try {
      const result = await apiHandler({
        url: endpoint.CATEGORY_VIDEOS_DELETE,
        method: "DELETE",
        data: {
          _id: deleteId,
          userId: userId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (result.status === 200) {
        getAllVideosByCategory(catId);
        toast.success("Video deleted successfully");
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete video");
    }
  };

  const updateVideoStatus = async (id, status) => {
    setIsLoading(true);
    try {
      const result = await apiHandler({
        url: endpoint.CATEGORY_VIDEOS_UPDATE,
        method: "PUT",
        data: {
          _id: id,
          status: status,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (result.status === 200) {
        getAllVideosByCategory(catId);
        toast.success("Video status updated successfully");
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to update video status");
    }
    setIsLoading(false);
  };

  const postVideo = async (formData) => {
    setIsLoading(true);
    try {
      const result = await apiHandler({
        url: endpoint.CATEGORY_VIDEOS_SAVE,
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
        authToken,
      });
      if (result.status === 200) {
        setIsPosting(false);
        toast.success(result.data.message);
        getAllVideosByCategory(catId);
      } else {
        toast.error(result.data.message);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
      setIsLoading(false);
    }
  };

  const handleEditButton = (video) => {
    setIsEdit(true);
    setEditData(video);
    setIsPosting(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    setCatId(category[0]?._id);
  }, [category]);

  useEffect(() => {
    if (catId) {
      getAllVideosByCategory(catId);
    }
  }, [catId]);

  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div>
      <Header
        tiltel={"Skill Yatra Videos"}
        icon={"FaPlus"}
        className={isPosting ? "rotate-icon" : " "}
        onClickFunc={handleIsPosting}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        clearFilter={filterApplied}
        clearFilterFun={triggerClearFilter}
        filterTypes={filterTypes}
        textAlign={textAlign}
      />
      {isPosting ? (
        <div className="video-table">
          <SkPostVideo
            postVideo={postVideo}
            categoryList={category}
            isEdit={isEdit}
            editData={editData}
          />
        </div>
      ) : addQuestion ? (
        <SkAddQuestion
          onClose={() => {
            setAddQuestion(false);
          }}
          setIsLoading={setIsLoading}
          addVideoData={addQuestionData}
        />
      ) : (
        <div className="video-table">
          <div className="skv">
            <FormControl fullWidth className="dropdown">
              <InputLabel id="demo-simple-select-label">
                Select Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={catId}
                label="Select category"
                name="cat_id"
                onChange={handleChange}
              >
                {category.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <CustomTable
      
            headers={headers}
            rows={paginatedRows}
            searchInput={searchInput}
            ref={tableRef}
            setFiltersApplied={setFiltersApplied}
            filterTypes={filterTypes}
            textAlign={textAlign}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      {showAlert && (
        <CustomAlert
          show={showAlert}
          onClickFunction={() => {
            deleteVideo();
          }}
          onCancelFunction={() => setShowAlert(false)}
          message="Are you sure you want to delete this Video?"
          type="delete"
        />
      )}
      {isViewing && (
        <SkViewVideo
          video={viewVideoDetails}
          onClose={() => {
            setIsViewing(false);
          }}
          isOpen={isViewing}
          updateVideoStatus={updateVideoStatus}
        />
      )}
      {isLoading && (
        <Spinner show={isLoading} closeModal={() => setIsLoading(false)} />
      )}
    </div>
  );
}
