import * as React from 'react';
import HighChartsReact from 'highcharts-react-official';
import * as highCharts from 'highcharts';
import { mediumGrey } from '../../styled/colors';

export interface DataProps {
  type: string;
  value: number[];
}

interface TrainingDataType {
  trainingData: DataProps;
}

const TrainingHistory: React.FC<TrainingDataType> = ({ trainingData }) => {
  const { type, value } = trainingData;
  const options = {
    chart: {
      height: 80,
      zoomType: 'x' as any,
      backgroundColor: 'transparent'
    },
    title: undefined,
    xAxis: [
      {
        visible: false,
        title: undefined,
        labels: {
          enabled: false
        }
      }
    ],
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },
    yAxis: {
      visible: false,
      title: undefined,
      labels: {
        enabled: false
      }
    },
    plotOptions: {
      column: {
        shadow: false,
        borderWidth: 1,
        pointPadding: 0,
        groupPadding: 0,
        pointStart: 0,
        pointInterval: 1,
        pointPlacement: 'between' as any
      }
    },
    legend: {
      enabled: false
    },
    series: [
      {
        type: 'column' as any,
        name: type === 'TRAINING' ? 'Training' : 'Prediction',
        data: value,
        color: mediumGrey
      }
    ]
  };

  return <HighChartsReact highcharts={highCharts} options={options} />;
};

export default TrainingHistory;
