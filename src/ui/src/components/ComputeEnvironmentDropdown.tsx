/* eslint-disable no-unexpected-multiline */
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Provider } from 'react-redux';
import * as R from 'ramda';
import {
  getUseableEnvironmentDetails,
  getUseableEnvironments,
  updateProjectSettings,
} from '@domino/api/dist/Projects';
import { getEnvironmentById } from '@domino/api/dist/Environments';
import {
  DominoEnvironmentsApiEnvironmentDetails as EnvironmentDetails,
  DominoProjectsApiEnvironmentDetails,
  DominoProjectsApiProjectEnvironmentDto as ComputeEnvironment,
  DominoProjectsApiProjectEnvironmentDto as Environments,
  DominoProjectsApiUseableProjectEnvironmentsDto as Environment,
  DominoServerProjectsApiProjectGatewayOverview as Project,
} from '@domino/api/dist/types';
import store from '../core/configureStore';
import * as toastr from '../components/toastr';
import FlagManagerProvider, { FlagManagerProviderProps } from '../core/FlagManagerProvider';
import EnvironmentSelector, { ConsolidatedCustomEnvironmentType } from '../components/ComputeEnvironmentSelector';
import { RouterType } from '../utils';

export const unsuitableEnvErr = `This Environment supports clusters and is not suitable as the execution's main Environment.
Please select a different Environment.`;

/**
 * Curry to do lookups in the computedata by id
 * @param computeData
 */
export const findEnvInComputeData = <T extends Array<Partial<{ id: string }>>>(computeData: T) =>
  (selectedId: string) => computeData ? computeData.find(e => e.id === selectedId) : undefined;

const getEnvironmentRevisionDetails = async (projectId: string, environmentId: string) => {
  return await getUseableEnvironmentDetails({
    projectId,
    environmentId
  });
};

/**
 * API method to get environments from a project
 * @param projectId
 */
export const getEnvironments = async (
  projectId: string,
  setError: (error: boolean) => void,
  clusterType?: string,
  clusterEnvironments?: Array<ComputeEnvironment>,
  projectEnvironments?: Environment
) => {
  if (!R.isNil(clusterType) && !R.isNil(clusterEnvironments) && !R.isEmpty(clusterEnvironments)) {
    return {
      currentlySelectedEnvironment: clusterEnvironments[0],
      environments: clusterEnvironments
    };
  }

  try {
    const environments = projectEnvironments || await getUseableEnvironments({ projectId });

    if (!R.isNil(clusterType)) {
      return {
        currentlySelectedEnvironment: environments.currentlySelectedEnvironment,
        environments: []
      };
    }

    const genericEnvironments = R.filter((env: Environments) => R.isEmpty(env.supportedClusters),
      environments.environments);

    return {
      currentlySelectedEnvironment: environments.currentlySelectedEnvironment,
      environments: genericEnvironments
    };
  } catch (err) {
    console.warn(`getUseableEnvironments`, err);
    setError(true);
    return undefined;
  }
};

/**
 * API method to update the project settings
 * @param projectId
 * @param defaultEnvironmentId
 */
const updateSettings = async (projectId: string, defaultEnvironmentId: string) => {
  try {
    await updateProjectSettings({ projectId, body: { defaultEnvironmentId } });
    toastr.success('Environment updated for project');
  } catch (err) {
    console.warn('updateDefaultEnvironmentSettings', err);
    toastr.error('Could not set environment');
  }
};

export interface ComputeEnvironmentDropdownProps extends RouteComponentProps {
  isControlled?: boolean;
  environmentId?: string;
  projectId: string;
  clusterType?: string;
  updateProjectEnvironmentOnSelect: boolean;
  canEditEnvironments?: boolean;
  canSelectEnvironment?: boolean;
  onChangeEnvironment?: (env: ComputeEnvironment, options?: any) => void;
  project?: Project;
  testId?: string;
  shouldEnvironmentBeInSyncWithProject?: boolean;
  clusterEnvironments?: Array<ComputeEnvironment>;
  projectEnvironments?: Environment;
  areProjectEnvironmentsFetching?: boolean;
  forProjectSettings?: boolean;
  getContainer?: () => HTMLElement;
  onFetchEnvironments?: (environments: Array<ComputeEnvironment>) => void;
  handleEnvChange?: (revision: string) => void;
  isRestrictedProject?: boolean;
}

