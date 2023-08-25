import * as React from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components';
import { DominoServerProjectsApiProjectGatewayOverview as Project } from '@domino/api/dist/types';
import { Popover } from '../../../components';
import ComputeEnvironmentDropdown from '../../../components/ComputeEnvironmentDropdown';
import HardwareTierSelect, { ExecutionType } from '../../../components/HardwareTierSelect';
import EnvironmentsIcon from '../../../icons/EnvironmentsIcon';
import HardwareBubble from '../../../icons/HardwareBubble';
import { CollapseElement } from '../../components/NavItem';

const InfoWrapper = styled.div`
  padding: 5px 0;
  display: flex;
`;

const Icon = styled.div`
  padding-right: 14px;
`;
const Text = styled.div`
  padding-top: 10px;
  height: 20px;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type EnvironmentDisplayProps = { pointer: boolean };
const EnvironmentDisplay = styled.div<EnvironmentDisplayProps>`
  ${props => props.pointer ? 'cursor: pointer;' : ''}
`;
const IndentedItem = styled.div`
  padding-left: 12px;
`;

type InfoElementProps = {
  icon: JSX.Element;
  text: JSX.Element | string;
};
const InfoElement = ({ icon, text }: InfoElementProps) => (
  <InfoWrapper>
    <Icon>{icon}</Icon>
    <Text>{text}</Text>
  </InfoWrapper>);

export interface PopoverContentProps {
  hardwareTierId: string;
  projectId: string;
  setEnvironmentName: (name: string) => void;
  setHardwaretierName: (name: string) => void;
  updateProject?: (project: Project) => void;
  project?: Project;
}

export const PopoverContent = (
  { hardwareTierId, projectId, setHardwaretierName, updateProject, project }: PopoverContentProps) => (
    <div>
      <div>
        <b>Hardware Tier</b>
        <HardwareTierSelect
          changeHandler={(hwt: any) => {
            setHardwaretierName(hwt!.hardwareTier.name);
            if (updateProject && project) {
              updateProject({
                ...project,
                hardwareTierId: hwt!.hardwareTier.id,
                hardwareTierName: hwt!.hardwareTier.name,
              });
            }
          }}
          projectId={projectId}
          selectedId={hardwareTierId}
          updateProjectOnSelect={true}
          executionType={ExecutionType.None}
        />
      </div>
      <div>
        <b>Compute Environment</b>
        <ComputeEnvironmentDropdown
          projectId={projectId}
          canEditEnvironments={false}
          updateProjectEnvironmentOnSelect={true}
          isRestrictedProject={project?.details?.isRestricted}
        />
      </div>
    </div>
  );

const ContentElement =
  ({
    children,
    projectId,
    setEnvironmentName,
    setHardwareTierName,
    canEdit,
    hardwareTierId,
    updateProject,
    project
  }: SettingsProps & {children: React.ReactNode}) => (
    canEdit ? (
      <Popover
        placement="right"
        title="Change project settings"
        content={(
          <PopoverContent
            setEnvironmentName={setEnvironmentName}
            setHardwaretierName={setHardwareTierName}
            hardwareTierId={hardwareTierId}
            projectId={projectId}
            updateProject={updateProject}
            project={project}
          />)}
        trigger="click"
      >
        {children}
      </Popover>) : <div>{children}</div>);

export interface SettingsProps {
  projectId: string;
  hardwareTierId: string;
  collapsed?: boolean;
  hardwareTierName: string;
  environmentName: string;
  canEdit: boolean;
  setEnvironmentName: (name: string) => void;
  setHardwareTierName: (name: string) => void;
  updateProject?: (project: Project) => void;
  project?: Project;
}

export const ProjectSettings = (props: SettingsProps) => {
  const {
    hardwareTierName, environmentName, collapsed, canEdit
  } = props;
  return (
    <ContentElement {...props} >
      {!collapsed ?
        <IndentedItem>
          <EnvironmentDisplay pointer={canEdit}>
            <InfoElement
              icon={<HardwareBubble width={16} height={16} />}
              text={props.project ? props.project.hardwareTierName : hardwareTierName}
            />
            <InfoElement
              icon={<EnvironmentsIcon width={16} height={16} />}
              text={props.project ? props.project.environmentName : environmentName}
            />
          </EnvironmentDisplay>
        </IndentedItem>
        :
        <Tooltip
          placement="right"
          title={`Hardware Tier: ${props.project ? props.project.hardwareTierName : hardwareTierName}.
                  Environment: ${environmentName}`}
        >
          <EnvironmentDisplay pointer={canEdit}>
            <CollapseElement type="secondary" selected={false} icon={<HardwareBubble width={16} height={16} />} />
            <CollapseElement type="secondary" selected={false} icon={<EnvironmentsIcon width={16} height={16} />} />
          </EnvironmentDisplay>
        </Tooltip>
      }
    </ContentElement>
  );
};

export interface ProjectSettingsProps {
  projectId: string;
  hardwareTierId: string;
  hardwareTierName: string;
  environmentName: string;
  canEdit: boolean;
  collapsed?: boolean;
  updateProject?: (project: Project) => void;
  project?: Project;
}
export interface DataStateProps {
  hardwareTierName: string;
  environmentName: string;
  setEnvironmentName: (name: string) => void;
  setHardwareTierName: (name: string) => void;
}

export type EnhancedProps = DataStateProps & ProjectSettingsProps;

const ProjectSettingsContainer = (props: ProjectSettingsProps) => {

  const [hardwareTierName, setHardwareTierName] = React.useState<string>(props.hardwareTierName);
  const [environmentName, setEnvironmentName] = React.useState<string>(props.environmentName);

  return (
    <ProjectSettings
      {...props}
      hardwareTierName={hardwareTierName}
      setHardwareTierName={setHardwareTierName}
      environmentName={environmentName}
      setEnvironmentName={setEnvironmentName}
    />
  );
};

export default ProjectSettingsContainer;
