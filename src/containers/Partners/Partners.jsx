import React, { useEffect, useState } from "react";
import Header from "../../components/Boilers/Header";
import "../../containers/Partners/Partners.css";
import PartnerModal from "../../containers/Partners/PartnerModal.jsx";
import { endpoint } from "../../apis/endpoint.js";
import { apiHandler } from "../../apis/index";
import Spinner from "../../components/Spinner/Spinner.jsx";
import CustomIcon from "../../components/CustomIcon.jsx";
import toast from "react-hot-toast";
import CustomAlert from "../../components/CustomAlert/CustomAlert.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { useSelector } from "react-redux";

const Partners = () => {
  const [partnerData, setPartnerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const userId = useSelector((state) => state.user.userId);
  const authToken = useSelector((state) => state.auth.authToken);
  const handlePartner = async () => {
    setIsLoading(true);
    try {
      const result = await apiHandler({
        url: endpoint.ENTERPRISE_PARTNERS,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        authToken: authToken,
        data: { Eid: userId }  // Correctly send the Eid
      });
  
      if (result && result.data && Array.isArray(result.data.partnerList)) {
        setPartnerData(result.data.partnerList);
        setTotalPages(Math.ceil(result.data.partnerList.length / rowsPerPage));
      } else {
        console.error("Invalid response format:", result);
        toast.error("Failed to fetch partners: Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch partners:", err);
      toast.error(`Failed to fetch partners: ${err.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePartnerStatus = async (id, status) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const result = await apiHandler({
        url: endpoint.PARTNER_STATUS,
        method: "PUT",
        authToken: authToken,
        data: { _id: id, status: status },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 200) {
        handlePartner();
        toast.success(
          `Partner ${
            status === "Active" ? "Activated" : "Deactivated"
          } Successfully`
        );
      } else {
        toast.error("Something went wrong");
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  const deletePartner = async () => {
    setIsLoading(true);
    try {
      const result = await apiHandler({
        url: endpoint.PARTNER_DELETE,
        method: "DELETE",
        authToken: authToken,
        data: { _id: deleteId },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result.status === 200) {
        handlePartner();
        toast.success("Partner Deleted Successfully");
      } else {
        toast.error("Something went wrong");
        setIsLoading(false);
      }
    } catch (err) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  const handleShowAlert = (id) => {
    setDeleteId(id);
    setShowAlert(true);
  };

  const jumpTo = (link) => {
    window.open(link, "_blank", "noreferrer");
  };

  useEffect(() => {
    handlePartner();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastPartner = currentPage * rowsPerPage;
  const indexOfFirstPartner = indexOfLastPartner - rowsPerPage;
  const currentPartners = partnerData.slice(
    indexOfFirstPartner,
    indexOfLastPartner
  );

  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-white">
      <Header
        title={"Partner"}
        icon={  "FaPlus" }
        onClickFunc={
          true ? () => setShowModal(true) : null
        }
      />
      </div>
      <div className="p-3">
        <div className="d-flex flex-wrap">
          {currentPartners.map((item, index) => (
            <div
              key={index}
              className="card-container"
              onClick={() => jumpTo(item.link)}
            >
              <div className="icons">
                {true && (
                  <>
                    {item.status === "Active" ? (
                      <div
                        className="icon yellow"
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePartnerStatus(item._id, "Deactive");
                        }}
                      >
                        <CustomIcon
                          name="IoIosPause"
                          tag="Deactivate Partner"
                        />
                      </div>
                    ) : (
                      <div
                        className="icon green"
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePartnerStatus(item._id, "Active");
                        }}
                      >
                        <CustomIcon name="IoIosPlay" tag="Activate Partner" />
                      </div>
                    )}
                    <div
                      className="icon blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUpdateData(item);
                        setShowModal(true);
                      }}
                    >
                      <CustomIcon name="MdEdit" tag="Edit Partner" />
                    </div>
                    <div
                      className="icon red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowAlert(item._id);
                      }}
                    >
                      <CustomIcon name="MdDelete" tag="Delete Partner" />
                    </div>
                  </>
                )}
              </div>
              <div
                className="cardbox"
                style={{ backgroundImage: `url("${item.image}")` }}
              />
              <div className="cardtext">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <PartnerModal
          updateData={updateData}
          setIsLoading={setIsLoading}
          handlePartner={handlePartner}
          isOpen={showModal}
          onClose={() => {
            setUpdateData(null);
            setShowModal(false);
          }}
        />
      )}
      {isLoading && (
        <Spinner show={isLoading} closeModal={() => setIsLoading(false)} />
      )}
      {showAlert && (
        <CustomAlert
          show={showAlert}
          onClickFunction={deletePartner}
          onCancelFunction={() => setShowAlert(false)}
          message="Are you sure you want to delete this Partner?"
          type="delete"
        />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Partners;
