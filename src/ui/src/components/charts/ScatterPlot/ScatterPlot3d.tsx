import * as React from 'react';
import * as Highcharts from 'highcharts';
import { AxisTypeValue } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import Highcharts3d from 'highcharts/highcharts-3d';
import * as R from 'ramda';
import { clickableBlue } from '@domino/ui/dist/styled/colors';
import { defaultPlotOptions, getAxisOptions } from '@domino/ui/dist/components/charts/utils';
import { ScatterPoint } from '@domino/ui/dist/experiments/types';

Exporting(Highcharts);
Highcharts3d(Highcharts);
HighchartsAccessibility(Highcharts);

export type DataPoint = {
  id: string;
  name: string;
  x: ScatterPoint;
  y: ScatterPoint;
  z: ScatterPoint;
}

interface ScatterPlot3dProps {
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
   * z-axis title
   */
  zAxisTitle?: string;
  onClick?: (id: string) => void;
}

const ScatterPlot3d = React.forwardRef((props: ScatterPlot3dProps, ref: React.RefObject<HighchartsReact.RefObject>) => {
  React.useEffect(() => {
    if (ref && ref.current) {
      const chart = ref.current.chart;
      const add3DControl = () => {
        // start to drag a point
        function dragStart(e: MouseEvent | PointerEvent | TouchEvent) {
          const eNormalized = chart.pointer.normalize(e); // point position
          const posX = eNormalized.chartX;
          const posY = eNormalized.chartY;
          const alpha = chart.options.chart?.options3d?.alpha; // rotation around X axis
          const beta = chart.options.chart?.options3d?.beta; // rotation around Y axis
          const sensitivity = 5; // lower is more sensitive
          const handlers: (() => void)[] = []; // event handlers, Highcharts use Function, which is banned in our code

          // drag a point
          const drag = (e: (MouseEvent | TouchEvent) & {chartX: number, chartY: number}) => {
            e = chart.pointer.normalize(e); // point position
            if (alpha && e.chartY && beta) {
              chart.update(
                // option
                {
                  chart: {
                    options3d: {
                      alpha: alpha + (e.chartY - posY) / sensitivity, // set new alpha value
                      beta: beta + (posX - e.chartX) / sensitivity, // set new beta value
                    },
                  },
                },
                undefined, // whether to redraw, default is true
                undefined, // whether items are updated one to one, default is false
                false // whether to apply animation, default is true
              );
            }
          }

          // clear all events
          const unbindAll = () => {
            // @ts-ignore
            handlers.forEach(function (unbind: () => void) {
              if (unbind) {
                unbind();
              }
            });
            handlers.length = 0;
          }

          // add drag and clear events, Highcharts use Function, which is banned in our code, have to call @ts-ignore
          // @ts-ignore
          handlers.push(Highcharts.addEvent(document, 'mousemove', drag));
          // @ts-ignore
          handlers.push(Highcharts.addEvent(document, 'touchmove', drag));
          // @ts-ignore
          handlers.push(Highcharts.addEvent(document, 'mouseup', unbindAll));
          // @ts-ignore
          handlers.push(Highcharts.addEvent(document, 'touchend', unbindAll));
        }

        // add starting rotation events
        Highcharts.addEvent(chart.container, 'mousedown', dragStart);
        Highcharts.addEvent(chart.container, 'touchstart', dragStart);
      }
      add3DControl();
    }
  }, [ref]);

  const xAxisCategories = R.filter(x => !R.isNil(x), R.uniq(R.map(point => point.x.displayVal, props.data)));
  const yAxisCategories = R.filter(x => !R.isNil(x), R.uniq(R.map(point => point.y.displayVal, props.data)));
  const zAxisCategories = R.filter(x => !R.isNil(x), R.uniq(R.map(point => point.z.displayVal, props.data)));

  return (
    <HighchartsReact
      highcharts={Highcharts}
      ref={ref}
      options={R.mergeDeepRight(defaultPlotOptions)({
        chart: {
          type: 'scatter3d',
          marginTop: 60,
          animation: false,
          options3d: {
            enabled: true,
            alpha: 10,
            beta: 30,
            depth: 400,
            fitToPlot: true,
            frame: {
              bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
              back: { size: 1, color: 'rgba(0,0,0,0.04)' },
              side: { size: 1, color: 'rgba(0,0,0,0.06)' }
            }
          },
          height: props.height,
          backgroundColor: 'transparent',
          spacing: [10, 10, 10, 10],
          zoomType: false,
        },
        series: [{
          type: 'scatter3d',
          data: R.map(point => ({
            id: point.id,
            name: point.name,
            x: point.x.val,
            y: point.y.val,
            z: point.z.val
          }), props.data)
        }],
        plotOptions: {
          scatter3d: {
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

            if (!R.isNil(pointData)) {
              return `
                <b>${pointData.name}</b>
                <div style="margin-top: 8px"><b>${props.xAxisTitle}:</b> ${pointData.x.displayVal}</div>
                <div><b>${props.yAxisTitle}:</b> ${pointData.y.displayVal}</div>
                <div><b>${props.zAxisTitle}:</b> ${pointData.z.displayVal}</div>
              `;
            }
            return '';
          }
        },
        credits: {
          enabled: false
        },
        title: {
          text: ''
        },
        legend: false,
        xAxis: R.mergeDeepRight(getAxisOptions(props.xAxisType))({
          categories: R.any(category => !R.isNil(category) && !(/\d+$/.test(`${category}`)), xAxisCategories) ?
            xAxisCategories : undefined,
          title: {
            text: `<b>${props.xAxisTitle || ''}</b>`,
            margin: 40,
          },
          type: props.xAxisType
        }),
        yAxis: {
          categories: R.any(category => !R.isNil(category) && !(/\d+$/.test(`${category}`)), yAxisCategories) ?
            yAxisCategories : undefined,
          title: {
            text: `<b>${props.yAxisTitle || ''}</b>`,
            margin: 90,
          }
        },
        zAxis: R.mergeDeepRight(getAxisOptions())({
          categories: R.any(category => !R.isNil(category) && !(/\d+$/.test(`${category}`)), zAxisCategories) ?
            zAxisCategories : undefined,
          title: {
            text: `<b>${props.zAxisTitle || ''}</b>`,
            margin: 50,
          }
        }),
        exporting: {
          enabled: false
        }
      })}
    />
  );
});

export default ScatterPlot3d;
