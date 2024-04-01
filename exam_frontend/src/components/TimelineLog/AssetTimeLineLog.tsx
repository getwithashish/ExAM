import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight} from "react-icons/hi";
import DrawerViewRequest from "../../pages/RequestPage/DrawerViewRequest";

interface TimelineLogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export function TimelineLog({ visible, setVisible }: TimelineLogProps) {
  const onClose = () => setVisible(false);

  return (
    <DrawerViewRequest
      visible={visible}
      onClose={onClose}
      title="Timeline"
    >
    <Timeline>
      <Timeline.Item>
        <Timeline.Point />
        <Timeline.Content>
        <Timeline.Time>19/03/2024</Timeline.Time>
          <Timeline.Title>Asset Updated</Timeline.Title>
          <Timeline.Body>
            <ol>
              <li>
                Changed from version 1 to version 2
              </li>
              <li>
                Changed from memory 16 to memory 32
              </li>
            </ol>
          </Timeline.Body>
          <Button color="gray">
            View all details
            <HiArrowNarrowRight className="ml-2 h-3 w-3" />
          </Button>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Point />
        <Timeline.Content>
          <Timeline.Time>19/01/2024</Timeline.Time>
          <Timeline.Title>Asset Updated</Timeline.Title>
          <Timeline.Body>
          <ol>
              <li>
                Changed from location: trivandrum to location kochi
              </li>
            </ol>
          </Timeline.Body>
          <Button color="gray">
            View all details
            <HiArrowNarrowRight className="ml-2 h-3 w-3" />
          </Button>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Point />
        <Timeline.Content>
        <Timeline.Time>12/10/2023</Timeline.Time>
          <Timeline.Title>Asset Created</Timeline.Title>
          <Timeline.Body>
          {/*  */}
          </Timeline.Body>
          <Button color="gray">
            View all details
            <HiArrowNarrowRight className="ml-2 h-3 w-3" />
          </Button>
        </Timeline.Content>
      </Timeline.Item>
    </Timeline>
    </DrawerViewRequest>

  );
}