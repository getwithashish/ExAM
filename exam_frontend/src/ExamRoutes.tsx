import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import SidebarComponentNew from "./components/sidebar/SidebarComponentNew";
import DashboardPage from "./pages";
import Login from "./pages/authentication/Login";
import Assignableasset from "./pages/AssignAsset/assignableasset";
import AssignPage from "./pages/RequestPage/AssignRequest";
import RequestPage from "./pages/RequestPage/AssetRequest";
import { useAuth } from "./pages/authentication/AuthContext";
import ProtectedRoute from "./pages/authentication/ProtectedRoute";
import SSORedirect from "./pages/authentication/SSORedirect";
import UpdatableAsset from "./pages/UpdatableAssetPage/UpdatableAsset";
import RejectedAsset from "./pages/RejectedAssetPage/RejectedAsset";
import ApprovedRequestPage from "./pages/ApprovedRequest/ApprovedRequestPage";
import MyApprovalPage from "./pages/MyApprovals/MyApprovalPage";

const ExamRoutes = () => {
  const { authenticated, setAuthenticated, userRole } = useAuth();

  useLayoutEffect(() => {
    // Code to execute before initial render
    console.log("Code executed before initial render");
    const storedValue = localStorage.getItem("jwt");
    if (storedValue) {
      setAuthenticated(true);
      //   setValue(JSON.parse(storedValue));
    }
  }, []);

  useEffect(() => {
    // Load value from localStorage when component mounts
    const storedValue = localStorage.getItem("jwt");
    console.log("JWT in auth context: ", storedValue);
    if (storedValue) {
      setAuthenticated(true);
      //   setValue(JSON.parse(storedValue));
    }
  }, []);

  return (
    <BrowserRouter>
      {/* <SidebarComponentNew>
            <Routes>
              <Route path="/" element={<Login />} />

              <Route path="/dashboard" element={<DashboardPage />} index />
              <Route path="/logout" element={<Logout />} />
              <Route path="/requests" element={<RequestPage />} />
            </Routes>
          </SidebarComponentNew> */}

      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/exam/*"
            element={
              <SidebarComponentNew>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/requests" element={<RequestPage />} />
                  <Route
                    path="/assignable_asset"
                    element={<Assignableasset />}
                  />
                  <Route path="/assign_requests" element={<AssignPage />} />
                  <Route path="/updatable_assets" element={<UpdatableAsset/>}/>
                  <Route path="/rejected_assets" element={<RejectedAsset/>}/>
                  <Route  path="/approved_requests" element={<ApprovedRequestPage />}/>
                  <Route path="/my_approvals" element={<MyApprovalPage />}/>
                </Routes>
              </SidebarComponentNew>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/sso/flow" element={<SSORedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default ExamRoutes;
