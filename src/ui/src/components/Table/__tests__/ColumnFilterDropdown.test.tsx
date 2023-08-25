import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@domino/test-utils/dist/testing-library';
import ColumnFilterDropdown from '../ColumnFilterDropdown';

describe('ColumnFilterDropdown', () => {
  const user = userEvent.setup({ pointerEventsCheck: 0 });
  it('should trigger onChange when clicking the checkbox', async () => {
    const onChange = jest.fn();
    const { baseElement } = render(
      <ColumnFilterDropdown
        onChange={onChange}
        columns={['a', 'b', 'c'].map(k => ({ label: k, key: k }))}
        selectedColumns={[]}
      />
    );
    await user.click(baseElement.querySelectorAll('.ant-dropdown-trigger')[0]);
    await user.click(baseElement.querySelectorAll('input[type="checkbox"]')[0]);
    expect(onChange).toHaveBeenCalledWith(['a']);
  });

  it('should not allow to uncheck all options', async () => {
    const onChange = jest.fn();
    const { baseElement } = render(
      <ColumnFilterDropdown
        onChange={onChange}
        columns={['a', 'b', 'c'].map(k => ({ label: k, key: k }))}
        selectedColumns={[{key: 'a', label: 'a'}, {key: 'b', label: 'b'}]}
      />);
    await user.click(baseElement.querySelectorAll('.ant-dropdown-trigger')[0]);
    expect(baseElement.querySelectorAll('.ant-checkbox-checked').length).toEqual(2);
    await user.click(baseElement.querySelectorAll('input[type="checkbox"]')[0]);
    expect(baseElement.querySelectorAll('.ant-checkbox-checked').length).toEqual(1);
    await user.click(baseElement.querySelectorAll('input[type="checkbox"]')[1]);
    expect(baseElement.querySelectorAll('.ant-checkbox-checked').length).toEqual(1);
  });
});
