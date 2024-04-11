import { FC, useState } from "react";
import { Button, Drawer } from "antd";
import { HiPencilAlt } from "react-icons/hi";
import AssetTimelineHandler from "./AssetTimelineHandler";

const TimelineDrawer: FC<{
  assetUuid: string;
  onClose: () => void;
  open: boolean;
}> = ({ assetUuid, onClose, open }) => {
  return (
    <Drawer
      title="View Asset Log"
      placement="right"
      onClose={onClose}
      open={open}
      width={1000}
    >
      <AssetTimelineHandler assetUuid={assetUuid} />
    </Drawer>
  );
};

const TimelineViewDrawer: FC<{ assetUuid: string }> = ({ assetUuid }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <Button color="primary" className="mx-5" onClick={handleDrawerOpen}>
        <HiPencilAlt className="mr-2 text-lg font-display mx-2" />
      </Button>
      <TimelineDrawer
        assetUuid={assetUuid}
        onClose={handleDrawerClose}
        open={drawerOpen}
      />
    </>
  );
};

export default TimelineViewDrawer;
