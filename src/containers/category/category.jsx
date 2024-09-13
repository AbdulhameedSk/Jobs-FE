import  { useState, useEffect, useRef } from "react";
import Header from "../../components/Boilers/Header.jsx";
// import "../../containers/Category/Category.css";
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
  const [kind, setKind] = useState("");
  const [type, setType] = useState("");
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
  const [kinds, setKinds] = useState([]);
  const [selectedKind, setSelectedKind] = useState("");
  const getKind = async (kind) => {
    try {
      const response = await apiHandler({
        url: `${endpoint.BASE_URL_STAGING}${endpoint.CATEGORY_ENTERPRISE}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          kind: kind,
        },
      });
  
      console.log(response.data);
      window.location.reload();
      return response.data;
    } catch (error) {
      console.error("Failed to fetch kind data:", error);
      throw error;
    }
  };  
  

  // Fetch categories when a kind is selected
  useEffect(() => {
    if (selectedKind) {
      getCategories(selectedKind);
    }
  }, [selectedKind]);
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
  const completedGST = async () => {
    const response = await fetch(`${endpoint.BASE_URL_STAGING}${endpoint.COMPLETE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        CurrentUser: userId,
      }),
    });
  
    const data = await response.json();
    console.log(data);
    
    return data;
  };

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
  const handleKindInputChange = (e) => {
    console.log("Selected Kind:", e.target.value);
    setSelectedKind(e.target.value);
    getCategories(e.target.value);
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
    formData.append("kind", selectedKind);
    formData.append("description", categoryDescription);
    formData.append("thanksdescription", categoryCompletedTask);
    formData.append("add_request_enterprise", "pending");
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

  const getCategories = async (kind = 1, clear) => {
    if (isEditCategory) {
      return;
    }
    if (searchInput?.length === 0) {
      setIsLoading(true);
    }
    try {
      const response = await apiHandler({
        url: endpoint.CATEGORY_ENTERPRISE,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          type: kind,
          limit: rowsPerPage,
          searchTerm: searchInput,
          by: userId,
          kind: selectedKind,
          nameFilter: !clear && isNameFilter ? nameFilter : null,
          descFilter: !clear && isDescFilter ? descFilter : null,
          thanksdescFilter: !clear && isThanksDescFilter ? thanksDescFilter : null,
        },
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
    } catch (error) {
      toast.error("Failed to fetch Categories");
    } finally {
      setIsLoading(false);
    }
  };
const getCategoryByID = async (id) => {
    setIsLoading(true);
    try {
        const response = await apiHandler({
            url: endpoint.CATEGORY_BY_ID,
            method: "POST",
            data: {
                id: id,
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            }
        });
        if (response.status === 200) {
            toast.success("Category Fetched Successfully");
            setCategory(response.data.data.category);
        } else {
            toast.error("Failed to fetch Category");
        }
    } catch (error) {
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

  const [isGSTCompleted, setIsGSTCompleted] = useState(null);

  useEffect(() => {
    const fetchGSTStatus = async () => {
      const result = await completedGST();
      setIsGSTCompleted(result);

      if (!result) {
        toast.promise(
          {
            loading: "Looks like you haven't completed your GST details. Please complete it to proceed.",
            success: <b>Settings saved!</b>,
            error: <b>Could not save.</b>,
          }
        );
      }
    };

    fetchGSTStatus();
  }, []);


if(!isGSTCompleted){
  return <div>Registration complete karna padega</div>
} return (
  <div>
    <Header
      title={"Category"}
      icon={true ? "FaPlus" : ""}
      className={isEditCategory ? "rotate-icon" : " "}
      onClickFunc={handleIsEditCategory}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      clearFilter={filterApplied}
      clearFilterFun={triggerClearFilter}
      onSearchInput={getCategories}
    />
 {!isEditCategory  && (   <div className="my-4 flex justify-end ">
  <div className="relative pr-10">
    <select
      id="kind"
      value={selectedKind}
      onChange={(e) => setSelectedKind(e.target.value)}
      className="mt-1 block w-40 p-2 border border-gray-300 rounded-lg bg-white shadow-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out"
    >
   
            <option value="Free to Public" className="text-gray-500">Free to public</option>
            <option value="For Employees" className="text-gray-500">For Employees</option>
            <option value="Paid Courses" className="text-gray-500">Paid Courses</option>

    </select>
  </div>
</div>)}
    {isEditCategory ? (
           <>
        <div className="max-w-3xl mx-auto p-2 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            {category ? "Edit Category" : "Add Category"}
          </h1>
          
      
          <div className="mb-2">
            <input
              type="text"
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={handleNameInputChange}
              className="w-full px-1 py-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div className="mb-2">
  <select
    value={selectedKind}
    onChange={handleKindInputChange}
    className="w-full px-1 py-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
  >
    <option value="">Select Category Type</option>
    <option value="Free to Public">Free to Public</option>
    <option value="For Employees">For Employees</option>
    <option value="Paid Courses">Paid Courses</option>
  </select>
</div>

          <div className="mb-2">
            <textarea
              type="text"
              placeholder="Enter Category Description"
              value={categoryDescription}
              onChange={handleDescriptionInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            ></textarea>
          </div>
      
          <div className="flex flex-wrap gap-2 mb-4">
  <div className="w-1/2 border border-dashed border-gray-400 rounded-md p-2 text-center ">
    <label className="cursor-pointer">
      <CustomIcon name={"RiAttachment2"} />
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleCategoryFileChange1}
      />
      <div className="mt-1 text-sm text-gray-600">
        {categoryFile1
          ? categoryFile1.name
            ? categoryFile1.name
            : "welcome_image.jpg"
          : "Upload Category Welcome Image"}
      </div>
      {categoryFile1 && (
        <CustomIcon
          name={"TiDeleteOutline"}
          className="text-red-500 mt-1 cursor-pointer"
          onClick={handleRemoveCategoryFile1}
        />
      )}
    </label>
  </div>
  <div className="w-1/2 border border-dashed border-gray-400 rounded-md p-2 text-center">
    <label className="cursor-pointer">
      <CustomIcon name={"RiAttachment2"} />
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleCategoryFileChange2}
      />
      <div className="mt-1 text-sm text-gray-600">
        {categoryFile2
          ? categoryFile2.name
            ? categoryFile2.name
            : "category_image.jpg"
          : "Upload Image For Category"}
      </div>
      {categoryFile2 && (
        <CustomIcon
          name={"TiDeleteOutline"}
          className="text-red-500 mt-1 cursor-pointer"
          onClick={handleRemoveCategoryFile2}
        />
      )}
    </label>
  </div>
</div>

          <div className="mb-2">
            <textarea
              type="text"
              placeholder="Enter Category Completed Thanks Message"
              value={categoryCompletedTask}
              onChange={handleCompletedTaskInputChange}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            ></textarea>
          </div>
      
          <div className="w-full border border-dashed border-gray-400 rounded-md p-2 text-center mb-4">
            <label className="cursor-pointer">
              <CustomIcon name={"RiAttachment2"} />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleCompletedTaskFileChange}
              />
              <div className="mt-1 text-sm text-gray-600">
                {categoryCompletedTaskFile
                  ? categoryCompletedTaskFile.name
                    ? categoryCompletedTaskFile.name
                    : "thanks_image.jpg"
                  : "Upload Image For Completed Task"}
              </div>
              {categoryCompletedTaskFile && (
                <CustomIcon
                  name={"TiDeleteOutline"}
                  className="text-red-500 mt-1 cursor-pointer"
                  onClick={handleRemoveCompletedTaskFile}
                />
              )}
            </label>
          </div>
      
          <button
            disabled={isLoading}
            onClick={
              category
                ? () => handleSaveCategory({ isEdit: true })
                : handleSaveCategory
            }
            className={`w-full py-2 text-white font-bold rounded-md ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring focus:ring-blue-300`}
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