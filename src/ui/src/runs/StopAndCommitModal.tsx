import * as React from 'react';
import styled from 'styled-components';
import { colors } from '@domino/ui/dist/styled';
import LaptopIcon from '@domino/ui/dist/icons/LaptopIcon';
import ModalWithButton from '../components/ModalWithButton';
import DangerButtonDark from '../components/DangerButtonDark';
import Link from '../components/Link/Link';
import HelperTextPanel from '../components/HelperTextPanel';
import {
  handleStopExecution,
  isApp,
  isWorkspace,
  STOP_RUN_BUTTON_LABEL,
  StopRunButtonProps
} from './utils';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';

const Container = styled.span`
  svg {
    display: flex;
    margin: 0 auto;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px auto;
  color: ${colors.greyishBrown};
  font-size: 20px;
`;

const Content = styled.div`
  margin: 0 32px 25px;

  p {
    color: ${colors.doveGray};
  }
`;

export type StopAndCommitProps = { urlToExecution: string; } & StopRunButtonProps;

const modalSubmitButtonLabel = (workloadType: string): string =>
  isApp(workloadType) ? 'Stop and discard results' :
    (!isWorkspace(workloadType) ? 'Stop and commit results' : 'Stop Workspace');

const modalProps = {
  title: 'Are you sure you want to stop this execution?',
  closable: true
};

const ExecutionLink: React.FC<{ type: string, href: string }> = ({ type, href }) => (
  <><Link href={href}>{`Click here to view the ${type}`}</Link> if you want to discard any uncommitted changes.</>
);

const StopAndCommitModal = (props: StopAndCommitProps) => {
  const { whiteLabelSettings } = useStore();
  return (
  <ModalWithButton
    handleSubmit={handleStopExecution(props, true)}
    ModalButton={DangerButtonDark}
    openButtonLabel={STOP_RUN_BUTTON_LABEL}
    modalSubmitButtonLabel={modalSubmitButtonLabel(props.workloadType)}
    modalProps={modalProps}
  >
    {!isWorkspace(props.workloadType) ? (<HelperTextPanel>
      {getAppName(whiteLabelSettings)} will commit any uncommitted changes to your project and external git repositories.
    </HelperTextPanel>) : (<Container>
      <LaptopIcon primaryColor={colors.white} />
      <Header>Stopping a Durable Workspace</Header>
      <Content>
        <p>Your working directory and any files changes will be preserved for a stopped workspace and available upon restart.</p>
        <p>All other files (e.g. packages installed in this session) will not persist between sessions.</p>
        <p><ExecutionLink type="Workspace" href={props.urlToExecution} /></p>
      </Content>
    </Container>)}
    {!isWorkspace(props.workloadType) &&
      <HelperTextPanel><ExecutionLink type="execution" href={props.urlToExecution} /></HelperTextPanel>}
  </ModalWithButton>);
}
export default StopAndCommitModal;
