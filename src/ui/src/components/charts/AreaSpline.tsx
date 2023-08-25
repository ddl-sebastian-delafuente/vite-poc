import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import { withTheme } from 'styled-components';
import { themeHelper } from '../../styled/themeUtils';
HighchartsAccessibility(Highcharts);

export interface AreaSplineProps {
  /**
   * data to plot AreaSpline
   */
  data: Array<number>;
  /**
   * Line color of graph. Same color with a little opacity applies to area
   */
  primaryColor: string;
  /**
   * Opacity amount to apply on primary color parameter. The resulted color applies to area
   */
  areaOpacity?: number;
  /**
   * Height of graph
   */
  height: number;
  /**
   * Tooltip text
   */
  titleText?: string;
  /**
   * Enables tooltip
   */
  tooltipEnabled?: boolean;
  theme?: any;
}

const AreaSpline = (props: AreaSplineProps) => {
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          type: 'areaspline',
          height: props.height,
          backgroundColor: 'transparent',
          margin: 0,
          spacing: [0, 0, 0, 0],
          style: {
            fontFamily: themeHelper('fontFamily')(props)
          }
        },
        title: {
          text: props.titleText
        },
        credits: {
          enabled: false
        },
        tooltip: {
          enabled: props.tooltipEnabled || false
        },
        plotOptions: {
          areaspline: {
            fillOpacity: 1
          }
        },
        series: [{
          type: 'areaspline',
          data: props.data,
          showInLegend: false,
          color: props.primaryColor,
          lineColor: props.primaryColor,
          lineWidth: props.areaOpacity ? 1 : 0,
          fillOpacity: props.areaOpacity,
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false
              }
            }
          },
        }],
        xAxis: {
          visible: false,
          minPadding: 0,
          maxPadding: 0
        },
        yAxis: {
          visible: false
        }
      }}
    />);
};

export default withTheme(AreaSpline);
