import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FaUserTie } from "react-icons/fa";
import Header from "../../components/Boilers/Header";
import CustomTable from "../../components/CustomTable/CustomTable";
import { endpoint } from "../../apis/endpoint";
import { apiHandler } from "../../apis";

const UserTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authToken = useSelector((state) => state.auth.authToken);
  const tableRef = useRef();

  const [searchInput, setSearchInput] = useState("");
  const [filterApplied, setFiltersApplied] = useState(false);
  const [rows, setRows] = useState([]);
  const userId = useSelector(state => state.user.userId);

  const headers = [
    "_id",
    "userName",
    "firstName",
    "surName",
    "phone",
    "email",
    "gender",
    "city",
    "state",
    "status",
    "videoCategory",
    "onboardTimestamp",
    "lastLogin",
    "follower",
    "following",
    "uploadedVideo",
    "watchedvideos",
    "favourites",
    "profileImage",
    "Actions"
  ];

  const filterTypes = Array(headers.length).fill("none");
  const columnsizes = Array(headers.length).fill("200px");
  const textAlign = [...Array(headers.length - 1).fill("left"), "center"];

  const givePermissions = (id) => {
    console.log("Navigating with ID:", id);
    navigate('/spermissions', { state: { id } });
    
  };

  const getEnterpriseEmployees = async () => {
    try {
      const response = await apiHandler({
        method: "POST",
        url: endpoint.ENTERPRISE_EMPLOYEES,
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          Eid: userId
        }
      });

      if (response.status === 200) {
        const data = response.data.employees;
        const formattedRows = data.map((item) => [
          item._id,
          item.userName,
          item.firstName,
          item.surName,
          item.phone,
          item.email,
          item.gender,
          item.city,
          item.state,
          item.status, // Add status field
          item.videoCategory,
          item.onboardTimestamp,
          item.lastLogin,
          String(item.follower),
          String(item.following),
          String(item.uploadedVideo),
          String(item.watchedvideos),
          String(item.favourites),
          item.profileImage,
          <div>
            <FaUserTie onClick={() => givePermissions(item._id)} />
          </div>,
        ]);
        setRows(formattedRows);
      }
    } catch (error) {
      console.error("Error fetching enterprise admins:", error);
      toast.error("Failed to fetch enterprise admins");
    }
  };

  useEffect(() => {
    getEnterpriseEmployees();
  }, []);

  const handleEnterPriseAdminDetails = () => {
    // Implement this function as needed
    console.log("Handling enterprise admin details");
  };

  return (
     <div className="flex flex-col">
      <Header
        title="Enterprise Users"
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        clearFilter={filterApplied}
        onSearchInput={handleEnterPriseAdminDetails}
      />
      <div className="jobs users ">
        <div className="user-table">
          <CustomTable
            ref={tableRef}
            headers={headers}
            rows={rows}
            searchInput={searchInput}
            setFiltersApplied={setFiltersApplied}
            columnsizes={columnsizes}
            filterTypes={filterTypes}
            textAlign={textAlign}
          />
        </div>
      </div>
    </div>
  );
};
export default UserTable;





