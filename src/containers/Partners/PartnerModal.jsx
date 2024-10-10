import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Modal } from "reactstrap";
import { endpoint } from "../../apis/endpoint";
import { apiHandler } from "../../apis/index";
import "./PartnerModal.css";

const PartnerModal = ({
  updateData,
  setIsLoading,
  handlePartner,
  isOpen,
  onClose,
}) => {
  // State for file uploads
  const [selectedImage, setSelectedImage] = useState(null);
  const [introImage, setIntroImage] = useState(null);
  const [isIntro, setIsIntro] = useState(false);
  const [isState, setIsState] = useState(0);
  const userId = useSelector((state) => state.user.userId);

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    // link: "",
    category: "",
    intro_description: "",
    intro_video: "",
    Eid: userId,
  });
  
  // State for dynamic fields
  const [fields, setFields] = useState([{ label: "", value: "" }]);
  
  // Get auth token from Redux store
  const authToken = useSelector((state) => state.auth.authToken);

  // Populate form data if updating an existing partner
  useEffect(() => {
    if (updateData) {
      setFormData({
        name: updateData.name || "",
        // link: updateData.link || "",
        category: updateData.category || "",
        intro_description: updateData.intro_description || "",
        intro_video: updateData.intro_video || "",
        Eid: userId||"Issue",
      });
      setSelectedImage(updateData.images || null);
      setIntroImage(updateData.intro_images || null);
      setIsIntro(updateData.intro_status || false);
      setIsState(updateData.intro_video ? 1 : 0);
      setFields(updateData.fields || [{ label: "", value: "" }]);
    }
  }, [updateData]);

  // Handle text and URL input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    console.log("Selected image:", file.name);
    // Optionally, update formData.link if needed
    // setFormData((prevData) => ({ ...prevData, link: file.name }));
  };

  // Handle intro image file selection
  const handleIntroImageChange = (e) => {
    const file = e.target.files[0];
    setIntroImage(file);
    console.log("Intro image:", file.name);
    // Optionally, update formData.intro_video or another field if needed
  };

  // Handle dynamic field changes
  const handleFieldChange = (index, event) => {
    const { name, value } = event.target;
    const newFields = fields.map((field, i) => {
      if (i === index) {
        return { ...field, [name]: value };
      }
      return field;
    });
    setFields(newFields);
  };

  // Add a new dynamic field
  const handleAddField = () => {
    setFields([...fields, { label: "", value: "" }]);
  };

  // Remove selected image
  const handleRemoveImage = (e) => {
    e.preventDefault();
    setSelectedImage(null);
  };

  // Remove intro image
  const handleRemoveIntroImage = (e) => {
    e.preventDefault();
    setIntroImage(null);
  };

  // Toggle intro status
  const toggleIntroStatus = () => {
    setIsIntro((prev) => !prev);
  };

  // Change intro state (0 for image, 1 for video)
  const handleChangeState = (e) => {
    setIsState(parseInt(e.target.value, 10));
  };

  // Function to handle adding a new partner
  const addPartner = async (e) => {
    e.preventDefault(); // Prevent default form submission
    onClose();
    const data = new FormData();
    data.append("name", formData.name);
    // data.append("link", formData.link);
    data.append("category", formData.category);
    data.append("status", "active");
    data.append("fields", JSON.stringify(fields));
data.append("Eid", userId);
    if (selectedImage) {
      data.append("images", selectedImage);
    }

    if (isIntro) {
      data.append("intro_description", formData.intro_description);
      if (isState === 0 && introImage) {
        data.append("intro_images", introImage);
      } else if (isState === 1) {
        data.append("intro_video", formData.intro_video);
      }
      data.append("intro_status", isIntro);
    }

    setIsLoading(true);
    try {
      const response = await apiHandler({
        method: "POST",
        url: endpoint.CREATE_PARTNER,
        authToken: authToken,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        handlePartner();
        toast.success("Partner added successfully");
      } else {
        // console.error("Failed to add partner:", response);
        // toast.error("Failed to add partner.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error adding partner:", error);
      toast.error("Failed to add partner.");
      setIsLoading(false);
    }
  };

  // Function to handle updating an existing partner
  const updatePartner = async (e) => {
    e.preventDefault(); // Prevent default form submission
    onClose();
    const data = new FormData();
    data.append("_id", updateData._id);
    data.append("name", formData.name);
    // data.append("link", formData.link);
    data.append("category", formData.category);
    data.append("status", "active");
    data.append("fields", JSON.stringify(fields));

    if (selectedImage) {
      data.append("images", selectedImage);
    }

    if (isIntro) {
      data.append("intro_description", formData.intro_description);
      if (isState === 0 && introImage) {
        data.append("intro_images", introImage);
      } else if (isState === 1) {
        data.append("intro_video", formData.intro_video);
      }
      data.append("intro_status", isIntro);
    }

    setIsLoading(true);
    try {
      const response = await apiHandler({
        method: "PUT",
        url: endpoint.UPDATE_PARTNER,
        data,
        authToken: authToken,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        handlePartner();
        toast.success("Partner updated successfully");
      } else {
        console.error("Failed to update partner:", response);
        toast.error("Failed to update partner.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating partner:", error);
      toast.error("Failed to update partner.");
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} className="max-w-3xl">
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-full"
        onSubmit={updateData ? updatePartner : addPartner}
      >
        <div className="flex flex-col space-y-4">
          {/* Name Input */}
          <h1 className="flex justify-center items-center text-blue-500 text-2xl">CREATE PARTNER</h1>
          <div className="flex flex-row gap-3" >
          <input
  className="border border-gray-300 rounded-md px-3    focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
  type="text"
  name="name"
  placeholder="Name"
  value={formData.name}
  onChange={handleInputChange}
  required
/>
<input
  className="border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
  type="text"
  name="category"
  placeholder="Category"
  value={formData.category}
  onChange={handleInputChange}
  required
/>

          </div>
          {/* Link Input (URL) */}
          {/* <input
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="url"
            name="link"
            placeholder="Link (URL)"
            value={formData.link}
            onChange={handleInputChange}
            required
          /> */}

          {/* Image File Input */}
          <div>
            <label className="block text-gray-700">Image:</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1"
            />
            {selectedImage && (
              <div className="flex items-center mt-2">
                <span>{selectedImage.name}</span>
                <button
                  onClick={handleRemoveImage}
                  className="ml-2 text-red-500 underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Category Input */}


          {/* Dynamic Fields */}
          {fields.map((field, index) => (
            <div key={index} className="flex flex-row space-y-2 gap-2 ">
             <input
  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
  type="text"
  name="label"
  placeholder="Label"
  value={field.label}
  onChange={(event) => handleFieldChange(index, event)}
  required
/>

              {/* <span>:</span> */}
              {/* <input
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="value"
                placeholder="Value"
                value={field.value}
                onChange={(event) => handleFieldChange(index, event)}
                required
              /> */}
            </div>
          ))}

          {/* Add Field Button */}
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md self-start"
            onClick={handleAddField}
          >
            + Add Field
          </button>

          {/* Intro Section Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="introStatus"
              checked={isIntro}
              onChange={toggleIntroStatus}
              className="mr-2"
            />
            <label htmlFor="introStatus" className="text-gray-700">
              Add Intro Section
            </label>
          </div>

          {/* Intro Section */}
          {isIntro && (
            <div className="border border-gray-300 p-4 rounded-md">
              {/* Intro Description */}
              <textarea
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                name="intro_description"
                placeholder="Intro Description"
                value={formData.intro_description}
                onChange={handleInputChange}
                required
              />

              {/* Intro Media Type Selection */}
              <div className="mt-4">
                <label className="block text-gray-700 mb-2">
                  Intro Media Type:
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="introMediaType"
                      value="0"
                      checked={isState === 0}
                      onChange={handleChangeState}
                      className="mr-2"
                    />
                    Image
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="introMediaType"
                      value="1"
                      checked={isState === 1}
                      onChange={handleChangeState}
                      className="mr-2"
                    />
                    Video
                  </label>
                </div>
              </div>

              {/* Intro Image or Video Input */}
              {isState === 0 ? (
                <div className="mt-4">
                  <label className="block text-gray-700">Intro Image:</label>
                  <input
                    type="file"
                    name="intro_images"
                    accept="image/*"
                    onChange={handleIntroImageChange}
                    className="mt-1"
                  />
                  {introImage && (
                    <div className="flex items-center mt-2">
                      <span>{introImage.name}</span>
                      <button
                        onClick={handleRemoveIntroImage}
                        className="ml-2 text-red-500 underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4">
                  <label className="block text-gray-700">Intro Video URL:</label>
                  <input
                    type="url"
                    name="intro_video"
                    placeholder="https://example.com/video"
                    value={formData.intro_video}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    required={isState === 1}
                  />
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md self-start"
          >
            {updateData ? "Update Partner" : "Add Partner"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PartnerModal;
