import React, { useEffect, useState, useRef } from "react";
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
import PostJobs from "./Postjobs";
import { fullDateAndTime } from "../../utils/Utils";

const Jobs = () => {
  const authToken = useSelector((state) => state.auth.authToken);
  const userId = useSelector((state) => state.user.userId);

  
  const [searchInput, setSearchInput] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteJobRole, setDeleteJob] = useState("");
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [columnsizes, setColumnsizes] = useState([]);
  const [textAlign, setTextAlign] = useState([]);
  const [filterTypes, setFilterTypes] = useState([]);
  const [applicantsPage, setApplicantsPage] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const tableRef = useRef();
  const [filterApplied, setFiltersApplied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  const handleIsPosting = () => {
    setIsPosting(!isPosting);
  };

  const handleApplicants = async (job) => {
    setIsLoading(true);
    try {
      const response = await apiHandler({
        method: "GET",
        url: endpoint.JOB_APPLICANTS + job._id,
        authToken: authToken,
        headers: { "Content-Type": "application/json" ,
          Authorization: `Bearer ${authToken}`,

        }
        ,
      });
      console.log(authToken);
      
      if (response.status === 200) {
        const applicants = response.data.data.job.applicants;
        setHeaders([
          "First Name",
          "Surname",
          "Username",
          "Phone",
          "Email",
          "Gender",
          "Age",
          "City",
          "State",
          "Country",
          "Profession",
          "Applied On",
          "Status",
          "Actions",
        ]);
        setFilterTypes([
          "text",
          "text",
          "text",
          "text",
          "text",
          "text",
          "range",
          "text",
          "text",
          "text",
          "text",
          "range",
          "text",
          "",
        ]);
        setTextAlign([
          "left",
          "left",
          "left",
          "center",
          "left",
          "left",
          "center",
          "left",
          "left",
          "left",
          "left",
          "center",
          "left",
          "",
        ]);
        setColumnsizes([
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
          "max-content",
        ]);
        const formattedApplicants = applicants.map((applicant) => {
          return [
            applicant.user?.firstName || "",
            applicant.user?.surName || "",
            applicant.user?.userName || "",
            applicant.user?.phone || "",
            applicant.user?.email || "",
            applicant.user?.gender || "",
            applicant.user?.age || "",
            applicant.user?.city || "",
            applicant.user?.state || "",
            applicant.user?.country || "",
            applicant.user?.profession || "",
            fullDateAndTime(applicant.applied_at),
            applicant.status || "",
            true && (
              <div className="icons-options">
                <div className="icon1" onClick={() => {}}>
                  <CustomIcon name="MdEdit" tag="Edit" />
                </div>
                <div className="icon2" onClick={() => {}}>
                  <CustomIcon name="MdDelete" tag="Delete" />
                </div>
              </div>
            ),
          ];
        });
        setRows(formattedApplicants);
        setTotalPages(Math.ceil(formattedApplicants.length / rowsPerPage));
        setApplicantsPage(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getJobs = async () => {
    setIsLoading(true);
    try {
      const response = await apiHandler({
        method: "POST",
        url: endpoint.ENTERPRISE_JOBS,
        authToken: authToken,
        data: { id: userId },
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,

         },
      });
      if (response.status === 200) {
        const jobs = response.data.data.jobs;
        setHeaders([
          "Role",
          "Industry",
          "City",
          "State",
          "Pincode",
          "Status",
          "Applications",
          "Pending",
          "Declined",
          "Shortlisted",
          "Accepted",
          "Actions",
        ]);
        setFilterTypes([
          "text",
          "text",
          "text",
          "text",
          "range",
          "text",
          "range",
          "range",
          "range",
          "range",
          "range",
          "",
        ]);
        setTextAlign([
          "left",
          "left",
          "center",
          "left",
          "left",
          "center",
          "center",
          "center",
          "center",
          "center",
          "center",
          "",
        ]);

        setColumnsizes([
          "200px",
          "200px",
          "100px",
          "100px",
          "100px",
          "100px",
          "100px",
          "100px",
          "100px",
          "100px",
          "100px",
          "max-content",
        ]);
        const formattedJobs = jobs.map((job, index) => {
          const pendingApplicants = job.applicants.filter(
            (applicant) => applicant.status === "pending"
          );
          const declinedApplicants = job.applicants.filter(
            (applicant) => applicant.status === "declined"
          );
          const shortlistedJobs = job.applicants.filter(
            (applicant) => applicant.status === "shortlisted"
          );
          const acceptedJobs = job.applicants.filter(
            (applicant) => applicant.status === "accepted"
          );

          return [
            job.role,
            job.industry,
            job.city,
            job.state,
            job.pincode,
            job.status,
            job.applicants.length,
            pendingApplicants.length, // Count of pending applicants
            declinedApplicants.length,
            shortlistedJobs.length,
            acceptedJobs.length,
            true && (
              <div className="icons-options">
                <div className="icon4">
                  <CustomIcon
                    name="MdContentCopy"
                    tag="Clone Job"
                    onClick={() => {
                      handleCloneJob(job);
                    }}
                  />
                </div>
                <div className="icon1">
                  <CustomIcon
                    name="MdEdit"
                    tag="Edit Job"
                    onClick={() => {
                      handleEditJob(job);
                    }}
                  />
                </div>
                <div className="icon2">
                  <CustomIcon
                    name="MdDelete"
                    tag="Delete Job"
                    onClick={() => {
                      setShowAlert(true);
                      setDeleteId(job._id);
                      setDeleteJob(job.role);
                    }}
                  />
                </div>
                <div
                  className="icon3"
                  onClick={() => {
                    handleApplicants(job);
                  }}
                >
                  <CustomIcon name="TbUsers" tag="Applicants" />
                </div>
              </div>
            ),
          ];
        });
        setRows(formattedJobs);
        setTotalPages(Math.ceil(formattedJobs.length / rowsPerPage)); // Calculate total pages (20 entries per page)
        setIsLoading(false);
        setApplicantsPage(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
 

  const deleteJob = async (jobId) => {
    setIsLoading(true);
    try {
      const response = await apiHandler({
        method: "DELETE",
        url: endpoint.JOB_DELETE,
        data: { _id: jobId },
        authToken: authToken,
        headers: { "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,

         },
      });
      if (response.status === 200) {
        getJobs();
        toast.success("Job deleted successfully");
      } else {
        setIsLoading(false);
        toast.error("Failed to delete job");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error("Failed to delete job");
    }
  };

  const postJob = async (data, jobId = null) => {
    setIsLoading(true);
    try {
      const response = await apiHandler({
        method: jobId ? "PUT" : "POST",
        url: jobId ? endpoint.UPDATE_JOB : endpoint.POST_JOB,
        data: jobId ? { ...data, _id: jobId } : data,
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,

        },
      });
      if (response.status === 200) {
        getJobs();
        toast.success(`Job ${jobId ? "updated" : "created"} successfully`);
      } else {
        setIsLoading(false);
        toast.error(`Failed to ${jobId ? "update" : "create"} job`);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(`Failed to ${jobId ? "update" : "create"} job`);
    }
  };

  const handleCloneJob = (job) => {
    const clonedJob = { ...job };
    delete clonedJob._id;
    delete clonedJob.applicants;
    delete clonedJob.createdAt;
    delete clonedJob.updatedAt;
    postJob(clonedJob);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setIsPosting(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const triggerDownload = () => {
    const escapeCsvValue = (value) => {
      if (typeof value === "string" && value.includes(",")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.map(escapeCsvValue).join(",") +
      "\n" +
      rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Remove the link after downloading
  };

  const triggerClearFilter = () => {
    if (tableRef.current) {
      tableRef.current.clearAllFilters();
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    if (true) {
      getJobs();
    }
  }, []);

  return (
    <div>
      <Header
        title={applicantsPage ? "Job Applicants" : "Jobs"}
        icon={"FaPlus"}
        className={isPosting ? "rotate-icon" : " "}
        onClickFunc={handleIsPosting}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        downloadCsv={true}
        downloadCsvFun={triggerDownload}
        clearFilter={filterApplied}
        clearFilterFun={triggerClearFilter}
        handleIsPosting={handleIsPosting}
      />

      {isLoading && (
        <Spinner show={isLoading} closeModal={() => setIsLoading(false)} />
      )}
      {isPosting ? (
        <PostJobs
          onClose={handleIsPosting}
          onSubmit={postJob}
          job={selectedJob}
        />
      ) : (
        <>
          <div className="">
            <div className="">
              <h1 className="">
                {applicantsPage ? (
                  <span>
                    <CustomIcon
                      name="IoChevronBackCircleOutline"
                      onClick={() => getJobs()}
                    />
                  </span>
                ) : null}
                {applicantsPage ? "List of Applicants" : "List of Jobs"}
              </h1>

              <CustomTable
                ref={tableRef}
                headers={headers}
                rows={paginatedRows} // Use paginated rows
                searchInput={searchInput}
                setFiltersApplied={setFiltersApplied}
                columnsizes={columnsizes}
                filterTypes={filterTypes}
                textAlign={textAlign}
              />
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {showAlert && (
        <CustomAlert
          show={showAlert}
          title={`Delete ${deleteJobRole} Job`}
          description="Are you sure you want to delete this job?"
          close={() => setShowAlert(false)}
          submit={() => {
            deleteJob(deleteId);
            setShowAlert(false);
          }}
        />
      )}
    </div>
  );
};

export default Jobs;