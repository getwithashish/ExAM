import { Layout, Menu, Dropdown } from "antd";
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
  ExclamationOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import ExampleNavbar from "../Navbar/navbar";

import type { FC } from "react";
import { Avatar, Button, DarkThemeToggle, Navbar } from "flowbite-react";
import { FaBell, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import styles from "../Navbar/navbar.module.css";
import AccountMenu from "../notificationMenuItem";
import MenuListComposition from "../menuItem";
import SideDrawerComponent from "../SideDrawerComponent/SideDrawerComponent";
import AddAsset from "../AddAsset/AddAsset";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/authentication/AuthContext";
import Avatars from "../Avatar/Avatar";
import SubMenu from "antd/es/menu/SubMenu";
import {
  CheckOutlined,
  EditOutlined,
  WarningOutlined,
} from "@mui/icons-material";

import { Footer as FlowbiteFooter } from "flowbite-react";
import { MdFacebook } from "react-icons/md";

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
        <Button
          type="link"
          icon={<LogoutOutlined />}
          style={{ color: "white", backgroundColor: "rgb(22, 119, 255)" }}
        >
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
          borderBottom: "1px solid #e8e8e8",
          padding: 0,
        }}
      >
        {/* <ExampleNavbar /> */}

        <div className="w-full p-2.5 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between ">
            <div className="text-left  font-display text-lg p-0 mb-10">
              Asset Management System
            </div>

            {/* </Navbar.Brand> */}

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-3 ${styles["button-components"]}`}
              >
                {jwtPayload && jwtPayload.username && (
                  <div className={styles["username-container"]}>
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
                <div className="flex items-center gap-3 ml-5  -mt-10">
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
            fontSize: "600px",
            width: "400px",
            left: 0,
            top: 0,
            bottom: 0,
            paddingTop: 100,
            borderRight: "1px solid  #e8e8e8",
          }}
          width="250px"
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

          <Menu theme="light" mode="inline" className="text-base">
            <Menu.Item icon={<PieChartOutlined />}>
              <Link to="/exam/dashboard">Dashboard</Link>
            </Menu.Item>
            <Menu.Item
              onClick={() => showDefaultDrawer()}
              icon={<AppstoreAddOutlined />}
            >
              Create Assets
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />}>
              <Link to="/exam/updatable_assets">Modify Assets</Link>
            </Menu.Item>
            <Menu.Item icon={<UserSwitchOutlined />}>
              <Link to="/exam/assignable_asset">Allocate Assets</Link>
            </Menu.Item>
            {userRole === "LEAD" ? (
              <SubMenu
                key="sub1"
                icon={<CheckSquareOutlined />}
                title="Approve Assets"
              >
                <Menu.Item icon={<CarryOutOutlined />}>
                  <Link to="/exam/creation_requests">In Creation</Link>
                </Menu.Item>
                <Menu.Item icon={<CarryOutOutlined />}>
                  <Link to="/exam/updation_requests">In Modification</Link>
                </Menu.Item>
                <Menu.Item icon={<CarryOutOutlined />}>
                  <Link to="/exam/assign_requests">In Allocation</Link>
                </Menu.Item>
              </SubMenu>
            ) : (
              ""
            )}

            {userRole === "LEAD" ? (
              <Menu.Item icon={<MailOutlined />}>
                {/* For lead */}
                <Link to="/exam/my_approvals">My Approval History</Link>
              </Menu.Item>
            ) : userRole === "SYSTEM_ADMIN" ? (
              <SubMenu key="sub1" icon={<MailOutlined />} title="My Requests">
                <Menu.Item icon={<CheckCircleOutlined />}>
                  {/* For sysadmin */}
                  <Link to="/exam/approved_requests">Approved</Link>
                </Menu.Item>
                {/* <Menu.Item icon={<WarningOutlined />}>
                  <Link to="/exam/rejected_assets">Rejected</Link>
                </Menu.Item> */}
              </SubMenu>
            ) : (
              ""
            )}
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

          <Footer className="bg-white">
            <FlowbiteFooter container>
              <div className="flex w-full flex-col gap-y-6 lg:flex-row lg:justify-between lg:gap-y-0">
                <FlowbiteFooter.LinkGroup>
                  <FlowbiteFooter.Link
                    href="https://experionglobal.com/terms-of-use/"
                    className="mr-3 mb-3 lg:mb-0"
                  >
                    Terms and conditions
                  </FlowbiteFooter.Link>
                  <FlowbiteFooter.Link
                    href="https://experionglobal.com/privacy-policy/"
                    className="mr-3 mb-3 lg:mb-0"
                  >
                    Privacy Policy
                  </FlowbiteFooter.Link>

                  <FlowbiteFooter.Link href="https://experionglobal.com/">
                    Contact
                  </FlowbiteFooter.Link>
                </FlowbiteFooter.LinkGroup>
                <FlowbiteFooter.LinkGroup>
                  <div className="flex gap-x-1">
                    <FlowbiteFooter.Link
                      href="https://www.facebook.com/experiontechnologies/"
                      className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
                    >
                      <MdFacebook className="text-lg" />
                    </FlowbiteFooter.Link>
                    <FlowbiteFooter.Link
                      href="https://www.instagram.com/experion_technologies/?hl=en"
                      className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
                    >
                      <FaInstagram className="text-lg" />
                    </FlowbiteFooter.Link>
                    <FlowbiteFooter.Link
                      href="https://twitter.com/experionglobal"
                      className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
                    >
                      <FaTwitter className="text-lg" />
                    </FlowbiteFooter.Link>
                    <FlowbiteFooter.Link
                      href="https://www.linkedin.com/company/experion-technologies/posts/"
                      className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
                    >
                      <FaLinkedin className="text-lg" />
                    </FlowbiteFooter.Link>
                    <FlowbiteFooter.Link
                      href="https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fexperion-technologies%2Fposts"
                      className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
                    >
                      {/* <FaDribbble className="text-lg" /> */}
                    </FlowbiteFooter.Link>
                  </div>
                </FlowbiteFooter.LinkGroup>
              </div>
            </FlowbiteFooter>
          </Footer>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarComponentNew;
