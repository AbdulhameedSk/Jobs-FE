import React, { useEffect, useState } from "react";
import CustomRewardInput from "../../components/CustomRewardInput/CustomRewardInput";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import CustomIcon from "../../components/CustomIcon";

export default function SkPostVideo({
  postVideo,
  categoryList,
  isEdit = false,
  editData = null,
}) {
  const [mediaFile, setMediaFile] = useState(null);
  const [formData, setFormData] = useState({
    seqs: "",
    link: "",
    title: "",
    desc: "",
    categoryId: "",
    background: null,
  });

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        seqs: editData.seqs || "",
        link: editData.link || "",
        title: editData.title || "",
        desc: editData.desc || "",
        categoryId: editData.categoryId._id || "",
        background: editData.background || null,
        edit: editData._id,
      });
      if (editData.background) {
        setMediaFile(editData.background);
      }
    }
  }, [isEdit, editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadVideo = () => {
    const { link } = formData;
    const getYoutubeId = (url) => {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("v");
    };
    const youtubeId = getYoutubeId(link);
    const thumbnail = `http://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    const updatedFormData = {
      ...formData,
      youtubeId: youtubeId,
      thumbnail: thumbnail,
      status: "In Approval",
    };
    if (isEdit) {
      postVideo(updatedFormData);
    } else {
      postVideo(updatedFormData);
    }
  };

  const handleMediaFile = (e) => {
    setMediaFile(e.target.files[0]);
    setFormData({ ...formData, background: e.target.files[0] });
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    setMediaFile(null);
    setFormData({ ...formData, background: null });
  };

  return (
    <div className="post-job">
      <h1 className="h2-style">{isEdit ? "Update Video" : "Upload Video"}</h1>
      <div className="container-job">
        <div className="text">
          <div className="input-container">
            <FormControl fullWidth className="dropdown">
              <InputLabel id="demo-simple-select-label">
                Select Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.categoryId}
                label="Select Category"
                name="categoryId"
                onChange={handleChange}
              >
                {categoryList.map((category) => {
                  return (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth className="dropdown">
              <InputLabel id="demo-simple-select-label">Sequence</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.seqs}
                label="Sequence"
                name="seqs"
                onChange={handleChange}
              >
                {Array.from({ length: 200 }, (_, i) => i + 1).map((seq) => {
                  return (
                    <MenuItem key={seq} value={seq}>
                      {seq}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <CustomRewardInput
              iconName={"FaRegPlayCircle"}
              placeholder={"Title"}
              value={formData.title}
              name="title"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"IoLink"}
              placeholder={"Video URL"}
              value={formData.link}
              name="link"
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName={"MdOutlineNotes"}
              placeholder={"Description"}
              value={formData.desc}
              name="desc"
              setValue={handleChange}
              event={true}
            />
            <div className="partner-modal-btn-border sk-image-button">
              <div>
                <label className="partner-modal-icon-clr">
                  <div className="flex">
                    <CustomIcon name={"RiAttachment2"} />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleMediaFile}
                    />
                    <div className="partner-modal-icon-text">
                      {mediaFile
                        ? mediaFile.name
                          ? mediaFile.name
                          : "background.jpg"
                        : "Upload Background Image"}
                    </div>
                  </div>
                  {mediaFile && (
                    <CustomIcon
                      name={"TiDeleteOutline"}
                      className="delete-icon"
                      onClick={handleRemoveFile}
                    />
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="add-button" onClick={handleUploadVideo}>
        {isEdit ? "Update Video" : "Upload Video"}
      </button>
    </div>
  );
}
