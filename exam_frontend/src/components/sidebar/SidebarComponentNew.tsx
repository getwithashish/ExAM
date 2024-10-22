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
import { EditOutlined } from "@mui/icons-material";
import { Footer as FlowbiteFooter } from "flowbite-react";
import { MdFacebook } from "react-icons/md";
import { useEffect, useState } from "react";
import React from "react";
import { Avatar, Button } from "@mui/material";
import { Polygon } from "../../assets";
import Tooltip from "../Tooltip/Tooltip";

const SidebarComponentNew = ({ children }: any) => {
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
        if (!base64Url) {
          throw new Error("Invalid Jwt token: Missing base URL segment");
        }
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

    const jwtToken = localStorage.getItem("jwt");
    if (jwtToken) {
      const payload = decodeJWT(jwtToken);
      setJwtPayload(payload);
      setUserRole(payload.user_scope);
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("refresh_token");
    setUserRole("None");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      key: "logout",
      label: (
        <div>
          <Button className="w-4" color="primary" onClick={handleLogout}>
            <span className="text-xs">Logout</span>
            <LogoutOutlined style={{ width: "10px", height: "10px" }} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ marginLeft: 0, minHeight: "100vh" }}>
      <Sider
        style={{
          position: "fixed",
          height: "100%",
          zIndex: 110,
          backgroundColor: "#161B21",
        }}
        width={265}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="bg-custom-400 rounded-lg h-screen m-2">
          <div className="justify-center p-2items-center pt-6 mx-8">
            <img
              className="h-8"
              src="/images/experion technologies.png"
              alt="Company Logo"
            />
          </div>
          <Menu
            theme="dark"
            mode="vertical"
            className="text-base font-display items-center justify-between bg-transparent pt-10 mx-2 "
          >
            <Menu.Item icon={<PieChartOutlined />}>
              <Tooltip title="Dashboard">
                <Link to="/exam/dashboard">Dashboard</Link>
              </Tooltip>
            </Menu.Item>

            {userRole === "SYSTEM_ADMIN" && (
              <>
                <Menu.Item
                  onClick={() => showDefaultDrawer()}
                  icon={<AppstoreAddOutlined />}
                >
                  <Tooltip title="To Create an Asset">Create Assets</Tooltip>
                </Menu.Item>
                <Menu.Item icon={<EditOutlined />}>
                  <Tooltip title="To modify an Asset">
                    <Link to="/exam/updatable_assets">Modify Assets</Link>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item icon={<UserSwitchOutlined />}>
                  <Tooltip title="To allocate an Asset to an employee">
                    <Link to="/exam/assignable_asset">Allocate Assets</Link>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item icon={<UserSwitchOutlined />}>
                  <Tooltip title="To deallocate an Asset from an employee">
                    <Link to="/exam/deallocate">Deallocate Assets</Link>
                  </Tooltip>
                </Menu.Item>
              </>
            )}

            {userRole === "LEAD" && (
              <Menu.Item icon={<EditOutlined />}>
                <Tooltip title="To delete an Asset">
                  <Link to="/exam/updatable_assets">Delete Assets</Link>
                </Tooltip>
              </Menu.Item>
            )}

            {userRole === "MANAGER" && (
              <Menu.Item icon={<EditOutlined />}>
                <Tooltip title="Restore Deleted Assets">
                  <Link to="/exam/updatable_assets">Restore Assets</Link>
                </Tooltip>
              </Menu.Item>
            )}

            {userRole === "LEAD" && (
              <Menu.SubMenu
                key="sub1"
                icon={<CheckSquareOutlined />}
                title="Approve Assets"
                className="bg-custom-400"
              >
                <Menu.Item icon={<CarryOutOutlined />}>
                  <Link to="/exam/creation_requests">
                    <Tooltip title="Approve Assets that are pending to be created">
                      In Creation
                    </Tooltip>
                  </Link>
                </Menu.Item>

                <Menu.Item icon={<CarryOutOutlined />}>
                  <Link to="/exam/updation_requests">
                    <Tooltip title="Approve Assets that are pending to be updated">
                      In Modification
                    </Tooltip>
                  </Link>
                </Menu.Item>

                <Menu.Item icon={<CarryOutOutlined />}>
                  <Link to="/exam/assign_requests">
                    <Tooltip title="Approve Assets that are pending to be allocated">
                      In Allocation
                    </Tooltip>
                  </Link>
                </Menu.Item>
              </Menu.SubMenu>
            )}

            {userRole === "LEAD" && (
              <Menu.Item icon={<MailOutlined />}>
                <Tooltip title="Show Assets that I have approved">
                  <Link to="/exam/my_approvals">My Approval History</Link>
                </Tooltip>
              </Menu.Item>
            )}

            {userRole === "SYSTEM_ADMIN" && (
              <Menu.SubMenu
                key="sub1"
                icon={<MailOutlined />}
                title="My Requests"
                style={{ backgroundColor: "#1D232C" }} // Adjust background color here
              >
                <Menu.Item icon={<CheckCircleOutlined />}>
                  <Tooltip title="Show my Asset Requests which have been approved">
                    <Link to="/exam/approved_requests">Approved</Link>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item icon={<CheckCircleOutlined />}>
                  <Tooltip title="Show the requests which are in pending status">
                    <Link to="/exam/pending_requests">Pending Requests</Link>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item icon={<CloseCircleOutlined />}>
                  <Tooltip title="Show my Asset creation and updation Requests which have been rejected">
                    <Link to="/exam/rejected_assets">Rejected Asset</Link>
                  </Tooltip>
                </Menu.Item>
                <Menu.Item icon={<CloseCircleOutlined />}>
                  <Tooltip title="Show my Asset allocation Requests which have been rejected">
                    <Link to="/exam/rejected_allocation">
                      Rejected Allocation
                    </Link>
                  </Tooltip>
                </Menu.Item>
              </Menu.SubMenu>
            )}

            <Menu.Item icon={<UserSwitchOutlined />}>
              <Tooltip title="To view the expisky assets">
                <Link to="/exam/expired_assets">Expired Assets</Link>
              </Tooltip>
            </Menu.Item>

            <Menu.Item icon={<CarryOutOutlined />}>
              <Tooltip title="Download user agent">
                <Link to="#" onClick={handleDownload}>
                  Download
                </Link>
              </Tooltip>
            </Menu.Item>

            <Menu.Item icon={<RobotOutlined />}>
              <Tooltip title="AI Assistant">
                <Link to="/exam/chat">AssetSense Ai</Link>
              </Tooltip>
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
      <Layout style={{ marginLeft: 0, minHeight: "100vh" }}>
        <Header
          style={{
            position: "fixed",
            zIndex: 100,
            width: "100vw",
            backgroundColor: "#161B21",
            padding: "0 28px",
            height: "97px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="flex w-screen lg:ml-60 sm:px-2 mx-2 bg-custom-400 rounded-lg items-center">
            <div className="flex-1">
              <span className="font-display font-bold text-white ml-8 text-2xl">
                A M S
              </span>
            </div>
            <div className="flex-1 text-right text-gray-200">
              {jwtPayload && jwtPayload.username && (
                <div>
                  <div className={styles["username"]}>
                    <span className="font-display">{jwtPayload.username}</span>
                  </div>
                  {jwtPayload.user_scope && (
                    <div className={styles["userscope"]}>
                      <span className="font-display text-gray-400">
                        {jwtPayload.user_scope.split("_").join(" ")}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mx-4">
              <Dropdown menu={{ items: menuItems }} placement="bottom" arrow>
                <div className="cursor-pointer">
                  <Avatar />
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content style={{ overflow: "initial", backgroundColor: "#161b21" }}>
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
            <Footer className="lg:ml-60 text-center md:ml-40 bg-custom-400">
              <FlowbiteFooter container className="bg-custom-500">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-y-0">
                  <FlowbiteFooter.LinkGroup>
                    <FlowbiteFooter.Link
                      href="https://experionglobal.com/terms-of-use/"
                      className="mr-3 mb-3 lg:mb-0 text-gray-400"
                    >
                      Terms and conditions
                    </FlowbiteFooter.Link>
                    <FlowbiteFooter.Link
                      href="https://experionglobal.com/privacy-policy/"
                      className="mr-3 mb-3 lg:mb-0 text-gray-400"
                    >
                      Privacy Policy
                    </FlowbiteFooter.Link>

                    <FlowbiteFooter.Link
                      href="https://experionglobal.com/"
                      className="mr-3 mb-3 lg:mb-0 text-gray-400"
                    >
                      Contact
                    </FlowbiteFooter.Link>
                  </FlowbiteFooter.LinkGroup>
                  <FlowbiteFooter.LinkGroup>
                    <div className="flex mx-10 gap-x-1">
                      <FlowbiteFooter.Link
                        href="https://www.facebook.com/experiontechnologies/"
                        className="hover:[&>*]:text-black dark:hover:[&>*]:text-white"
                      >
                        <MdFacebook className="text-lg" />
                      </FlowbiteFooter.Link>
                      <FlowbiteFooter.Link
                        href="https://www.instagram.com/experion_technologies/?hl=en"
                        className="hover:[&>*]:text-black dark:hover:[&>*]:text-white"
                      >
                        <FaInstagram className="text-lg" />
                      </FlowbiteFooter.Link>
                      <FlowbiteFooter.Link
                        href="https://twitter.com/experionglobal"
                        className="hover:[&>*]:text-black dark:hover:[&>*]:text-white"
                      >
                        <FaTwitter className="text-lg" />
                      </FlowbiteFooter.Link>
                      <FlowbiteFooter.Link
                        href="https://www.linkedin.com/company/experion-technologies/posts/"
                        className="hover:[&>*]:text-black dark:hover:[&>*]:text-white"
                      >
                        <FaLinkedin className="text-lg" />
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
