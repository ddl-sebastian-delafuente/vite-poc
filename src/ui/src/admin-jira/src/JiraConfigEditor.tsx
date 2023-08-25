import * as React from 'react';
import { ChangeEvent } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { Form } from '@ant-design/compatible';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import { DominoProjectManagementApiPmOAuth1AConfiguration as JiraOAuthConf } from '@domino/api/dist/types';
import {
  getJiraOAuthConfiguration,
  createJiraOAuthConfiguration,
  removeJiraOAuthConfiguration,
} from '@domino/api/dist/ProjectManagement';
import Table from '../../components/Table/Table';
import Button from '../../components/Button/Button';
import WaitSpinner from '../../components/WaitSpinner';
import { error as errorToast, success } from '../../components/toastr';
import Modal from '../../components/Modal';
import Link from '../../components/Link/Link';
import LinkedProjects from './LinkedProjects';
import { colors, themeHelper } from '../../styled';
import ErrorPage from '../../components/ErrorPage';

type Error = Partial<{ status: number }>;

export interface DisplayConfigProps {
  clickHandler: () => void;
  data: JiraOAuthConf;
}

export interface JiraConfigState {
  error?: Error;
  loading: boolean;
  jiraOAuthConfiguration?: JiraOAuthConf;
}

export interface DisplayConfigState {
  modalVisible: boolean;
}

export interface AddConfigState {
  jiraUrl: string;
}

export interface AddConfigProps {
  clickHandler: (jiraUrl: string) => void;
}

const WrappingCode = styled.code`
  white-space: normal;
`
const Warning = styled.div`
  border-radius: ${themeHelper('borderRadius.standard')};
  background-color: ${colors.secondaryWarningBackground};
  color: ${colors.secondaryWarning};
  padding: ${themeHelper('paddings.medium')};
  margin-bottom: ${themeHelper('margins.medium')};
  border: 1px solid ${colors.secondaryWarningBorder};
`;
const StyledLink = styled(Link)`
  color: ${colors.linkBlue};
`;

const getRestartServicesLink = () => '/admin/restartNucleus';

class DisplayConfig extends React.PureComponent<DisplayConfigProps, DisplayConfigState> {
  constructor(props: DisplayConfigProps) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  render() {
    const { data } = this.props;
    const dataSource = [
      {
        key: '1',
        field: 'Application URL',
        value: <code>{data.applicationUrl}</code>
      },
      {
        key: '2',
        field: 'Application Name',
        value: <code>{data.applicationName}</code>
      },
      {
        key: '3',
        field: 'Application Type',
        value: <code>{data.applicationType}</code>
      },
      {
        key: '4',
        field: 'Create Incoming Link',
        value: <code>{data.createIncomingLink.toString()}</code>
      },
      {
        key: '5',
        field: 'Incoming Consumer Key',
        value: <code>{data.inComingConsumerKey}</code>
      },
      {
        key: '6',
        field: 'Incoming Consumer Name',
        value: <code>{data.inComingConsumerName}</code>
      }
    ];

    if (data.publicKey) {
      dataSource.push(
        {key: '7', field: 'Public Key', value: <WrappingCode>{data.publicKey}</WrappingCode>}
      );
    }

    const columns = [
      {
        title: 'Field',
        dataIndex: 'field',
        key: 'field',
        sorter: false
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        sorter: false
      }
    ];
    return (
      <div>
        <h4>Current Configuration</h4>
        <Table
          dataSource={dataSource}
          columns={columns}
          hideRowSelection={true}
          hideColumnFilter={true}
          showSearch={false}
          data-test = "jira-oauth-data"
        />
        {data.publicKey && (
            <div role="alert" className="alert alert-info">
                <span className="glyphicon glyphicon-info-sign" /> Make sure to copy your public key now.
                You won’t be able to see it again.
            </div>
          )
        }
        <br />
        <Button btnType="primary" size="large" isDanger={true} onClick={() => this.setState({modalVisible: true})}>
          Delete Configuration
        </Button>
        <Modal
          visible={this.state.modalVisible}
          onOk={this.props.clickHandler}
          onCancel={() => this.setState({modalVisible: false})}
          okText="Yes"
          cancelText="No"
          className="modal-with-gray-bg"
          data-test="delete-config-confirm-modal"
        >
          <div>
            <div>
              <strong>
                You must unlink all projects linked to Jira tickets before deleting current Jira configuration.
              </strong>
            </div>
           <span>Are you sure you want to delete current Jira configuration?</span>
          </div>
        </Modal>
      </div>
    );
  }
}

class AddConfig extends React.PureComponent<AddConfigProps, AddConfigState> {
  constructor(props: AddConfigProps) {
    super(props);
    this.state = {
      jiraUrl: ''
    };
  }

  changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      jiraUrl: e.target.value
    });
  }
  onAdd = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    this.props.clickHandler(this.state.jiraUrl);
  }

  render() {
    return(
    <div>
      <h4>No Configuration Found.</h4>
      <Form onSubmit={this.onAdd}>
        {/* @ts-ignore */}
        <Form.Item label="Jira URL">
          <Input
            onChange={this.changeHandler}
            placeholder={'Enter Jira URL'}
            type="url"
            data-test="jira-url"
            required
          />
        </Form.Item>
        <Button htmlType="submit" size="large" data-test="submit-jira-url">Add Configuration</Button>
      </Form>
    </div>
    );
  }
}

class JiraConfigEditor extends React.PureComponent<{}, JiraConfigState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      error: undefined,
      loading: true,
      jiraOAuthConfiguration: undefined
    };
  }

  deleteConfig = () => {
    this.setState({loading: true});
    removeJiraOAuthConfiguration({}).then(() => {
      this.setState({
        jiraOAuthConfiguration: undefined,
        loading: false
      });
      success('Jira configuration successfully deleted');
    }, (error: string) => errorToast(`Could not delete configuration: ${error}`));
  }

  addConfig = (jiraUrl: string) => {
    this.setState({loading: true});
    createJiraOAuthConfiguration({jiraUrl: jiraUrl}).then((data: JiraOAuthConf) => {
      this.setState({
        jiraOAuthConfiguration: data,
        loading: false
      });
      success('Jira configuration successfully added');
    }, (error: string) => errorToast(`Could not add configuration: ${error}`));
  }

  componentDidMount() {
    this.fetchJiraConf();
  }

  fetchJiraConf = async () => {
    const newState: Partial<JiraConfigState> = {};
    try {
      newState.jiraOAuthConfiguration = await getJiraOAuthConfiguration({});
    } catch (e) {
      console.error(e);
      newState.error = e;
    } finally {
      this.setState({ ...newState as JiraConfigState, loading: false });
    }
  }

  render() {
    return (
      <div>{
        this.state.loading
          ? <WaitSpinner />
          : !R.isNil(this.state.error)
            ? <ErrorPage status={this.state.error.status ?? 403} />
            : (<>
              <Warning>
                Changes here do not take effect until services are restarted.
                Click <StyledLink href={getRestartServicesLink()}>here</StyledLink> to restart services.
              </Warning>
              <h1>Jira Configuration Management</h1>
              {this.state.loading ? <WaitSpinner /> : (
                this.state.jiraOAuthConfiguration
                  ? <DisplayConfig clickHandler={this.deleteConfig} data={this.state.jiraOAuthConfiguration!} />
                  : <AddConfig clickHandler={this.addConfig} />
                )}
              <LinkedProjects />
            </>)
      }</div>
    );
  }
}

export default JiraConfigEditor;
