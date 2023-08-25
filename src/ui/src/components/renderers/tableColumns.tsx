import * as React from 'react';
import moment from 'moment';
import countdown from 'countdown';
import { length, cond, equals, isNil, always } from 'ramda';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ClockCircleOutlined } from '@ant-design/icons';
import Goal from '../../icons/Goal';
import {
  bootstrapWarningRed,
  linkBlue
} from '../../styled/colors';
import { themeHelper } from '../../styled/themeUtils';
import { projectOverviewPage } from '../../core/routes';
import Timer from '../Timer';
import StatusRenderer from './StatusRender';
import tooltipRenderer from './TooltipRenderer';
import {
  formatCPU,
  bytesToGiB,
  timeFormat,
  shortTimeFormatWithYearAndMeridian,
} from './helpers';

interface CpuProps {
  cpu: number;
}

const CommentWrapper = styled.div`
  padding: 0px 5px;
  background: #9DAEE4;
  border-radius: 20px;
  font-weight: 400;
  width: fit-content;
  height: auto;
  a {
    color: white;
    text-decoration: none;
  }
`;

const StyledCPU = styled.div`
  color: ${(props: CpuProps) => props.cpu > 70 ? bootstrapWarningRed : 'inherit'};
`;

const TitleWithGoals = styled.div`
  display: flex;
`;

const TWGTitle = styled.div`
  display: flex;
`;

const IconTitleSeparator = styled.div`
  min-width: ${themeHelper('margins.tiny')};
`;

export const cpuRenderer = (cpu: number) => (
  <StyledCPU cpu={cpu}>
    {formatCPU(cpu)}
  </StyledCPU>
);

export const memoryRenderer = (memory: number) => (
  <span>
    {bytesToGiB(memory)}
  </span>
);

export const durationRenderer = (
  submissionTime?: number,
  completedTime = 0,
  status = '',
  isWebsocketError = false
) => {
  if (submissionTime) {
    return (
      <Timer
        renderBody={() => {
          const cd = countdown(
            submissionTime,
            completedTime || moment().valueOf(),
          ) as countdown.Timespan;
          // format in 2w 4h 3m 2s format
          countdown.setLabels('ms| s| m| h| d| w', 'ms| s| m| h| d| w', ', ', ',');
          return cd.toString() || '--';
        }}
        canTick={() => (status === 'Running' && !isWebsocketError)}
      />
    );
  } else {
    return '--';
  }
};

const preventPropagation = (e: { stopPropagation: () => void }) => e.stopPropagation();

export const commentsRenderer = (
  link: string,
  commentsCount: number,
) => (
  <CommentWrapper>
    <Link to={link} onClick={preventPropagation}>
      {commentsCount}
    </Link>
  </CommentWrapper>
);

export const statusRenderer = (status: string, dataTest?: string) => (
  tooltipRenderer(status, (
    <span data-test={dataTest}>
      <StatusRenderer
        status={status}
        renderAsDot={true}
      />
    </span>
    ), undefined, undefined, undefined,
    (trigger: HTMLElement) => trigger.parentElement || document.body)
);

export const stageTimeRenderer = (submissionTime?: number | string) => (
  submissionTime ?
    tooltipRenderer(
      moment(submissionTime).format(timeFormat), moment(submissionTime).fromNow()
    ) : '--'
);

export const startTimeRenderer = (time?: number | string) => cond([
  [equals(true), always(tooltipRenderer(
    moment && moment(time).format(timeFormat),
    moment && moment(time).format(shortTimeFormatWithYearAndMeridian))
  )],
  [equals(false), always('--')]
])(!isNil(time));

export const actualTimeRenderer = (submissionTime?: number) => (
  moment(submissionTime).format(timeFormat)
);

export const nameRenderer = (name: string) => (
  tooltipRenderer(name, name)
);

export const commandRenderer = (name: string) => (
  tooltipRenderer(name, name)
);

export const userRenderer = (name: string, isScheduled = false) => (
  tooltipRenderer(
    isScheduled ? `Scheduled by ${name}` : name,
    (
      <span>
        {
          isScheduled &&
            <ClockCircleOutlined style={{paddingRight: '10px'}} />
        }
        {name}
      </span>
    )
  )
);

export const queuedReasonRenderer = (name: string) => (
  tooltipRenderer(name, name)
);

export const getProjectGoalLink = (ownerName: string, projectName: string) => (
  `${projectOverviewPage(ownerName, projectName, 'goals')}`
);

const titleRenderer = (title: string | React.ReactNode, defaultTitle = '--') => (
  <span className="title" data-test={`${title || defaultTitle}-title`}>
    {title || defaultTitle}
  </span>
);

export const titleWithGoalsInfoRenderer = (
  ownerName: string,
  projectName: string,
  goalIds: Array<string>,
  title?: string | React.ReactNode,
  titleFirst?: boolean
) => {
  const defaultTitle = '--';

  if (!title && !length(goalIds)) {
    return defaultTitle;
  }
  if (title && !length(goalIds)) {
    return titleRenderer(title, defaultTitle);
  }
  return (
    <TitleWithGoals data-test="goal-info">
      {
        titleFirst &&
        <TWGTitle>
          {titleRenderer(title, defaultTitle)}
          <IconTitleSeparator />
        </TWGTitle>
      }
      <Link
        to={getProjectGoalLink(ownerName, projectName)}
      >
      {
        tooltipRenderer(`Linked to ${length(goalIds)} Goals`, (
          <span onClick={(ev) => ev.stopPropagation()}>
            <Goal
              primaryColor={linkBlue}
              height={13}
              width={13}
            />
          </span>),
          'right'
        )}
      </Link>
      {
        !titleFirst &&
        <TWGTitle>
          <IconTitleSeparator />
          {titleRenderer(title)}
        </TWGTitle>
      }
    </TitleWithGoals>
  );
};

const padStart = (text: string, targetLength: number, padString: string) => {
  if (text.length > targetLength) {
    return text;
  } else {
    const rem = targetLength - text.length;
    const padStr = padString.repeat(rem);
    return padStr + text;
  }
};

export const formatDurationRenderer = (
  submissionTime?: number,
  completedTime?: number,
  status = '',
  isWebsocketError = false
) => {
  if (submissionTime) {
    return (
      <Timer
        renderBody={() => {
          const endTime = completedTime ? moment(completedTime) : moment();
          const duration = moment.duration(endTime.diff(moment(submissionTime)));
          const hours = duration.asHours().toFixed();
          const minutes = duration.minutes();
          const seconds = duration.seconds();
          return `${padStart(hours.toString(), 2, '0')}:${
            padStart(minutes.toString(), 2, '0')}:${
            padStart(seconds.toString(), 2, '0')}`;
        }}
        canTick={() => (status === 'Running' && !isWebsocketError)}
      />
    );
  } else {
    return '--';
  }
};

export const durationFormat = (time: number) => {
  const now = moment();
  return  moment.utc(now.diff(moment(time))).format('hh:mm:ss');
}
