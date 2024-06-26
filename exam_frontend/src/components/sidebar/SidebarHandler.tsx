//src/components/sidebar/SidebarHandler.tsx

import { useState, useEffect } from "react";
import ExamSidebar from "./sidebar";

export const SidebarHandler = ({ addAsset }: { addAsset: () => void }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleResize = () => {
    const isMobile: boolean = window.innerWidth <= 1024;
    setIsSidebarVisible(!isMobile);
    setIsClicked(!isMobile);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeSidebar = () => {
    setIsSidebarVisible(false);
    setIsClicked(false);
  };

  const openSidebar = () => {
    setIsSidebarVisible(true);
  };

  return (
    // <div style={{ backgroundColor: 'white' }} >
    <ExamSidebar
      isSidebarVisible={isSidebarVisible}
      isClicked={isClicked}
      openSidebar={openSidebar}
      closeSidebar={closeSidebar}
      addAsset={addAsset}
    />
    // </div>
  );
};
