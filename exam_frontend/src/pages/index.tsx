/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import { Statistics } from "../components/charts/piechartBody";


const DashboardPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <div className="my-6">
          <Statistics />
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};


export default DashboardPage;
