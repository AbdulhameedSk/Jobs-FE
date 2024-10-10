// src/components/DisplayForm.js
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { endpoint } from "../../apis/endpoint.js";
import { apiHandler } from "../../apis/index";
const DisplayForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams(); // Assuming partnerId is part of the route params
  const { partner: locationPartner } = location.state || {};
  const userId = useSelector((state) => state.user.userId);

  // Retrieve authToken from Redux store
  const authToken = useSelector((state) => state.auth.authToken);

  // State to hold partner data
  const [partner, setPartner] = useState(locationPartner || null);
  const [loading, setLoading] = useState(!locationPartner);
  const [error, setError] = useState(null);

  // Initialize formFields with partner's fields, adding an 'input' property
  const [formFields, setFormFields] = useState(
    locationPartner?.fields?.map(field => ({ 
      ...field, 
      input: field.value || '' // Initialize with existing value if any
    })) || []
  );

  // State to manage form submission status
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // If partner data is not available via location.state, fetch it using getFormData
    if (!locationPartner && params.partnerId) {
      const fetchFormData = async () => {
        try {
          setLoading(true);
          const { data } = await apiHandler({
            url: endpoint.GETFORMDATA,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            data: { partnerId: params.partnerId },
            authToken,
          });

          if (data.success) {
            setPartner({ fields: data.fields });
            setFormFields(
              data.fields.map(field => ({
                ...field,
                input: field.value || '',
              }))
            );
          } else {
            toast.error(data.msg || "Failed to retrieve form data");
            setError(data.msg || "Failed to retrieve form data");
          }
        } catch (err) {
          console.error("Error fetching form data:", err);
          const errorMessage = err.response?.data?.msg || "An error occurred while fetching form data";
          toast.error(errorMessage);
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchFormData();
    }
  }, [locationPartner, params.partnerId, authToken]);

  // Debugging line
  console.log("Received partner data:", partner); 

  // If loading, display a loading indicator
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  // If there was an error fetching partner data, display an error message
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-500">{error}</h1>
        <button 
          onClick={() => navigate('/partners')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Back to Partners
        </button>
      </div>
    );
  }

  // If no partner data is available, display a message and a button to navigate back
  if (!partner) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">No partner data available</h1>
        <button 
          onClick={() => navigate('/partners')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Back to Partners
        </button>
      </div>
    );
  }

  /**
   * Handles changes to the input fields.
   * @param {number} index - The index of the field being updated.
   * @param {string} value - The new value of the input field.
   */
  const handleInputChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].input = value;
    setFormFields(updatedFields);
  };

  /**
   * Validates the form fields before submission.
   * @returns {boolean} - Returns true if validation passes, else false.
   */
  const validateForm = () => {
    for (let field of formFields) {
      if (!field.input.trim()) {
        toast.error(`Please enter a value for "${field.label}"`);
        return false;
      }
      // Add more validation rules here if needed (e.g., email format)
    }
    return true;
  };

  /**
   * Handles form submission.
   * Utilizes the custom apiHandler for making API requests.
   * @param {object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      // Prepare the fields data by mapping over formFields
      const submittedFields = formFields.map(field => ({
        label: field.label,
        value: field.input,
        type: field.type, // Include field type if necessary
      }));

      // Prepare the payload with partnerId and the submitted fields
      const payload = {
        partnerId: params.partnerId || locationPartner._id, // Ensure partnerId is available
        fields: submittedFields,
        Eid: userId, // Assuming 'Eid' represents Enterprise ID
      };

      // Make the API call using apiHandler
      const { data } = await apiHandler({
        url: endpoint.SUBMITFORM,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: payload,
        authToken,
      });

      // Handle the response based on the success flag
      if (data.success) {
        toast.success("Form submitted successfully");
        navigate('/partners'); // Redirect to the partners page or perform other actions
      } else {
        toast.error(data.msg || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.msg || "An error occurred while submitting the form";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Debugging function to show current form data in console.
   */
  const showData = (id) => {
    navigate('/FData', { state: { id: id } });  };

  return (
    <div className="container mx-auto p-4">
      {/* Back to Partners Button */}
      <button 
        onClick={() => navigate('/partners')}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
      >
        Back to Partners
      </button>

      {/* Partner Name (Optional if available) */}
      {partner.name && (
        <h1 className="text-3xl font-bold mb-4">{partner.name}</h1>
      )}

      {/* Form for Dynamic Fields */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row">
          {/* Dynamic Fields Section */}
          <div className="flex-1 md:mr-4">
            <div className="grid grid-cols-1 gap-4">
              {formFields.map((field, index) => (
                <div key={index} className="border p-4 rounded shadow-sm bg-white">
                  {/* Field Label */}
                  <label className="font-semibold text-lg mb-2 block" htmlFor={`field-${index}`}>
                    {field.label}
                  </label>
                  {/* Input Based on Field Type */}
                  {field.type === 'textarea' ? (
                    <textarea
                      id={`field-${index}`}
                      placeholder={`Enter ${field.label}...`}
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={field.input}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      required
                    />
                  ) : (
                    <input
                      id={`field-${index}`}
                      type={field.type || 'text'}
                      placeholder={`Enter ${field.label}...`}
                      className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={field.input}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      required
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Partner Image Section */}
          {partner.image && (
            <div className="flex-shrink-0 mt-4 md:mt-0">
              <img 
                src={partner.image} 
                alt={partner.name || "Partner Image"} 
                className="w-full max-w-md rounded shadow-md" 
              />
            </div>
          )}
        </div>

        {/* Submit and Debug Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <button 
            type="submit"
            disabled={submitting}
            className={`mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Submitting...' : 'SUBMIT'}
          </button>
          <button 
            type="button"
            onClick={() => showData(partner._id)}
              className="mt-4 px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Show Form Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default DisplayForm;
