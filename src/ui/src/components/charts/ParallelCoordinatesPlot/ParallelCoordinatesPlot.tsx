import * as React from 'react';
import * as R from 'ramda';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import HighchartsParallelCoordinates from 'highcharts/modules/parallel-coordinates';
import HighchartsHeatmap from 'highcharts/modules/heatmap';
import * as chroma from 'chroma-js';
import {
  defaultPlotOptions,
  getNumberTicks,
  heatMapColors as gradientColors,
  typecastNumberPoint
} from '@domino/ui/dist/components/charts/utils';
import { bilbao } from '@domino/ui/dist/styled/colors';
import { BOLD } from '@domino/ui/dist/styled/fontWeights';

const colorScale = chroma.scale(R.reverse(gradientColors));

const mapIndexed = R.addIndex(R.map);

HighchartsParallelCoordinates(Highcharts);
HighchartsHeatmap(Highcharts);
Exporting(Highcharts);
HighchartsAccessibility(Highcharts);

type PlotDataItem = {
  name: string;
  color: string;
  data: Array<any>;
  shadow: boolean;
}

interface ViewComponentProps {
  plotData: Array<unknown>;
  xAxisData: Array<string>;
  yAxisData: Array<unknown>;
  showColorAxis: boolean;
  onClick?: (id: string) => void;
}

const ViewComponent = React.forwardRef((props: ViewComponentProps, ref: React.RefObject<HighchartsReact.RefObject>) => {
  const options = R.mergeDeepRight(defaultPlotOptions)({
    colors: gradientColors,
    chart: {
      type: 'line',
      parallelCoordinates: true,
      parallelAxes: {
        lineWidth: 2
      },
      backgroundColor: 'transparent',
      padding: 20,
      spacing: [20, 10, 20, 10],
      events: {
        load: function (event: any) {
          event.target.reflow();
        }
      }
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: props.xAxisData,
      offset: 10,
    },
    yAxis: props.yAxisData,
    series: props.plotData,
    plotOptions: {
      line: {
        marker: {
          symbol: 'circle'
        }
      },
      series: {
        cursor: 'pointer',
        stickyTracking: false,
        lineWidth: 2,
        events: {
          mouseOver: function () {
            (this as any).group.toFront();
          },
          click: function () {
            const { onClick } = props;
            if (onClick) {
              onClick((this as any).userOptions.id);
            }
          }
        }
      }
    },
    tooltip: {
      snap: 1,
      useHTML: true,
      formatter: function (this: any) {
        const points = R.join('', mapIndexed((data: any, idx) => {
          return `<div><b>${data.category}:</b> ${this.point.series.userOptions.tooltipData[idx]}</div>`
        }, this.point.series.data));
        return `
          <b>${this.point.series.name}</b>
          <div style="margin-top: 8px;">${points}</TooltipData>
        `;
      }
    }
  });

  const colorAxisOptions = {
    colorAxis: {
      layout: 'vertical',
      startOnTick: false,
      endOnTick: false,
      type: 'linear',
      gridLineWidth: 0,
      labels: {
        enabled: false
      },
      stops: mapIndexed((color, idx) => ([idx * (1 / (gradientColors.length)), color]), gradientColors),
      showInLegend: true
    },
    legend: {
      enabled: true,
      y: 15,
      symbolWidth: 24,
      symbolHeight: 280,
      layout: 'vertical',
      verticalAlign: 'bottom',
      align: 'right',
    }
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      ref={ref}
      allowChartUpdate={true}
      options={props.showColorAxis ? { ...options, ...colorAxisOptions } : options}
    />
  );
});

export type DataPoint = {
  id: string;
  name: string;
  lineData: Record<string, any>;
};

export type AxisLabel = {
  name: string;
  doHighlight?: boolean;
}

interface Props {
  /**
   * data to plot
   */
  data: Array<DataPoint>;
  /**
   * data to plot
   */
  axisLabels: Array<AxisLabel>;
  /**
   * Callback on clicking line
   */
  onClick?: (id: string) => void;
}

