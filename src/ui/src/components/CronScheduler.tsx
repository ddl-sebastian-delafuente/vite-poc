/**
 * Cron schedule editor UI component
 *
 * We use Quartz scheduler in the backend
 * (http://www.quartz-scheduler.org/documentation/2.4.0-SNAPSHOT/tutorials/tutorial-lesson-06.html)
 * The generated cron expression is of the following format:
 * 1. Seconds (0-59) (always zero in our case as we disallow setting it on the UI)
 * 2. Minutes (0-59)
 * 3. Hours (0-23)
 * 4. Day-of-Month (1-31)
 * 5. Month (1-12)
 * 6. Day-of-Week (1-7) (1=Sunday)
 * 7. Year (optional field - unused)
 */

import * as React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import Select from './Select/Select';
import FlexLayout from './Layouts/FlexLayout';
import { getTestId } from '../utils/common';

const StyledFlexLayout = styled(FlexLayout)`
  & > * {
    margin: 0;
  }
`;

const PointOfTime = styled.span`
  && {
    margin: ${({leftMarginOnly}: {leftMarginOnly?: boolean}) => leftMarginOnly ? '0 0 0 8px' : '0 8px'};
  }
`;

export enum Period {
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
  Weekday = 'weekday'
}

export enum CronField {
  Minute = 1,
  Hour = 2,
  Day = 3,
  Month = 4,
  Weekday = 5
}

export interface CronProps {
  /**
   * The name of the form field
   */
  name?: string;
  /**
   * The initial cron string value
   */
  value?: string;
  /**
   * Callback invoked with the cron value whenever the schedule changes
   */
  onChange?: (cronString: string) => void;
  /**
   * Callback invoked with the cron value whenever the schedule perioud dropdown changes
   */
   onPeriodChange?: (value: Period) => void;
  testId?: string;
}

export interface State {
  cron: string[];
  period: Period;
}

const PERIOD_OPTIONS = [
  {
    label: 'hour',
    value: Period.Hour
  },
  {
    label: 'day',
    value: Period.Day
  },
  {
    label: 'week',
    value: Period.Week
  },
  {
    label: 'weekday',
    value: Period.Weekday
  },
  {
    label: 'month',
    value: Period.Month
  },
  {
    label: 'year',
    value: Period.Year
  }
];

const MONTH_OPTIONS = moment.monthsShort().map((month: string, index: number) => ({
  label: month,
  value: `${index + 1}`
}));

const suffix = (val: number) => {
  if (val % 10 === 1) {
    return 'st';
  }
  if (val % 10 === 2) {
    return 'nd';
  }
  if (val % 10 === 3) {
    return 'rd';
  }

  return 'th';
};

const DAY_OPTIONS = Array(31).fill(0).map((x, i) => ({
  label: `${i + 1}${suffix(i + 1)}`,
  value: `${i + 1}`
}));

const WEEKDAY_OPTIONS = Array(7).fill(0).map((x, i) => ({
  label: moment(i, 'e').format('dddd'),
  value: `${i + 1}`
}));

const HOUR_OPTIONS = Array(24).fill(0).map((x, i) => ({
  label: `${i < 10 ? '0' : ''}${i}`,
  value: `${i}`
}));

const MINUTE_OPTIONS = Array(60).fill(0).map((x, i) => ({
  label: `${i < 10 ? '0' : ''}${i}`,
  value: `${i}`
}));

// Used to keep this on top of modals
const   selectDropdownStyle = { zIndex: 2500 };

// Default values
const DEFAULT = {
  HOUR: '12',
  MINUTE: '0',
  SECOND: '0',
  DAY: '1',
  WEEKDAYS: '2-6',
  MONTH: '1',
  UNSET: '?',
  ALL: '*'
};

