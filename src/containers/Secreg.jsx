import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { endpoint } from '../apis/endpoint';

const Secreg = () => {
    const [gstin, setGstin] = useState('');
    const [orgName, setOrgName] = useState('');
    const [industry, setIndustry] = useState('');
    const [address, setAddress] = useState('');
    const [revenue, setRevenue] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
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
                    body: JSON.stringify({
                        CurrentUser: Id
                    })
                });

                const data = await response.json();
                if (response.status === 200) {
                    console.log('User Details Fetched!');
                    setGstin(data.user.gstinNumber);
                    setOrgName(data.user.OrgName);
                    setIndustry(data.user.Industry);
                    setAddress(data.user.Address);
                    setRevenue(data.user.Revenue);
                    setEmail(data.user.email);
                    setId(data.user.UniqueId);
                    setPassword(data.user.password);
                }
            } catch (error) {
                console.error('Error in fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [Id]);

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
                    gstin,
                    OrgName: orgName,
                    Industry: industry,
                    Address: address,
                    Revenue: revenue,
                }),
            });

            const data = await response.json();
            if (response.status === 200) {
                console.log('Registration Successful! Redirecting...');
                toast.success('Registration Successful! Redirecting...');
                setTimeout(() => navigate('/dashboard'), 2000);
            }
            console.log(data);
        } catch (error) {
            console.error('Error in secreg:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-6">Profile Of Your Organization</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                    <label className="block text-gray-700">Enterprise Id</label>
                        <input
                            type="text"
                            disabled
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Enterprise Id"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <label className="block text-gray-700">Password</label>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    
                    
                    <div className="mb-4">
                        <label className="block text-gray-700">Organization Name</label>
                        <input
                            type="text"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            placeholder="Enter organization name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Industry</label>
                        <input
                            type="text"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            placeholder="Enter industry type"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter address"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Revenue</label>
                        <select
                            value={revenue}
                            placeholder="Select revenue"
                            onChange={(e) => setRevenue(e.target.value)}
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
                    <label className="block text-gray-700">GSTIN</label>
                        <input
                            type="text"
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                            placeholder="Enter your GSTIN"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
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