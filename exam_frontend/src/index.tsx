import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import DashboardPage from "./pages";
import SignInPage from "./pages/authentication/Login";
import SignUpPage from "./pages/authentication/Logout";
import EcommerceProductsPage from "./pages/e-commerce/products";
import UserListPage from "./pages/users/list";
import AssetTableOne from "./components/AssetTable/AssetTableOne";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  <QueryClientProvider client={new QueryClient()}>
  <StrictMode>
    <Flowbite theme={{ theme }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignInPage />} />
          <Route path="/dashboard" element={<DashboardPage />} index />         
          <Route path="/authentication/sign-up" element={<SignUpPage />} />
          <Route path="/assignable_asset" element={<AssetTableOne />} />

          <Route
            path="/e-commerce/products"
            element={<EcommerceProductsPage />}
          />
          <Route path="/users/list" element={<UserListPage />} />
        </Routes>
      </BrowserRouter>
    </Flowbite>
  </StrictMode>
  </QueryClientProvider>  
);
