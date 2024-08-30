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
    <div className="post-job space-y-8 p-6 bg-white rounded-lg shadow-md">
    <h1 className={`text-2xl font-semibold ${isEdit ? "text-blue-600" : "text-blue-600"}`}>
      {isEdit ? "Update Video" : "Upload Video"}
    </h1>
    
    <div className="container-job space-y-6">
      <div className="text space-y-4">
        <div className="input-container space-y-6">
          
          <FormControl fullWidth className="dropdown">
            <InputLabel id="select-category-label" className="text-gray-700">
              Select Category
            </InputLabel>
            <Select
              labelId="select-category-label"
              id="select-category"
              value={formData.categoryId}
              label="Select Category"
              name="categoryId"
              onChange={handleChange}
              className="bg-gray-100 rounded-md"
            >
              {categoryList.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <FormControl fullWidth className="dropdown">
            <InputLabel id="select-sequence-label" className="text-gray-700">
              Sequence
            </InputLabel>
            <Select
              labelId="select-sequence-label"
              id="select-sequence"
              value={formData.seqs}
              label="Sequence"
              name="seqs"
              onChange={handleChange}
              className="bg-gray-100 rounded-md"
            >
              {Array.from({ length: 200 }, (_, i) => i + 1).map((seq) => (
                <MenuItem key={seq} value={seq}>
                  {seq}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
  
          <CustomRewardInput
            iconName={"FaRegPlayCircle"}
            placeholder={"Title"}
            value={formData.title}
            name="title"
            setValue={handleChange}
            event={true}
            className="bg-gray-100 rounded-md"
          />
  
          <CustomRewardInput
            iconName={"IoLink"}
            placeholder={"Video URL"}
            value={formData.link}
            name="link"
            setValue={handleChange}
            event={true}
            className="bg-gray-100 rounded-md"
          />
  
          <CustomRewardInput
            iconName={"MdOutlineNotes"}
            placeholder={"Description"}
            value={formData.desc}
            name="desc"
            setValue={handleChange}
            event={true}
            className="bg-gray-100 rounded-md"
          />
  
          <div className="sk-image-button border border-gray-300 rounded-md p-4 flex items-center justify-between">
            <label className="flex items-center space-x-3 cursor-pointer">
              <CustomIcon name={"RiAttachment2"} />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleMediaFile}
              />
              <span className="text-gray-600">
                {mediaFile
                  ? mediaFile.name
                    ? mediaFile.name
                    : "background.jpg"
                  : "Upload Background Image"}
              </span>
            </label>
            {mediaFile && (
              <CustomIcon
                name={"TiDeleteOutline"}
                className="text-red-500 cursor-pointer"
                onClick={handleRemoveFile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  
    <button
      className={`w-1/2 py-3 rounded-md text-white font-semibold ${isEdit ? "bg-blue-600" : "bg-blue-600"} hover:opacity-90 transition duration-300 ease-in-out`}
      onClick={handleUploadVideo}
    >
      {isEdit ? "Update Video" : "Upload Video"}
    </button>
  </div>
  
  );
}
