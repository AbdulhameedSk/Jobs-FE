import React, { useState, useEffect } from "react";
import Header from "../../components/Boilers/Header";
import "../../containers/Jobs/Jobs.css";
import CustomTable from "../../components/CustomTable/CustomTable";
import Pagination from "../../components/Pagination/Pagination";
import { endpoint } from "../../apis/endpoint";
import { apiHandler } from "../../apis/index";
import { useSelector } from "react-redux";
import CustomIcon from "../../components/CustomIcon";
import Spinner from "../../components/Spinner/Spinner";
import toast from "react-hot-toast";
import CustomAlert from "../../components/CustomAlert/CustomAlert";
import { fullDateAndTime } from "../../utils/Utils";
import { PiHandTapFill } from "react-icons/pi"; // Added missing icon import
import { useNavigate } from "react-router-dom"; // Added missing navigate import

const Permissions = () => {
  const navigate = useNavigate(); // Correct use of navigate
  const givePermissions = (id) => {
    console.log("Give permissions to user with id:", id);
    navigate('/CoursePermissions', { state: { id } });
  };

  const [headers, setHeaders] = useState([]);
  const [filterTypes, setFilterTypes] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [textAlign, setTextAlign] = useState([]);
  const [columnSizes, setColumnSizes] = useState([]);
  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filterApplied, setFiltersApplied] = useState(false);
  const authToken = useSelector((state) => state.auth.authToken);

  const allUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiHandler({
        method: "GET",
        url: endpoint.ALL_EMPLOYEES,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        const users = response.data.employees || [];

        setHeaders([
          "First Name",
          "Surname",
          "Username",
          "Phone",
          "Email",
          "Permissions",
        ]);

        setFilterTypes(["text", "text", "text", "text", "text", ""]);
        setTextAlign(["left", "left", "left", "center", "left", "center"]);
        setColumnSizes([
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
        ]);

        if (users.length === 0) {
          setRows([]);
          setTotalPages(0);
        } else {
          const formattedUsers = users.map((user) => [
            user.firstName || "N/A",
            user.surName || "N/A",
            user.userName || "N/A",
            user.phone || "N/A",
            user.email || "N/A",
            <PiHandTapFill
              key={user._id}
              size={30}
              onClick={() => givePermissions(user._id)}
              style={{ cursor: "pointer" }}
            />,
          ]);
          setRows(formattedUsers);
          setTotalPages(Math.ceil(formattedUsers.length / rowsPerPage));
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
      toast.error("An error occurred while fetching users.");
    }
  };

  useEffect(() => {
    allUsers();
  }, []);

  const triggerClearFilter = () => {
    setFiltersApplied(false);
    setSearchInput("");
  };

  return (
    <div>
      <Header title={"Course Permissions"} />
      <div>
        {isLoading ? (
          <Spinner />
        ) : (
          <CustomTable
            headers={headers}
            rows={rows}
            filterTypes={filterTypes}
            textAlign={textAlign}
            columnSizes={columnSizes}
            searchInput={searchInput}
          />
        )}
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default Permissions;
