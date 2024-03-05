//src/components/sidebar/SidebarHandler.tsx

import { useState, useEffect } from 'react';
import ExamSidebar from './sidebar';

export const SidebarHandler = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const handleResize = () => {
    const isMobile: boolean = window.innerWidth <= 1024;
    setIsSidebarVisible(!isMobile);
    setIsClicked(!isMobile);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const closeSidebar = () => {
    setIsSidebarVisible(false);
    setIsClicked(false);
  };

  const openSidebar = () => {
    console.log("clicked");
    // setIsClicked(true);
    setIsSidebarVisible(true)
  };

  return (
    <div>
      <ExamSidebar
        isSidebarVisible={isSidebarVisible}
        isClicked={isClicked}
        openSidebar={openSidebar}
        closeSidebar={closeSidebar}
      />
    </div>
  );
};
