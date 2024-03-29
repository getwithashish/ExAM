/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, FC } from "react";
import { Statistics } from "../components/charts/Statistics";
import DasboardAssetHandler from '../components/DashboardAssetTable/DasboardAssetHandler'
import { QueryBuilderComponent } from "../components/QueryBuilder/QueryBuilder";
import DrawerViewRequest from "./RequestPage/DrawerViewRequest";
import { Button } from "flowbite-react";

const DashboardPage: FC = function () {
  const [visible, setVisible] = useState(false);

  const showQueryBuilder = () => {
    setVisible(true);
  };

  const closeQueryBuilder = () => {
    setVisible(false);
  };
 
  return (
    <div className="bg-white">
      <Statistics />
      <DasboardAssetHandler />
      <Button onClick={showQueryBuilder} className="bg-blue-500 p-2 ml-10 h-50 w-50 font-display">QueryBuilder</Button>
      <DrawerViewRequest
        title="Assign"
        onClose={closeQueryBuilder}
        visible={visible}
      >
        <QueryBuilderComponent />
      </DrawerViewRequest>
    </div>
  );
};

export default DashboardPage;
