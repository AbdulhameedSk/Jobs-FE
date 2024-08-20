import React, { useState } from 'react';
import Header from '../../components/Boilers/Header';
import SideBarMenu from '../../components/Boilers/SideBarMenu';

const policies = `
  <h2 class="text-xl font-bold mb-2">Terms and Conditions</h2>
  
  <h3 class="text-lg font-semibold mb-2">1. Introduction</h3>
  <p class="mb-2">Welcome to JobPortal. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions. If you do not agree to these terms, please do not use our services.</p>
  
  <h3 class="text-lg font-semibold mb-2">2. User Responsibilities</h3>
  <p class="mb-2">You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
  
  <h3 class="text-lg font-semibold mb-2">3. Job Listings</h3>
  <p class="mb-2">JobPortal provides a platform for employers to post job listings and for job seekers to apply for jobs. We are not responsible for the accuracy or legality of job listings and make no guarantees regarding the jobs posted on our site.</p>
  
  <h3 class="text-lg font-semibold mb-2">4. Data Privacy</h3>
  <p class="mb-2">We are committed to protecting your privacy. Our use of your personal information is governed by our Privacy Policy. By using our services, you consent to our collection and use of your personal information as described in our Privacy Policy.</p>
  
  <h3 class="text-lg font-semibold mb-2">5. Prohibited Activities</h3>
  <p class="mb-2">You agree not to engage in any activity that is harmful, illegal, or disruptive to our services or to other users. This includes, but is not limited to, posting fraudulent job listings, spamming, or attempting to interfere with the operation of our website.</p>
  
  <h3 class="text-lg font-semibold mb-2">6. Intellectual Property</h3>
  <p class="mb-2">All content on JobPortal, including text, graphics, logos, and software, is the property of JobPortal or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works based on our content without our express written permission.</p>
  
  <h3 class="text-lg font-semibold mb-2">7. Limitation of Liability</h3>
  <p class="mb-2">JobPortal is not liable for any indirect, incidental, or consequential damages arising out of or related to your use of our services. We make no warranties or representations regarding the accuracy, reliability, or completeness of the content on our website.</p>
  
  <h3 class="text-lg font-semibold mb-2">8. Changes to Terms</h3>
  <p class="mb-2">We reserve the right to modify these terms and conditions at any time. Your continued use of our services following any changes constitutes your acceptance of the updated terms.</p>
  
  <h3 class="text-lg font-semibold mb-2">9. Governing Law</h3>
  <p class="mb-2">These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which JobPortal operates. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction.</p>
  
  <p>If you have any questions or concerns about these terms and conditions, please contact us at support@jobportal.com.</p>
`;

const Agreement = () => {
  const [agree, setAgree] = useState(false);

  const checkboxHandler = () => {
    setAgree(!agree);
  };

  const btnHandler = () => {
    alert('Accepted');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Menu */}
      {/* <div className="w-60 bg-gray-800 h-full">
        <SideBarMenu />
      </div> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* <Header title="Agreement" icon="" onClickFunc={null} /> */}

        <div className="flex-1 flex flex-col justify-center items-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl overflow-auto">
            <h1 className="text-2xl font-semibold text-center mb-6">Terms and Conditions</h1>
            <div
              className="prose lg:prose-xl border border-gray-300 rounded-lg p-4 mb-4"
              dangerouslySetInnerHTML={{ __html: policies }}
            />
            <div className="flex items-center mb-4">
              {/* <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={checkboxHandler}
                className="form-checkbox h-5 w-5 text-blue-600"
              /> */}
              {/* <label htmlFor="agree" className="ml-2 text-gray-700">
                I agree to <strong>terms and conditions</strong>
              </label> */}
            </div>
            {/* <button
              onClick={btnHandler}
              disabled={!agree}
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${
                agree ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              } transition-colors duration-300`}
            >
              Continue
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agreement;
