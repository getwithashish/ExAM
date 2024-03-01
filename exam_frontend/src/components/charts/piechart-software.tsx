import Stack from "@mui/material/Stack";
import { PieChart } from "@mui/x-charts/PieChart";


const data = [
    { label: "IN STORE", value: 10, color: '#03045e' },
    { label: "IN USE", value: 1700, color: '#00b4d8'  },
    { label: "IN REPAIR", value: 0, color: '#90e0ef' },
    { label: "EXPIRED", value: 40, color: '#0077b6' },
    { label: "DISPOSED", value: 20, color: '#caf0f8' },
  ];


export default function PieChartSoftware() {
    return (
      <Stack direction="row">
        <PieChart
          series={[
            {
                data,
                innerRadius: 70,
                outerRadius: 130,
                paddingAngle: 1,
                cornerRadius: 5,
                startAngle: 0,
                endAngle: 360,
                cx: 140,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 50, additionalRadius: -40, color: 'gray' },
            },
          ]}
          width={300}
          height={300}
          legend ={{hidden: true}}
        />
      </Stack>
    );
  }