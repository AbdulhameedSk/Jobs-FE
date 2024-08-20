import React from "react";
import { Modal } from "reactstrap";
import "./CustomAlert.css";

export default function CustomAlert({
  onClickFunction,
  onCancelFunction,
  message,
  type,
  show,
}) {
  const handleOnClickFunction = () => {
    onClickFunction();
    onCancelFunction();
  };

  return (
    <div>
      <Modal
        backdrop={"static"}
        isOpen={show}
        toggle={onCancelFunction}
        centered
      >
        <div className="custom-alert">
          <div className="message">{message}</div>
          <div className="btns">
            <button onClick={onCancelFunction} className="button left">
              Cancel
            </button>
            <button
              onClick={handleOnClickFunction}
              className={
                type === "delete"
                  ? "delete button right"
                  : "button right confirm"
              }
            >
              {type === "delete" ? "Delete" : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
