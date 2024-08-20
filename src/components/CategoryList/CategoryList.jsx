import React, { useEffect, useState } from "react";
import "./CategoryList.css";
import CustomIcon from "../../components/CustomIcon";
import toast from "react-hot-toast";
import { endpoint } from "../../apis/endpoint";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import CustomAlert from "../CustomAlert/CustomAlert.jsx";
import CustomTableV2 from "../CustomTable/CustomTableV2.jsx";
import Pagination from "../Pagination/Pagination.jsx";

export default function CategoryList({
  categories,
  isLoading,
  setIsLoading,
  handleEditCategory,
  getCategories,
  searchInput,
  setFiltersApplied,
  tableRef,
  totalPages,
  currentPage,
  rowsPerPage,
  handlePageChange,
  clickFunctioArray,
  clickSortFunctionArray,
  clearAllFilters,
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [rows, setRows] = useState([]);

  const authToken = useSelector((state) => state.auth.authToken);

  const headers = ["Name", "Description", "Thanks Description", "Actions"];
  const filterTypes = ["text", "text", "text", ""];
  const textAlign = ["left", "left", "left", ""];

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint.CATEGORY_DELETE, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ _id: id }),
      });

      const data = await response.json();
      if (response.status === 200) {
        toast.success("Category deleted successfully");
        getCategories();
        window.location.reload(true);
      } else {
        toast.error("Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategoryButton = (id) => {
    handleEditCategory(id);
  };

  const openCustomAlert = (id) => {
    setShowAlert(true);
    setDeleteId(id);
  };

  useEffect(() => {
    if (categories.length > 0) {
      const rows = categories.map((category) => [
        category.name,
        category.description,
        category.thanksdescription,
        <div className="icons-options" key={category._id}>
          <div
            className="icon1"
            onClick={() => handleEditCategoryButton(category._id)}
          >
            <CustomIcon name="MdEdit" tag="Edit Category" />
          </div>
          <div className="icon3" onClick={() => {}}>
            <CustomIcon name="IoIosPlay" tag="Unpublish Category" />
          </div>
          <div
            className="icon2"
            onClick={() => openCustomAlert(category._id)}
          >
            <CustomIcon name="MdDelete" tag="Delete Category" />
          </div>
        </div>,
      ]);
      setRows(rows);
    }
  }, [categories]);

  return (
    <div className="ListCategory">
      <h1 className="h2-style">List of Categories</h1>
      <CustomTableV2
        ref={tableRef}
        headers={headers}
        rows={rows}
        searchInput={searchInput}
        setFiltersApplied={setFiltersApplied}
        filterTypes={filterTypes}
        textAlign={textAlign}
        clearFilters={clearAllFilters}
        clickFunctioArray={clickFunctioArray}
        clickSortFunctionArray={clickSortFunctionArray}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalPages / rowsPerPage)}
        onPageChange={handlePageChange}
      />
      {showAlert && (
        <CustomAlert
          show={showAlert}
          onClickFunction={() => handleDelete(deleteId)}
          onCancelFunction={() => setShowAlert(false)}
          message="Are you sure you want to delete this category?"
          type="delete"
        />
      )}
      {isLoading && (
        <Spinner show={isLoading} closeModal={() => setIsLoading(false)} />
      )}
    </div>
  );
}