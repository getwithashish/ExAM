import React, { useCallback, useMemo, useState } from "react";
import DropDown from "../../components/DropDown/DropDown";
import { CloudDownloadOutlined, UploadOutlined } from "@mui/icons-material";
import SideDrawerComponent from "../../components/SideDrawerComponent/SideDrawerComponent";
import UploadComponent from "../../components/Upload/UploadComponent";
import { useNavigate } from "react-router-dom";

const InitialImportPage = () => {
  const [showUpload, setShowUpload] = useState(false);
  const closeImportDrawer = () => {
    setShowUpload(false);
  };

  const navigate = useNavigate();

  const decodeJWT = useCallback((token: string) => {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url)
        throw new Error("Invalid token format: missing base64Url");
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }, []);

  const userScope = useMemo(() => {
    const jwtToken = localStorage.getItem("jwt");
    return jwtToken ? decodeJWT(jwtToken)?.user_scope : null;
  }, [decodeJWT]);

  const handleDropDownSelect = useCallback(
    (key: string) => {
      if (key === "import") {
        setShowUpload(true);
      } else if (key === "downloadTemplate") {
        const link = document.createElement("a");
        link.href = "/static/sample_asset_download_template.csv";
        link.setAttribute("download", "sample_asset_download_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    [setShowUpload]
  );

  if (userScope === "MANAGER") {
    return (
      <div className="ml-6">
        <DropDown
          onSelect={handleDropDownSelect}
          items={[
            { label: "Import Files", key: "import", icon: <UploadOutlined /> },
          ]}
          buttonLabel="Import"
        />
        <SideDrawerComponent
          displayDrawer={showUpload}
          closeDrawer={closeImportDrawer}
        >
          <UploadComponent initial_import={true} />
        </SideDrawerComponent>
      </div>
    );
  } else {
    navigate("/exam/dashboard");
    return null;
  }
};

export default InitialImportPage;
