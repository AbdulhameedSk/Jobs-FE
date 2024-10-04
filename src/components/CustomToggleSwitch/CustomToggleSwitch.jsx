import React from "react";
import Switch from "react-switch";

export default function CustomToggleSwitch({ isIntro, setIsIntroFunc }) {
  const handleChange = (newChecked) => {
    setIsIntroFunc(newChecked);
  };

  return (
    <div>
      <Switch
        onChange={() => {
          handleChange(!isIntro);
        }}
        checked={isIntro}
      />
    </div>
  );
}
