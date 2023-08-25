import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { semiBlack, linkBlue } from '../styled/colors';

export const NonClickableCrumb = styled.span`
  color: ${semiBlack};
`;

const ClickableCrumb = styled.a`
  &.clickable-crumb-fb {
    color: ${linkBlue};
  }
`;

const onNavigateHandler = (
  onNavigate: BreadcrumbProps['onNavigate'],
  args: string[]
): (() => void) | undefined => {
  if (onNavigate) {
    return onNavigate(args);
  }
  return;
};
export interface BreadcrumbProps {
  PathContainer?: React.FC<{ children: React.ReactNode }>;
  path: string[];
  onNavigate?: (path: string[]) => ()  => void;
  root?: string;
}

const SimpleBreadCrumbs: React.FC<BreadcrumbProps> = ({
  path,
  onNavigate,
  PathContainer = 'span',
  root = '/',
}) => {
  const ClickablePathContainer = onNavigate ? ClickableCrumb : NonClickableCrumb;
  return (
    <PathContainer>
      {path.length > 0 &&
      <>
        <ClickablePathContainer
          onClick={onNavigateHandler(onNavigate, [])}
          className="clickable-crumb-fb"
        >
          {root}
        </ClickablePathContainer>
        {root !== '/' && <NonClickableCrumb> / </NonClickableCrumb>}
      </>}
      {R.dropLast(1)(path).map((level: string, i: number) => (
        <span key={i}>
          <ClickablePathContainer
            className="clickable-crumb-fb"
            onClick={onNavigateHandler(onNavigate, R.take(i + 1, path))}
          >
            {level}
          </ClickablePathContainer>
          <NonClickableCrumb> / </NonClickableCrumb>
        </span>
      ))}
      <NonClickableCrumb>
        {R.last(path)}
      </NonClickableCrumb>
    </PathContainer>
  );
};

export default SimpleBreadCrumbs;
