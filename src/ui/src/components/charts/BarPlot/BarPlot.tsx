import * as React from 'react';
import * as R from 'ramda';
import * as Highcharts from 'highcharts';
import { Series, SeriesBarOptions, SeriesColumnOptions, TooltipFormatterContextObject } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { defaultPlotOptions } from '@domino/ui/dist/components/charts/utils';

export enum BarType {
  VERTICAL = 'Vertical',
  HORIZONTAL = 'Horizontal'
}

const titleStyles: React.CSSProperties = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap'
};

export type BarOptions = Omit<SeriesBarOptions, 'type'> | Omit<SeriesColumnOptions, 'type'>;

interface Props {
  title?: string;
  height: number;
  barType?: BarType;
  categories: string[];
  data: BarOptions[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  tooltipFormatter?: (point: TooltipFormatterContextObject) => string;
  onClick?: (series: Series) => void;
}

const BarPlot = React.forwardRef((props: Props, ref: React.RefObject<HighchartsReact.RefObject>) => {
  const {title, height, barType, categories, data, xAxisTitle, yAxisTitle, tooltipFormatter, onClick} = props;

  return (
    <HighchartsReact
      highcharts={Highcharts}
      ref={ref}
      options={R.mergeDeepRight(defaultPlotOptions)({
        title: {text: title || '', style: titleStyles},
        chart: {
          height: height,
          type: R.equals(barType, BarType.VERTICAL) ? 'column' : 'bar'
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
          },
          bar: {
            pointPadding: 0,
            events: {
              click: function (this: Series) {
                if (onClick) {
                  onClick(this);
                }
              }
            }
          },
          column: {
            pointPadding: 0,
            events: {
              click: function (this: Series) {
                if (onClick) {
                  onClick(this);
                }
              }
            }
          }
        },
        xAxis: {
          categories: categories,
          title: {
            text: xAxisTitle || null
          },
        },
        yAxis: {
          title: {
            text: yAxisTitle || null
          },
        },
        series: data,
        ...tooltipFormatter ? {
          tooltip: {
            useHTML: true,
            formatter: function (this: any) {
              return tooltipFormatter(this);
            }
          }
        } : {}
      })}
    />
  );
});

export default BarPlot;
