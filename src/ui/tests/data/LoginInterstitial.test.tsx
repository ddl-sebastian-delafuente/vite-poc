import * as React from 'react';
import {
  render, 
  screen, 
} from '@domino/test-utils/dist/testing-library';

import { LoginInterstitial } from '../../src/data/LoginInterstitial';

const appName = 'Domino';

describe('LoginInterstitial', () => {
  it('should show two CTA buttons when signups are enabled', () => {
    render(<LoginInterstitial isSignupEnabled={true} appName={appName} />);

    expect(screen.queryByText('Login')).not.toBeNull();
    expect(screen.queryByText('Sign Up')).not.toBeNull();
  });

  it('should show one CTA button when signups are disabled', () => {
    render(<LoginInterstitial isSignupEnabled={false} appName={appName} />);

    expect(screen.queryByText('Log in to Domino')).not.toBeNull();
    expect(screen.queryByText('Sign Up')).toBeNull();
  })
});
