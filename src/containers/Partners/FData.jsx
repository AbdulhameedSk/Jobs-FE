import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from "../../components/Boilers/Header";
import { endpoint } from "../../apis/endpoint.js";
import { apiHandler } from "../../apis/index";
import { useSelector } from 'react-redux';

const FData = () => {
    const location = useLocation();
    const { id } = location.state || {};
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const authToken = useSelector((state) => state.auth.authToken);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("No partner ID provided");
                return;
            }

            setIsLoading(true);
            try {
                const { data } = await apiHandler({
                    url: endpoint.FORM_DATA,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    data: { partnerId: id },
                });

                if (data.success) {
                    setFormData(data.fields);
                } else {
                    setError(data.msg || "Failed to fetch form data");
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
                setError("An error occurred while fetching form data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, authToken]);

    return (
        <div className="container mx-auto p-4">
            <Header title="Form Data" icon="" />
            
            <h1 className="text-2xl font-bold mb-4">Partner's Form Data</h1>

            {isLoading && <p>Loading...</p>}

            {error && <p className="text-red-500">{error}</p>}

            {formData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.map((field, index) => (
                        <div key={index} className="border p-4 rounded shadow ">
                            <div className="flex gap-2">
                                <h2 className="font-semibold">{field.label}</h2>
                                <p>:</p>
                                <p>{field.value || 'No data'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FData;
