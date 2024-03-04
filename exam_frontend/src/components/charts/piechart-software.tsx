import { useState } from 'react';
import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


const data = [
    { label: "IN STORE", value: 10, color: '#455e90' },
    { label: "IN USE", value: 1700, color: '#304069'  },
    { label: "IN REPAIR", value: 0, color: '#4f92ef' },
    { label: "EXPIRED", value: 40, color: '#b3d2f8' },
    { label: "DISPOSED", value: 20, color: '#7db1fb' },
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
              innerRadius: 60,
              outerRadius: 140,
              paddingAngle: 1,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              cx: 100,
              cy:150,
              highlightScope: { faded: 'global', highlighted: 'item' },
              faded: { innerRadius: 80, additionalRadius: -50, color: 'gray' },
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