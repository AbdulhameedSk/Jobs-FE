import React from "react";
import CustomIcon from "../CustomIcon";
import "./nono.css";
const CustomRewardInput = ({
  iconName,
  type,
  placeholder,
  style,
  value,
  name,
  setValue,
  event = false,
}) => {
  return (
    <div>
      <div>
        <div className="input-group input-bg-color mb-3 flex ">
          <span className="input-group-text reword-icon-fix ">
            <div className="reward-icon-side-fix  ">
              <CustomIcon name={iconName} />
            </div>
          </span>
          <div className="form-input">
            <input
              type={type}
              className="w-full border border-black h-full"
              placeholder={placeholder}
              class="form-control reward-input-fixing"
              style={{ ...style }}
              name={name}
              value={value}
              onChange={(e) => {
                if (event) {
                  setValue(e);
                } else {
                  setValue(e.target.value);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomRewardInput;
