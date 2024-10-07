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
import FieldsPopup from "./FieldsPopup"; // Import the new FieldsPopup component

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
  
  const [showFieldsPopup, setShowFieldsPopup] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);

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
        data: { Eid: userId }
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
      const result = await apiHandler({
        url: endpoint.PARTNER_STATUS,
        method: "PUT",
        authToken: authToken,
        data: { _id: id, status: status },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (result.status === 200) {
        handlePartner();
        toast.success(
          `Partner ${status === "Active" ? "Activated" : "Deactivated"} Successfully`
        );
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
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
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAlert = (id) => {
    setDeleteId(id);
    setShowAlert(true);
  };

  const OpenFieldsAsPopUp = (partner) => {
    setSelectedPartner(partner);
    setShowFieldsPopup(true);
  };

  useEffect(() => {
    handlePartner();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastPartner = currentPage * rowsPerPage;
  const indexOfFirstPartner = indexOfLastPartner - rowsPerPage;
  const currentPartners = partnerData.slice(indexOfFirstPartner, indexOfLastPartner);

  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-white">
        <Header
          title={"Partner"}
          icon={"FaPlus"}
          onClickFunc={() => setShowModal(true)}
        />
      </div>
      <div className="p-3">
        <div className="d-flex flex-wrap">
          {currentPartners.map((item, index) => (
            <div key={index} className="card-container">
              <div className="icons">
                {item.status === "Active" ? (
                  <div
                    className="icon yellow"
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePartnerStatus(item._id, "Deactive");
                    }}
                  >
                    <CustomIcon name="IoIosPause" tag="Deactivate Partner" />
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
              </div>
              <div
                className="cardbox"
                style={{ backgroundImage: `url("${item.image}")` }}
                onClick={() => OpenFieldsAsPopUp(item)}
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
      {isLoading && <Spinner show={isLoading} />}
      {showAlert && (
        <CustomAlert
          show={showAlert}
          onClickFunction={deletePartner}
          submit={() => {
            deletePartner(deleteId);
            setShowAlert(false);
          }}
          close={() => setShowAlert(false)}
          description="Are you sure you want to delete this Partner?"
          title="Delete"
        />
      )}
      <FieldsPopup
        isOpen={showFieldsPopup}
        toggle={() => setShowFieldsPopup(false)}
        fields={selectedPartner?.fields || {}}
        partnerName={selectedPartner?.name || ""}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Partners;
