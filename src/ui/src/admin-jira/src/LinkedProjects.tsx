import * as React from 'react';
import styled from 'styled-components';
import {
  DominoProjectManagementApiLinkedProjectDetails as LinkedProjectDetails
} from '@domino/api/dist/types';
import { getAllLinkedProjects, unlinkAndResetProject } from '@domino/api/dist/ProjectManagement';
import { error } from '../../components/toastr';
import { getErrorMessage } from '../../components/renderers/helpers';
import Link from '../../components/Link/Link';
import Table from '../../components/Table/Table';
import Modal from '../../components/Modal';
import WaitSpinner from '../../components/WaitSpinner';

const Wrapper = styled.div`
  margin-top: 20px;
`;

export interface State {
  linkedProjects: LinkedProjectDetails[];
  modalVisible: boolean;
  selectedProjectId: string;
  loading: boolean;
}

class LinkedProjects extends React.Component<{}, State> {
  state: State = {
    linkedProjects: [],
    modalVisible: false,
    selectedProjectId: '',
    loading: false
  }

  componentDidMount() {
    this.fetchAllLinkedProjects();
  }

  fetchAllLinkedProjects = async () => {
    try{
      this.setState({loading: true});
      const response = await getAllLinkedProjects({});
      this.setState({
        linkedProjects: response
      });
    } catch (e) {
      console.warn(e);
      error('Failed to get linked projects');
    } finally {
      this.setState({loading: false});
    }
  }

  unlinkTicket = async () => {
    try {
      const response: any = await unlinkAndResetProject({
        projectId: this.state.selectedProjectId
      });
      if (response.code) {
        error(response.message);
      }
    } catch (e) {
      error(await getErrorMessage(e, 'Could not unlink jira ticket'));
      console.warn(e);
    } finally {
      this.fetchAllLinkedProjects();
      this.setState({modalVisible: false});
    }
  }

  setSelectedProject = (selectedProjectId: string) =>
    this.setState({selectedProjectId: selectedProjectId, modalVisible: true});

  render() {
    const columns = [{
      key: 'projectName',
      title: 'Project Name',
      dataIndex: 'projectName',
      sorter: false,
      render: (projectName: string) => <span>{projectName}</span>
    }, {
      key: 'linkedTicket',
      title: 'Linked Ticket',
      sorter: false,
      render: (ticket: LinkedProjectDetails) => <Link href={ticket.ticketLink}>{ticket.ticketKey}</Link>
    }, {
      title: 'Unlink',
      key: 'unlink',
      sorter: false,
      render: (row: LinkedProjectDetails) => <Link onClick={() => this.setSelectedProject(row.projectId)}>Unlink</Link>
    }];
    return (
      <Wrapper>
        <h4>Linked Jira Projects</h4>
        {this.state.loading ? <WaitSpinner/> : <Table
          dataSource={this.state.linkedProjects}
          columns={columns}
          hideRowSelection={true}
          hideColumnFilter={true}
          showSearch={false}
        />}
        <Modal
          visible={this.state.modalVisible}
          onOk={this.unlinkTicket}
          onCancel={() => this.setState({modalVisible: false})}
          okText="Unlink"
        >
          <div>
            <span>Are you sure you want to unlink project</span>
          </div>
        </Modal>
      </Wrapper>
    );
  }
}

export default LinkedProjects;
