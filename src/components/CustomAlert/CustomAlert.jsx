import React from "react";
import { Modal } from "reactstrap";

const CustomAlert = ({
  show,
  title,
  description,
  close,
  submit
}) => {
  return (
    <Modal isOpen={show} toggle={close} centered backdrop="static" className="font-sans">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md mx-auto">
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={submit}
          >
            Delete
          </button>
          <button
            type="button"
            className=" w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={close}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomAlert;