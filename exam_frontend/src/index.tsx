import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { Flowbite } from "flowbite-react";
import ExamRoutes from "./ExamRoutes";
import { AuthProvider } from "./pages/authentication/AuthContext";
import { createTheme, ThemeProvider } from "@mui/material";
import { ConfigProvider, theme } from "antd";

const container = document.getElementById("root");
if (!container) {
  throw new Error("React root element doesn't exist");
}
const root = createRoot(container);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
});

const { darkAlgorithm } = theme;

const customTheme = {
  algorithm: darkAlgorithm,
  components: {
    Drawer: {
      colorBgElevated: "#161B21",
      colorText: "#FFFFFF",
    },
  },
};

root.render(
  <QueryClientProvider client={new QueryClient()}>
    <StrictMode>
      <Flowbite>
        <AuthProvider>
          <ThemeProvider theme={darkTheme}>
          <ConfigProvider theme={customTheme}>
            <ExamRoutes />
            </ConfigProvider>
          </ThemeProvider>
        </AuthProvider>
      </Flowbite>
    </StrictMode>
  </QueryClientProvider>
);
