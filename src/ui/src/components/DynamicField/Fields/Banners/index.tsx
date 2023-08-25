/**
 * This file contains custom banner contents that cannot be easily serialized in a 
 * JSON payload. Typically this will be banners that have links or other special 
 * formatting
 */
import * as React from 'react';

import Link from '../../../Link/Link';

const featureStoreMissingCredentialsMessage = (
  <div>
    <p>Git credentials are required for adding or creating a feature store repository in order to write commits to remote.</p>
    <div>
      <Link href="/account" openInNewTab>{`Account Settings > Git Credentials`}</Link>
    </div>
  </div>
);

export const BannerMapping = {
  featureStoreMissingCredentialsMessage,
}
