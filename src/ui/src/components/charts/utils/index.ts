import * as R from 'ramda';
import { AxisLabelsFormatterContextObject, AxisTypeValue } from 'highcharts';
import { colors } from '@domino/ui/dist/styled';

export const plotColors: string[] = [
  '#1F3AEF',
  '#6B5AF9',
  '#A77DFF',
  '#3ABAE2',
  '#79E7B2',
  '#72D072',
  '#A8E032',
  '#FBBB68',
  '#F19675',
  '#E76F83',
];

export const heatMapColors = R.reverse(plotColors);

const roundValue = (setting: AxisLabelsFormatterContextObject<number>) => R.is(Number, setting.value) ?
  Math.round(setting.value * 10000) / 10000 : setting.value;

export const getAxisOptions = (axisType?: AxisTypeValue) => ({
  title: {
    style: {
      color: colors.neutral500
    }
  },
  ... R.isNil(axisType) || R.equals(axisType, 'linear') ? {
    labels: {
      formatter: roundValue,
    }
  } : {}
});

export const defaultPlotOptions = {
  colors: plotColors,
  credits: {
    enabled: false
  },
  exporting: {
    enabled: false
  },
  chart: {
    height: 350,
    style: {
      fontFamily: 'monospace',
    }
  },
  xAxis: {
    title: {
      style: {
        color: colors.neutral500
      }
    }
  },
  yAxis: getAxisOptions(),
  tooltip: {
    backgroundColor: colors.neutral50,
    borderRadius: 2,
    borderWidth: 0
  }
}

const numberFormatStepValue = (value: number, hasDecimalValues = false, roundingOff = false) => {
  if (roundingOff) {
    return value;
  } else {
    return (hasDecimalValues ? parseFloat(value.toFixed(2)) : value);
  }
};

export const getNumberTicks = (values: any[], numberOfTicks = 5, roundingOff = false) => {
  if (R.isEmpty(values)) {
    return values;
  }

  const uniqValues = R.uniq(R.filter(x => !R.isNil(x), values));

  if (!R.all(val => (/\d+$/.test(val as any)), uniqValues)) {
    return uniqValues;
  }

  const hasDecimalValues = R.any(val => val % 1 > 0, uniqValues);
  const valuesSorted = R.sort((a, b) => a - b,
    [...(hasDecimalValues ? R.map(parseFloat, uniqValues) : R.map(parseInt, uniqValues))]);

  if (R.length(valuesSorted) === 1) {
    const value = valuesSorted[0];
    const leastValue = value - 1;
    const mostValue = value + 1;
    return [
      numberFormatStepValue(leastValue, hasDecimalValues, roundingOff),
      numberFormatStepValue(value, hasDecimalValues, roundingOff),
      numberFormatStepValue(mostValue, hasDecimalValues, roundingOff)
    ];
  }

  const min = R.head(valuesSorted);
  const max = R.last(valuesSorted);

  if (!R.isNil(min) && !R.isNil(max)) {
    const stepInterval = hasDecimalValues ? (((max - min) / numberOfTicks)) :
      Math.ceil((max - min) / numberOfTicks);

    const firstStep = (min - stepInterval);
    const steps = [numberFormatStepValue(firstStep, hasDecimalValues, roundingOff)];
    for (let stepCounter = 0; stepCounter < numberOfTicks; stepCounter++) {
      const nextStep = min + (stepCounter * stepInterval);
      steps.push(numberFormatStepValue(nextStep, hasDecimalValues, roundingOff));
    }
    steps.push(numberFormatStepValue(max, hasDecimalValues, roundingOff));
    steps.push(numberFormatStepValue((max + stepInterval), hasDecimalValues, roundingOff));
    return steps;
  }
  return values;
};

export const typecastNumberPoint = (value: any, roundingOff = true) => {
  if (!/\d+$/.test(value)) {
    return value;
  }

  const isDecimalValue = value % 1 > 0;

  if (isDecimalValue) {
    if (!roundingOff) {
      return parseFloat(value);
    }
    return parseFloat(parseFloat(value).toFixed(2));
  }
  return parseInt(value);
};
