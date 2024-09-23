import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBarMenu from "../../components/Boilers/SideBarMenu";
import { useSelector } from "react-redux";

const Index = () => {
  const authToken = useSelector((state) => state.auth.authToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
  }, [authToken, navigate]);

  return (
    <>
      <div className="row">
        <div className="col-lg-2">
          <SideBarMenu />
        </div>
        <div className="col-lg-10">
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;