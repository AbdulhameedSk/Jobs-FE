import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { endpoint } from '../apis/endpoint';

const BankDetails = () => {
    const [formData, setFormData] = useState({
        accountNumber: '',
        ifscCode: '',
        holderName: '',
        bankName: '',
        branch: ''
    });

    const Id = useSelector((state) => state.user.userId);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const response = await fetch(`${endpoint.BASE_URL_STAGING}${endpoint.GET_BANK_DETAILS}/${Id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setFormData({
                            accountNumber: data.user.AccountNumber,
                            ifscCode: data.user.IFSC,
                            bankName: data.user.BankName,
                            branch: data.user.BranchName,
                            holderName: data.user.HolderName
                        });
                        console.log('Bank Details Fetched!');
                    } else {
                        throw new Error(data.msg || 'Failed to fetch bank details');
                    }
                } else {
                    throw new Error('Failed to fetch bank details');
                }
            } catch (error) {
                console.error('Error in fetching bank details:', error);
                toast.error('Failed to fetch bank details');
            }
        };

        fetchBankDetails();
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
            const response = await fetch(`${endpoint.BASE_URL_STAGING}${endpoint.BANK_DETAILS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CurrentUser: Id,
                    bankName: formData.bankName,
                    accountNumber: formData.accountNumber,
                    ifscCode: formData.ifscCode,
                    branch: formData.branch,
                    holderName: formData.holderName
                }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log('Bank Details Updated Successfully!');
                    toast.success('Bank Details Updated Successfully!');
                    setTimeout(() => navigate('/dashboard'), 2000);
                } else {
                    throw new Error(data.msg || 'Failed to update bank details');
                }
            } else {
                throw new Error('Failed to update bank details');
            }
        } catch (error) {
            console.error('Error in updating bank details:', error);
            toast.error('Failed to update bank details. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 m-8 w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold text-center mb-6">Bank Details</h1>

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
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Update Bank Details
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BankDetails;