import React from "react";
import "../../components/CustomRewardInput/CustomRewardInput.css";
import CustomIcon from "../CustomIcon";
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
        <div className="input-group input-bg-color mb-3">
          <span className="input-group-text reword-icon-fix">
            <div className="reward-icon-side-fix">
              <CustomIcon name={iconName} />
            </div>
          </span>
          <div className="form-input">
            <input
              type={type}
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
