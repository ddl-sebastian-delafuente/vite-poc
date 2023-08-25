import * as React from 'react';

import styled from 'styled-components';
import { colors } from '../../styled';

// Takes repositoryName and returns name without username
const formatInitialPathName = (unformattedRepoName: any) => unformattedRepoName.split('/')[1];

export type DirectoryBreadcrumbsProps = {
  currentPath: string[];
  repositoryName: string;
  setPath: (newPath: string) => void;
};

  // Generates a series of clickable breadcrumbs which reset the currentPath
const DirectoryBreadcrumbs: React.FC<DirectoryBreadcrumbsProps> = ({currentPath, repositoryName, setPath}) => {
  return (
  <PathContainerWithOffset className="blur-on-fetch">
    {/* Generate a root item to allow navigation back if path is > 0 */}
    {currentPath.length > 0 ? (
      <OnClickSpan onClick={() => setPath('')}>
        {formatInitialPathName(repositoryName)}
      </OnClickSpan>
    ) : (
      <span key={repositoryName}>
        {formatInitialPathName(repositoryName)}
      </span>
    )
    }
    <DivisionSpan>/</DivisionSpan>
    {currentPath.map(
      (pathString: string, idx: number) => {
        // Generate clickable paths back if not present dir indicator
        if (idx < currentPath.length - 1) {
          return (
            <React.Fragment key={pathString + idx}>
              <OnClickSpan onClick={() => setPath(currentPath.slice(0, idx + 1).join('/'))}>
                {pathString}
              </OnClickSpan>
              <DivisionSpan>/</DivisionSpan>
            </React.Fragment>
          );
        } else {
          // generate current directory indicator
          return (
            <span
              key={pathString}
            >
              {pathString}
            </span>
          );
        }
      }
    )}
  </PathContainerWithOffset>
  );
};
DirectoryBreadcrumbs.displayName = 'DirectoryBreadcrumbs';

export default DirectoryBreadcrumbs;

const PathContainerWithOffset = styled.div`
  padding-top: 0;
  position: relative;
  top: 26px;
`;

const OnClickSpan = styled.span`
  cursor: pointer;
  position: relative;
  color: ${colors.linkBlue};
  z-index: 1000;
`;

const DivisionSpan = styled.span`
  padding: 0px 6px;
`;
