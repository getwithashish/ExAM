import { FC, useState } from 'react';
import { Button, Drawer } from 'antd';
import { HiPencilAlt } from 'react-icons/hi';
import AssetTimelineHandler from './AssetTimelineHandler';

const TimelineDrawer: FC<{ assetUuid: string; onClose: () => void; visible: boolean }> = ({ assetUuid, onClose, visible }) => {
  return (
    <Drawer
      title="View Asset Log"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={1000}
    >
      <AssetTimelineHandler assetUuid={assetUuid} />
    </Drawer>
  );
};

const TimelineButton: FC<{ assetUuid: string }> = ({ assetUuid }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleDrawerOpen = () => {
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  return (
    <>
      <Button color="primary" className="mx-5" onClick={handleDrawerOpen}>
        <HiPencilAlt className="mr-2 text-lg font-display mx-2" />
      </Button>
      <TimelineDrawer assetUuid={assetUuid} onClose={handleDrawerClose} visible={drawerVisible} />
    </>
  );
};

export default TimelineButton;
