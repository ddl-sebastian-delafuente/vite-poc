import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Modal } from 'antd';
import * as R from 'ramda';
import styled from 'styled-components';
import {
  DominoProjectsApiProjectSummary as Project,
  DominoDatamountApiDataMountDto as ExternalVolume,
  Organization
} from '@domino/api/dist/types';
import CopyToClipBoard from '../../components/CopyToClipBoard';
import Drive from '../../icons/Drive';
import FlexLayout from '../../components/Layouts/FlexLayout';
import LabelAndValue from '../../components/LabelAndValue';
import Link from '../../components/Link/Link';
import { colors, themeHelper } from '../../styled';
import { getVolumeType } from '../index';
import ProjectsView from './ProjectsView';
import UsersView from './UsersView';

const StyledFlexLayout = styled(FlexLayout)`
  color: ${colors.doveGreyDarker};
  font-size: ${themeHelper('fontSizes.large')};
  font-weight: ${themeHelper('fontWeights.normal')};;
`;
const FlexItem = styled.div`
  flex: 1;
`;
const ContentWrapper = styled.div`
  padding: 0 30px;
`;
const Divider = styled.hr`
  border-color: ${colors.btnGrey};
`;
const StyledLabelAndValue = styled(LabelAndValue)`
  margin-bottom: 16px;
`;
const Label = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.headerGrey};
  text-transform: capitalize;
`;
const CopyToClipBoardWrapper = styled.div`
  .text-container {
    border: none;
    height: auto;
    padding: 0;
    margin-right: 10px;
    color: inherit;
  }
`;

export interface ExternalDataVolumeViewProps {
  externalVolume: ExternalVolume;
  allProjects: Project[];
  allOrganizations: Organization[];
}
export interface ExternalDataVolumeViewState {
  visible: boolean;
}

class ExternalDataVolumeView extends React.Component<ExternalDataVolumeViewProps, ExternalDataVolumeViewState> {
  state: ExternalDataVolumeViewState = {
    visible: false
  };

  showModal = () => this.setState({visible: true});

  cancelModal = () => this.setState({visible: false});

  render() {
    const {externalVolume, allProjects, allOrganizations} = this.props;
    const {name, volumeType, description, mountPath, pvcName, pvId, users, projects, isPublic,
      readOnly } = externalVolume;
    return (
      <div>
        <Link onClick={this.showModal}>{name}</Link>
        <Modal
          bodyStyle={{padding: '24px 0'}}
          footer={null}
          title={(
            <StyledFlexLayout justifyContent="flex-start" itemSpacing={8}>
              <Drive width={20} height={15} primaryColor={colors.mineShaftColor}/>
              <div>Details</div>
            </StyledFlexLayout>
          )}
          onCancel={this.cancelModal}
          visible={this.state.visible}
        >
          <ContentWrapper>
            <FlexLayout justifyContent="flex-start">
              <FlexItem>
                <StyledLabelAndValue
                  label={<Label>Name</Label>}
                  value={name}
                />
              </FlexItem>
              <FlexItem>
                <LabelAndValue
                  label={<Label>Type</Label>}
                  value={getVolumeType(volumeType)}
                />
              </FlexItem>
            </FlexLayout>
            <StyledLabelAndValue
              label={<Label>Description</Label>}
              value={R.defaultTo('--')(description)}
            />
            <StyledLabelAndValue
              label={<Label>Relative Mount Path</Label>}
              value={
                <CopyToClipBoardWrapper>
                  <CopyToClipBoard text={mountPath} tooltip="Copy path" placement="right"/>
                </CopyToClipBoardWrapper>
              }
            />
            <LabelAndValue
              label={<Label>Mount Type</Label>}
              value={readOnly ? 'Read-Only' : 'Read-Write'}
            />
          </ContentWrapper>
          <Divider/>
          <ContentWrapper>
            <StyledLabelAndValue
              label={<Label>Persistent Volume Claim</Label>}
              value={
                <CopyToClipBoardWrapper>
                  <CopyToClipBoard text={pvcName} tooltip="Copy claim" placement="right"/>
                </CopyToClipBoardWrapper>
              }
            />
            <LabelAndValue
              label={<Label>Persistent Volume</Label>}
              value={
                <CopyToClipBoardWrapper>
                  <CopyToClipBoard text={pvId} tooltip="Copy name"  placement="right"/>
                </CopyToClipBoardWrapper>
              }
            />
          </ContentWrapper>
          <Divider/>
          <ContentWrapper>
            <StyledLabelAndValue
              label={<Label>Volume Access</Label>}
              value={
                isPublic ? 'Everyone' : <UsersView userIds={users} allOrganizations={allOrganizations}/>}
            />
            <LabelAndValue
              label={<Label>Projects using this volume</Label>}
              value={
                <ProjectsView projectIds={projects} allProjects={allProjects}/>}
            />
          </ContentWrapper>
        </Modal>
      </div>
    );
  }
}

export default ExternalDataVolumeView;
