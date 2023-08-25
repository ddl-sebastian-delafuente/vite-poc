import * as React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import WarningBox from '../components/WarningBox';
import Link from '../components/Link/Link';
import { themeHelper } from '../styled/themeUtils';

const StyledWarningBox = styled(WarningBox)`
  background-color: #FFFBE4;
`;

const StyledLink = styled(Link)`
  margin-left: ${themeHelper('margins.tiny')};
`;

export interface Props {
  headCommitCreatedAt?: number;
  headRevisionDirectoryLink: string;
}

const OldRevisionInteractiveMessage = ({
  headCommitCreatedAt,
  headRevisionDirectoryLink,
}: Props) => {
  const defaultContent = `
    This is not the latest version of the default branch of your files. 
  `;
  const content = `
    ${headCommitCreatedAt ? (
      `${defaultContent} The latest version was made at 
        ${moment(headCommitCreatedAt).format('MMMM Do YYYY [@] h:mm a')}.`
      ) : defaultContent}
  `;
  return (
    <StyledWarningBox>
      <span title={content}>
        {content}
      </span>
      <StyledLink href={headRevisionDirectoryLink}>
        View Latest
      </StyledLink>
      <br/>
      <span>
        Any edits to files, including adding files or folders, 
        currently can only be saved to the default branch.
      </span>
    </StyledWarningBox>
  );
};

export default OldRevisionInteractiveMessage;
