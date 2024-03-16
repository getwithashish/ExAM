import React from 'react';
import { AllChartHandlers } from './handlers/AllChartHandlers';
import { PieChartGraphProps } from './types/ChartTypes';

const PieChartGraph: React.FC<PieChartGraphProps> = (props) => {
    return (
        <div>
            <AllChartHandlers {...props} />
        </div>
    );
};

export default PieChartGraph;
