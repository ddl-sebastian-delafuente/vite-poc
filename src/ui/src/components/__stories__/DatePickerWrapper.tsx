import * as React from 'react';
import { DatePicker } from 'antd';
import { equals } from 'ramda';
import moment from 'moment';
import {
  DatePickerProps,
  RangePickerProps
} from 'antd/lib/date-picker';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import DatePickerWithInput from '../DatePickerWithInput';
const { RangePicker } = DatePicker;
const defaultSize = 'middle';

export interface DatePickerWrapperProps {
  range: boolean;
  showTime?: boolean;
  datePickerDefaultValue: moment.Moment;
  rangeDefaultValue: [moment.Moment, moment.Moment];
  size?: 'small' | 'default';
}
export type Props = DatePickerWrapperProps & Omit<DatePickerProps, 'value' | 'onChange' | 'size'> &
  Omit<RangePickerProps, 'value' | 'onChange' | 'size'>;
const DatePickerWrapper = (props: Props) => {
  const { range, datePickerDefaultValue, rangeDefaultValue, size = 'default', ...rest } = props;
  return props.range ?
    // @ts-ignore
    <RangePicker {...rest} defaultValue={rangeDefaultValue} allowClear={false} size={(equals(size, 'default') ? defaultSize : size) as SizeType} /> :
    // @ts-ignore
    <DatePickerWithInput {...rest} defaultValue={datePickerDefaultValue} allowClear={false} size={size} />;
};

export default DatePickerWrapper;
