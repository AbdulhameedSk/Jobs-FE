import React, { useState, useEffect } from "react";
import Header from "../../components/Boilers/Header";
import "../../containers/Jobs/Jobs.css";
import { useNavigate, useLocation } from "react-router-dom";
import { endpoint } from "../../apis/endpoint";
import { apiHandler } from "../../apis/index";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner/Spinner";
import { PiHandTapFill } from "react-icons/pi"; // Added missing icon import
import { useSelector } from "react-redux";
const CoursePermissions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [checkboxes, setCheckboxes] = useState([]); // State to store checkbox data
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  const authToken = useSelector((state) => state.auth.authToken);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const response = await apiHandler({
        url: endpoint.CATEGORY_EMPLOYEES,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        const categories = response.data.data.category;
        // Set categories in the checkboxes state
        const checkboxData = categories.map((category) => ({
          id: category._id,
          name: category.name,
          allow: category.allow, // Assuming `allow` is a boolean or an object with `read` and `write`
        }));
        setCheckboxes(checkboxData); // Update checkboxes state

        setCategories(categories); // Set categories as needed
      } else {
        toast.error("Failed to fetch Categories");
      }
    } catch (error) {
      toast.error("Failed to fetch Categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const { id } = location.state || {};
 
  const handleCheckboxChange = (index) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index].allow = !newCheckboxes[index].allow; // Toggle the `allow` state
    setCheckboxes(newCheckboxes);
  };

  const handleSubmit = async () => {
    alert("Submitted");
  };
  
  return (
    <div>
      <Header title={"Create Sub-Admin"} />
      <div className="min-h-screen bg-gray-100 pt-2">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-screen">
              <Spinner /> {/* Display a spinner while loading */}
            </div>
          ) : (
            <>
              <ul className="space-y-2">
                {checkboxes.map((item, index) => (
                  <li key={index} className="flex items-center justify-between bg-white shadow-md p-3 rounded-lg">
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
                  Submit Course Permissions
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
