import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FaUserTie } from "react-icons/fa";
import Header from "../../components/Boilers/Header";
import CustomTableV2 from "../../components/CustomTable/CustomTableV2";
import { endpoint } from "../../apis/endpoint";
import { apiHandler } from "../../apis";

const Permissions = () => {
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.authToken);
  const tableRef = useRef();

  const [searchInput, setSearchInput] = useState("");
  const [filterApplied, setFiltersApplied] = useState(false);
  const [rows, setRows] = useState([]);

  const headers = [
    "Organization",
    "Email",
    "Address",
    "Industry",
    "Revenue",
    "GSTIN Number",
    "Completed GST",
    "Created At",
    "Actions",
  ];

  const filterTypes = Array(9).fill("none");
  const columnsizes = Array(9).fill("200px");
  const textAlign = [...Array(8).fill("left"), "center"];

  const givePermissions = (id) => {
    console.log("users of :", id);
    navigate('/usertable', { state: { id } });
  };

  const getEnterpriseAdmins = async () => {
    try {
      const response = await apiHandler({
        method: "GET",
        url: endpoint.ENTERPRISE_ADMINS,
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = response.data.users;
        const formattedRows = data.map((item) => [
          item.OrgName,
          item.email,
          item.Address,
          item.Industry,
          item.Revenue,
          item.gstinNumber,
          item.isGSTCompleted ? "Yes" : "No",
          item.createdAt,
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
    getEnterpriseAdmins();
  }, []);

  const handleEnterPriseAdminDetails = () => {
    // Implement search functionality if needed
  };

  return (
    <div className="flex flex-col">
      <Header
        title="Enterprise Admins"
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        clearFilter={filterApplied}
        onSearchInput={handleEnterPriseAdminDetails}
      />
      <div className="jobs users ">
        <div className="user-table">
          <CustomTableV2
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

export default Permissions;