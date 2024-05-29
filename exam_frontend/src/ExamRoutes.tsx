import { useEffect, useLayoutEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import SidebarComponentNew from "./components/sidebar/SidebarComponentNew";
import DashboardPage from "./pages";
import Login from "./pages/authentication/Login";
import Assignableasset from "./pages/AssignAsset/Allocate";
import AssignPage from "./pages/RequestPage/AssignRequest";
import { useAuth } from "./pages/authentication/AuthContext";
import ProtectedRoute from "./pages/authentication/ProtectedRoute";
import SSORedirect from "./pages/authentication/SSORedirect";
import UpdatableAsset from "./pages/UpdatableAssetPage/UpdatableAsset";
import RejectedAsset from "./pages/RejectedAssetPage/RejectedAsset";
import ModificationRequests from "./pages/RequestPage/ModifcationRequests";
import CreateRequestPage from "./pages/RequestPage/CreateRequest";
import ApprovedRequestPage from "./pages/ApprovedRequest/ApprovedRequestPage";
import MyApprovalPage from "./pages/MyApprovals/MyApprovalPage";
import Deallocate from "./pages/Deallocate/Deallocate";
import RejectedAllocationAsset from "./pages/RejectedAssetPage/RejectedAllocation";
import AssetSense from "./components/ChatBot/assetSense";
import ExpiredAssets from "./pages/ExpiredAssets/ExpiredAssets"

const ExamRoutes = () => {
  const { setAuthenticated } = useAuth();

  useLayoutEffect(() => {
    const storedValue = localStorage.getItem("jwt");
    if (storedValue) {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const storedValue = localStorage.getItem("jwt");
    if (storedValue) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/exam/*"
            element={
              <SidebarComponentNew>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/updatable_assets"
                    element={<UpdatableAsset />}
                  />
                  <Route
                    path="/assignable_asset"
                    element={<Assignableasset />}
                  />
                  <Route path="/deallocate" element={<Deallocate />} />
                  <Route
                    path="/creation_requests"
                    element={<CreateRequestPage />}
                  />
                  <Route
                    path="/updation_requests"
                    element={<ModificationRequests />}
                  />
                  <Route path="/assign_requests" element={<AssignPage />} />
                  <Route path="/rejected_assets" element={<RejectedAsset />} />
                  <Route path="/rejected_allocation" element={<RejectedAllocationAsset />} />
                  <Route path="/approved_requests" element={<ApprovedRequestPage />} />
                  <Route path="/my_approvals" element={<MyApprovalPage />} />
                  <Route path="/chat" element={<AssetSense />} />
                  <Route path="/expired_assets" element={<ExpiredAssets />} />
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