import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import ExamRoutes from "./ExamRoutes";
import { AuthProvider } from "./pages/authentication/AuthContext";

const container = document.getElementById("root");
if (!container) {
  throw new Error("React root element doesn't exist!");
}
const root = createRoot(container);

root.render(
  <QueryClientProvider client={new QueryClient()}>
    <StrictMode>
      <Flowbite theme={{ theme }}>
        <AuthProvider>
          <ExamRoutes />
        </AuthProvider>
      </Flowbite>
    </StrictMode>
  </QueryClientProvider>
);
