import React, { useState, useEffect } from "react";
import CustomRewardInput from "../../components/CustomRewardInput/CustomRewardInput.jsx";
import CustomIcon from "../../components/CustomIcon.jsx";
import CustomToggleSwitch from "../../components/CustomToggleSwitch/CustomToggleSwitch.jsx";
import CustomSwitch from "../../components/CustomSwitch/CustomSwitch.jsx";
import { endpoint } from "../../apis/endpoint.js";
import { apiHandler } from "../../apis/index";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Modal } from "reactstrap";

const PartnerModal = ({
  updateData,
  setIsLoading,
  handlePartner,
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [introFile, setIntroFile] = useState(null);
  const [isIntro, setIsIntro] = useState(false);
  const [isState, setIsState] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    category: "",
    intro_description: "",
    intro_video: "",
  });
  const authToken = useSelector((state) => state.auth.authToken);
  const userId = useSelector((state) => state.user.userId);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("Selected file:", file.name);
  };

  const handleIntroFileChange = (e) => {
    const file = e.target.files[0];
    setIntroFile(file);
    console.log("Intro file:", file.name);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const setIsIntroFunc = (newChecked) => {
    setIsIntro(newChecked);
  };

  const handleChangeState = (newState) => {
    setIsState(newState);
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    setSelectedFile(null);
  };

  const handleRemoveIntroFile = (e) => {
    e.preventDefault();
    setIntroFile(null);
  };

  const addPartner = async () => {
    onClose();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("link", formData.link);
    data.append("category", formData.category);
    data.append("status", "active"); // Assuming a default status
    data.append("Eid", userId); // Assuming a default Eid
    if (selectedFile) {
      data.append("images", selectedFile);
    }
    if (isIntro) {
      data.append("intro_description", formData.intro_description);
      if (isState === 0 && introFile) {
        data.append("images", introFile);
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
        console.error("Failed to add partner:", response);
        toast.error("Failed to add partner.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error adding partner:", error);
      toast.error("Failed to add partner.");
      setIsLoading(false);
    }
  };

  const updatePartner = async () => {
    onClose();
    const data = new FormData();
    data.append("_id", updateData._id);
    data.append("name", formData.name);
    data.append("link", formData.link);
    data.append("category", formData.category);
    data.append("status", "active"); // Assuming a default status
    if (selectedFile) {
      data.append("images", selectedFile);
    }
    if (isIntro) {
      data.append("intro_description", formData.intro_description);
      if (isState === 0 && introFile) {
        data.append("images", introFile);
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

  useEffect(() => {
    if (updateData) {
      setFormData({
        name: updateData.name,
        link: updateData.link,
        category: updateData.category,
        intro_description: updateData.intro_description,
        intro_video: updateData.intro_video,
      });
      setSelectedFile(updateData.images);
      setIntroFile(updateData.intro_images);
      setIsIntro(updateData.intro_status);
      setIsState(updateData.intro_video ? 1 : 0);
    }
  }, [updateData]);

  return (
    <Modal backdrop={"static"} isOpen={isOpen} toggle={onClose} centered>
      <div className="partner-modal" width="100%">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div
            className="modal-content video-background-color"
            style={{ height: "max-content" }}
          >
            <div
              className="modal-header"
              style={{ backgroundColor: "#bac7d3" }}
            >
              <h5
                className="modal-title"
                id="exampleModalLabel"
                style={{ color: "#2d88ba" }}
              >
                {updateData ? "Update Partner" : "Add New Partner"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="partner-modal-fix">
              <div className="row">
                <div className="col-lg-6">
                  <div>
                    <CustomRewardInput
                      iconName={"IoMdPerson"}
                      placeholder={"Partner name"}
                      type={"text"}
                      name="name"
                      value={formData.name}
                      setValue={handleInputChange}
                      style={{ width: "330px" }}
                      event={true}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <CustomRewardInput
                      iconName={"MdCategory"}
                      placeholder={"Category"}
                      type={"text"}
                      name="category"
                      value={formData.category}
                      setValue={handleInputChange}
                      style={{ width: "330px" }}
                      event={true}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <CustomRewardInput
                      iconName={"IoMdLink"}
                      placeholder={"Partner Url"}
                      type={"text"}
                      name="link"
                      value={formData.link}
                      setValue={handleInputChange}
                      style={{ width: "716px" }}
                      event={true}
                    />
                  </div>
                </div>
                <div className="partner-flex">
                  <div className="col-lg-4">
                    <div className="partner-modal-file">
                      {updateData
                        ? "Update Partner Branding image"
                        : "Add Partner Branding image"}
                    </div>
                    <div className="partner-modal-btn-border">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <label className="partner-modal-icon-clr">
                          <CustomIcon name={"RiAttachment2"} />
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <div className="partner-modal-icon-text">
                            {selectedFile ? selectedFile.name : "Attach Image"}
                          </div>
                          {selectedFile && (
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
                  <div className="partner-intro">
                    <div className="partner-modal-file">Partner Intro Page</div>
                    <CustomToggleSwitch
                      isIntro={isIntro}
                      setIsIntroFunc={setIsIntroFunc}
                    />
                  </div>
                </div>
                {isIntro && (
                  <>
                    <div>
                      <textarea
                        className="textarea"
                        name="intro_description"
                        id="partnerintrodes"
                        placeholder="Description"
                        value={formData.intro_description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className="partner-flex gap">
                      <div>
                        {isState === 0 ? (
                          <div className="partner-modal-btn-border">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <label className="partner-modal-icon-clr">
                                <CustomIcon name={"RiAttachment2"} />
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={handleIntroFileChange}
                                />
                                <div className="partner-modal-icon-text">
                                  {introFile ? introFile.name : "Attach Image"}
                                </div>
                                {introFile && (
                                  <CustomIcon
                                    name={"TiDeleteOutline"}
                                    className="delete-icon"
                                    onClick={handleRemoveIntroFile}
                                  />
                                )}
                              </label>
                            </div>
                          </div>
                        ) : (
                          <CustomRewardInput
                            iconName={"IoMdLink"}
                            placeholder={"Video Url"}
                            type={"text"}
                            name="intro_video"
                            value={formData.intro_video}
                            setValue={handleInputChange}
                            style={{ width: "600px" }}
                            event={true}
                          />
                        )}
                      </div>
                      <div className="partner-switch">
                        <CustomSwitch
                          icons={[
                            <CustomIcon name={"LuImagePlus"} />,
                            <CustomIcon name={"LuPlaySquare"} />,
                          ]}
                          labels={["Image", "Video"]}
                          isState={isState}
                          setIsStateFunc={handleChangeState}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div>
                <div className="partner-bttn-fix">
                  <div>
                    {updateData ? (
                      <button className="partner-btn" onClick={updatePartner}>
                        Update Partner
                      </button>
                    ) : (
                      <button className="partner-btn" onClick={addPartner}>
                        Add Partner
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PartnerModal;
