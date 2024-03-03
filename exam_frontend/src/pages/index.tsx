
import type { FC } from "react";

import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { Assignment } from "../components/Assign/Assignment";


const DashboardPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
       <Assignment />
      
      </div>
    </NavbarSidebarLayout>
  );
};



export default DashboardPage;
