import type { FC } from "react";
import {Navbar } from "flowbite-react";
import  styles from './navbar.module.css';


const ExampleNavbar: FC = function () {
  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* <Navbar.Brand href="/"> */}
             
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
             
              <img src="images/logo.png" alt="Logo" className="mr-3 h-6 sm:h-8" />
              
              </span>
            {/* </Navbar.Brand> */}
          </div>
          <div className="flex items-center gap-3">

        <div className={`flex items-center gap-3 ${styles['button-components']}`}>
         
{/*             
              <Button>
                <FaBell />
              </Button> */}

               
                 {/* <DarkThemeToggle /> */}

            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
