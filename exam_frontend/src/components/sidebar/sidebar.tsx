
//src/components/sidebar/sidebar.tsx

import React from 'react';
import { Sidebar } from 'flowbite-react';
import { HiLogin, HiViewBoards } from 'react-icons/hi';
import { FaDesktop } from 'react-icons/fa';
import { IoCodeWorking } from 'react-icons/io5';
import { BsX ,BsChevronDoubleRight} from 'react-icons/bs';
import styles from './sidebar.module.css';
import { ExamSidebarProps } from './types';
import { Link } from 'react-router-dom';


const ExamSidebar: React.FC<ExamSidebarProps> = ({ isSidebarVisible, isClicked, openSidebar, closeSidebar ,addAsset }) => {
  const handleLogout = () => {
    // Logic for handling logout
    console.log('Logout clicked');
  };

  return (
    <>
    <button className={styles['arrowButton']} onClick={openSidebar}>
        <BsChevronDoubleRight className={`h-screen flex justify-center items-center fixed z-50 ${isSidebarVisible ? styles['hidden'] : styles['displayed']}`}></BsChevronDoubleRight>
      
      </button>
    <div style={{ backgroundColor: 'white' }}>
      <div className={` ${isClicked ? styles['open'] : isSidebarVisible ? styles['sidebar'] : styles['hidden']}`} >
        <Sidebar aria-label="Sidebar with multi-level dropdown example ">
        
          <div className="flex h-full flex-col justify-between  bg-white">
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
                  <Sidebar.Item icon={FaDesktop} className={styles['scaleup']} onClick={addAsset} >Add Asset</Sidebar.Item>
                  <Link to="/assignable_asset">
                    <Sidebar.Item icon={FaDesktop} className={styles['scaleup']}>Assignable Assets</Sidebar.Item>
                  </Link>
                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup>
                  <Sidebar.Item icon={HiLogin} className={styles['scaleup']} onClick={handleLogout}>Logout</Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </div>
          </div>
        </Sidebar>
      </div>
    </div>
    </>
  );
};

export default ExamSidebar;
