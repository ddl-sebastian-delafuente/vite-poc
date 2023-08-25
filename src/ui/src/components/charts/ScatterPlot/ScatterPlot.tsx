import * as React from 'react';
import * as Highcharts from 'highcharts';
import { AxisTypeValue, TooltipFormatterContextObject } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import * as R from 'ramda';
import { clickableBlue } from '@domino/ui/dist/styled/colors';
import { defaultPlotOptions, getAxisOptions } from '@domino/ui/dist/components/charts/utils';
import { ScatterPoint } from '../../../experiments/types';

Exporting(Highcharts);
HighchartsAccessibility(Highcharts);

export type DataPoint = {
  id: string;
  name: string;
  x: ScatterPoint;
  y: ScatterPoint;
};

const titleStyles: React.CSSProperties = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap'
};

interface ScatterPlotProps {
  title?: string;
  /**
   * data to plot
   */
  data: Array<DataPoint>;
  /**
   * Height of graph
   */
  height: number;
  /**
   * x-axis title
   */
  xAxisTitle?: string;
  xAxisType?: AxisTypeValue;
  /**
   * y-axis title
   */
  yAxisTitle?: string;
  /**
   * Callback on clicking point
   */
  onClick?: (id: string) => void;
  tooltipFormatter?: (point: TooltipFormatterContextObject) => string;
}

const ScatterPlot = React.forwardRef((props: ScatterPlotProps, ref: React.RefObject<HighchartsReact.RefObject>) => {
  const xAxisCategories = R.uniq(R.map(point => point.x.displayVal, props.data));
  const yAxisCategories = R.uniq(R.map(point => point.y.displayVal, props.data));

  return (
    <HighchartsReact
      highcharts={Highcharts}
      ref={ref}
      options={R.mergeDeepRight(defaultPlotOptions)({
        chart: {
          type: 'scatter',
          height: props.height,
          backgroundColor: 'transparent',
          padding: 20,
          spacing: [10, 50, 0, 0],
          zoomType: 'xy'
        },
        series: [{
          type: 'scatter',
          data: R.map(point => ({
            id: point.id,
            name: point.name,
            x: point.x.val,
            y: point.y.val
          }), props.data)
        }],
        plotOptions: {
          scatter: {
            cursor: 'pointer',
            states: {
              hover: {
                color: clickableBlue,
              }
            },
            point: {
              events: {
                click: function (this: any) {
                  const { onClick } = props;
                  if (onClick) {
                    onClick(this.id);
                  }
                }
              }
            }
          }
        },
        tooltip: {
          useHTML: true,
          formatter: function (this: any) {
            const pointData = R.find(dataPoint => R.equals(dataPoint.id, this.point.id), props.data);

            return props.tooltipFormatter ? props.tooltipFormatter(this) : (!R.isNil(pointData) ? `
              <b>${this.point.name}</b>
              <div style="margin-top: 8px"><b>${props.xAxisTitle}:</b> ${pointData.x.displayVal}</div>
              <div><b>${props.yAxisTitle}:</b> ${pointData.y.displayVal}</div>
            ` : '');
          }
        },
        credits: {
          enabled: false
        },
        title: {text: props.title, style: titleStyles},
        legend: false,
        xAxis: R.mergeDeepRight(getAxisOptions(props.xAxisType))({
          categories: R.any(category => !R.isNil(category) && !(/\d+$/.test(`${category}`)), xAxisCategories) ?
            xAxisCategories : undefined,
          title: {
            text: `<b>${props.xAxisTitle || ''}</b>`
          },
          type: props.xAxisType
        }),
        yAxis: {
          categories: R.any(category => !R.isNil(category) && !(/\d+$/.test(`${category}`)), yAxisCategories) ?
            yAxisCategories : undefined,
          title: {
            text: `<b>${props.yAxisTitle || ''}</b>`
          }
        },
        exporting: {
          enabled: false
        }
      })}
    />
  );
});

export default ScatterPlot;
