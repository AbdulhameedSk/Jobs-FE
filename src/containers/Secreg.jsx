import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { endpoint } from '../apis/endpoint';

const Secreg = () => {
    const [formData, setFormData] = useState({
        gstin: '',
        orgName: '',
        industry: '',
        address: '',
        revenue: '',
        email: '',
        id: '',
        accountNumber: '',
        ifscCode: '',
        holderName: '',
        bankName: '',
        branch: '',
        password: ''
    });

    const Id = useSelector((state) => state.user.userId);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`${endpoint.BASE_URL_STAGING}${endpoint.ENTERPRISE_DETAILS}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ CurrentUser: Id })
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData(prevState => ({
                        ...prevState,
                        gstin: data.user.gstinNumber,
                        orgName: data.user.OrgName,
                        industry: data.user.Industry,
                        address: data.user.Address,
                        revenue: data.user.Revenue,
                        email: data.user.email,
                        id: data.user.UniqueId,
                        password: data.user.password,
                        accountNumber: data.user.AccountNumber,
                        ifscCode: data.user.IFSC,
                        bankName: data.user.BankName,
                        branch: data.user.BranchName,
                        holderName: data.user.HolderName
                    }));
                    console.log('User Details Fetched!');
                } else {
                    throw new Error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error in fetching user details:', error);
                toast.error('Failed to fetch user details');
            }
        };

        fetchUserDetails();
    }, [Id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${endpoint.BASE_URL_STAGING}${endpoint.COMPLETE_REGISTRATION}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CurrentUser: Id,
                    ...formData
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration Successful! Redirecting...');
                toast.success('Registration Successful! Redirecting...');
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Error in secreg:', error);
            toast.error('Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Profile Of Your Organization</h1>
                <form onSubmit={handleSubmit}>
                    {/* Form fields */}
                    {Object.entries(formData).map(([key, value]) => (
                        <div key={key} className="mb-4">
                            <label className="block text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input
                                type={key === 'password' ? 'password' : 'text'}
                                name={key}
                                value={value}
                                onChange={handleChange}
                                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={key === 'id'}
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Secreg;