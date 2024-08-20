import React, { useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { RotatingLines } from "react-loader-spinner";

const Spinner = ({ show, closeModal, ...args }) => {
  return (
    <div className="spinner">
      <Modal
        backdrop={"static"}
        isOpen={show}
        toggle={closeModal}
        {...args}
        centered
      >
        <div className="d-flex justify-content-center">
          <div className="spinner-border spinner-color-cgn" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Spinner;
