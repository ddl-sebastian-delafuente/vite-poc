import React from 'react';
import * as HighCharts from 'highcharts';
import HighChartsReact from 'highcharts-react-official';
import { colors } from '../../styled';
import { transparent } from '@domino/ui/dist/styled/colors';

export interface DataProps {
  threshold: {
    lessThan?: number;
    greaterThan?: number;
  };
  trendsData: number[];
  yAxisLabel?: string;
  legendLabel?: string;
}

interface TrendChartProps {
  trainingData: DataProps;
}

const DriftTrendChart: React.FC<TrendChartProps> = ({ trainingData }) => {
  const { trendsData, threshold } = trainingData;

  const setValues = (threshold: Record<string, number>, state: 'min' | 'max') => {
    if(threshold.lessThan && threshold.greaterThan, state === 'min'){
      return Math.min(threshold.lessThan, threshold.greaterThan)
    }
    if(threshold.lessThan && threshold.greaterThan, state === 'max'){
      return Math.max(threshold.lessThan, threshold.greaterThan)
    }
    return 0
  }

  const Options = {
    credits: {
      enabled: false
    },
    legend: {
      enabled: false,
      itemStyle: {
        color: colors.black,
        cursor: 'default' as any,
        pointerEvents: 'none'
      },
      itemHoverStyle: {
        color: colors.black,
        cursor: 'default' as any,
        pointerEvents: 'none'
      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 1,
          states: {
            hover: {
              lineWidth: 2,
              enabled: true,
              radius: 3,
              lineColor: colors.cabaret,
              fillColor: colors.white
            }
          }
        }
      }
    },
    title: {
      style: { display: 'none' }
    },
    chart: {
      height: 80,
      zoomType: 'x' as any,
      backgroundColor: 'transparent'
    },
    xAxis: [
      {
        visible: false,
        title: undefined,
        labels: {
          enabled: false
        }
      }
    ],
    yAxis: {
      visible: true,
      title: undefined,
      labels: {
        enabled: false
      },
      plotLines: [
        {
          color: colors.cabaret,
          width: 1,
          value: threshold ? threshold.lessThan : undefined
        },
        {
          color: colors.cabaret,
          width: 1,
          value: threshold ? threshold.greaterThan : undefined
        }
      ],
      plotBands: [
        {
          from: threshold?.lessThan,
          to: 100000,
          color: 'rgba(214, 77, 99, 0.2)'
        },
        {
          from: threshold?.greaterThan,
          to: -100000,
          color: 'rgba(214, 77, 99, 0.2)'
        }
      ],
      gridLineColor: transparent,
      softMin: setValues(threshold, 'min'),
      softMax: setValues(threshold, 'max')
    },
    series: [
      {
        data: trendsData,
        color: colors.mineShaftColor,
        lineWidth: 2,
        events: {
          legendItemClick: function () {
            return false;
          }
        }
      } as any,
      {
        // Series that mimics the plot line
        color: colors.mineShaftColor,
        name: 'Threshold',
        lineWidth: 2,
        marker: {
          enabled: false
        },
        events: {
          legendItemClick: function () {
            return false;
          }
        }
      }
    ],
    tooltip: {
      enabled: false
    }
  };

  return <HighChartsReact Highcharts={HighCharts} options={Options} />;
};

export default DriftTrendChart;
