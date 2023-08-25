import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoWorkspacesApiWorkspaceDefinitionDto as WorkspaceDefinition,
} from '@domino/api/dist/types';
import { getAvailableToolsForEnvironment } from '@domino/api/dist/Workspaces';
import { getAvailableWorkspaceDefinitions } from '@domino/api/dist/Workspaces';
import Jupyter from '../icons/Jupyter';
import VScode from '../icons/VScode';
import RStudio from '../icons/RStudio';
import Pyspark from '../icons/Pyspark';
import { error as toastrError } from '../components/toastr';
import { themeHelper } from '../styled/themeUtils';
import {
  altoLight,
  orangishGrey,
  dodgerBlue,
  greyishBrown,
  rejectRedColor,
  alabaster,
  boulder
} from '../styled/colors';
import FlexLayout from './Layouts/FlexLayout';
import JupyterLab from '../icons/JupyterLab';
import Matlab from '../icons/Matlab';
import SasStudio from '../icons/SasStudio';
import { NETWORK_ERROR_600 } from '@domino/api/dist/httpRequest';
import Radio, { RadioChangeEvent } from '@domino/ui/dist/components/Radio';

const ComponentLayout = styled.div`
  margin-top: 0;
  .ant-radio {
    display: none; /* radio selector isn't needed */
  }
`;

type StyledContainerProps = {
  disabled: boolean;
};
export const StyledContainer = styled.div<StyledContainerProps>`
  display: inline-flex;
  margin: 0 22px 14px 0;
  border: 1px solid ${alabaster};
  &.selected {
    border: 1px solid ${({ disabled }) => disabled ? altoLight : dodgerBlue};
    border-radius: ${themeHelper('borderRadius.standard')};
  }

  .ws-def-option {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    margin: 0;
    width: 165px;
    padding: 0 ${themeHelper('margins.tiny')};
    box-sizing: border-box;
    border: 1px solid ${altoLight};
    border-radius: ${themeHelper('borderRadius.standard')};
    user-select: none;
    background-color: ${orangishGrey};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    &.selected {
      border: 1px solid ${props => props.disabled ? alabaster : dodgerBlue};
      border-radius: 0;
    }
  }

  && > .ant-radio-wrapper {
    margin-right: 0;
  }

  span.ant-radio + span {
    display: flex;
  }

  span.ant-radio + * {
    padding: 0;
  }
`;

const NoWorkspaceImageLabel = styled.span`
  width: 100%;
  padding: 0px;
`;

const ErrorState = styled.div`
  font-style: italic;
  color: ${rejectRedColor};
`;

const IdeIcon = styled.img`
  max-height: 32px;
  max-width: 64px;
`;

const DefinitionTitle = styled.span`
  display: block;
  align-items: center;
  height: 16px;
  max-width: 72px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  font-size: 14px;
  color: ${({ disabled }: { disabled: boolean }) => disabled ? 'grey' : greyishBrown};
`;

const StyledDefinitionText = styled.div`
  color: ${boulder};
`;

const noop = () => undefined;

export interface WorkspaceDefinitionWithDataFetchProps {
  projectId: string;
  environmentId?: string;
  setWorkspaceIDEs?: React.Dispatch<React.SetStateAction<WorkspaceDefinition[] | undefined>>;
  setWorkspaceIDEsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  onWorkspaceDefinitionSelect?: (workspace?: WorkspaceDefinition) => void;
  selectedWorkspaceDefId?: string;
  disabled?: boolean;
  project?: Project;
  showDefaultSelection?: boolean;
  testId?: string;
  workspaceDisabledReason?: string;
}
export interface DataStateProps {
  workspaceDefinitions: WorkspaceDefinition[];
  selectedWorkspaceDefinitionId?: string;
  setWorkspaceDefinitions: (wsDefinitionsData?: WorkspaceDefinition[]) => void;
  setSelectedWorkspaceDefinitionId: (selectedWorkspaceDefinitionId?: string) => void;
  error?: boolean;
  setError: (error: boolean) => void;
  onChange?: (e: RadioChangeEvent) => void;
}

export interface StateProps {
  environmentName: string;
  setEnvironmentName: (envName: string) => void;
}

