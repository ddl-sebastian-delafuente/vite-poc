import * as React from 'react';
import styled from 'styled-components';
import { themeHelper } from '../../styled/themeUtils';
import { DominoProjectsApiProjectStatus } from '@domino/api/dist/types';
import { colors } from '../../styled';

interface StatusRendererTypeProps {
  isBlocked: boolean;
  status: 'active' | 'complete';
}
const StatusRendererType = styled.span<StatusRendererTypeProps>`
  display: inline-block;
  width: ${themeHelper('statusDotSizePx')}px;
  height: ${themeHelper('statusDotSizePx')}px;
  border-radius: 50%;
  background-color: ${props => props.isBlocked ? colors.rejectRedColor 
                      : props.status === 'active' ? colors.green
                        : props.status === 'complete' ? colors.neutralGrey 
                          : colors.darkEggplantPurple};
  letter-spacing: 0.3px;
  color: white;
  font-size: ${themeHelper('fontSizes.tiny')};
`;

const ProjectStatusRenderer = (value: DominoProjectsApiProjectStatus) => {
    return (
      <StatusRendererType isBlocked={value.isBlocked} status={value.status} />);
  };

// TODO: Check this
export default ProjectStatusRenderer;
