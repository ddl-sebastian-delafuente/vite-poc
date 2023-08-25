import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import userEvent from '@testing-library/user-event';
import DownloadIconButton from '../DownloadIconButton';

describe('<DownloadIconButton />', () => {

  const defaultProps = {
    onClick: async () => undefined,
    children: "Download Audit Log",
    "aria-label": "Download Audit Log",
    componentType: "add",
    themeType: "dark",
  };

  it('should render button', () => {
    const view = render(
      <DownloadIconButton {...defaultProps} />
    );
    expect(view.getByDominoTestId('downloadIcon-button')).toBeTruthy();
  });

  it('should have download Icon', () => {
    const view = render(
      <DownloadIconButton {...defaultProps} />
    );
    expect(view.baseElement.querySelector('svg')?.getAttribute('data-icon')).toEqual('download');
  });

  it('should call onClick function when clicked', async () => {
    const onClick = jest.fn();
    const view = render(
      <DownloadIconButton {...defaultProps} onClick={onClick} />
    );
    expect(view.getByDominoTestId('downloadIcon-button')).toBeTruthy();
    await userEvent.click(view.getByDominoTestId('downloadIcon-button'));
    expect(onClick).toBeCalled();
  });

});
