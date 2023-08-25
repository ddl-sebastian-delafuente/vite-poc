import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@domino/test-utils/dist/testing-library';
import Select from '../Select/Select';

const defaultProps = {
  options: [{
    label: 'Manager',
    options: [
      {label: 'Jack', value: 'jack'},
      {label: 'Lucy', value: 'lucy'},
    ],
  }, {
    label: 'Engineer',
    options: [{label: 'yiminghe', value: 'Yiminghe'}],
  }],
  useOptionsAsProp: true
};

describe('Select', () => {
  it('should show group options when nested options are passed', async () => {
    const {container} = render(<Select {...defaultProps} />);
    const select = screen.getByRole('combobox');
    await userEvent.click(select);
    expect(container.querySelectorAll('.ant-select-item-group')).toHaveLength(2);
  });
});
