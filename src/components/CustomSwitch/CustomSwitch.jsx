import React from "react";
import "./CustomSwitch.css";

export default function CustomSwitch({
  icons,
  labels,
  isState,
  setIsStateFunc,
}) {
  const handleChangeState = (newState) => {
    setIsStateFunc(newState);
  };

  return (
    <div className="switch">
      <div
        className={isState === 0 ? "switch-item active" : "switch-item"}
        onClick={() => {
          handleChangeState(0);
        }}
      >
        {icons[0]} <span>{labels[0]}</span>
      </div>
      <div
        className={isState === 1 ? "switch-item active" : "switch-item"}
        onClick={() => {
          handleChangeState(1);
        }}
      >
        {icons[1]} <span>{labels[1]}</span>
      </div>
    </div>
  );
}
