import { 
  render, 
  screen, 
  waitFor,
  fireEvent
} from '@domino/test-utils/dist/testing-library';
import * as React from 'react';
import { ValidationStatus } from '@domino/ui/dist/components/DynamicWizard/useValidationState';
import { DynamicFieldDisplay, FieldStyle } from '../';

interface MockData {
  username?: string;
  first: string;
  last: string;
}

const MOCK_DATA: Readonly<MockData> = {
  username: 'test-username',
  first: 'test-first',
  last: 'test-last',
};

const ELEMENT_FIRST = { label: 'First Label', path: 'first' };
const ELEMENT_LAST = { label: 'Last Label', path: 'last' };
const ELEMENT_USERNAME = { label: 'Username Label', path: 'username' };
const ELEMENT_MULTISELECT = { fieldType: 'multiSelect', label: 'Names', path: 'names', options: [{label: 'user1', value: 'user1'}, { label: 'user2', value: 'user2'}]}

describe('Dynamic Field Display', () => {
  it('should handle basic layouts', () => {
    render(<DynamicFieldDisplay
      data={MOCK_DATA}
      layout={{
        elements: [
          ELEMENT_USERNAME,
          ELEMENT_FIRST,
          ELEMENT_LAST,
        ]
      }}
    />);

    expect(screen.queryByText('Username Label')).not.toBeNull()
    expect(screen.queryByText('First Label')).not.toBeNull()
    expect(screen.queryByText('Last Label')).not.toBeNull()
  });
  
  it('should handle empty values', () => {
    render(<DynamicFieldDisplay
      data={{
        ...MOCK_DATA,
        username: undefined
      }}
      layout={{
        elements: [
          ELEMENT_USERNAME,
          ELEMENT_FIRST,
          ELEMENT_LAST,
        ]
      }}
    />);

    expect(screen.queryByText('Username Label')).not.toBeNull()
    expect(screen.queryByText('--')).not.toBeNull()
    expect(screen.queryByText('First Label')).not.toBeNull()
    expect(screen.queryByText('Last Label')).not.toBeNull()
  });
  
  it('should handle nested layouts', () => {
    render(<DynamicFieldDisplay
      data={MOCK_DATA}
      layout={{
        elements: [
          ELEMENT_USERNAME,
          {
            elements: [
              ELEMENT_FIRST,
              ELEMENT_LAST,
            ]
          },
        ]
      }}
    />);

    expect(screen.queryByText('Username Label')).not.toBeNull()
    expect(screen.queryByText('First Label')).not.toBeNull()
  });

  it('should show inputs when defined as editable', () => {
    const { queryByDominoTestId } = render(<DynamicFieldDisplay
      data={MOCK_DATA}
      layout={{
        elements: [
          ELEMENT_USERNAME,
          ELEMENT_FIRST,
          ELEMENT_LAST,
        ]
      }}
      editable={true}
      testIdPrefix="test"
    />);

    expect(queryByDominoTestId('test-username')).not.toBeNull();
    expect(queryByDominoTestId('test-first')).not.toBeNull();
    expect(queryByDominoTestId('test-last')).not.toBeNull();
  });

  it('should handle user inputs', async () => {
    const { getByDominoTestId } = render(<DynamicFieldDisplay
      data={MOCK_DATA}
      layout={{
        elements: [
          ELEMENT_USERNAME,
          ELEMENT_FIRST,
          ELEMENT_LAST,
        ]
      }}
      editable={true}
      testIdPrefix="test"
    />);

    const textInput = getByDominoTestId('test-username-textinput');
    fireEvent.change(textInput, { target: { value: '' } });
    fireEvent.change(textInput, { target: { value: 'text input' } });
    await waitFor(() => expect(textInput.getAttribute('value')).toEqual('text input'));
  });

  it('should render multiselect dropdown when fieldType is multiSelect', async () => {
    const view = render(<DynamicFieldDisplay
      data={{names: 'user1'}}
      layout={{
        elements: [
          ELEMENT_MULTISELECT
        ]
      }}
      fieldStyle={FieldStyle.FormItem}
    />);
    await waitFor(() => expect(view.baseElement.querySelector('.ant-select-multiple ')).toBeTruthy());
  });

  it('should display custom error message when provided', async () => {
    const isRequiredErrorMessage = 'custom required message';
    render(
    <DynamicFieldDisplay
      data={{names: 'user1'}}
      layout={{
        elements: [
          {
            ...ELEMENT_USERNAME,
            isRequired: true,
            isRequiredErrorMessage
          }
        ]
      }}
      fieldStyle={FieldStyle.FormItem}
      validationStatus={ValidationStatus.initialized}
    />);
    expect(screen.queryByText('Username Label')).not.toBeNull();
    await waitFor(() => expect(screen.getByText(isRequiredErrorMessage)).toBeTruthy());
  });

  it('should display default error message when custom error message is not provided', async () => {
    const defaultErrorMessage = 'Username Label is required';
    render(
    <DynamicFieldDisplay
      data={{names: 'user1'}}
      layout={{
        elements: [
          {
            ...ELEMENT_USERNAME,
            isRequired: true
          }
        ]
      }}
      fieldStyle={FieldStyle.FormItem}
      validationStatus={ValidationStatus.initialized}
    />);
    expect(screen.queryByText('Username Label')).not.toBeNull();
    await waitFor(() => expect(screen.getByText(defaultErrorMessage)).toBeTruthy());
  });

});
