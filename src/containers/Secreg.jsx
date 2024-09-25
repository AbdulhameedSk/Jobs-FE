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
    const [step, setStep] = useState(1);

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

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <>
                            <h1 className="text-2xl font-bold text-center mb-6">Profile Of Your Organization</h1>

                            <div className="mb-4">
                                <label className="block text-gray-700">Enterprise Id</label>
                                <input
                                    type="text"
                                    disabled
                                    value={formData.id}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Organization Name</label>
                                <input
                                    type="text"
                                    name="orgName"
                                    disabled
                                    value={formData.orgName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Industry</label>
                                <input
                                    type="text"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Revenue</label>
                                <select
                                    name="revenue"
                                    value={formData.revenue}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="<20">Less than 20 LPA</option>
                                    <option value="20-1cr">20 - 1 Cr</option>
                                    <option value="1cr-10cr">1 Cr - 10 Cr</option>
                                    <option value="10cr-250cr">10 Cr - 250 Cr</option>
                                    <option value="250cr-1000cr">250 Cr - 1000 Cr</option>
                                    <option value="1000cr+">More than 1000 Cr</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">GSTIN</label>
                                <input
                                    type="text"
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Next
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                                        <h1 className="text-2xl font-bold text-center mb-6">Bank Details of Your Organisation</h1>

                            <div className="mb-4">
                                <label className="block text-gray-700">Bank Account Number</label>
                                <input
                                    type="text"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Bank IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Bank Name</label>
                                <input
                                    type="text"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Bank Branch</label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Bank Account Holder Name</label>
                                <input
                                    type="text"
                                    name="holderName"
                                    value={formData.holderName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-full mr-2 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="w-full ml-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Submit
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Secreg;
