import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route, useLocation } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages";
import Login from "./pages/authentication/Login";
import Logout from "./pages/authentication/Logout";
import RequestPage from "./pages/RequestPage/Requests";
import SidebarComponentNew from "./components/sidebar/SidebarComponentNew";
import ExamRoutes from "./ExamRoutes";
// import UserListPage from "./pages/users/list";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

// const location = useLocation();
// const renderSidebar = location.pathname !== "/login";

const root = createRoot(container);

root.render(
  <QueryClientProvider client={new QueryClient()}>
    <StrictMode>
      <Flowbite theme={{ theme }}>
        <ExamRoutes />
      </Flowbite>
    </StrictMode>
  </QueryClientProvider>
);
