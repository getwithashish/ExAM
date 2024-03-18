import { Layout, Menu, Dropdown} from "antd";
import {
  AppstoreAddOutlined,
  CarryOutOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MailOutlined,
  PieChartOutlined,
  SelectOutlined,
  UploadOutlined,
  UserOutlined,
  UserSwitchOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import ExampleNavbar from "../Navbar/navbar";

import type { FC } from "react";
import { Avatar, Button, DarkThemeToggle, Navbar } from "flowbite-react";
import { FaBell } from "react-icons/fa";
import styles from "../Navbar/navbar.module.css";
import AccountMenu from "../notificationMenuItem";
import MenuListComposition from "../menuItem";
import SideDrawerComponent from "../SideDrawerComponent/SideDrawerComponent";
import AddAsset from "../AddAsset/AddAsset";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/authentication/AuthContext";
import Avatars from "../Avatar/Avatar";

const SidebarComponentNew = ({ children }) => {
  const { userRole, setUserRole, login, logout } = useAuth();

  // const { addAssetState, setAddAssetState } = useMyContext();
  const [displaydrawer, setDisplayDrawer] = useState(false);
  const closeDrawer = () => {
    setDisplayDrawer(false);
    console.log("displaydrwer value is ", displaydrawer);
  };
  const showDefaultDrawer = () => {
    setDisplayDrawer(true);
    console.log("displaydrawer value is ", displaydrawer);
  };

  const { Header, Content, Footer, Sider } = Layout;
  const items = [
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    UserOutlined,
  ].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: `nav ${index + 1}`,
  }));

  const [jwtPayload, setJwtPayload] = useState<any>(null);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    // Function to decode JWT token
    const decodeJWT = (token: string) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
      }
    };

    // Get JWT token from localStorage
    const jwtToken = localStorage.getItem("jwt");
    console.log(jwtToken);

    // Decode JWT token and set payload
    if (jwtToken) {
      const payload = decodeJWT(jwtToken);
      console.log(payload);
      console.log(payload.username);
      setJwtPayload(payload);
      // login()
      setUserRole(payload.user_scope);
    }
  }, []);

  const navigate = useNavigate();

  const toggleLogout = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh_token");
    // logout()
    setUserRole("None");
    navigate("/login", { replace: true });
  };
  const menu = (
    <Menu>
      {/* Use Button component instead of Menu.Item */}
      <Menu.Item key="logout" onClick={handleLogout}>
        <Button type="link" icon={<LogoutOutlined />} style={{ color: "white", backgroundColor:"rgb(22, 119, 255)" }}>
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: "white",
          zIndex: 110,
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
          borderBottom:  "1px solid #e8e8e8"
        }}
      >
        {/* <ExampleNavbar /> */}

        <div className="w-full p-2.5 lg:px-5 lg:pl-3">
          
          <div className="flex items-center justify-between">
            
            <div className="flex items-center">
          
            
            
                <img
                  src="../../public/images/xam_logo.png"
                  alt="Logo"
                  className="mr-12 -mt-10 -ml-10  md:-mt-10 md:-ml-10 w-30 h-10 sm:w-38 sm:h-16" // Adjust width and height as needed
                />
                

                
            
              {/* </Navbar.Brand> */}
            </div>
            <div className="flex items-center gap-3 -mr-10">
              
              <div
                className={`flex items-center gap-3 ${styles["button-components"]}`}
              >
                 
                {/* <AccountMenu></AccountMenu> */}
                {/*             
              <Button>
                <FaBell />
              </Button> */}

                {/* <DarkThemeToggle /> */}
               

                {jwtPayload && jwtPayload.username && (
                  <div className={styles["username-container"]}>
                    {/* <MenuListComposition /> */}
                    <span className={styles["username"]}>
                      Hi, {jwtPayload.username}
                    </span>
                    {jwtPayload && jwtPayload.user_scope && (
                      <span className={styles["userscope"]}>
                        {jwtPayload.user_scope}
                      </span>
                    )}
                 
                  </div>
                )}
                <div className="flex items-center gap-3 ml-5 -mt-10">
              <Dropdown overlay={menu} placement="bottomCenter" arrow>
                <div className="cursor-pointer">
                  <Avatars />
                </div>
              </Dropdown>
            </div>
                  
              </div>
            </div>
          </div>
        </div>
      </Header>
      <Layout>
        <Sider
          theme="light"
          style={{
            // overflow: "auto",
            zIndex: 100,
            height: "100vh",
            position: "sticky",
            width:"400px",
            left: 0,
            top: 0,
            bottom: 0,
            paddingTop: 100,
            borderRight:  "1px solid  #e8e8e8"
          }}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          {/* <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["4"]}
            items={items}
          /> */}
          <Menu theme="light" mode="inline">
            <Menu.Item icon={<PieChartOutlined />}>
              <Link to="/exam/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item
              onClick={() => showDefaultDrawer()}
              icon={<AppstoreAddOutlined />}
            >
              Add An Asset
            </Menu.Item>
            <Menu.Item icon={<UserSwitchOutlined />}>
              <Link to="/exam/assignable_asset">Assign an Asset</Link>
            </Menu.Item>
            {userRole === "LEAD" ? (
              <Menu.Item icon={<CarryOutOutlined />}>
                <Link to="/exam/requests">Pending(Assets)</Link>
              </Menu.Item>
            ) : (
              ""
            )}
            {userRole === "LEAD" ? (
              <Menu.Item icon={<CarryOutOutlined />}>
                <Link to="/exam/assign_requests">Pending(Assign)</Link>
              </Menu.Item>
            ) : (
              ""
            )}
            
             <Menu.Item icon={<CarryOutOutlined />}>
                <Link to="/exam/updatable_assets">Updatable Assets</Link>
              </Menu.Item>
              <Menu.Item icon={<CarryOutOutlined />}>
                <Link to="/exam/rejected_assets">My Rejected Assets</Link>
              </Menu.Item>

            <Menu.Item onClick={() => handleLogout()} icon={<LogoutOutlined />}>
              Logout
            </Menu.Item>
          </Menu>
        </Sider>
        <Content>
          {children}
          <SideDrawerComponent
            displayDrawer={displaydrawer}
            closeDrawer={closeDrawer}
          >
            <AddAsset />
          </SideDrawerComponent>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarComponentNew;
