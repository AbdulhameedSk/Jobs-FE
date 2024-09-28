import React, { useEffect, useRef, useState } from "react";
import "../../components/CustomProfileEdit/CustomProfileEdit.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../ChangePassword/ChangePassword.jsx";
import { endpoint } from "../../apis/endpoint";
import { apiHandler } from "../../apis/index";
import { useSelector } from "react-redux";

const CustomProfileEdit = ({ setProFlage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const changePasswordRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleProFlage = () => {
    setProFlage(false);
  };
  const authToken = useSelector((state) => state.auth.authToken);
  const handleLogout = async () => {
    try {
      const response = await apiHandler({
        url: endpoint.SIGNOUTALL,
        method: 'POST',
        authToken,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        console.log("Successfully signed out from all sessions.");
        navigate("/login");
        handleProFlage();
      } else {
        console.error("Error logging out: ", response.data.message);
      }
    } catch (error) {
      console.error("An error occurred during logout: ", error);
    }
  };
  const handleClickOutside = (event) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target) &&
      changePasswordRef.current &&
      !changePasswordRef.current.contains(event.target)
    ) {
      handleProFlage();
      setIsOpen(false);
    }
  };

  const handleOpenChangePassword = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
const navBank = () => {
    navigate("/bank-details");
    handleProFlage();
  }
  
  return (
    <div
      ref={wrapperRef}
      className="position-absolute"
      style={{ right: 30, top: 60 }}
    >
      <div className="card" style={{ width: "12rem" }}>
        <div className="card-body">
          <div className="profile-edit-text" onClick={handleOpenChangePassword}>
            Change password
          </div>
          <div className="profile-edit-text" onClick={handleLogout}>
            Logout
          </div>
          <div className="profile-edit-text" onClick={navBank}>
            Bank Details
          </div>
        </div>
      </div>
      {isOpen && (
        <ChangePassword
          ref={changePasswordRef}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            handleProFlage();
          }}
        />
      )}
    </div>
  );
};

export default CustomProfileEdit;
