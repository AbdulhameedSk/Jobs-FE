import React, { useState, useEffect } from "react";
import "../../components/Boilers/SideBarMenu.css";
import CustomIcon from "../../components/CustomIcon.jsx";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/ChauwkLogo/ROUND_LOGO.png";

const SideBarMenu = () => {
  const navigate = useNavigate();
  const [isListOpenSkill, setIsListOpenSkill] = useState(false);
  const [isListSecOpen, setIsListSecOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleListSkill = () => {
    setIsListOpenSkill(!isListOpenSkill);
  };

  const toggleListSecond = () => {
    setIsListSecOpen(!isListSecOpen);
  };

  const handleItemClick = (route) => {
    setSelectedItem(route);
    navigate(`/${route}`);
  };

  return (
    <div className="side-background-color side-nav no-scrollbar">
      <div className="side-menu-logo">
        <img src={Logo} alt="Logo" width="45%" />
      </div>

      <div className="sideBar-border-line"></div>
      <div style={{ marginTop: "15px", padding: "0px 20px 0px 20px" }}>
        <div
          onClick={() => handleItemClick("dashboard")}
          style={{
            backgroundColor:
              selectedItem === "dashboard" ? "lightblue" : "transparent",
            borderRadius: "5px",
          }}
          className="side-fixing-text-sd"
        >
          <div className="side-icon-dash">
            <CustomIcon name={"MdDashboard"} />
          </div>
          <div
            className="sideBar-text-dash"
            style={{
              color:
                selectedItem === "dashboard" ? "#1e81d2" : "rgb(144 132 132)",
            }}
          >
            Dashboard
          </div>
        </div>
        <div
              onClick={() => handleItemClick("partners")}
              style={{
                backgroundColor:
                  selectedItem === "partners" ? "lightblue" : "transparent",
                borderRadius: "5px",
              }}
              className="side-fixing-text-col"
            >
              <div className="side-icon-dash-col">
                <CustomIcon name={"FaHandshakeSimple"} />
              </div>
              <div
                className="sideBar-text-dash-col"
                style={{
                  color:
                    selectedItem === "partners"
                      ? "#1e81d2"
                      : "rgb(144 132 132)",
                }}
              >
                Partners
              </div>
            </div>
        <div
          onClick={() => handleItemClick("Permissions")}
          style={{
            backgroundColor:
              selectedItem === "Permissions" ? "lightblue" : "transparent",
            borderRadius: "5px",
          }}
          className="side-fixing-text-sd"
        >
          <div className="side-icon-dash">
            <CustomIcon name={"PiStudentFill"} />
          </div>
          <div
            className="sideBar-text-dash"
            style={{
              color:
                selectedItem === "Permissions" ? "#1e81d2" : "rgb(144 132 132)",
            }}
          >
            Course Permissions
          </div>
        </div>

        <div
          onClick={() => handleItemClick("usertable")}
          style={{
            backgroundColor:
              selectedItem === "sectionpermission" ? "lightblue" : "transparent",
            borderRadius: "5px",
          }}
          className="side-fixing-text-sd"
        >
          <div className="side-icon-dash">
            <CustomIcon name={"GrUserSettings"} />
          </div>
          <div
            className="sideBar-text-dash"
            style={{
              color:
                selectedItem === "sectionpermission" ? "#1e81d2" : "rgb(144 132 132)",
            }}
          >
            Section Permission
          </div>
        </div>

        <div className="side-skill-fix" onClick={toggleListSkill}>
          <div className="side-sy-text">Training</div>
          <div className="side-sy-icon">
            <CustomIcon
              name={isListOpenSkill ? "IoIosArrowUp" : "IoIosArrowDown"}
            />
          </div>
        </div>
        
        {isListOpenSkill && (
          <div>
            <div
              onClick={() => handleItemClick("category")}
              style={{
                backgroundColor:
                  selectedItem === "category" ? "lightblue" : "transparent",
                borderRadius: "5px",
              }}
              className="side-fixing-text-col"
            >
              <div className="side-icon-dash-col">
                <CustomIcon name={"BiSolidCategoryAlt"} />
              </div>
              <div
                className="sideBar-text-dash-col"
                style={{
                  color:
                    selectedItem === "category"
                      ? "#1e81d2"
                      : "rgb(144 132 132)",
                }}
              >
                Category
              </div>
            </div>

            <div
              onClick={() => handleItemClick("skillyatravideos")}
              style={{
                backgroundColor:
                  selectedItem === "skillyatravideos"
                    ? "lightblue"
                    : "transparent",
                borderRadius: "5px",
              }}
              className="side-fixing-text-col"
            >
              <div className="side-icon-dash-col">
                <CustomIcon name={"PiVideoFill"} />
              </div>
              <div
                className="sideBar-text-dash-col"
                style={{
                  color:
                    selectedItem === "skillyatravideos"
                      ? "#1e81d2"
                      : "rgb(144 132 132)",
                }}
              >
                Videos
              </div>
            </div>
          </div>
        )}

        <div className="side-skill-fix" onClick={toggleListSecond}>
          <div className="side-sy-text">Recruitment</div>
          <div className="side-sy-icon">
            <CustomIcon
              name={isListSecOpen ? "IoIosArrowUp" : "IoIosArrowDown"}
            />
          </div>
        </div>

        {isListSecOpen && (
          <div>
            <div
              onClick={() => handleItemClick("jobs")}
              style={{
                backgroundColor:
                  selectedItem === "jobs" ? "lightblue" : "transparent",
                borderRadius: "5px",
              }}
              className="side-fixing-text-col"
            >
              <div className="side-icon-dash-col">
                <CustomIcon name={"RiUserSearchFill"} />
              </div>
              <div
                className="sideBar-text-dash-col"
                style={{
                  color:
                    selectedItem === "jobs" ? "#1e81d2" : "rgb(144 132 132)",
                }}
              >
                Jobs
              </div>
            </div>

          
          </div>
        )}
         
      </div>
    </div>
  );
};

export default SideBarMenu;