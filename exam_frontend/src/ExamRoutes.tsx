import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
import ExpiredAssets from "./pages/ExpiredAssets/ExpiredAssets";
import PendingRequestPage from "./pages/PendingRequest/PendingRequestPage";

const pageVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: -100,
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.7,
};

const ExamRoutes = () => {
  const { setAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
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
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route
          path="/exam/*"
          element={
            <SidebarComponentNew>
              <div className="dark">
                <motion.div
                  key={location.key}
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
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
                    <Route
                      path="/rejected_assets"
                      element={<RejectedAsset />}
                    />
                    <Route
                      path="/rejected_allocation"
                      element={<RejectedAllocationAsset />}
                    />
                    <Route
                      path="/approved_requests"
                      element={<ApprovedRequestPage />}
                    />
                    <Route
                      path="/pending_requests"
                      element={<PendingRequestPage />}
                    />
                    <Route path="/my_approvals" element={<MyApprovalPage />} />
                    <Route path="/chat" element={<AssetSense />} />
                    <Route path="/expired_assets" element={<ExpiredAssets />} />
                  </Routes>
                </motion.div>
              </div>
            </SidebarComponentNew>
          }
        />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/sso/flow" element={<SSORedirect />} />
    </Routes>
  );
};

export default ExamRoutes;
