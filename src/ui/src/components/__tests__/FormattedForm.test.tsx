import * as React from 'react';
import { render, waitFor } from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import FormattedForm, {
  InputType, InputSpec, InputOptions, Props as FormattedFormProps
} from '../FormattedForm';

describe('Formatted Form', () => {
  const baseProps: FormattedFormProps = {
    submitOnEnter: true,
    asModal: true,
    submitLabel: "Submit",
    fieldMatrix: [
      [
        {
          inputType: 'input' as InputType,
          inputOptions: {
            key: 'name',
            className: 'name',
            label: 'New Name',
            validated: true,
          } as InputOptions,
        }
      ]
    ] as InputSpec[][]
  };

  it('should call `onSubmit` on `Enter` keypress after typing into input', async () => {
    const onSubmitMock = jest.fn();
    const { getByDominoTestId } = render(<FormattedForm {...baseProps} onSubmit={onSubmitMock} />);
    userEvent.type(getByDominoTestId('name-field'), 'Test Name{enter}');
    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
  });

  it('should call `onSubmit` on `submit-button` click after typing into input', async () => {
    const onSubmitMock = jest.fn();
    const { getByDominoTestId } = render(<FormattedForm {...baseProps} onSubmit={onSubmitMock} />);
    userEvent.type(getByDominoTestId('name-field'), 'Test Name');
    await userEvent.click(getByDominoTestId('submit-button'));
    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
  });
});
