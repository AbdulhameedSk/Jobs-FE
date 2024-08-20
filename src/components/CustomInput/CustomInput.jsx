import React from "react";
import "../CustomInput/CustomInput.css";
const CustomInput = ({ label, text, name, placeholder, value, onChange }) => {
  return (
    <div>
      <div className="mb-3">
        {/* <label for="exampleFormControlInput1" class="form-label">
                      {label}
                    </label> */}
        <input
          type={text}
          className="form-control input-text-btn text-input-border "
          id="exampleFormControlInput1"
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default CustomInput;
