import React, { useState } from "react";
import CustomIcon from "../CustomIcon.jsx";
import { useSelector } from "react-redux";
import { Modal } from "reactstrap";
import CustomRewardInput from "../CustomRewardInput/CustomRewardInput";
import { endpoint } from "../../apis/endpoint.js";
import toast from "react-hot-toast";
import Spinner from "../Spinner/Spinner.jsx";

export default function ChangePassword({ onClose, isOpen }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (
      formData.oldPassword.length === 0 ||
      formData.newPassword.length === 0 ||
      formData.confirmPassword.length === 0
    ) {
      toast.error("Please fill all fields");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password should be same");
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(endpoint.UPDATE_ADMIN_PASSWORD, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPhone: formData.oldPassword,
          phone: formData.newPassword,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      
      if (response.status === 200) {
        toast.success("Password changed successfully");
        onClose();
      } else {
        toast.error(response.data.message);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <Modal backdrop={"static"} isOpen={isOpen} toggle={onClose} centered>
      <div className="view-video change-pwd modal-contents box-shadow">
        <div className="video-details">
          <div className="video-header">
            <div className="title">
              <h1 className="h2-style">Change Password</h1>
            </div>
          </div>
          <div className="change-pwd-body">
            <CustomRewardInput
              iconName="MdLockOutline"
              type="password"
              placeholder="Old Password"
              name="oldPassword"
              value={formData.oldPassword}
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="MdLockOutline"
              type="password"
              placeholder="New Password"
              name="newPassword"
              value={formData.newPassword}
              setValue={handleChange}
              event={true}
            />
            <CustomRewardInput
              iconName="MdLockOutline"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              setValue={handleChange}
              event={true}
            />
          </div>
          <div className="buttons">
            <button
              className="button red"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </button>
            <button
              className="button green"
              onClick={() => {
                handleSave();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      {isLoading && (
        <Spinner show={isLoading} closeModal={() => setIsLoading(false)} />
      )}
    </Modal>
  );
}
