import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@domino/test-utils/dist/testing-library';
import WithDoubleClickConfirm from '../WithDoubleClickConfirm';

describe('<WithDoubleClickConfirm />', () => {
  const defaultProps = {
    submitLabel: 'submit',
    confirmLabel: 'confirm',
    confirmMessage: 'this is a message',
  };

  it('should show the confirm popover if should confirm is true', async () => {
    const view = render(
      <WithDoubleClickConfirm {...defaultProps}>
        <div />
      </WithDoubleClickConfirm>
    );
    await userEvent.click(screen.getByText('submit'));
    expect(view.container.getElementsByClassName('ant-popover-open').length).toEqual(1);
  });

  it('should not show the confirm popover to start if should confirm is false', async () => {
    const view = render(
      <WithDoubleClickConfirm {...defaultProps} shouldConfirm={() => false}>
        <div />
      </WithDoubleClickConfirm>
    );
    await userEvent.click(screen.getByText('submit'));
    expect(view.container.getElementsByClassName('ant-popover-open').length).toEqual(0);
  });

  it('should not trigger the on click callback if should confirm', async () => {
    const spiedOnClick = jest.fn();
    render(
      <WithDoubleClickConfirm {...defaultProps} onClick={spiedOnClick}>
        <button />
      </WithDoubleClickConfirm>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(spiedOnClick).toHaveBeenCalledTimes(0);
  });

  it('should trigger the on click callback if should not confirm', async () => {
    const spiedOnClick = jest.fn();
    render(
      <WithDoubleClickConfirm {...defaultProps} onClick={spiedOnClick} shouldConfirm={() => false}>
        <button />
      </WithDoubleClickConfirm>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(spiedOnClick).toHaveBeenCalledTimes(1);
  });

  it('should trigger on click callback on second click if should confirm', async () => {
    const spiedOnClick = jest.fn();
    render(
      <WithDoubleClickConfirm {...defaultProps} onClick={spiedOnClick}>
        <button />
      </WithDoubleClickConfirm>
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button'));
    expect(spiedOnClick).toHaveBeenCalledTimes(1);
  });

  it('should show confirmation label if confirming', async () => {
    render(
      <WithDoubleClickConfirm {...defaultProps} onClick={() => undefined}>
        <button />
      </WithDoubleClickConfirm>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').textContent).toBe('confirm');
  });

  it('should show submit label to start if not clicked by default', () => {
    render(
      <WithDoubleClickConfirm {...defaultProps}>
        <button />
      </WithDoubleClickConfirm>
    );
    expect(screen.getByText('submit')).toBeTruthy();
  });

  it('should reset state if popover hides', async () => {
    render(
      <WithDoubleClickConfirm {...defaultProps} onClick={() => undefined}>
        <button />
      </WithDoubleClickConfirm>
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').textContent).toBe('submit');
  });

});
