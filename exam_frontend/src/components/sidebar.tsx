
import { useState, useEffect } from 'react';
import { Sidebar } from 'flowbite-react';
import { HiLogin, HiViewBoards } from 'react-icons/hi';
import { FaDesktop } from 'react-icons/fa';
import { IoCodeWorking } from 'react-icons/io5';
import styles from './sidebar.module.css';
import { BsChevronDoubleRight , BsX } from 'react-icons/bs';

const ExamSidebar = () => {

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isClicked,setIsClicked] = useState(false)
  

  const handleResize = () => {
    const isMobile = window.innerWidth <= 768 
    setIsSidebarVisible(!isMobile)
    setIsClicked(!isMobile)
    
  };


  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures this effect runs only once during mount and cleans up on unmount


  const closeSidebar = ()=>{
    setIsSidebarVisible(false)
    setIsClicked(false)
  }

  const openSidebar =()=>{
    console.log("clicked")
    setIsClicked(true)
  }
 
  return (
    <>
       
       <button className={styles['arrowButton']} onClick={()=>openSidebar()} >
        <BsChevronDoubleRight></BsChevronDoubleRight>
       </button>
      <div className={` ${isClicked ? styles['open'] : isSidebarVisible ? styles['sidebar'] : styles['hidden']}`}>
        <Sidebar aria-label="Sidebar with multi-level dropdown example">
          <div className="flex h-full flex-col justify-between py-2">
            <div>
              <button className={styles['closeButton']} onClick={()=>closeSidebar()}>
                <BsX></BsX>
              </button>
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <div> <h2 className={styles['Heading']}>Navigation</h2>
                    </div>
                  <Sidebar.Item icon={HiViewBoards} className={styles['scaleup']}>Dashboard</Sidebar.Item>

                  <div >
                    <h2 className={styles['Heading']} >Category</h2>
                  </div>
                  
                  <Sidebar.Item icon={FaDesktop} className={styles['scaleup']}>Hardware</Sidebar.Item>

                  <Sidebar.Item icon={IoCodeWorking} className={styles['scaleup']}>Software</Sidebar.Item>
                </Sidebar.ItemGroup>

                <Sidebar.ItemGroup>
                  <Sidebar.Item icon={HiLogin} className={styles['scaleup']}>Logout</Sidebar.Item>
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
