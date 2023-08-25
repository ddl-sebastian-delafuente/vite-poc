import * as React from 'react';
import * as R from 'ramda';
import pluralize from 'pluralize';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Form, Input } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import {getProvisionedWorkspaceCount} from "@domino/api/dist/Workspace";
import { transferProjectOwnership } from '@domino/api/dist/Projects';
import { error, success } from '@domino/ui/dist/components/toastr';
import Button from './Button/Button';
import Modal from '../components/Modal';
import Link from "./Link/Link";
import { projectRoutes } from '../navbar/routes';
import { colors, themeHelper } from '../styled';
import useStore from '../globalStore/useStore';
import { getAppName, replaceWithWhiteLabelling } from '../utils/whiteLabelUtil';

const ModalTitle = styled.span`
   > * {
    padding-right: 12px;
  }
  .anticon.anticon-warning {
    color: ${colors.rejectRedColor};
  }
`;

const Content = styled.div`
  padding: ${themeHelper('margins.medium')};
  background: ${colors.alabaster};
`;
const Description = styled.div`
  margin-bottom: ${themeHelper('margins.large')};
`;

export interface TransferOwnershipProps {
  errorPageContactEmail: string
  projectId: string;
}

const TransferOwnership = (props: TransferOwnershipProps) => {
  const { whiteLabelSettings } = useStore();
  const [unarchivedWorkspaceCount, setUnarchivedWorkspaceCount] = React.useState(0);
  const [visibility, setVisibility] = React.useState(false);
  const [isTransferringProject, setIsTransferringProject] = React.useState(false);
  const [userName, setUsername] = React.useState('');
  const [projectName, setProjectName] = React.useState('');
  const [newOwner, setNewOwner] = React.useState('');

  const transferOwnershipWarning =  "By transferring ownership, the previous owner will no longer be able to edit, delete the data source with other users. " +
    "They will not lose access to the data sources. Domino admins are always able to edit the data source or re-assign an owner."

  const showModal = React.useCallback (async () => {
    getProvisionedWorkspaceCount({projectId: props.projectId})
      .then(count => {
        setUnarchivedWorkspaceCount(count);
      })
      .catch(err => {
        console.error(err);
      });
    setVisibility(true);
  }, [props.projectId]);

  const hideModal = React.useCallback( () => setVisibility(false), []);

  const handleTransferOwnership = React.useCallback(async () => {
    try {
      setIsTransferringProject(true);
      await transferProjectOwnership({body: {
        projectId: props.projectId,
        newOwnerUsernameOrEmail: newOwner
      }});
      success(`${projectName} was successfully transferred to ${newOwner}`);
      window.location.assign(projectRoutes.path());
    } catch (e) {
      console.warn(e);
      error('There was an error transferring the project. Please try again later.');
    } finally {
      setIsTransferringProject(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, newOwner, projectName, userName]);

  const archiveDisabled = unarchivedWorkspaceCount > 0;
  const toolTipText = archiveDisabled ?
    `This project has ${unarchivedWorkspaceCount} ${pluralize('workspace', unarchivedWorkspaceCount)}. You must delete all workspaces before proceeding`
    : undefined;

  return (
    <>
      <Button isDanger={true} onClick={showModal}>Transfer Ownership</Button>
      <Modal
        title={<ModalTitle>
          <WarningOutlined/>
          <span>Transfer This Project?</span>
        </ModalTitle>}
        visible={visibility}
        isDanger={true}
        okText="Transfer"
        onCancel={hideModal}
        onOk={handleTransferOwnership}
        confirmLoading={isTransferringProject}
        useLoadingButton={true}
        okButtonProps={{disabled: archiveDisabled}}
        okButtonTooltipText={toolTipText}
      >
        <Content>
          <Description>
            {replaceWithWhiteLabelling(getAppName(whiteLabelSettings))(transferOwnershipWarning)}
            <p>
              Once transferred, please <Link
              href={`mailto:${!R.isNil(props.errorPageContactEmail)
              && props.errorPageContactEmail}`}
            > contact support
            </Link> if you wish to acquire project later.
            </p>
          </Description>
          <Form
            name="basic"
            autoComplete="on"
            layout={"vertical"}
          >
            <Form.Item
              label="Your Username:"
              name="userName"
              rules={[{ message: 'Please input your username!' }]}
            >
              <Input
                onChange={e => setUsername(e.target.value)}/>
            </Form.Item>
            <Form.Item
              label="Project Name:"
              name="projectName"
              rules={[{ message: 'Please input your project name!' }]}
            >
              <Input
                onChange={e => setProjectName(e.target.value)}/>
            </Form.Item>
            <Form.Item
              label="New Owner Username or Email:"
              name="newOwner"
              rules={[{ message: 'Please input the new owner username or email!' }]}
            >
              <Input
                onChange={e => setNewOwner(e.target.value)}/>
            </Form.Item>
          </Form>
        </Content>
      </Modal>
    </>
  );
};

export default TransferOwnership;