const ParallelCoordinatesPlot = React.forwardRef((props: Props, ref: React.RefObject<HighchartsReact.RefObject>) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [plotData, setPlotData] = React.useState<Array<PlotDataItem>>([]);
  const [xAxisData, setXAxisData] = React.useState<Array<string>>([]);
  const [yAxisData, setYAxisData] = React.useState<Array<Record<string, any>>>([]);
  const [showColorAxis, setShowColorAxis] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsLoading(true);
    const hasColorAxisLabel = R.any(axisLabel => !R.isNil(axisLabel.doHighlight) && axisLabel.doHighlight,
      props.axisLabels);

    setShowColorAxis(hasColorAxisLabel);

    const categorisedData = R.reduce((acc, { lineData }) => {
      R.forEach(({ name: axisName }) => {
        acc[axisName] = [...(acc[axisName] || []), typecastNumberPoint(lineData[axisName] ?? 0, false)];
      }, props.axisLabels);
      return acc;
    }, {}, props.data);

    const ptData = (!R.isEmpty(props.data) && !R.isEmpty(props.axisLabels)) ? R.map(({ id, name, lineData }) => {
      const colorAxisLabel = R.last(props.axisLabels);
      let pointValueOnColorScale = 0;

      if (!R.isNil(colorAxisLabel) && hasColorAxisLabel) {
        const minValue = R.apply(Math.min, categorisedData[colorAxisLabel!.name]);
        const maxValue = R.apply(Math.max, categorisedData[colorAxisLabel!.name]);
        const noRoundingForAxisValues = ((maxValue - minValue) <= 1);
        const numberTicksOfLastColumn = getNumberTicks(
          categorisedData[colorAxisLabel!.name], undefined, noRoundingForAxisValues);

        const leastValueOnScale = R.head(numberTicksOfLastColumn);
        const mostValueOnScale = R.last(numberTicksOfLastColumn);
        const pointValue = typecastNumberPoint(lineData[colorAxisLabel!.name] || 0, false);
        pointValueOnColorScale = !R.equals(leastValueOnScale, mostValueOnScale) ?
          (pointValue - leastValueOnScale) / (mostValueOnScale - leastValueOnScale) : 0.5;
      }

      return {
        id: id,
        name: name,
        data: R.map(({ name: axisName }) => {
          return R.isNil(lineData[axisName]) ? null : ((/\d+$/.test(lineData[axisName] as any)) ?
            typecastNumberPoint(lineData[axisName], false) :
            R.indexOf(lineData[axisName], R.uniq(categorisedData[axisName]).sort()));
        }, props.axisLabels),
        tooltipData: R.map(({ name: axisName }) => {
          return R.isNil(lineData[axisName]) ? '--' : ((/\d+$/.test(lineData[axisName] as any)) ?
            typecastNumberPoint(lineData[axisName], false) : lineData[axisName]);
        }, props.axisLabels),
        shadow: false,
        color: colorScale(pointValueOnColorScale).hex()
      };
    }, props.data) : [];

    setPlotData(ptData);

    const xAxsData = !R.isEmpty(ptData) ? R.map(axisLabel => {
      if (axisLabel.doHighlight) {
        return `<span style="color: ${bilbao};font-weight: ${BOLD};">${axisLabel.name}</span>`;
      } else {
        return axisLabel.name;
      }
    }, props.axisLabels) : [];

    setXAxisData(xAxsData);

    const yAxsData = (!R.isEmpty(ptData) && !R.isEmpty(categorisedData)) ? R.map(({ name: axisName }) => {
      if (!R.isEmpty(categorisedData[axisName]) && !R.isNil(categorisedData[axisName]) &&
        (R.all(val => (/\d+$/.test(val as any)), categorisedData[axisName]))) {
        const minValue = R.apply(Math.min, categorisedData[axisName]);
        const maxValue = R.apply(Math.max, categorisedData[axisName]);
        const noRoundingForAxisValues = ((maxValue - minValue) <= 1);
        return {
          tickPositions: getNumberTicks(categorisedData[axisName], undefined, noRoundingForAxisValues),
          minPadding: 0.02,
          labels: {
            formatter: (value: any) => R.is(Number, value?.value) ? Number(value.value.toFixed(4)) : value?.value
          }
        };
      } else if (!R.isNil(categorisedData[axisName])) {
        return {
          categories: R.uniq(categorisedData[axisName]).sort(),
          offset: 10
        };
      }
      return {};
    }, props.axisLabels) : [];

    setYAxisData(yAxsData);
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, props.axisLabels]);

  return !isLoading && (!R.isEmpty(plotData) && !R.isEmpty(yAxisData) && !R.isEmpty(xAxisData)) ? (
    <ViewComponent
      ref={ref}
      plotData={plotData}
      xAxisData={xAxisData}
      yAxisData={yAxisData}
      showColorAxis={showColorAxis}
      onClick={props.onClick}
    />
  ) : <></>;
});

export default ParallelCoordinatesPlot;
