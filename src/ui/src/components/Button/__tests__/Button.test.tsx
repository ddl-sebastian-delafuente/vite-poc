import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@domino/test-utils/dist/testing-library';
import Button from '../Button';

afterAll(jest.resetModules);

describe('Button component tests', () => {
  const testId = 'button-component';
  const content = 'Darth Vader';
  const data = [{ key: 0, content }];

  it('should render successfully', () => {
    expect(render(<Button btnType="primary" testId={testId}>Sample Button</Button>)
      .getByDominoTestId(testId)).toBeTruthy();
  });

  it('onClick working', async () => {
    const mock = jest.fn();
    await userEvent.click(render(<Button testId={testId} onClick={mock}>Sample Button</Button>).getByDominoTestId(testId));
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('check button disabled', async () => {
    const mock = jest.fn();
    await userEvent.click(render(<Button testId={testId} onClick={mock} disabled={true}>Sample Button</Button>)
      .getByDominoTestId(testId), { pointerEventsCheck: 0 });
    expect(mock).toHaveBeenCalledTimes(0);
  });

  it('check split button, main button functionality', async () => {
    const mock = jest.fn();
    await userEvent.click(render(<Button btnType="split" actions={data} testId={testId} onClick={mock}>Button</Button>)
      .getByDominoTestId(testId));
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('check split button, main button when disabled', async () => {
    const mock = jest.fn();
    await userEvent.click(render(<Button btnType="split" actions={data} testId={testId} onClick={mock} disabled={true}>Button</Button>)
      .getByDominoTestId(testId), { pointerEventsCheck: 0 });
    expect(mock).not.toHaveBeenCalled();
  });

  it('check split button, dropdown functionality', async () => {
    const dropdownDataTest = 'action-dropdown';
    const view = render(<Button btnType="split" actions={data} dropdownDataTest={dropdownDataTest}>Button</Button>);
    expect(view.queryByText(content)).toBeFalsy();
    await userEvent.click(view.getByDominoTestId(dropdownDataTest));
    expect(view.getByText(content)).toBeTruthy();
  });

  it('check split button, dropdown when disabled', async () => {
    const dropdownDataTest = 'action-dropdown';
    const view = render(<Button btnType="split" actions={data} dropdownDataTest={dropdownDataTest} disabled={true}>Button</Button>);
    await userEvent.click(view.getByDominoTestId(dropdownDataTest), { pointerEventsCheck: 0 });
    expect(view.queryByText(content)).toBeFalsy();
  });
});
