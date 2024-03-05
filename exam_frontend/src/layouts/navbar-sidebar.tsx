//src/layouts/navbar-sidebar.tsx

import type { FC, PropsWithChildren } from "react";
import { Footer } from "flowbite-react";
import { SidebarHandler } from "../components/sidebar/SidebarHandler";
import Navbar from "../components/Navbar/navbar";
import Sidebar from "../components/sidebar";
import { MdFacebook } from "react-icons/md";
import { FaDribbble, FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const NavbarSidebarLayout: FC<PropsWithChildren<NavbarSidebarLayoutProps>> =
  function ({ children, isFooter = true }) {
    return (
      <>
        <Navbar />
        <div className="flex items-start pt-16">
          <SidebarHandler />
          <MainContent isFooter={isFooter}>{children}</MainContent>
        </div>
      </>
    );
  };

const MainContent: FC<PropsWithChildren<NavbarSidebarLayoutProps>> = function ({
  children,
  isFooter,
}) {
  return (
    <main className="relative h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900 lg:ml-64">
      {children}
      {isFooter && (
        <div className="mx-4 mt-4">
          <MainContentFooter />
        </div>
      )}
    </main>
  );
};

const MainContentFooter: FC = function () {
  return (
    <>
      <Footer container>
        <div className="flex w-full flex-col gap-y-6 lg:flex-row lg:justify-between lg:gap-y-0">
          <Footer.LinkGroup>
            <Footer.Link href="https://experionglobal.com/terms-of-use/" className="mr-3 mb-3 lg:mb-0">
              Terms and conditions
            </Footer.Link>
            <Footer.Link href="https://experionglobal.com/privacy-policy/" className="mr-3 mb-3 lg:mb-0">
              Privacy Policy
            </Footer.Link>
           
            <Footer.Link href="https://experionglobal.com/">Contact</Footer.Link>
          </Footer.LinkGroup>
          <Footer.LinkGroup>
            <div className="flex gap-x-1">
              <Footer.Link
                href="https://www.facebook.com/experiontechnologies/"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <MdFacebook className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="https://www.instagram.com/experion_technologies/?hl=en"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaInstagram className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="https://twitter.com/experionglobal"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaTwitter className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="https://www.linkedin.com/company/experion-technologies/posts/"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                <FaLinkedin className="text-lg" />
              </Footer.Link>
              <Footer.Link
                href="https://www.linkedin.com/uas/login?session_redirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Fexperion-technologies%2Fposts"
                className="hover:[&>*]:text-black dark:hover:[&>*]:text-gray-300"
              >
                {/* <FaDribbble className="text-lg" /> */}
              </Footer.Link>
            </div>
          </Footer.LinkGroup>
        </div>
      </Footer>
      <p className="my-8 text-center text-sm text-gray-500 dark:text-gray-300">
        &copy; 2024-2025 experionassetmanagement.com All rights reserved.
      </p>
    </>
  );
};

export default NavbarSidebarLayout;
