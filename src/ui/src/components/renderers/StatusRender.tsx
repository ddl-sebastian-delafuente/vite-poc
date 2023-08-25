import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { Tag } from 'antd';
import {
  UNSUCCESSFUL_STATES,
  LOADING_STATES,
  RUNNING_STATES,
  COMPLETING_STATES,
  RunStatus,
} from '../enums/RunStatus';
import { caseInsensitiveContains, caseInsensitiveEquals } from '../utils/util';
import { colors } from '../../styled';

export interface RenderProps {
  status: string;
  renderAsDot?: boolean;
}

export const statusesToStatusDisplayColor = (_status: string) => {
  const status = R.replace(/\ /g, '', _status);
  const running = caseInsensitiveContains(status, RUNNING_STATES);
  const stopping = caseInsensitiveContains(status, COMPLETING_STATES);
  const loading = caseInsensitiveContains(status, LOADING_STATES);
  const stoppedFailed = caseInsensitiveContains(status, UNSUCCESSFUL_STATES);
  const userStopped = caseInsensitiveEquals(status, RunStatus.Stopped);
  const succeeded = caseInsensitiveEquals(status, RunStatus.Succeeded);

  return running ? colors.darkPurpleLabelBackground
    : stopping ? colors.warning
      : loading ? colors.malibu
        : stoppedFailed ? colors.rejectRedColor
            : userStopped ? colors.neutralGrey
              : succeeded ? colors.green
                : colors.darkEggplantPurple;
};

const StyledTag = styled<any>(Tag)`
  &.ant-tag:hover {
    opacity: 1;
    cursor: default;
  }
`;

const StyledDot = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 5px;
  background-color: ${props => props.color}
`;

const StatusRenderer = (props: RenderProps) => (
  <React.Fragment>
    {
      props.renderAsDot ?
        <StyledDot
          color={statusesToStatusDisplayColor(props.status)}
        /> :
        <StyledTag
          color={statusesToStatusDisplayColor(props.status)}
        >
          {props.status}
        </StyledTag>
    }
  </React.Fragment>
);

export default StatusRenderer;
