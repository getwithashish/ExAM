
//src/components/sidebar/sidebar.tsx

import React from 'react';
import { Sidebar } from 'flowbite-react';
import { HiLogin, HiViewBoards } from 'react-icons/hi';
import { FaDesktop } from 'react-icons/fa';
import { IoCodeWorking } from 'react-icons/io5';
import { BsX ,BsChevronDoubleRight} from 'react-icons/bs';
import styles from './sidebar.module.css';
import { ExamSidebarProps } from './types';


const ExamSidebar: React.FC<ExamSidebarProps> = ({ isSidebarVisible, isClicked, openSidebar, closeSidebar }) => {
  const handleLogout = () => {
    // Logic for handling logout
    console.log('Logout clicked');
  };

  return (
    <>
    <button className={styles['arrowButton']} onClick={openSidebar}>
        <BsChevronDoubleRight className={`h-screen flex justify-center items-center fixed z-50 ${isSidebarVisible ? styles['hidden'] : styles['displayed']}`}></BsChevronDoubleRight>
      
      </button>
      <div className={` ${isClicked ? styles['open'] : isSidebarVisible ? styles['sidebar'] : styles['hidden']}`}>
        <Sidebar aria-label="Sidebar with multi-level dropdown example">
        
          <div className="flex h-full flex-col justify-between py-2">
            <div>
              <button className={styles['closeButton']} onClick={closeSidebar}>
                <BsX />
              </button>
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <div>
                    <h2 className={`${styles['Heading']} dark:text-white`}>Navigation</h2>
                  </div>
                  <Sidebar.Item icon={HiViewBoards} className={styles['scaleup']}>Dashboard</Sidebar.Item>
                  <Sidebar.Item icon={FaDesktop} className={styles['scaleup']} onClick>Add Asset</Sidebar.Item>
                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup>
                  <Sidebar.Item icon={HiLogin} className={styles['scaleup']} onClick={handleLogout}>Logout</Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </div>
          </div>
        </Sidebar>
      </div>
    </>
  );
};

export default ExamSidebar;
