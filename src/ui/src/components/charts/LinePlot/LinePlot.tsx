import * as React from 'react';
import * as R from 'ramda';
import * as Highcharts from 'highcharts';
import {
  AxisTypeValue,
  LegendOptions,
  Series,
  SeriesLineOptions,
  TooltipFormatterContextObject
} from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { defaultPlotOptions } from '@domino/ui/dist/components/charts/utils';
import { colors, fontSizes } from '@domino/ui/dist/styled';

export type LineOptions = Omit<SeriesLineOptions, 'type'>;

interface Props {
  title?: string;
  height: number;
  xAxisTitle?: string;
  xAxisType?: AxisTypeValue;
  yAxisTitle?: string;
  yAxisType?: AxisTypeValue;
  data: LineOptions[];
  tooltipFormatter?: (point: TooltipFormatterContextObject) => string;
  legendOptions?: LegendOptions;
  subtitle?: string;
  onClick?: (series: Series) => void;
}

const titleStyles: React.CSSProperties = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};

const subTitleStyles: React.CSSProperties = { color: colors.neutral900, fontSize: fontSizes.TINY };

const LinePlot = React.forwardRef((props: Props, ref: React.RefObject<HighchartsReact.RefObject>) => {
  const {title, height, data, xAxisTitle, yAxisTitle, tooltipFormatter, xAxisType, yAxisType, legendOptions,
    subtitle } = props;

  const getFormattedData = () => data.map((series: LineOptions) =>
    series.data?.length === 1 ? R.mergeDeepRight(series, {
      marker: {
        enabled: true
      }
    }) : series
  );

  return (
    <HighchartsReact
      highcharts={Highcharts}
      ref={ref}
      options={R.mergeDeepRight(defaultPlotOptions)({
        title: {text: title, style: titleStyles},
        chart: {
          height: height,
          spacing: [10, 10, 15, 10]
        },
        plotOptions: {
          line: {
            cursor: 'pointer',
            marker: {
              enabled: false
            },
            title: {
              enabled: false
            },
            events: {
              click: function (this: Series) {
                const { onClick } = props;
                if (onClick) {
                  onClick(this);
                }
              }
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          ...legendOptions
        },
        xAxis: {
          title: {
            text: xAxisTitle || ''
          },
          type: xAxisType,
          alignTicks: false,
          startOnTick: false,
          endOnTick: false
        },
        yAxis: {
          title: {
            text: yAxisTitle || ''
          },
          type: yAxisType,
          alignTicks: false,
          startOnTick: false,
          endOnTick: false,
        },
        series: getFormattedData(),
        ...tooltipFormatter ? {
          tooltip: {
            useHTML: true,
            formatter: function (this: any) {
              return tooltipFormatter(this);
            },
          }
        } : {},
        subtitle: {text: subtitle, style: subTitleStyles}
      })}
    />
  );
});

export default LinePlot;