const getDefaultCron = (period: Period) => {
  if (period === Period.Year) {
    return [
      DEFAULT.SECOND,
      DEFAULT.MINUTE,
      DEFAULT.HOUR,
      DEFAULT.DAY,
      DEFAULT.MONTH,
      DEFAULT.UNSET
    ];
  } else if (period === Period.Month) {
    return [
      DEFAULT.SECOND,
      DEFAULT.MINUTE,
      DEFAULT.HOUR,
      DEFAULT.DAY,
      DEFAULT.ALL,
      DEFAULT.UNSET
    ];
  } else if (period === Period.Week) {
    return [
      DEFAULT.SECOND,
      DEFAULT.MINUTE,
      DEFAULT.HOUR,
      DEFAULT.UNSET,
      DEFAULT.ALL,
      DEFAULT.DAY
    ];
  } else if (period === Period.Weekday) {
    return [
      DEFAULT.SECOND,
      DEFAULT.MINUTE,
      DEFAULT.HOUR,
      DEFAULT.UNSET,
      DEFAULT.ALL,
      DEFAULT.WEEKDAYS
    ];
  } else if (period === Period.Day) {
    return [
      DEFAULT.SECOND,
      DEFAULT.MINUTE,
      DEFAULT.HOUR,
      DEFAULT.ALL,
      DEFAULT.ALL,
      DEFAULT.UNSET
    ];
  } else if (period === Period.Hour) {
    return [
      DEFAULT.SECOND,
      DEFAULT.MINUTE,
      DEFAULT.ALL,
      DEFAULT.ALL,
      DEFAULT.ALL,
      DEFAULT.UNSET
    ];
  }
  return [
    DEFAULT.ALL,
    DEFAULT.ALL,
    DEFAULT.ALL,
    DEFAULT.ALL,
    DEFAULT.ALL,
    DEFAULT.ALL
  ];
};

// Check if a cron field is set, i.e, anything other than * or ?
const isSet = (val: string): boolean => {
  if (val && val !== DEFAULT.ALL && val !== DEFAULT.UNSET) {
    return true;
  }
  return false;
};

// Parse a cron schedule string to the component's internal state representation
const parseCron = (cronString: string): State => {
  const cron = cronString.split(' ');
  let period;
  if (isSet(cron[4])) {
    period = Period.Year;
  } else if (isSet(cron[3])) {
    period = Period.Month;
  } else if (isSet(cron[5])) {
    if (cron[5] === DEFAULT.WEEKDAYS) {
      period = Period.Weekday;
    } else {
      period = Period.Week;
    }
  } else if (isSet(cron[2])) {
    period = Period.Day;
  } else {
    period = Period.Hour;
  }

  return {
    cron,
    period
  };
};

class CronScheduler extends React.Component<CronProps, State> {

  constructor(props: CronProps) {
    super(props);

    this.state = props.value ? parseCron(props.value) : {
      cron: getDefaultCron(Period.Day),
      period: Period.Day
    };
  }

  getCronSchedule() {
    return this.state.cron.join(' ');
  }

  renderFormField() {
    this.onCronChange();
    return (
      <input
        name={this.props.name || 'cronString'}
        type="hidden"
        value={this.getCronSchedule()}
      />
    );
  }

  renderPeriodSelector(testId?: string) {
    return (
      <Select
        value={this.state.period}
        options={PERIOD_OPTIONS}
        onSelect={this.onPeriodChange}
        getPopupContainer={
          <T extends Element & { parentNode: any }>(trigger?: T) => trigger ? trigger.parentNode : undefined}
        style={{width: 100}}
        dropdownStyle={selectDropdownStyle}
        data-test={getTestId('cron-period-selector', testId)}
        className="cron-period-selector"
        showSearch={true}
      />
    );
  }

  renderMonthSelector(testId?: string) {
    if (this.state.period === Period.Year) {
      return (
        <React.Fragment>
          <PointOfTime>of</PointOfTime>
          <Select
            value={this.state.cron[4]}
            options={MONTH_OPTIONS}
            style={{width: 70}}
            getPopupContainer={
              <T extends Element & { parentNode: any }>(trigger?: T) => trigger ? trigger.parentNode : undefined}
            dropdownStyle={selectDropdownStyle}
            onSelect={this.onMonthChange}
            data-test={getTestId('cron-month-selector', testId)}
            showSearch={true}
          />
        </React.Fragment>
      );
    }
    return null;
  }

  renderDaySelector(testId?: string) {
    if (this.state.period === Period.Year || this.state.period === Period.Month) {
      return (
        <React.Fragment>
          <PointOfTime>on the</PointOfTime>
          <Select
            value={this.state.cron[3]}
            options={DAY_OPTIONS}
            getPopupContainer={
              <T extends Element & { parentNode: any }>(trigger?: T) => trigger ? trigger.parentNode : undefined}
            style={{width: 70}}
            dropdownStyle={selectDropdownStyle}
            onSelect={this.onDayChange}
            data-test={getTestId('cron-day-selector', testId)}
            showSearch={true}
          />
        </React.Fragment>
      );
    }
    return null;
  }

