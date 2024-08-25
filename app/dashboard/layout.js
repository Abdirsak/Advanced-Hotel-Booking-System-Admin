"use client";
// import node module libraries
import { useState } from "react";

// import theme style scss file
import "styles/theme.scss";

// import sub components
import NavbarVertical from "/layouts/navbars/NavbarVertical";
import NavbarTop from "/layouts/navbars/NavbarTop";
import { CompanyProfileApi } from "common/utils/axios/api";
import { useQuery } from "@tanstack/react-query";
import request from "common/utils/axios";

const fetchCompanyProfile = async () => {
  const response = await request({
    method: "GET",
    url: CompanyProfileApi,
  });
  return response.data;
};

const useCompanyProfile = () => {
  return useQuery({
    queryKey: "company-profile",
    queryFn: fetchCompanyProfile,
  });
};

export default function DashboardLayout({ children }) {
  const [showMenu, setShowMenu] = useState(true);

  const { data } = useCompanyProfile();

  // console.log(data);

  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };

  return (
    <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
      <div className="navbar-vertical navbar">
        <NavbarVertical
          showMenu={showMenu}
          onClick={(value) => setShowMenu(value)}
          settings={data}
        />
      </div>
      <div id="page-content">
        <div className="header">
          <NavbarTop
            data={{
              showMenu: showMenu,
              SidebarToggleMenu: ToggleMenu,
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
