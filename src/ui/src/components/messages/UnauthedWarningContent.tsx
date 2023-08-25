import * as React from 'react';
import Link from '../Link/Link';
import { getLoginUrl } from '../utils/util'

const LinkWithUrl = ({ children, customRedirectUrl }: Props & { children: React.ReactNode }) => (
  <Link href={getLoginUrl(customRedirectUrl)} isUnderlined={true}>
    {children}
  </Link>
);

export type Props = {
  customRedirectUrl?: string;
};

export const UnauthedWarningContent = ({
  customRedirectUrl,
}: Props) => (
  <div>
    Please <LinkWithUrl customRedirectUrl={customRedirectUrl}>
      Login or Sign Up
    </LinkWithUrl> and try again.
  </div>
);
