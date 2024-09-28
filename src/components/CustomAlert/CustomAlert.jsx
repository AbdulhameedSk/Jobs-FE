import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import "./CustomAlert.css";

const CustomAlert = ({
  show,
  title,
  description,
  close,
  submit
}) => {
  return (
    <Modal isOpen={show} toggle={close} centered backdrop="static">
      <ModalHeader toggle={close}>{title}</ModalHeader>
      <ModalBody>
        <div className="custom-alert">
          <div className="message">{description}</div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={close}>
          Cancel
        </Button>
        <Button color="danger" onClick={submit}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CustomAlert;