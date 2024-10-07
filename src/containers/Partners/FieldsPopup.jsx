import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const FieldsPopup = ({ isOpen, toggle, fields, partnerName }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>{partnerName} Details</ModalHeader>
      <ModalBody>
        {Object.entries(fields).map(([key, value]) => (
          <div key={key} className="mb-2">
            <span className="font-semibold">{key}:</span> {value}
          </div>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default FieldsPopup;