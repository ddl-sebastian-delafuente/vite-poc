import * as React from 'react';

export interface OptionalHyperlinkProps {
  children: any;
  FallbackTag?: keyof JSX.IntrinsicElements;
  target?: string;
  href?: string;
}

const OptionalHyperlink = ({
  FallbackTag,
  children,
  href,
  target,
}: OptionalHyperlinkProps) => {
  if (href) {
    return (
      <a target={target} href={href}>
        {children}
      </a>
    );
  }

  if (FallbackTag) {
    return (
      <FallbackTag>
        {children}
      </FallbackTag>
    );
  }

  return children;
};

export default OptionalHyperlink;
