import * as React from 'react';
import styled from 'styled-components';
import Link from '../components/Link/Link';
import { themeHelper } from '../styled/themeUtils';
import { linkBlue } from '../styled/colors';
import { titleWithGoalsInfoRenderer } from '../components/renderers/tableColumns'; 

export const getModelLink = (modelId: string) => `/models/${modelId}/overview`;

// The other cell values of table are rendered from scala template & has 13px font-size.
const StyledModelName = styled.span`
  font-size: 13px;
  font-weight: ${themeHelper('fontWeights.bold')};
`;

const StyledLink = styled(Link)`
  text-decoration: none !important;
  color: ${linkBlue} !important;
`;

export interface ModelNameProps {
  name: string;
  modelId: string;
  goalIds: Array<string>;
  projectName: string;
  projectOwnerUsername: string;
}

const ModelName = ({name, modelId, goalIds, projectName, projectOwnerUsername}: ModelNameProps) => (
  <>
    {
      titleWithGoalsInfoRenderer(
        projectOwnerUsername,
        projectName,
        goalIds,
        <StyledLink
          href={getModelLink(modelId)}
        >
          <StyledModelName className="model-name">{name}</StyledModelName>
        </StyledLink>
      )
    }
  </>
);

export default ModelName;
