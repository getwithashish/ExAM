import { Layout, Menu, Dropdown, Spin } from "antd";
import {
  AppstoreAddOutlined,
  CarryOutOutlined,
  LogoutOutlined,
  MailOutlined,
  PieChartOutlined,
  UploadOutlined,
  UserOutlined,
  UserSwitchOutlined,
  VideoCameraOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CloseCircleOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import styles from "./sidebar.module.css";
import SideDrawerComponent from "../SideDrawerComponent/SideDrawerComponent";
import AddAsset from "../AddAsset/AddAsset";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../pages/authentication/AuthContext";
import Avatars from "../Avatar/Avatar";
import { EditOutlined } from "@mui/icons-material";
import ToolTip from "../Tooltip/Tooltip";
import { Footer as FlowbiteFooter } from "flowbite-react";
import { MdFacebook } from "react-icons/md";
import { useEffect, useState } from "react";
import React from "react";
import SubMenu from "antd/es/menu/SubMenu";
import { Button} from "@mui/material";

const SidebarComponentNew = ({ children }) => {
  const { userRole, setUserRole, login, logout } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const handleDownload = async () => {
    const fileUrl = "/static/asset_management_windows.exe";

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "asset_management_windows.exe");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const [displaydrawer, setDisplayDrawer] = useState(false);
  const closeDrawer = () => {
    setDisplayDrawer(false);
  };
  const showDefaultDrawer = () => {
    setDisplayDrawer(true);
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
    if (jwtToken) {
      const payload = decodeJWT(jwtToken);
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

  const menuItems = [
    {
      key: "logout",
      label: (
        <Button color="error" onClick={handleLogout}>
          Logout &nbsp;
          <LogoutOutlined />
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: "white",
          zIndex: 110,
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          borderBottom: "1px solid #e8e8e8",
          padding: 0,
          width: "100%",
        }}
      >
        <div className="flex w-screen lg:px-5 lg:pl-3">
          <div className="text-left my-5 px-4 font-display text-lg p-0 m-0 items-center justify-between flex-1">
            <b>Asset Management System</b>
          </div>
          <div className="flex-1 px-4">
            <div className="flex gap-4">
              <div className="flex-1 text-right">
                {jwtPayload && jwtPayload.username && (
                  <div>
                    <div className={styles["username"]}>
                      Hi, {jwtPayload.username}
                    </div>
                    {jwtPayload.user_scope && (
                      <div className={styles["userscope"]}>
                        {jwtPayload.user_scope}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-2">
                <Dropdown menu={{ items: menuItems }} placement="bottom" arrow>
                  <div className="cursor-pointer">
                    <Avatars />
                  </div>
                </Dropdown>
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
            paddingLeft: 15,
            borderRight: "1px solid  #e8e8e8",
            // marginRight:"30px"
          }}
          width="250px"
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div className="demo-logo-vertical" />

          <Menu theme="light" mode="inline" className="text-base">
            <Menu.Item icon={<PieChartOutlined />}>
              <ToolTip title="Dashboard">
                <Link to="/exam/dashboard">Dashboard</Link>
              </ToolTip>
            </Menu.Item>
            <React.Fragment>
              {userRole === "SYSTEM_ADMIN" ? (
                <React.Fragment>
                  <Menu.Item
                    onClick={() => showDefaultDrawer()}
                    icon={<AppstoreAddOutlined />}
                  >
                    <ToolTip title="To Create an Asset">
                      Create Assets
                      </ToolTip>
                  </Menu.Item>
                  <Menu.Item icon={<EditOutlined />}>
                    <ToolTip title="To modify an Asset">
                      <Link to="/exam/updatable_assets">Modify Assets</Link>
                    </ToolTip>
                  </Menu.Item>
                  <Menu.Item icon={<UserSwitchOutlined />}>
                    <ToolTip title="To allocate an Asset to an employee">
                      <Link to="/exam/assignable_asset">Allocate Assets</Link>
                    </ToolTip>
                  </Menu.Item>
                  <Menu.Item icon={<UserSwitchOutlined />}>
                    <ToolTip title="To deallocate an Asset from an employee">
                      <Link to="/exam/deallocate">Deallocate Assets</Link>
                    </ToolTip>
                  </Menu.Item>
                </React.Fragment>
              ) : userRole === "LEAD" ? (
                <React.Fragment>
                  <Menu.Item icon={<EditOutlined />}>
                    <ToolTip title="To delete an Asset">
                      <Link to="/exam/updatable_assets">Delete Assets</Link>
                    </ToolTip>
                  </Menu.Item>
                </React.Fragment>
              ) : userRole === "MANAGER" ? (
                <React.Fragment>
                  <Menu.Item icon={<EditOutlined />}>
                    <ToolTip title="View Deleted Assets">
                      <Link to="/exam/updatable_assets">Deleted Assets</Link>
                    </ToolTip>
                  </Menu.Item>
                </React.Fragment>
              ) : (
                ""
              )}
            </React.Fragment>

            {userRole === "LEAD" ? (
              <SubMenu
                key="sub1"
                icon={<CheckSquareOutlined />}
                title="Approve Assets"
              >
                <Menu.Item icon={<CarryOutOutlined />}>
                  <ToolTip title="Approve Assets that are pending to be created">
                    <Link to="/exam/creation_requests">In Creation</Link>
                  </ToolTip>
                </Menu.Item>

                <Menu.Item icon={<CarryOutOutlined />}>
                  <ToolTip title="Approve Assets that are pending to be updated">
                    <Link to="/exam/updation_requests">In Modification</Link>
                  </ToolTip>
                </Menu.Item>

                <Menu.Item icon={<CarryOutOutlined />}>
                  <ToolTip title="Approve Assets that are pending to be allocated">
                    <Link to="/exam/assign_requests">In Allocation</Link>
                  </ToolTip>
                </Menu.Item>
              </SubMenu>
            ) : (
              ""
            )}

            {userRole === "LEAD" ? (
              <Menu.Item icon={<MailOutlined />}>
                {/* For lead */}
                <ToolTip title="Show Assets that I have approved">
                  <Link to="/exam/my_approvals">My Approval History</Link>
                </ToolTip>
              </Menu.Item>
            ) : userRole === "SYSTEM_ADMIN" ? (
              <SubMenu key="sub1" icon={<MailOutlined />} title="My Requests">
                <Menu.Item icon={<CheckCircleOutlined />}>
                  {/* For sysadmin */}
                  <ToolTip title="Show my Asset Requests which have been approved">
                    <Link to="/exam/approved_requests">Approved</Link>
                  </ToolTip>
                </Menu.Item>
                <Menu.Item icon={<CheckCircleOutlined />}>
                  {/* For sysadmin */}
                  <ToolTip title="Show the requests which are in pending status">
                    <Link to="/exam/pending_requests">Pending Requests</Link>
                  </ToolTip>
                </Menu.Item>
                <Menu.Item icon={<CloseCircleOutlined />}>
                  {/* For sysadmin */}
                  <ToolTip title="Show my Asset creation and updation Requests which have been rejected">
                    <Link to="/exam/rejected_assets">Rejected Asset</Link>
                  </ToolTip>
                </Menu.Item>
                <Menu.Item icon={<CloseCircleOutlined />}>
                  {/* For sysadmin */}
                  <ToolTip title="Show my Asset allocation Requests which have been rejected">
                    <Link to="/exam/rejected_allocation">
                      Rejected Allocation
                    </Link>
                  </ToolTip>
                </Menu.Item>
              </SubMenu>
            ) : (
              ""
            )}
            <Menu.Item icon={<UserSwitchOutlined />}>
              <ToolTip title="To view the expired assets">
                <Link to="/exam/expired_assets">Expired Assets</Link>
              </ToolTip>
            </Menu.Item>
            <Menu.Item icon={<CarryOutOutlined />}>
              <ToolTip title="Download user agent">
                <Link to="#" onClick={handleDownload}>Download</Link>
              </ToolTip>
            </Menu.Item>
            <Menu.Item icon={<RobotOutlined />}>
              <ToolTip title="AI Assistant">
                <Link to="/exam/chat">AssetSense Ai</Link>
              </ToolTip>
            </Menu.Item>
          </Menu>
        </Sider>
        <Content className="bg-white">
          <Spin spinning={loading}>
            {children}
            <SideDrawerComponent
              displayDrawer={displaydrawer}
              closeDrawer={closeDrawer}
            >
              <AddAsset
                loading={loading}
                setLoading={setLoading}
                setDisplayDrawer={setDisplayDrawer}
              />
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
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarComponentNew;
