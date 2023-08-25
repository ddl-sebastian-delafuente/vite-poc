import * as React from 'react';
import { render, screen } from '@domino/test-utils/dist/testing-library';
import { adminInterfaceWhitelabelConfigurations } from '@domino/test-utils/dist/mocks';
import * as useStoreHook from '../../../globalStore/useStore';
import GitCredentialsPanel from '../../git-credentials/GitCredentialsPanel';

const appName = 'Domino';
const whiteLabelSettings = { ...adminInterfaceWhitelabelConfigurations, appName };
const storeResolvedMock = { principal: undefined, formattedPrincipal: undefined, whiteLabelSettings };

describe('<GitCredentialsPanel />', () => {
  const defaultProps = {
    apiKey: undefined,
    generating: false,
    error: undefined,
    onRegenerate: () => undefined,
  };

  it('should show header title', () => {
    render(<GitCredentialsPanel />);
    expect(screen.getByText('Git Credentials')).toBeTruthy();
  });

  it('should show header notification', () => {
    jest.spyOn(useStoreHook, 'default').mockImplementation(() => storeResolvedMock);
    const view = render(<GitCredentialsPanel {...defaultProps} />);
    expect(view.baseElement.querySelector('.header-help-link')?.textContent)
      .toContain(`Learn more about working with ${appName} and Git`);
  });

  it('should show add modal button', () => {
    render(<GitCredentialsPanel {...defaultProps} />);
    expect(screen.getByText('Add Credentials')).toBeTruthy();
  });
});
