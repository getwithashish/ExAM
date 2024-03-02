import { useState } from 'react';
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const data = [
    { label: "IN STORE", value: 200, color: '#03045e'},
    { label: "IN USE", value: 1300, color:  '#00b4d8'},
    { label: "IN REPAIR", value: 150, color: '#90e0ef'},
    { label: "EXPIRED", value: 30 , color: '#0077b6'},
    { label: "DISPOSED", value: 50, color: '#caf0f8'},
];

export default function PieChartHardware() {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <Stack direction="row">
      <FormControlLabel
        control={
          <Checkbox
            checked={isHidden}
            onChange={(event) => setIsHidden(event.target.checked)}
          />
        }
        label="Hide Legend"
        labelPlacement="end"
      />
      
      <PieChart
        series={[
          {
            data,
            innerRadius: 70,
            outerRadius: 140,
            paddingAngle: 1,
            cornerRadius: 5,
            startAngle: 0,
            endAngle: 360,
            cx: 100,
            cy:150,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 90, additionalRadius: -30, color: 'gray' },
          },
        ]}
        width={500}
        height={300}
        legend={{
          direction: 'column',
          position: { vertical: 'middle', horizontal: 'right' },
          hidden: isHidden // Setting hidden property based on isHidden state
        }}
      />
    </Stack>
  );
}
