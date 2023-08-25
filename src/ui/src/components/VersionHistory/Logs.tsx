import * as React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { map } from 'ramda';
import { EyeOutlined } from '@ant-design/icons';
import ModalWithButton from '../../components/ModalWithButton';
import InvisibleButton from '../../components/InvisibleButton';
import WaitSpinner from '../../components/WaitSpinner';
import { sharkGrey, lightishBlue, logColor, tulipTreeColor } from '../../styled/colors';
import { themeHelper } from '../../styled/themeUtils';

const StyledInvisibleButton = styled(InvisibleButton)`
  &.ant-btn {
    padding: 0;
    width: 100%;
  }
  &, &:hover {
    color: ${lightishBlue};
  }
`;

const DownloadOption = styled.span`
  margin-left : 10px;
`;

const LogsWrapper = styled.div`
  height: calc(100vh - 250px);
  padding: 15px;
  overflow-y: auto;
  font-size: 12px;
  background-color: ${sharkGrey};
  color: ${logColor};
  word-wrap: break-word;
  && * {
    font-family: ${themeHelper('codeFontFamily')};
  }
`;

const TimeStamp = styled.span`
  color: ${tulipTreeColor};
`;

const Title = styled.span`
  font-size: ${themeHelper('fontSizes.large')};
`;

export type Log = {
  timestamp: string;
  content: string;
}

interface LogsProps {
  title: string;
  buttonLabel: string;
  fetchLogs: (onSuccess: (val: Array<Log>) => void, onComplete: () => void) => void;
}

const Logs = (props: LogsProps) => {
  const [logs, setLogs] = React.useState<Array<Log>>([]);
  const [isLogsFetching, setIsLogsFetching] = React.useState<boolean>(false);

  const fetchLogs = async () => {
    setIsLogsFetching(true);
    props.fetchLogs(setLogs, () => setIsLogsFetching(false));
    return {};
  };

  return (
    <ModalWithButton
      ModalButton={StyledInvisibleButton}
      openButtonLabel={(
        <>
          <EyeOutlined style={{ fontSize: '15px'}} />
          <DownloadOption>{props.buttonLabel}</DownloadOption>
        </>)}
      modalProps={{
        width: 900,
        bodyStyle: { padding: '20px' },
        title: <Title>{props.title}</Title>
      }}
      showFooter={false}
      closable={true}
      onBeforeOpen={fetchLogs}
    >
      {() => isLogsFetching ? <WaitSpinner /> : (
        <LogsWrapper>
          {
            map((item: Log) => (
              <div>
                <TimeStamp>{moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} : </TimeStamp>
                <span>{item.content}</span>
              </div>
            ), logs)
          }
        </LogsWrapper>        
      )}
    </ModalWithButton>
  );
};

export default Logs;
