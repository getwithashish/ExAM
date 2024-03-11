import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages";
import Login from "./pages/authentication/Login";
import Logout from "./pages/authentication/Logout";
import RequestPage from "./pages/e-commerce/Requests";
// import UserListPage from "./pages/users/list";


const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <Flowbite theme={{ theme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} index />         
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/dashboard/requests"
            element={<RequestPage />}
          />
          {/* <Route path="/users/list" element={<UserListPage />} /> */}
        </Routes>
      </BrowserRouter>
    </Flowbite>
  </StrictMode>
);