// this one is used in legacy code, so no need of withFlagManagerProvider
export const ComputeEnvironmentDropdown = (props: ComputeEnvironmentDropdownProps) => {
  const {
    environmentId,
    projectId,
    isControlled,
    clusterType,
    clusterEnvironments,
    onFetchEnvironments,
    onChangeEnvironment,
    shouldEnvironmentBeInSyncWithProject,
    project,
    projectEnvironments,
    areProjectEnvironmentsFetching,
    updateProjectEnvironmentOnSelect,
    canSelectEnvironment,
    canEditEnvironments,
    forProjectSettings,
    handleEnvChange,
    isRestrictedProject
  } = props;

  const [environment, setEnvironment] = React.useState<Environment>();
  const [error, setError] = React.useState<boolean>(false);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = React.useState<string>();
  const [environmentDetails, setEnvironmentDetails] = React.useState<DominoProjectsApiEnvironmentDetails>();

  const fetchEnvironment = async (environmentId: string) => {
    try {
      const response = await getEnvironmentById({ environmentId });
      return { ...response, version: response.latestRevision?.number || 1 };
    } catch (err) {
      console.error(err);
    }
    return undefined;
  };

  const updateDefaultEnvironmentSettings = React.useCallback(
    async ({ id: defaultEnvironmentId }: ComputeEnvironment) => {
      await updateSettings(projectId, defaultEnvironmentId);
      const env = await getEnvironments(projectId, setError, clusterType, clusterEnvironments, projectEnvironments);
      if (!R.isNil(env) && !R.isNil(onFetchEnvironments)) {
        onFetchEnvironments(env.environments);
      }
      setEnvironment(env);
    }, [clusterType, clusterEnvironments, projectId, projectEnvironments, onFetchEnvironments]);

  const setEnvironments = React.useCallback(async () => {
    const env = await getEnvironments(projectId, setError, clusterType, clusterEnvironments, projectEnvironments);
    if (!R.isNil(env) && !R.isNil(onFetchEnvironments)) {
      onFetchEnvironments(env.environments);
    }

    const envFromProps = !R.isNil(env) ?
      env.environments.find(item => item.id === environmentId) : undefined;

    if (isControlled && environmentId) {
      // This variable is required to udpate the fetched environment with parent
      // after `getEnvironmentRevisionDetails` is fetched & when `isControlled` is true
      let envFetched: EnvironmentDetails & { version: number } | undefined = undefined;
      if (R.isNil(envFromProps) && env) {
        envFetched = await fetchEnvironment(environmentId);
        if (envFetched) {
          env.environments.push(envFetched);
        }
      } else if (onChangeEnvironment && envFromProps) {
        onChangeEnvironment(envFromProps);
      }
      try {
        setSelectedEnvironmentId!(environmentId);
        setEnvironmentDetails!(await getEnvironmentRevisionDetails(projectId, environmentId));
      } catch (error) {
        console.error(error);
      }
      // Updates the selected environment object with parent on component load though `isControlled` is set to true
      if (onChangeEnvironment && !R.isNil(envFetched)) {
        onChangeEnvironment(envFetched);
      }
    } else {
      if (env) {
        const selectedEnvId = env.currentlySelectedEnvironment?.id;
        const doesEnvironmentExistInEnvironments = env.environments.find(ev => ev.id === selectedEnvId);
        if (!R.isEmpty(env.currentlySelectedEnvironment?.supportedClusters) && !doesEnvironmentExistInEnvironments && selectedEnvId) {
          const response = await fetchEnvironment(selectedEnvId);
          if (response) {
            env.environments.push(response);
          }
        }
        setSelectedEnvironmentId!(selectedEnvId);
        if (onChangeEnvironment) {
          const defaultSelectedEnvironment = env.environments.find((computeEnv: ComputeEnvironment) =>
            computeEnv.id === selectedEnvId
          );
          if (defaultSelectedEnvironment) {
            onChangeEnvironment(defaultSelectedEnvironment);
          }
        }
      }
    }
    setEnvironment(env);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterType, clusterEnvironments, environmentId, projectEnvironments, isControlled, projectId]);

  React.useEffect(() => {
    if (!areProjectEnvironmentsFetching) {
      setEnvironments();
    }
  }, [areProjectEnvironmentsFetching, setEnvironments]);

  React.useEffect(() => {
    (async () => {
      if (isControlled) {
        // TODO this component is very disorganized and hard to add to DOM-19546
        // once this component is refactored, please remove the isControlled prop
        if (environmentId) {
          try {
            setSelectedEnvironmentId!(environmentId);
            setEnvironmentDetails!(await getEnvironmentRevisionDetails(projectId, environmentId));
          } catch (error) {
            console.error(error);
          }
        }
      }
    })();
  }, [environmentId, isControlled, projectId]);

  React.useEffect(() => {
    (async () => {
      const selectedEnvId = environment?.currentlySelectedEnvironment?.id;
      if (!isControlled && environment && selectedEnvId) {
        setEnvironmentDetails!(await getEnvironmentRevisionDetails(projectId, selectedEnvId));
      }
    })();
  }, [environment, isControlled, projectId]);

  React.useEffect(() => {
    if (!isControlled) {
      if (shouldEnvironmentBeInSyncWithProject && project && environment) {
        const env = findEnvInComputeData(environment.environments)
        if (env && env.name !== project.environmentName) {
          setEnvironments();
        }
      }
    }
  }, [environment, shouldEnvironmentBeInSyncWithProject, isControlled, project, setEnvironments]);

  const changeEnvironmentHandler = (reduxProject?: Project, updateProject?: (p: Project) => void) =>
    async (env?: ConsolidatedCustomEnvironmentType, options?: any) => {
      if (!R.isNil(env)) {
        if (!R.isNil(onChangeEnvironment)) {
          onChangeEnvironment(env as ComputeEnvironment, options);
        }
        if (!R.isNil(environment)) {
          const finalProjectId = (!updateProjectEnvironmentOnSelect ? project?.id : reduxProject?.id) ?? undefined;
          const { currentlySelectedEnvironment } = environment;
          if (!R.isNil(finalProjectId) && updateProjectEnvironmentOnSelect) {
            setEnvironmentDetails(await getEnvironmentRevisionDetails(finalProjectId, env.id));

            // update the environment setting for the project
            if (!R.isNil(reduxProject) && !R.isNil(updateProject) && env.id !== currentlySelectedEnvironment?.id) {
              updateDefaultEnvironmentSettings(env as ComputeEnvironment);
              updateProject({ ...reduxProject, environmentName: env.name });
            } else {
              console.error('Could not select an environment because no project was loaded');
            }
          }
        }
      }
    };

  return (
    <React.Fragment>
      <Provider store={store}>
        <FlagManagerProvider {...props}>
          {(coreState: FlagManagerProviderProps) => {
            const reduxProject = coreState.project;
            const updateProject = coreState.setProjectAction;
            let selectedEnvironment: string | undefined = undefined;
            if (!R.isNil(environment)) {
              const env = reduxProject && updateProjectEnvironmentOnSelect && (
                (R.find(R.propEq('name', reduxProject.environmentName))(environment.environments))
              ) as ComputeEnvironment | undefined;
              selectedEnvironment = env ? env.id : selectedEnvironmentId;
            }
            return (
              <EnvironmentSelector
                error={error}
                projectEnvironments={environment}
                selectedEnvironmentId={selectedEnvironment}
                setSelectedEnvironmentId={setSelectedEnvironmentId}
                environment={!R.isNil(environment) && selectedEnvironment ? (
                  findEnvInComputeData(environment.environments as Partial<{ id: string; }>[])
                    (selectedEnvironment) as ConsolidatedCustomEnvironmentType
                ) : undefined}
                environmentDetails={environmentDetails}
                onChangeEnvironment={changeEnvironmentHandler(reduxProject, updateProject)}
                canSelectEnvironment={canSelectEnvironment}
                canEditEnvironments={canEditEnvironments}
                testId="compute-environment-dropdown"
                forProjectSettings={forProjectSettings}
                projectId={projectId}
                handleEnvChange={handleEnvChange}
                isRestrictedProject={isRestrictedProject}
              />
            );
          }}
        </FlagManagerProvider>
      </Provider>
    </React.Fragment>
  );
};

export const ComputeEnvironmentDropdownWithRouter:
  RouterType<ComputeEnvironmentDropdownProps, React.ComponentType<ComputeEnvironmentDropdownProps>>
  = withRouter(ComputeEnvironmentDropdown);
export default ComputeEnvironmentDropdownWithRouter;
