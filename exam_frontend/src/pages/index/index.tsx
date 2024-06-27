/* eslint-disable jsx-a11y/anchor-is-valid */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type FC } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import AddAsset from "../../components/AddAsset/AddAsset";
import AssetTable from "../../components/AssetTable/AssetTable";
import SideDrawerComponent from "../../components/SideDrawerComponent/SideDrawerComponent";
import { SidebarHandler } from "../../components/sidebar/SidebarHandler";
import AssignmentDrawer from "../../components/AssignAsset/Assign/AssignmentDrawer";
import { Assignment } from "../../components/AssignAsset/Assign/Assignment";
import ExportButton from "../../components/Export/Export";
import { DataType } from "../../components/AssetTable/types";

const DashboardPage: FC = function () {
  const [displaydrawer, setDisplayDrawer] = useState(false);
  const [isAssign, setIsAssign] = useState(false);
  const [record, setRecord] = useState<DataType>();

  const showDefaultDrawer = () => {
    setDisplayDrawer(true);
  };
  const closeDrawer = () => {
    setDisplayDrawer(false);
  };

  const showAssignDrawer = (record: DataType) => {
    setRecord(record);
    setIsAssign(true);
  };
  const closeAssignDrawer = () => {
    setIsAssign(false);

  };

  return (
    <QueryClientProvider client={new QueryClient()}>
      <NavbarSidebarLayout>
        <div>
          <ExportButton />
          <SidebarHandler addAsset={showDefaultDrawer} />
          {/* <Statistics />         */}

          {record && (
            <AssignmentDrawer
              closeAssignDrawer={closeAssignDrawer}
              isAssign={isAssign}
            >
              <Assignment record={record} />
            </AssignmentDrawer>
          )}

          <AssetTable />

          <SideDrawerComponent
            displayDrawer={displaydrawer}
            closeDrawer={closeDrawer}
          >
            <AddAsset />
          </SideDrawerComponent>

          <div></div>
        </div>
      </NavbarSidebarLayout>
    </QueryClientProvider>
  );
};

export default DashboardPage;