  renderDayOfWeekSelector(testId?: string) {
    if (this.state.period === Period.Week) {
      return (
        <React.Fragment>
          <PointOfTime>on</PointOfTime>
          <Select
            value={this.state.cron[5]}
            options={WEEKDAY_OPTIONS}
            getPopupContainer={
              <T extends Element & { parentNode: any }>(trigger?: T) => trigger ? trigger.parentNode : undefined}
            onSelect={this.onWeekdayChange}
            dropdownStyle={selectDropdownStyle}
            data-test={getTestId('cron-day-of-week-selector', testId)}
            showSearch={true}
          />
        </React.Fragment>
      );
    }
    return null;
  }

  renderHoursSelector(testId?: string) {
    if (this.state.period !== Period.Hour) {
      return (
        <Select
          value={this.state.cron[2]}
          options={HOUR_OPTIONS}
          style={{width: 70}}
          dropdownStyle={selectDropdownStyle}
          getPopupContainer={
            <T extends Element & { parentNode: any }>(trigger?: T) => trigger ? trigger.parentNode : undefined}
          onSelect={this.onHourChange}
          data-test={getTestId('cron-hour-selector', testId)}
          showSearch={true}
          filterOption={(input, option) =>
            // @ts-ignore
            option?.children.indexOf(input) >= 0
          }
        />
      );
    }
    return null;
  }

  renderMinutesSelector(testId?: string) {
    return (
      <React.Fragment>
        <Select
          value={this.state.cron[1]}
          options={MINUTE_OPTIONS}
          style={{width: 70, marginLeft: this.state.period !== Period.Hour ? '8px' : 0}}
          dropdownStyle={selectDropdownStyle}
          getPopupContainer={
            <T extends Element & { parentNode: any }>(trigger?: T) => trigger ? trigger.parentNode : undefined}
          onSelect={this.onMinuteChange}
          data-test={getTestId('cron-minute-selector', testId)}
          showSearch={true}
          filterOption={(input, option) =>
            // @ts-ignore
            option?.children.indexOf(input) >= 0
          }
        />
      </React.Fragment>
    );
  }

  updateCronField = (index: CronField, value: string) => {
    const { cron } = this.state;
    const newCron = [...cron];
    newCron[index] = value;
    this.setState({
      cron: newCron
    }, this.onCronChange);
  }

  onMinuteChange = (minute: string) => {
    this.updateCronField(CronField.Minute, minute);
  }

  onHourChange = (hour: string) => {
    this.updateCronField(CronField.Hour, hour);
  }

  onDayChange = (day: string) => {
    this.updateCronField(CronField.Day, day);
  }

  onWeekdayChange = (weekday: string) => {
    this.updateCronField(CronField.Weekday, weekday);
  }

  onMonthChange = (month: string) => {
    this.updateCronField(CronField.Month, month);
  }

  onPeriodChange = (period: Period) => {
    if (this.props.onPeriodChange) {
      this.props.onPeriodChange(period);
    }
    this.setState({
      period,
      cron: getDefaultCron(period)
    }, this.onCronChange);
  }

  onCronChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.getCronSchedule());
    }
  }

  render() {
    const { testId } = this.props;
    return (
      <StyledFlexLayout justifyContent="flex-start" data-test="cron-scheduler">
        <StyledFlexLayout justifyContent="flex-start">
          {this.renderFormField()}
          {this.renderPeriodSelector(testId)}
          {this.renderDaySelector(testId)}
          {this.renderMonthSelector(testId)}
          {this.renderDayOfWeekSelector(testId)}
          <PointOfTime>at</PointOfTime>
        </StyledFlexLayout>
        <StyledFlexLayout justifyContent="flex-start">
          {this.renderHoursSelector(testId)}
          {this.renderMinutesSelector(testId)}
          {
            this.state.period === Period.Hour &&
            <PointOfTime leftMarginOnly={true}>minutes past the hour</PointOfTime>
          }
        </StyledFlexLayout>
      </StyledFlexLayout>
    );
  }
}

/* @component */
export default CronScheduler;