export type EnhancedProps = StateProps & DataStateProps & WorkspaceDefinitionWithDataFetchProps;

export type WorkspaceDefinitionLogoProps = {
  wsDefinition: WorkspaceDefinition;
  disabled: boolean;
};

const WorkspaceDefinitionLogo = ({ wsDefinition, disabled }: WorkspaceDefinitionLogoProps) => {
  const withName = (icon: React.ReactNode, name?: string) => (
    <FlexLayout alignItems="center" flexWrap="nowrap" style={{ width: '135px', height: '100%' }}>
      {icon}
      <DefinitionTitle disabled={disabled} >
        {name || wsDefinition.title}
      </DefinitionTitle>
    </FlexLayout>
  );

  if (wsDefinition.title) {
    return R.cond([
      [R.equals('Jupyter (Python, R, Julia)'), () => withName(<Jupyter width={16} height={16}/>, 'Jupyter')],
      [R.equals('JupyterLab'), () => withName(<JupyterLab width={16} height={16}/>)],
      [R.equals('vscode'), () => withName(<VScode width={16} height={16}/>, 'VSCode')],
      [R.equals('RStudio'), () => withName(<RStudio width={16} height={16}/>)],
      [R.equals('PySpark'), () => withName(<Pyspark width={16} height={16}/>)],
      [R.equals('MATLAB'), () => withName(<Matlab width={16} height={16}/>)],
      [R.equals('SAS Studio'), () => withName(<SasStudio width={16} height={16}/>)],
      [R.T, () => withName(<IdeIcon src={wsDefinition.iconUrl}/>, '')]
    ])(wsDefinition.title);
  }

  return (
    <NoWorkspaceImageLabel>
      {wsDefinition.title || ''}
    </NoWorkspaceImageLabel>
  );
};

const noDataLoadingState = (loading: boolean, hasItems: boolean, error?: boolean) => {
  if (error) {
    return <ErrorState>Error getting workspace definitions!</ErrorState>;
  } else if (loading) {
    return <i>Loading available workspaces...</i>;
  } else if (!hasItems) {
    return <span>There are no IDEs found with this environment. Try another environment.</span>;
  }
  return;
};

export const WorkspaceDefinitionSelector = ({
  workspaceDefinitions,
  selectedWorkspaceDefinitionId,
  onChange,
  error,
  disabled = false,
  workspaceDisabledReason,
  ...otherProps
}: EnhancedProps) => {
  const hasItems = (workspaceDefinitions && workspaceDefinitions.length > 0);
  if (!workspaceDefinitions || !hasItems || error) {
    const state = noDataLoadingState(!workspaceDefinitions, hasItems, error);
    return <StyledDefinitionText>{state}</StyledDefinitionText>;
  }

  return (
    <div>
      <ComponentLayout>
        <Radio
          disabled={disabled}
          onChange={onChange}
          value={selectedWorkspaceDefinitionId}
          dataTest={otherProps.testId}
          optionType="button"
          size="large"
          spaceSize="small"
          direction="horizontal"
          disabledReason={workspaceDisabledReason}
          items={workspaceDefinitions.map((wsDef: WorkspaceDefinition) => {
            return {
              key: wsDef.id,
              value: wsDef.id,
              'data-test': wsDef.name,
              disabled: disabled,
              label: <WorkspaceDefinitionLogo wsDefinition={wsDef} disabled={disabled} />
            }
          }
          )}
        />
      </ComponentLayout>
    </div>
  );
};

/**
 * API method to get available workspace definitions for the project
 * @param projectId
 */
const getWorkspaceDefinitions = async (
  projectId: string,
  setError: (error: boolean) => void,
  environmentId?: string,
) => {
  try {
    if (environmentId) {
      const workspaceDefs = await getAvailableToolsForEnvironment({ projectId, environmentId });
      return workspaceDefs.workspaceTools;
    } else {
      return await getAvailableWorkspaceDefinitions({ projectId });
    }
  } catch (err) {
    console.warn(`Could not fetch Workspace Definitions`, err);
    if (err.status !== NETWORK_ERROR_600) {
      toastrError('Could not get workspace definitions information');
    }
    setError(true);
    return undefined;
  }
};

