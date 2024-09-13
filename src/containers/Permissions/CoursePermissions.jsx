import React, { useState, useEffect } from "react";
import Header from "../../components/Boilers/Header";
import "../../containers/Jobs/Jobs.css";
import { useNavigate, useLocation } from "react-router-dom";
import { endpoint } from "../../apis/endpoint";
import { apiHandler } from "../../apis/index";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner/Spinner";
import { useSelector } from "react-redux";

const CoursePermissions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [checkboxes, setCheckboxes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const authToken = useSelector((state) => state.auth.authToken);
  const { id } = location.state || {};

  const fetchCategoriesAndPermissions = async () => {
    setIsLoading(true);
    try {
      // Fetch all categories
      const categoriesResponse = await apiHandler({
        url: endpoint.CATEGORY_EMPLOYEES,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Fetch user permissions
      const permissionsResponse = await apiHandler({
        url: `${endpoint.FETCH_COURSE_PERMISSIONS}/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (categoriesResponse.status === 200 && permissionsResponse.status === 200) {
        const categories = categoriesResponse.data.categories;
        const userPermissions = permissionsResponse.data.permissions;

        // Create checkbox data, ticking those in user permissions
        const checkboxData = categories.map((category) => ({
          id: category._id,
          name: category.name,
          allow: userPermissions.includes(category._id),
        }));

        setCheckboxes(checkboxData);
      } else {
        toast.error("Failed to fetch categories or permissions");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch necessary data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndPermissions();
  }, [id]); // Re-fetch if id changes

  const handleCheckboxChange = (index) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index].allow = !newCheckboxes[index].allow;
    setCheckboxes(newCheckboxes);
  };

  const handleSubmit = async () => {
    const updatedPermissions = checkboxes
      .filter(checkbox => checkbox.allow)
      .map(checkbox => checkbox.id);
    
    try {
      const response = await apiHandler({
        url: `${endpoint.UPDATE_COURSE_PERMISSIONS}/${id}`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        data: { permissions: updatedPermissions },
      });

      if (response.status === 200) {
        toast.success("Permissions updated successfully");
        // Optionally, you can update the local state to reflect the changes
        setCheckboxes(checkboxes.map(checkbox => ({
          ...checkbox,
          allow: updatedPermissions.includes(checkbox.id)
        })));
      } else {
        toast.error("Failed to update permissions");
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Failed to update permissions");
    }
  };
  
  return (
    <div>
      <Header title={"Course Permissions"} />
      <div className="min-h-screen bg-gray-100 pt-2">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-screen">
              <Spinner />
            </div>
          ) : (
            <>
              <ul className="space-y-2">
                {checkboxes.map((item, index) => (
                  <li key={item.id} className="flex items-center justify-between bg-white shadow-md p-3 rounded-lg">
                    <span className="text-lg text-gray-700 font-medium">{item.name}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={item.allow}
                          onChange={() => handleCheckboxChange(index)}
                          className="form-checkbox h-5 w-5 text-green-600"
                        />
                        <span className="text-lg text-gray-700">Allow</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center mt-6">
                <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out">
                  Update Course Permissions
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePermissions;