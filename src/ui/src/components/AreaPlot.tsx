import * as React from 'react';
import { withTheme } from 'styled-components';
import * as Highcharts from 'highcharts';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsReact from 'highcharts-react-official';
import {
  SeriesAreaOptions,
  SeriesAreasplineOptions,
  TooltipFormatterContextObject,
  XAxisOptions
} from 'highcharts';
import { themeHelper } from '../styled/themeUtils';
HighchartsAccessibility(Highcharts);

export enum ChartType {
  Area = 'area',
  AreaSpline = 'areaspline'
}
export interface AreaPlotProps {
  /**
   * data to plot AreaSpline
   */
  data: any;
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
   * outer line color of graph
   */
  lineColor?: string;
  /**
   * tooltip
   */
  tooltipEnabled?: boolean;
  /**
   * name of the series
   */
  name: string;
  tooltipFormatter?: (point: TooltipFormatterContextObject) => string;
  xAxisType?: 'linear' | 'logarithmic' | 'datetime' | 'category';
  yAxisSoftMax?: number;
  xAxisSoftMin?: number;
  xAxisSoftMax?: number;
  categories?: Array<string>;
  showYAxisPlotLine? : boolean;
  type?: ChartType;
  showLabels?: boolean;
  plotBackgroundColor? : string;
  plotBorderColor?: string;
  tickInterval?: number;
  tickLength?: number;
  theme?: any;
  xAxisLabelFormatter?: (timestamp: number) => string;
}
const tooltipFormatterFn = (point: TooltipFormatterContextObject, props: AreaPlotProps) => {
  if (props.tooltipFormatter) {
    return props.tooltipFormatter(point);
  }
  return props.name + ': ' + point.y;
};

const AreaPlot = (props: AreaPlotProps) => {
  const {plotBackgroundColor = 'white', type = ChartType.AreaSpline, xAxisLabelFormatter} = props;
  return (
    <div data-test="area-plot">
    <HighchartsReact
      highcharts={Highcharts}
      options={{
        chart: {
          type: type,
          height: props.height,
          backgroundColor: 'transparent',
          margin: props.showLabels ? undefined : 0,
          spacing: props.showLabels ? [5, 1, 5, 0] : [0, 0, 0, 0],
          plotBackgroundColor: plotBackgroundColor,
          plotBorderColor: props.plotBorderColor,
          plotBorderWidth: 1,
          style: {
            fontFamily: themeHelper('fontFamily')(props)
          }
        },
        title: {
          text: undefined
        },
        credits: {
          enabled: false
        },
        tooltip: {
          useHTML: true,
          enabled: props.tooltipEnabled || false,
          // valueSuffix: props.units,
          formatter: function(this: TooltipFormatterContextObject) {
            return tooltipFormatterFn(this, props);
          }
        },
        plotOptions: {
          [type]: {
            fillOpacity: 1
          }
        },
        series: [{
          name: props.name,
          type: type,
          showInLegend: false,
          data: props.data,
          color: props.primaryColor,
          lineColor: props.lineColor ? props.lineColor : props.primaryColor,
          lineWidth: props.lineColor ? 2 : (props.areaOpacity ? 1 : 0),
          fillOpacity: props.areaOpacity,
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false
              }
            }
          }
        } as SeriesAreaOptions | SeriesAreasplineOptions],
        xAxis: {
          type: props.xAxisType || 'linear',
          categories: props.categories,
          minPadding: 0,
          maxPadding: 0,
          softMin: props.xAxisSoftMin,
          softMax: props.xAxisSoftMax,
          visible: props.showLabels || false,
          labels: {
            formatter: function () {
              return xAxisLabelFormatter && xAxisLabelFormatter(this.value);
            },
            style: {
              fontSize: themeHelper('fontSizes.tiny')(props)
            }
          }
        } as XAxisOptions,
        yAxis: {
          softMax: props.yAxisSoftMax,
          plotLines:[{
            color: 'red',
            value: props.showYAxisPlotLine ? props.yAxisSoftMax : undefined,
            dashStyle: 'ShortDash',
            width: 2,
            className:'y-axis'
          }],
          gridLineWidth: 0,
          tickInterval: props.tickInterval,
          title: {
            text: undefined
          },
          labels: {
            format: '{value}%',
            style: {
              fontSize: '12px'
            }
          },
          minorGridLineWidth: 0,
          minorTickInterval: props.tickInterval,
          minorTickColor: '#ccd6eb',
          minorTickWidth: 1,
          minorTickLength: props.tickLength
        }
      }}
    />
    </div>
    );
};
export default withTheme(AreaPlot);
