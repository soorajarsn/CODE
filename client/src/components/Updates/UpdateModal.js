import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
// import { Link } from "react-router-dom";
import './updateModal.scss'
const UpdateModal = ({
  modalOpen,
  setModalOpen,
  msg,
  modalHeader,
  buttonContent,
}) => {
  const toggle = () => {
    console.log('closing modal')
    setModalOpen(false);
  };

  return (
    <Modal isOpen={modalOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} 
        className='modal-header' 
        cssModule={{'modal-title': 'w-100 text-center'}}>
          <i class="fas fa-road"/>
          <div className='modal-heading'>{modalHeader}</div>
          <div className='modal-body'>{msg}</div>
        </ModalHeader>
      {/* <ModalBody className='modal-body'>{msg}</ModalBody> */}
      <ModalFooter className='modal-footer justify-content-center'>
        <a href='/roadmaps'>
        <Button
          color="warning"
          className="start-btn"
        >
          {buttonContent}
        </Button>
        </a>
      </ModalFooter>
    </Modal>
  );
};
export default UpdateModal;
