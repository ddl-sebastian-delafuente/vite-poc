import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@domino/test-utils/dist/testing-library';
import ApiKeyGenerator from '../../apikeygenerator/ApiKeyGenerator';

describe('<ApiKeyGenerator />', () => {
  const defaultProps = {
    apiKey: undefined,
    generating: false,
    error: undefined,
    onRegenerate: () => undefined,
  };

  it('should show warning message by default', () => {
    render(<ApiKeyGenerator {...defaultProps} />);
    expect(screen.getByText('If you regenerate this API key, applications using this key will need to be updated.')).toBeTruthy();
  });

  it('should show a modal if regenerate button clicked', async () => {
    render(<ApiKeyGenerator {...defaultProps} />);
    await userEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('should allow canceling out of confirmation modal', async () => {
    render(<ApiKeyGenerator {...defaultProps} />);
    await userEvent.click(screen.getByText('Regenerate'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    await userEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByRole('dialog')).toBeFalsy();
  });

  it('should not trigger confirmation callback prop when canceling', async () => {
    const spiedOnRegenerate = jest.fn();
    render(<ApiKeyGenerator {...defaultProps} onRegenerate={spiedOnRegenerate} />);
    await userEvent.click(screen.getByText('Regenerate'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    await userEvent.click(screen.getByText('Cancel'));
    expect(spiedOnRegenerate).toHaveBeenCalledTimes(0);
  });

  it('should trigger confirmation callback if regenerate submit clicked', async () => {
    const spiedOnRegenerate = jest.fn();
    render(<ApiKeyGenerator {...defaultProps} onRegenerate={spiedOnRegenerate} />);
    await userEvent.click(screen.getByText('Regenerate'));
    expect(screen.getByRole('dialog')).toBeTruthy();
    await userEvent.click(screen.getByText('Yes, Regenerate API Key'));
    expect(spiedOnRegenerate).toHaveBeenCalledTimes(1);
  });

  it('should change copy on regenerate button if is regenerating', () => {
    render(<ApiKeyGenerator {...defaultProps} generating={true} />);
    expect(screen.getAllByText('Generating...')).toHaveLength(1);
  });

  it('should disable regenerate button if is regenerating', () => {
    render(<ApiKeyGenerator {...defaultProps} generating={true} />);
    expect(screen.getByRole('button').hasAttribute('disabled')).toBeTruthy();
  });

  it('should show new api key if provided', () => {
    render(<ApiKeyGenerator {...defaultProps} apiKey="newapikey" />);
    expect(screen.getByText('newapikey')).toBeTruthy();
  });

  it('should show copy to clipboard button if api key generated', () => {
    render(<ApiKeyGenerator {...defaultProps} apiKey="newapikey" />);
    expect(screen.getAllByText('Copy to Clipboard')).toHaveLength(1);
  });
});