const getAndSetWorkspaceDefinitions = async (props: EnhancedProps) => {
  const {
    projectId,
    environmentId,
    setWorkspaceDefinitions,
    setSelectedWorkspaceDefinitionId,
    onWorkspaceDefinitionSelect = noop,
    setError,
    selectedWorkspaceDefId,
    showDefaultSelection = true,
    setWorkspaceIDEs,
    setWorkspaceIDEsLoading
  } = props;
  if(setWorkspaceIDEsLoading){
    setWorkspaceIDEsLoading(true);
  }
  const workspaceDefinitions = await getWorkspaceDefinitions(projectId, setError, environmentId);
  setWorkspaceDefinitions(workspaceDefinitions);

  if(!R.isNil(setWorkspaceIDEs)){
    setWorkspaceIDEs(workspaceDefinitions);
  }

  const firstWorkspaceDef = !R.isNil(workspaceDefinitions) && !R.isEmpty(workspaceDefinitions) && workspaceDefinitions[0];
  const selectedWorkspace = workspaceDefinitions ?
    R.find(R.propEq('id', selectedWorkspaceDefId))(workspaceDefinitions) : undefined;
  const workspaceToUpdate = !R.isNil(selectedWorkspace) ? selectedWorkspace :
    showDefaultSelection ? firstWorkspaceDef : undefined;

    onWorkspaceDefinitionSelect(workspaceToUpdate);
  if (!R.isNil(workspaceToUpdate)) {
    setSelectedWorkspaceDefinitionId(workspaceToUpdate && workspaceToUpdate.id);
  }
  if(setWorkspaceIDEsLoading){
    setWorkspaceIDEsLoading(false);
  }
};

const WorkspaceDefinitionSelectorContainer = (props: WorkspaceDefinitionWithDataFetchProps) => {
  const { onWorkspaceDefinitionSelect = noop } = props;

  const [workspaceDefinitions, setWorkspaceDefinitions] = useState<WorkspaceDefinition[]>();
  const [selectedWorkspaceDefinitionId, setSelectedWorkspaceDefinitionId] = useState<string |
   undefined>(props.selectedWorkspaceDefId);
  const [environmentName, setEnvironmentName] = useState<string>(props.project && props.project.environmentName || '');
  const [error, setError] = useState<boolean>(false);

  const onChange =  (e: RadioChangeEvent) => {
    if (workspaceDefinitions) {
      const selectedWorkspace = workspaceDefinitions.filter(wsDef => wsDef.id === e.target.value)[0];
      setSelectedWorkspaceDefinitionId(selectedWorkspace && selectedWorkspace.id);
      onWorkspaceDefinitionSelect(selectedWorkspace);
    }
  };
  const getAndSetWorkspaceDefinitionsParams = {
    ...props,
    workspaceDefinitions: workspaceDefinitions || [],
    selectedWorkspaceDefinitionId: selectedWorkspaceDefinitionId,
    environmentName: environmentName,
    error: error,
    setWorkspaceDefinitions: setWorkspaceDefinitions,
    setSelectedWorkspaceDefinitionId: setSelectedWorkspaceDefinitionId,
    setEnvironmentName: setEnvironmentName,
    setError: setError,
    onChange: onChange
  };

  useEffect(() => {
    // Update available workspace tools when environment changes
    if (props.environmentId) {
      getAndSetWorkspaceDefinitions(R.merge(getAndSetWorkspaceDefinitionsParams, props));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.environmentId]);

  useEffect(() => {
    // Update environment name when project changes
    if (props.project && (environmentName !== props.project.environmentName)) {
      setEnvironmentName(props.project.environmentName);
    }
}, [props.project, environmentName]);

  return (
    <WorkspaceDefinitionSelector
      {...props}
      workspaceDefinitions={workspaceDefinitions || []}
      selectedWorkspaceDefinitionId={selectedWorkspaceDefinitionId}
      environmentName={environmentName}
      error={error}
      setWorkspaceDefinitions={setWorkspaceDefinitions}
      setSelectedWorkspaceDefinitionId={setSelectedWorkspaceDefinitionId}
      setEnvironmentName={setEnvironmentName}
      setError={setError}
      onChange={onChange}
    />
  );

};
export default WorkspaceDefinitionSelectorContainer;
