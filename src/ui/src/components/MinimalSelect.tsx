import * as React from 'react';
import { isNil } from 'ramda';
import Select from './Select/Select';

const wrapperId = 'minimal-select';

export type OptionRenderer = (selectContext: MinimalSelect) => JSX.Element;

export type LabelFormatter = (value: number | string) => string | number;

export type OnSelectChangeHandler = (event: React.ChangeEvent<{ value: string }>) => void;

export type Props = {
  style?: {};
  name?: string;
  id?: string;
  labelFormatter?: LabelFormatter;
  shouldSubmitOnSelect?: boolean;
  noToggleBorder?: boolean;
  label?: string;
  onChange?: (value: string) => void;
  defaultValue?: number | string;
  children?: any[];
  'data-test'?: string;
};

export type State = {
  selectedValue: string | number;
  open: boolean;
};

class MinimalSelect extends React.PureComponent<Props, State> {

  static defaultProps = {
    style: {},
    label: '',
    labelFormatter: (x: string | number) => x,
    shouldSubmitOnSelect: false,
    noToggleBorder: false,
    children: [],
    onChange: () => undefined,
    defaultValue: '',
  };

  state = {
    selectedValue: this.props.defaultValue!,
    open: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.defaultValue !== this.props.defaultValue && !isNil(nextProps.defaultValue)) {
      this.setState({ selectedValue: nextProps.defaultValue! });
    }
  }

  onSelect = (value: string, _option: any) => {
    this.setState({
      selectedValue: value,
      open: false
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(value);
      }
    });
  }

  onToggle = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const {
      selectedValue,
      open,
    } = this.state;
    const {
      children,
      name,
      id,
      style,
      ...rest
    } = this.props;

    return (
      <div id={wrapperId}>
        <Select
          style={style}
          data-test={rest['data-test']}
          open={open}
          defaultValue={selectedValue}
          options={children}
          onSelect={this.onSelect}
          onDropdownVisibleChange={this.onToggle}
          containerId={wrapperId}
        />
        <input
          type="hidden"
          id={id}
          name={name}
          value={selectedValue}
        />
      </div>
    );
  }
}

export default MinimalSelect;
