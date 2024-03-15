import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import SidebarComponentNew from "./components/sidebar/SidebarComponentNew";
import DashboardPage from "./pages";
import Login from "./pages/authentication/Login";
import Assignableasset from "./pages/assignableasset";
import AssignPage from "./pages/RequestPage/AssignRequest";
import RequestPage from "./pages/RequestPage/AssetRequest";


const ExamRoutes = () => {
  

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
        <Route
          path="/exam/*"
          element={
            <SidebarComponentNew>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/requests" element={<RequestPage />} />
                <Route path="/assignable_asset" element={<Assignableasset />} />
                <Route path="/assign_requests" element={<AssignPage />}/>
              </Routes>
            </SidebarComponentNew>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default ExamRoutes;
