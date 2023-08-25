import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { themeHelper } from '../../styled';
import UsersAndOrgsDropdown from '../../components/UsersAndOrgsDropdown';
import Radio, { RadioChangeEvent } from '@domino/ui/dist/components/Radio';

const SelectWrapper = styled.div`
  margin: ${themeHelper('paddings.small')} 0 ${themeHelper('margins.medium')} ${themeHelper('margins.large')};
`;

const radioStyle = {
  display: 'flex',
  marginBottom: '10px'
};

export interface Props {
  isPublic?: boolean;
  users?: string[];
  onAccessChange: (isPublic: boolean) => void;
  onChangeUsers: (selectedValues: string[]) => void;
}

export interface State {
  isPublic?: boolean;
}

class ExternalDataVolumeAccessSelector extends React.Component<Props, State> {
  state: State = {
    isPublic: this.props.isPublic
  };

  onChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    this.setState({isPublic: value});
    this.props.onAccessChange(value);
  }

  render() {
    const items = [
      {
        key: 'everyone',
        value: true,
        style: radioStyle,
        label: 'Everyone'
      },
      {
        key: 'specific-users',
        value: false,
        style: radioStyle,
        label: 'Specific users or organizations'
      }
    ];
    return (
      <>
        <Radio
          value={this.state.isPublic}
          onChange={this.onChange}
          items={items}
        />
        {!this.state.isPublic && (
          <SelectWrapper>
            <UsersAndOrgsDropdown
              defaultValues={R.defaultTo([])(this.props.users)}
              onChangeUsers={this.props.onChangeUsers}
            />
          </SelectWrapper>
        )}
      </>
    );
  }
}

export default ExternalDataVolumeAccessSelector;
