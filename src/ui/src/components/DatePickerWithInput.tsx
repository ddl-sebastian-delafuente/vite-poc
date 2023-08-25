import * as React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { equals } from 'ramda';
import { DatePickerProps } from 'antd/lib/date-picker';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

export type OnChange = (value: Date) => void;
const defaultSize = 'middle';

export type Props = {
  id?: string;
  name?: string;
  className?: string;
  value?: string;
  showTime?: boolean;
  onChange?: OnChange;
  size?: 'small' | 'default';
} & Omit<DatePickerProps, 'onChange' | 'size'>;

const handleOnChange: (cb?: OnChange) => (date: moment.Moment | null) => void = cb => date => {
  if (cb && date) {
    cb(new Date(date.year(), date.month(), date.date()));
  }
};

const formatDate = (value?: string): moment.Moment | undefined => {
  if (value) {
    return moment(new Date(value));
  }
  return;
};

const DatePickerWithInput = ({
  className,
  onChange,
  value,
  id,
  name,
  size = 'default',
  ...props
}: Props) => (
  <>
    <input type="hidden" id={id} value={value} name={name} />
    <DatePicker
      allowClear={false}
      className={className}
      // @ts-ignore
      value={formatDate(value)}
      format={props.showTime ? "MM/DD/YYYY HH:MM:SS" : "MM/DD/YYYY"}
      onChange={handleOnChange(onChange)}
      size={(equals(size, 'default') ? defaultSize : size) as SizeType}
      {...props}
    />
  </>
);

export type State = {
  value?: any;
};

export type WithStateProps = {
  id?: string;
  name?: string;
  className?: string;
  value?: string;
};

export class DatePickerWithState extends React.PureComponent<WithStateProps, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  onChange = (value: Date) => {
    const date = moment(value).format('MM/DD/YYYY');
    this.setState({ value: date });
  }

  render() {
    const { value } = this.state;
    return (
      <DatePickerWithInput
        {...this.props}
        onChange={this.onChange}
        value={value}
      />
    );
  }
}

export default DatePickerWithInput;
