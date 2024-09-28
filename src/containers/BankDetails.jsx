import React, { useEffect, useState } from 'react';
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
    const [isLoading, setIsLoading] = useState(false);

    const userId = useSelector((state) => state.user.userId);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
const fetchBankDetails = async () => {
        try {
            const response = await fetch(`${endpoint.BASE_URL_STAGING}${endpoint.GET_BANK_DETAILS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CurrentUser: userId
                }),
                });
    
                const data = await response.json();
                setFormData({
                    accountNumber: data.AccountNumber,
                    ifscCode: data.IFSC,
                    holderName: data.HolderName,
                    bankName: data.BankName,
                    branch: data.branch
                
            });
        } catch (error) {
            console.error('Error in fetching bank details:', error);
            toast.error(error.message || 'Failed to fetch bank details. Please try again.');
        }
    };
    useEffect(() => {
        fetchBankDetails();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${endpoint.BASE_URL_STAGING}${endpoint.BANK_DETAILS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    CurrentUser: userId,
                    bankName: formData.bankName,
                    accountNumber: formData.accountNumber,
                    ifscCode: formData.ifscCode,
                    branch: formData.branch,
                    holderName: formData.holderName
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update bank details');
            }

            const data = await response.json();
            if (data.success) {
                console.log('Bank Details Updated Successfully!');
                toast.success('Bank Details Updated Successfully!');
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                throw new Error(data.msg || 'Failed to update bank details');
            }
        } catch (error) {
            console.error('Error in updating bank details:', error);
            toast.error(error.message || 'Failed to update bank details. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 m-8 w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold text-center mb-6">Update Bank Details</h1>

                    {['accountNumber', 'ifscCode', 'bankName', 'branch', 'holderName'].map((field) => (
                        <div className="mb-4" key={field}>
                            <label className="block text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update Bank Details'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BankDetails;