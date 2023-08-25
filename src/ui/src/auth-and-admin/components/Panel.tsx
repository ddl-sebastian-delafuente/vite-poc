import * as React from 'react';
import styled from 'styled-components';
import { QuestionCircleFilled } from '@ant-design/icons';
import { colors } from '@domino/ui/dist/styled';

const StyledAnchorElement = styled.a`
  display: flex;
  align-items: center;
  color: ${colors.basicLink};
`;

const StyledQuestionCircleFilled = styled(QuestionCircleFilled)`
  margin-left: 5px;
`;

export type Props = {
  id?: string;
  header: string;
  helpLinkHref?: string;
  onHelpLinkClick?: () => void;
  children?: React.ReactNode;
};

export const Panel = ({
  header,
  onHelpLinkClick,
  helpLinkHref,
  children,
  id,
}: Props) => {
  const hasHelpLink = !!helpLinkHref || !!onHelpLinkClick;
  return (
    <div className="panel panel-default" id={id}>
      <div className="panel-heading">
        {hasHelpLink && (
        <StyledAnchorElement
          href={helpLinkHref || '#'}
          onClick={onHelpLinkClick}
          className="pull-right help-link"
        >
            What’s this? <StyledQuestionCircleFilled />
        </StyledAnchorElement>
        )}
        <h3 className="panel-title">
          {header}
        </h3>
      </div>
      <div className="panel-body">
        {children}
      </div>
    </div>
  );
};

export default Panel;
