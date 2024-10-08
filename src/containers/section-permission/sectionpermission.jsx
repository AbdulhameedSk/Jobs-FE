import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Checkbox, Button, message } from 'antd';
import Header from "../../components/Boilers/Header";
import { useNavigate, useLocation } from "react-router-dom";

import { apiHandler } from "../../apis/index";
import { endpoint } from "../../apis/endpoint";

const SectionPermission = () => {
  const location = useLocation();
  const authToken = useSelector((state) => state.auth.authToken);
  const [checkedValues, setCheckedValues] = useState([]);
  const [loading, setLoading] = useState(false);

  const onChange = (values) => {
    setCheckedValues(values);
    console.log('checked = ', values);
  };

  const { id } = location.state || {};

  const AddPermissions = async () => {
    setLoading(true);
    try {
      console.log("ID from location.state:", id);

      const response = await apiHandler({
        url: `${endpoint.SECTION_PERMISSIONS}/${id}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          permissions: checkedValues,
        },
      });
      console.log(response);
      message.success("Permissions updated successfully!");
    } catch (error) {
      console.error("Error updating permissions:", error);
      message.error("Failed to update permissions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const permissionOptions = [
    "Videos Feed",
    "Skill Yatra-Free",
    "Skill Yatra Enterprise",
    "Skill Yatra Paid",
    "Public Jobs - Applied Jobs",
    "Internal Jobs",
    "Rewards",
    "Partners"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center  ">
      <Header title="Section-Permissions" icon="" />
      <div className="bg-white shadow-lg rounded-lg p-8 m-8 w-full max-w-lg">
        <div className="mb-6">
          <Checkbox.Group
            style={{ width: '100%' }}
            onChange={onChange}
          >
            <div className="flex flex-col space-y-4">
              {permissionOptions.map((option) => (
                <Checkbox
                  key={option}
                  value={option}
                  className="text-lg"
                >
                  <span className="ml-2">{option}</span>
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>
        <div className="flex justify-center">
          <Button 
            type="primary" 
            onClick={AddPermissions} 
            loading={loading}
            disabled={checkedValues.length === 0}
            className="px-8"
          >
            Submit Permissions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SectionPermission;
