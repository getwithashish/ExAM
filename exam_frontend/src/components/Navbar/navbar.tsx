import React, { FC, useEffect, useState } from "react";
import { Button, DarkThemeToggle, Navbar } from "flowbite-react";
import { FaBell } from 'react-icons/fa';
import styles from './navbar.module.css';
import MenuListComposition from "../menuItem";
import AccountMenu from "../notificationMenuItem";

const ExampleNavbar: FC = function () {
  const [jwtPayload, setJwtPayload] = useState<any>(null);

  useEffect(() => {
    // Function to decode JWT token
    const decodeJWT = (token: string) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
    };

    // Get JWT token from localStorage
    const jwtToken = localStorage.getItem('jwt');
    console.log(jwtToken)

    // Decode JWT token and set payload
    if (jwtToken) {
      const payload = decodeJWT(jwtToken);
      console.log(payload)
      console.log(payload.username)
      setJwtPayload(payload);
    }
  }, []);

  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              <img src="../../public/images/logo.png" alt="Logo" className="mr-3 h-6 sm:h-8" />
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-3 ${styles['button-components']}`}>
              <AccountMenu />
              {/* <Button>
                <FaBell />
              </Button> */}
              {/* <DarkThemeToggle /> */}
              <MenuListComposition />
              {jwtPayload && jwtPayload.username && (
                <span className={styles["username"]}>Hi, {jwtPayload.username}</span>
                
              )}
               {jwtPayload && jwtPayload.user_scope && (
                <span className={styles["userscope"]}>{jwtPayload.user_scope}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;
