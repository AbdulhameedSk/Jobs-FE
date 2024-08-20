import  { useState, useEffect, useRef } from "react";
import Header from "../../components/Boilers/Header.jsx";
import "../../containers/Category/Category.css";
import CustomIcon from "../../components/CustomIcon";
import { endpoint } from "../../apis/endpoint";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import CategoryList from "../../components/CategoryList/CategoryList.jsx";
import Spinner from "../../components/Spinner/Spinner";
import CustomFilterModal from "../../components/CustomFilterModal/CustomFilterModal.jsx";
import { apiHandler } from "../../apis/index.js";

const Category = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditCategory, setIsEditCategory] = useState(false);
  const authToken = useSelector((state) => state.auth.authToken);
  const [searchInput, setSearchInput] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryFile1, setCategoryFile1] = useState(null);
  const [categoryFile2, setCategoryFile2] = useState(null);
  const [categoryCompletedTask, setCategoryCompletedTask] = useState("");
  const [categoryCompletedTaskFile, setCategoryCompletedTaskFile] =
    useState(null);
  const [category, setCategory] = useState(null);
  const tableRef = useRef();
  const [filterApplied, setFiltersApplied] = useState(false);

  const userId = useSelector((state) => state.user.userId);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // filterModal
  const [filterModal, setFilterModal] = useState(false);
  const [filterType, setFilterType] = useState("range");
  const [filterInput, setFilterInput] = useState("");
  const [filterText, setFilterText] = useState("");

  // nameFilter
  const [nameFilter, setNameFilter] = useState([null, 0]);
  const [filterName, setFilterName] = useState("");
  const [isNameFilter, setIsNameFilter] = useState(false);

  // descFilter
  const [descFilter, setDescFilter] = useState([null, 0]);
  const [filterDesc, setFilterDesc] = useState("");
  const [isDescFilter, setIsDescFilter] = useState(false);

  // thanksdescFilter
  const [thanksDescFilter, setThanksDescFilter] = useState([null, 0]);
  const [filterThanksDesc, setFilterThanksDesc] = useState("");
  const [isThanksDescFilter, setIsThanksDescFilter] = useState(false);

  const clickFunctioArray = [
    () => {
      setFilterType("text");
      setFilterText("Name");
      setFilterModal(true);
    },
    () => {
      setFilterType("text");
      setFilterText("Description");
      setFilterModal(true);
    },
    () => {
      setFilterType("text");
      setFilterText("Thanks Description");
      setFilterModal(true);
    },
    null,
  ];
  const clickSortFunctionArray = [
    [
      () => {
        setIsNameFilter(true);
        if (nameFilter[1] === 0) {
          setNameFilter([filterName, 1]);
        } else {
          setNameFilter([filterName, nameFilter[1] * -1]);
        }
      },
      nameFilter[1] === 1 ? "asc" : "desc",
    ],
    [
      () => {
        setIsDescFilter(true);
        if (descFilter[1] === 0) {
          setDescFilter([filterDesc, 1]);
        } else {
          setDescFilter([filterDesc, descFilter[1] * -1]);
        }
      },
      descFilter[1] === 1 ? "asc" : "desc",
    ],
    [
      () => {
        setIsThanksDescFilter(true);
        if (thanksDescFilter[1] === 0) {
          setThanksDescFilter([filterThanksDesc, 1]);
        } else {
          setThanksDescFilter([filterThanksDesc, thanksDescFilter[1] * -1]);
        }
      },
      thanksDescFilter[1] === 1 ? "asc" : "desc",
    ],
    null,
  ];

  

  const handleCategoryFileChange1 = (e) => {
    const file = e.target.files[0];
    setCategoryFile1(file);
  };

  const handleCategoryFileChange2 = (e) => {
    const file = e.target.files[0];
    setCategoryFile2(file);
  };

  const handleRemoveCategoryFile1 = (e) => {
    e.preventDefault();
    setCategoryFile1(null);
  };

  const handleRemoveCategoryFile2 = (e) => {
    e.preventDefault();
    setCategoryFile2(null);
  };

  const handleCompletedTaskFileChange = (e) => {
    const file = e.target.files[0];
    setCategoryCompletedTaskFile(file);
  };

  const handleRemoveCompletedTaskFile = (e) => {
    e.preventDefault();
    setCategoryCompletedTaskFile(null);
  };

  const handleNameInputChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleDescriptionInputChange = (event) => {
    setCategoryDescription(event.target.value);
  };

  const handleCompletedTaskInputChange = (event) => {
    setCategoryCompletedTask(event.target.value);
  };

  const handleSaveCategory = async ({ isEdit = false }) => {
    setIsLoading(true); // Set isLoading to true before the API call
    const formData = new FormData();
    if (isEdit) {
      formData.append("edit", category._id);
    }
    if (categoryFile1) formData.append("image", categoryFile1);
    if (categoryFile2) formData.append("descriptionimg", categoryFile2);
    if (categoryCompletedTaskFile)
      formData.append("thanksimg", categoryCompletedTaskFile);
    formData.append("name", categoryName);
    formData.append("description", categoryDescription);
    formData.append("thanksdescription", categoryCompletedTask);
    setIsLoaded(true);
    try {
      const response = await apiHandler({
        url: endpoint.CATEGORY_SAVE,
        method: "POST",
        data: formData,
        authToken: authToken,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        if (isEdit) {
          toast.success("Category updated successfully");
          setIsEditCategory(false);
          getCategories("edit");
        } else {
          toast.success("Category uploaded successfully");
          setIsEditCategory(false);
          getCategories("save");
        }
      } else {
        toast.error("Failed to upload category");
      }
    } catch {
      toast.error("Failed to upload category");
    } finally {
      setIsLoading(false); // Set isLoading back to false after the API call
    }
  };

  const handleIsEditCategory = () => {
    setCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setCategoryCompletedTask("");
    setCategoryFile1(null);
    setCategoryFile2(null);
    setCategoryCompletedTaskFile(null);
    setIsEditCategory(!isEditCategory);
  };

  const handleEditCategory = async (id) => {
    setIsEditCategory(true);
    getCategoryByID(id);
  };

  const getCategories = async (page = 1, clear) => {
    const token = localStorage.getItem("token");
    if (isEditCategory) {
      return;
    }
    if (searchInput?.length == 0) {
      setIsLoading(true);
    }
    try {
      const response = await apiHandler({
        url: endpoint.CATEGORY,
        method: "POST",
        authToken: authToken,
        data: {
          page: page,
          limit: rowsPerPage,
          searchTerm: searchInput,
          nameFilter: !clear && isNameFilter ? nameFilter : null,
          descFilter: !clear && isDescFilter ? descFilter : null,
          thanksdescFilter:
            !clear && isThanksDescFilter ? thanksDescFilter : null,
        },
        "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
      });
      if (response.status === 200) {
        setCategories(response.data.data.category);
        if (filterModal) {
          setFilterModal(false);
        }
        setTotalPages(response.data.data.count);
      } else {
        toast.error("Failed to fetch Categories");
      }
    } catch {
      toast.error("Failed to fetch Categories");
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryByID = async (id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await apiHandler({
        url: endpoint.CATEGORY_BY_ID,
        method: "POST",
        data: {
          id: id,
        },
        authToken: authToken,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        toast.success("Category Fetched Successfully");
        setCategory(response.data.data.category);
      } else {
        toast.error("Failed to fetch Category");
      }
    } catch {
      toast.error("Failed to fetch Category");
    } finally {
      setIsLoading(false);
    }
  };

  const setAllElements = async () => {
    if (category) {
      setCategoryName(category.name);
      setCategoryDescription(category.description);
      setCategoryCompletedTask(category.thanksdescription);
      setCategoryFile1(category.image);
      setCategoryFile2(category.descriptionimg);
      setCategoryCompletedTaskFile(category.thanksimg);
    }
  };

  const triggerClearFilter = () => {
    if (tableRef.current) {
      tableRef.current.clearAllFilters();
    }
  };

  const clearAllFilters = () => {
    setIsNameFilter(false);
    setIsDescFilter(false);
    setIsThanksDescFilter(false);

    setFiltersApplied(false);
    setFilterInput("");

    setFilterName("");
    setFilterDesc("");
    setFilterThanksDesc("");

    setNameFilter([null, 0]);
    setDescFilter([null, 0]);
    setThanksDescFilter([null, 0]);

    getCategories(1, true);
  };

  useEffect(() => {
    if (isNameFilter || isDescFilter || isThanksDescFilter) {
      setFiltersApplied(true);
      getCategories();
    }
  }, [nameFilter, descFilter, thanksDescFilter]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getCategories(pageNumber);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    setAllElements();
  }, [category]);

  // nameFilter
  useEffect(() => {
    if (nameFilter[1] !== 0 && !filterModal) {
      getCategories();
    }
  }, [nameFilter]);

  useEffect(() => {
    setNameFilter([filterName, nameFilter[1]]);
  }, [filterName]);

  // descFilter
  useEffect(() => {
    if (descFilter[1] !== 0 && !filterModal) {
      getCategories();
    }
  }, [descFilter]);

  useEffect(() => {
    setDescFilter([filterDesc, descFilter[1]]);
  }, [filterDesc]);

  // thanksDescFilter
  useEffect(() => {
    if (thanksDescFilter[1] !== 0 && !filterModal) {
      getCategories();
    }
  }, [thanksDescFilter]);

  useEffect(() => {
    setThanksDescFilter([filterThanksDesc, thanksDescFilter[1]]);
  }, [filterThanksDesc]);

  useEffect(() => {
    if (isNameFilter || isDescFilter || isThanksDescFilter) {
      setFiltersApplied(true);
      getCategories();
    }
  }, [isNameFilter, isDescFilter, isThanksDescFilter]);

  return (
    <div>
      <Header
        title={"Category"}
        icon={"FaPlus" }
        className={isEditCategory ? "rotate-icon" : " "}
        onClickFunc={handleIsEditCategory}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        clearFilter={filterApplied}
        clearFilterFun={triggerClearFilter}
        onSearchInput={getCategories}
      />
      {isEditCategory ? (
        <>
          <div className="category-container">
            <h1 className="h2-style">
              {category ? "Edit Category" : "Add Category"}
            </h1>
            <div className="category-name">
              <input
                type="text"
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={handleNameInputChange}
              />
            </div>
            <div className="category-description">
              <textarea
                type="text"
                placeholder="Enter Category Description"
                value={categoryDescription}
                onChange={handleDescriptionInputChange}
              ></textarea>
            </div>
            <div className="category-flex">
              <div className="partner-modal-btn-border category-button">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <label className="partner-modal-icon-clr">
                    <CustomIcon name={"RiAttachment2"} />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleCategoryFileChange1}
                    />
                    <div className="partner-modal-icon-text">
                      {categoryFile1
                        ? categoryFile1.name
                          ? categoryFile1.name
                          : "welcome_image.jpg"
                        : "Upload Category Welcome Image"}
                    </div>
                    {categoryFile1 && (
                      <CustomIcon
                        name={"TiDeleteOutline"}
                        className="delete-icon"
                        onClick={handleRemoveCategoryFile1}
                      />
                    )}
                  </label>
                </div>
              </div>
              <div className="partner-modal-btn-border category-button">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <label className="partner-modal-icon-clr">
                    <CustomIcon name={"RiAttachment2"} />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleCategoryFileChange2}
                    />
                    <div className="partner-modal-icon-text">
                      {categoryFile2
                        ? categoryFile2.name
                          ? categoryFile2.name
                          : "category_image.jpg"
                        : "Upload Image For Category"}
                    </div>
                    {categoryFile2 && (
                      <CustomIcon
                        name={"TiDeleteOutline"}
                        className="delete-icon"
                        onClick={handleRemoveCategoryFile2}
                      />
                    )}
                  </label>
                </div>
              </div>
            </div>
            <div className="category-Completedtask">
              <textarea
                type="text"
                placeholder="Enter Category Completed Thanks Message"
                value={categoryCompletedTask}
                onChange={handleCompletedTaskInputChange}
              ></textarea>
            </div>
            <div className="partner-modal-btn-border category-button category-completed-task-upload">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <label className="partner-modal-icon-clr">
                  <CustomIcon name={"RiAttachment2"} />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleCompletedTaskFileChange}
                  />
                  <div className="partner-modal-icon-text">
                    {categoryCompletedTaskFile
                      ? categoryCompletedTaskFile.name
                        ? categoryCompletedTaskFile.name
                        : "thanks_image.jpg"
                      : "Upload Image For Completed Task"}
                  </div>
                  {categoryCompletedTaskFile && (
                    <CustomIcon
                      name={"TiDeleteOutline"}
                      className="delete-icon"
                      onClick={handleRemoveCompletedTaskFile}
                    />
                  )}
                </label>
              </div>
            </div>
            <button
              disabled={isLoading}
              onClick={
                category
                  ? () => handleSaveCategory({ isEdit: true })
                  : handleSaveCategory
              }
              className="save-category-button"
            >
              {isLoading
                ? "Loading..."
                : category
                ? "Update Category"
                : "Save Category"}
            </button>
          </div>
        </>
      ) : (
        <>
          <CategoryList
            tableRef={tableRef}
            categories={categories}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleEditCategory={handleEditCategory}
            getCategories={getCategories}
            searchInput={searchInput}
            setFiltersApplied={setFiltersApplied}
            totalPages={totalPages}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            handlePageChange={handlePageChange}
            clickFunctioArray={clickFunctioArray}
            clickSortFunctionArray={clickSortFunctionArray}
            clearAllFilters={clearAllFilters}
          />
          {filterModal && filterType === "text" && (
            <CustomFilterModal
              onClose={() => setFilterModal(false)}
              filterText={filterText}
              filterInput={
                filterText === "Name"
                  ? filterName
                  : filterText === "Description"
                  ? filterDesc
                  : filterText === "Thanks Description"
                  ? filterThanksDesc
                  : filterName
              }
              setFilterInput={
                filterText === "Name"
                  ? setFilterName
                  : filterText === "Description"
                  ? setFilterDesc
                  : filterText === "Thanks Description"
                  ? setFilterThanksDesc
                  : setFilterName
              }
              handleFilter={() => {
                if (filterText === "Name") {
                  setIsNameFilter(true);
                } else if (filterText === "Description") {
                  setIsDescFilter(true);
                } else if (filterText === "Thanks Description") {
                  setIsThanksDescFilter(true);
                } else {
                  setIsNameFilter(true);
                }
              }}
              type={filterType}
            />
          )}
        </>
      )}
      {isLoading && (
        <Spinner show={isLoading} closeModal={() => setIsLoading(false)} />
      )}
    </div>
  );
};

export default Category;
