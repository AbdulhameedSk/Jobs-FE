import React, { useEffect, useState } from "react";
import CustomIcon from "../../components/CustomIcon.jsx";
import PROFILE from "../../assets/ChauwkLogo/CHAUWK_SYMBOL_NIGHT.png";
import { useNavigate } from 'react-router-dom';
import CustomProfileEdit from "../CustomProfileEdit/CustomProfileEdit.jsx";
const Header = ({
  title,
  icon,
  modalToggle,
  modalTarget,
  onClickFunc,
  className = "",
  searchInput,
  setSearchInput,
  onSearchInput = () => {},
  downloadCsv = false,
  downloadCsvFun = null,
  clearFilter = false,
  clearFilterFun = null,
}) => {
  const [proFlage, setProFlage] = useState(false);
  const SecReg = () => {
    navigate("/SecReg");
  }

  const handleProFlage = () => {
    setProFlage(!proFlage);
  };

  const handleOnClickFunc = () => {
    if (typeof onClickFunc === "function") {
      onClickFunc();
    }
  };

  useEffect(() => {
    onSearchInput();
  }, [searchInput]);
const navigate=useNavigate();
  return (
    <>
      <div className="sticky top-0 z-100 w-full bg-white shadow-md h-[12vh] flex justify-between items-center px-5">
        <div className="text-2xl font-bold text-[#515b6f]">{title}</div>
        <div>
          <div className="flex gap-2">
            <div className="flex items-center bg-[#ecf3ec66] rounded-full p-2">
              <button className="border-none bg-transparent">
                <div className="w-6 h-6">
                  <CustomIcon name={"CiSearch"} />
                </div>
              </button>
              <input
                className="bg-[#ecf3ec0f] border-none focus:outline-none"
                type="text"
                placeholder="Search for Something"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div
              className={`flex items-center justify-center cursor-pointer ${className}`}
              data-bs-toggle={modalToggle}
              data-bs-target={modalTarget}
            >
              {icon && icon !== "" && (
                <CustomIcon name={icon} onClick={() => handleOnClickFunc()} />
              )}
            </div>
            {downloadCsv && (
              <div className="flex items-center justify-center cursor-pointer">
                <CustomIcon name="PiFileCsvBold" onClick={downloadCsvFun} />
              </div>
            )}
            {clearFilter && (
              <div className="flex items-center justify-center cursor-pointer">
                <CustomIcon
                  name="MdOutlineFilterAltOff"
                  onClick={clearFilterFun}
                />
              </div>
            )}
            <div>
              <img
                onClick={() => SecReg()}
                src={PROFILE}
                alt="employee"
                className="w-12 h-12 rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>
        {proFlage && <CustomProfileEdit setProFlage={setProFlage} />}
      </div>
    </>
  );
};

export default Header;
