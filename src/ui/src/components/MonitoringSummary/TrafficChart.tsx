import React from 'react';
import * as highCharts from 'highcharts';
import HighChartsReact from 'highcharts-react-official';
import { colors } from '../../styled';

interface TrendPros {
  value: number;
  date: string;
}

interface DataProps {
  trendsData: TrendPros[];
}

interface TrendChartProps {
  traffic: DataProps;
}

const TrafficChart: React.FC<TrendChartProps> = ({ traffic }) => {
  const { trendsData } = traffic;

  const categoryValues = trendsData.map((data) => data.date);
  const dataValues = trendsData.map((data) => data.value);

  const Options = {
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      },
      series: {
        marker: {
          enabled: true,
          radius: 1,
          states: {
            hover: {
              lineWidth: 1,
              enabled: true,
              radius: 3,
              lineColor: colors.black,
              fillColor: colors.black
            }
          }
        }
      }
    },
    title: {
      style: { display: 'none' }
    },
    chart: {
      height: 140,
      zoomType: 'x' as any,
      backgroundColor: colors.transparent
    },
    xAxis: [
      {
        visible: true,
        title: undefined,
        labels: {
          enabled: true
        },
        categories: categoryValues,
        tickWidth: 1,
      }
    ],
    yAxis: {
      minPadding: 0,
      visible: true,
      title: undefined,
      labels: {
        enabled: true
      }
    },
    series: [
      {
        data: dataValues,
        title: {
          enabled: false
        },
        color: colors.black,
        events: {
          legendItemClick: function () {
            return false;
          }
        }
      } as any
    ],
    tooltip: {
      enabled: false
    }
  };

  return <HighChartsReact highcharts={highCharts} options={Options} />;
};

export default TrafficChart;
