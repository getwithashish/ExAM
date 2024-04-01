import React from 'react'
import axiosInstance from '../../config/AxiosConfig'
import { useState, useEffect } from 'react';
import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight} from "react-icons/hi";
import DrawerViewRequest from "../../pages/RequestPage/DrawerViewRequest";



// const fetchAssetLogs = async (assetUuid) => {
//     try{
//         const response = await axiosInstance.get(`/asset_lifecycle/${assetUuid}`);
//         console.log(response.data)
//         return response.data;        
//     }
//     catch(error){
//         console.error("Error fetching asset logs", error);
//         throw error
//     }
// }


const AssetTimelineHandler = () => {
    const [assetLogs, setAssetLogs] = useState(null);
    const [assetUuid, setAssetUuid] = useState('00836843a4594382b8044e685f085306');
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(`/asset_lifecycle/${assetUuid}`);
          setAssetLogs(response.data.data);
        } catch (error) {
          console.error('Error fetching asset logs', error);
        }
      };
      fetchData();
    }, [assetUuid]);
  
    return (
      <Timeline>
        {assetLogs &&
          assetLogs.logs.map((log) => (
            <Timeline.Item key={log.id}>
              <Timeline.Point />
              <Timeline.Content>
                <Timeline.Time>{log.timestamp}</Timeline.Time>
                <Timeline.Title>{log.operation}</Timeline.Title>
                <Timeline.Body>
                  <ul>
                    {Object.entries(log.changes).map(([key, value]) => (
                      value.old_value !== 'None' && (
                        <li key={key}>
                          {key}: {value.old_value} ➡️ {value.new_value}
                        </li>
                      )
                    ))}
                  </ul>
                </Timeline.Body>
                <Button color="gray">
                  View all details
                  <HiArrowNarrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Timeline.Content>
            </Timeline.Item>
          ))}
      </Timeline>
    );
  };
  
  export default AssetTimelineHandler;