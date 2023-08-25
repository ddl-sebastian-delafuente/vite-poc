import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { StopOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getUseableEnvironments, listHardwareTiersForProject } from '@domino/api/dist/Projects';
import {
  DominoWorkspaceApiWorkspaceClusterConfigDto as OldClusterProperties,
  DominoWorkspaceApiComputeClusterConfigDto as NewClusterProperties,
  Information,
  ComputeClusterType,
  DominoProjectsApiProjectEnvironmentDto as Environment,
  DominoComputeclusterApiDefaultComputeClusterSettings as ClusterSettings,
  DominoProjectsApiUseableProjectEnvironmentsDto as ProjectEnvironments,
} from '@domino/api/dist/types';
import { ComputeClusterLabels } from '@domino/ui/dist/clusters/types';
import WarningBox from '@domino/ui/dist/components/WarningBox';
import HelpLink from '@domino/ui/dist/components/HelpLink';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import WaitSpinner from '../components/WaitSpinner';
import SparkClusterForm from './SparkClusterForm';
import RayClusterForm from './RayClusterForm';
import DaskClusterForm from './DaskClusterForm';
import MpiClusterForm from './MpiClusterForm';
import { greyishBrown, mineShaftColor } from '../styled/colors';
import SparkStarIcon from '../icons/SparkStarIcon';
import RayIcon from '../icons/RayIcon';
import DaskIcon from '../icons/DaskIcon';
import MPIIcon from '../icons/MPIIcon';
import { colors, fontSizes, themeHelper } from '../styled';
import {
  getClusterType,
  getClusterDisabledMessage,
  getClusterPropertiesFromOldDTO,
  isClusterConfigValidPerFF
} from './util';
import StandAloneClusterSetting from './StandAloneClusterSetting';
import NoClusterView from './NoClusterView';
import { MAX_EXECUTIONS_ALLOWED_DEFAULT } from './constants';
import {
  DominoHardwaretierApiHardwareTierWithCapacityDto as HardwareTierWithCapacity
} from '@domino/api/dist/types';
import { ACTIVE_REVISION, EnvRevision } from '../components/utils/envUtils';
import useStore from '@domino/ui/dist/globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';
import { DynamicFieldDisplay, FieldValue, FieldStyle } from '@domino/ui/dist/components/DynamicField';
import { FieldType } from '@domino/ui/dist/components/DynamicField/DynamicField.types';

const noClusterId = 'none';

const ComponentLayout = styled.div`
  margin-top: 0;
  .ant-radio {
    display: none; /* radio selector isn't needed */
  }
  && .ant-row {
    padding: 0;
  }
  .ant-legacy-form-item {
    margin-bottom: 5px;
  }
  .ant-legacy-form-item-label {
    margin-bottom: ${themeHelper('margins.tiny')};
  }
`;
const DynamicFieldDisplayWrapper = styled.div`
  .ant-radio-button-wrapper {
    height: 40px;
    line-height: 38px;
  }
  .ant-form-item-label {
    padding-bottom: 4px;
    line-height: 32px;
  }
`;

const ClusterTitle = styled.span`
  margin-left: ${themeHelper('margins.tiny')};
  line-height: 16px;
  color: ${greyishBrown};
  font-weight: ${themeHelper('fontWeights.thick')}
`;

const ClusterHelp = styled(FlexLayout)`
  margin: ${themeHelper('margins.tiny')} 0 ${themeHelper('margins.small')} 0;
`;

const ClusterHelpText = styled.div`
  font-size: ${themeHelper('fontSizes.tiny')};
  height: 12px;
  line-height: 12px;
  color: ${colors.boulder};
`;

const ClusterHelpLink = styled(HelpLink)`
  font-size: inherit;
  margin-left: 4px;
`;

export type ClusterPropertyKeysUnion = `${keyof NewClusterProperties}` | `${keyof OldClusterProperties}`;


interface ClusterEnvironments {
  Spark: Array<Environment>;
  Ray: Array<Environment>;
  Dask: Array<Environment>;
  MPI: Array<Environment>;
}

const defaultClusterEnvironments: ClusterEnvironments = { Spark: [], Ray: [], Dask: [], MPI: [] };

export const clusterIcon = {
  none: <StopOutlined style={{ color: mineShaftColor }}/>,
  Spark: <SparkStarIcon />,
  Ray: <RayIcon />,
  Dask: <DaskIcon />,
  MPI: <MPIIcon/>
};

const StyledRadioOptionContent = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  font-size: ${themeHelper('fontSizes.small')};
  width: 60px;
`;

export interface ClusterContentProps {
  projectId: string;
  defaultClusterProperties?: OldClusterProperties | NewClusterProperties;
  executionSlots?: number;
  sparkClusterMode?: string;
  projectName: string;
  ownerName: string;
  runHwTierId?: string;
  enableSparkClusters: boolean;
  enableRayClusters: boolean;
  enableDaskClusters: boolean;
  /**
   * Gives the fetch status for `projectEnvironments` prop. Should be sent when `projectEnvironments` is sent.
   */
  areProjectEnvironmentsFetching?: boolean;
  /**
   * `getUseableEnvironments` API response. Should be accompanied with `areProjectEnvironmentsFetching`.
   */
  projectEnvironments?: ProjectEnvironments;
  onChange?: (payload?: NewClusterProperties) => void;
  fetchDefaultClusterSettings: (clusterType: string) => Promise<ClusterSettings>;
  onWorkerCountMaxChange: (maxValue?: number) => void;
  onClusterAutoScaleOptionChange?: (isEnabled: boolean) => void;
  enableEnvironmentRevisions?: boolean;
  isClusterFormValidated?: boolean;
  hideDefaultRevisionOptions?: boolean;
  hideMpirunInfoBox?: boolean;
  updateComputeClusterFieldsLoaded?: (isLoaded?: boolean) => void;
  selectedDataPlaneId?: string;
  setClusterTypeSelected?: (bool: boolean) => void;
  setClusterType?: (value: 'none' | ComputeClusterType) => void;
  isRestrictedProject?: boolean;
}

const ClusterContent = (props: ClusterContentProps) => {
  const { setClusterType } = props;
  const { whiteLabelSettings, principal, formattedPrincipal } = useStore();
  const [supportedClusters, setSupportedClusters] = React.useState<Array<string>>([]);
  const [selectedClusterType, setSelectedClusterType] = React.useState<ComputeClusterType | 'none'>('none');
  const [maximumExecutionSlotsPerUser, setMaximumExecutionSlotsPerUser] =
    React.useState<number | undefined>(props.executionSlots);
  const [clusterProperties, setClusterProperties] = React.useState<NewClusterProperties>();
  const [clusterEnvironments, setClusterEnvironments] =
    React.useState<ClusterEnvironments>(defaultClusterEnvironments);
  const [isLoadingEnvLocally, setIsLoadingEnvLocally] = React.useState<boolean>(true);
  const [areClusterDefaultsFetched, setAreClusterDefaultsFetched] = React.useState<boolean>(false);
  const [clusterDisabledMessageForCluster, setClusterDisabledMessageForCluster] = React.useState<ComputeClusterType>();
  const [defaultMaxWorkerCount, setDefaultMaxWorkerCount] = React.useState<number>();
  const [hardwareTiers, setHardwareTiers] = React.useState<HardwareTierWithCapacity[]>();
  const [canShowClusterForm, setCanShowClusterForm] = React.useState<boolean>(false);
  const enabledOnDemandSparkAutoscaling = !R.isNil(principal) && principal.featureFlags
    .indexOf('ShortLived.SparkAutoscalingEnabled') > -1;
  const enabledRayAutoscaling = !R.isNil(principal) && principal.featureFlags
    .indexOf('ShortLived.RayAutoscalingEnabled') > -1;
  const enabledDaskAutoscaling = !R.isNil(principal) && principal.featureFlags
    .indexOf('ShortLived.DaskAutoscalingEnabled') > -1;
  const enableMpiClusters: boolean = formattedPrincipal?.enableMpiClusters ?? false;

  const fetchSupportedClusters = () => {
    const { Spark, Ray, Dask, MPI } = ComputeClusterLabels;
    const clusters: ComputeClusterType[] = [Spark, Ray, Dask, MPI];
    setSupportedClusters(clusters);
  };

  const filterClusterEnvironments = (clusterEnvsList: Environment[]) => {
    if (!R.isNil(clusterEnvsList)) {
      const clusterEnvs = R.reduce((acc, env) => {
        R.forEach(clusterType => {
          acc[clusterType] = acc[clusterType].concat(env);
        }, env.supportedClusters);
        return acc;
      }, {...defaultClusterEnvironments}, clusterEnvsList);
      setClusterEnvironments(clusterEnvs);
      setIsLoadingEnvLocally(false);
    }
  };

  React.useEffect(() => {
    const { defaultClusterProperties, enableSparkClusters, enableRayClusters, enableDaskClusters, setClusterTypeSelected } = props;
    fetchSupportedClusters();
    fetchHardwareTiers();
    if (!R.isNil(defaultClusterProperties)) {
      if (!R.isNil((defaultClusterProperties as NewClusterProperties).clusterType)) {
        if (isClusterConfigValidPerFF((defaultClusterProperties as NewClusterProperties).clusterType,
          enableSparkClusters, enableRayClusters, enableDaskClusters, enableMpiClusters)) {
          setSelectedClusterType((defaultClusterProperties as NewClusterProperties).clusterType);
          setClusterType && setClusterType((defaultClusterProperties as NewClusterProperties).clusterType);
          setClusterDisabledMessageForCluster(undefined);
        } else {
          setSelectedClusterType(noClusterId);
          setClusterType && setClusterType(noClusterId);
          setClusterDisabledMessageForCluster((defaultClusterProperties as NewClusterProperties).clusterType);
        }
      } else if (!R.isNil(defaultClusterProperties.computeEnvironmentId) &&
        !R.isEmpty(defaultClusterProperties.computeEnvironmentId)) {
        if (isClusterConfigValidPerFF(ComputeClusterLabels.Spark,
          enableSparkClusters, enableRayClusters, enableDaskClusters, enableMpiClusters)) {
          setSelectedClusterType(ComputeClusterLabels.Spark);
          setClusterType && setClusterType(ComputeClusterLabels.Spark)
        } else {
          setSelectedClusterType(noClusterId);
          setClusterType && setClusterType(noClusterId)
          setClusterDisabledMessageForCluster(ComputeClusterLabels.Spark);
        }
      }
      setClusterTypeSelected && setClusterTypeSelected(selectedClusterType === 'none' ? false : true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableMpiClusters, props.enableSparkClusters, props.enableRayClusters, props.enableDaskClusters, props.runHwTierId, props.selectedDataPlaneId]);

  React.useEffect(() => {
    if (!R.isEmpty(supportedClusters) &&
      (props.enableSparkClusters || props.enableRayClusters || props.enableDaskClusters || enableMpiClusters)
    ) {
      if (R.isNil(props.areProjectEnvironmentsFetching)) {
        // fallback fetch if environments are NOT fetching by it's parent component.
        getUseableEnvironments({ projectId: props.projectId })
          .then(response => filterClusterEnvironments(response.environments))
          .catch(err => console.warn(`getUseableEnvironments`, err));
      } else if (!R.isNil(props.projectEnvironments)) {
        filterClusterEnvironments(props.projectEnvironments.environments);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportedClusters, props.areProjectEnvironmentsFetching]);

  const fetchHardwareTiers = async () => {
    const { projectId } = props;
    try {
      const hardwareTiers = await listHardwareTiersForProject({ projectId });
      setHardwareTiers(hardwareTiers);
    } catch (e) {
      console.error(e);
    }
  }

  const fetchDefaultClusterSettings = async () => {
    try {
      const clusterSettings = await props.fetchDefaultClusterSettings(selectedClusterType);

      if (!R.isNil(clusterSettings)) {
        if (R.pathOr(false, ['workerHardwareTierId', 'value'], clusterSettings)) {
          onChange('workerHardwareTierId', { value: clusterSettings.workerHardwareTierId!.value });
        }
        if (R.pathOr(false, ['masterHardwareTierId', 'value'], clusterSettings)) {
            onChange('masterHardwareTierId', { value: clusterSettings.masterHardwareTierId!.value });
        }
        if(clusterSettings.masterHardwareTierId === undefined){
          onChange('masterHardwareTierId', undefined );
        }
        if (!R.isNil(clusterSettings.computeEnvironmentId)) {
          onChange('computeEnvironmentId', clusterSettings.computeEnvironmentId);
        }
        if (!R.isNil(clusterSettings.workerCount)) {
          onChange('workerCount', clusterSettings.workerCount);
        }
        if (!R.isNil(clusterSettings.maxWorkerCount)) {
          onChange('maxWorkerCount', clusterSettings.maxWorkerCount);
          setDefaultMaxWorkerCount(clusterSettings.maxWorkerCount);
        }
        if (!R.isNil(clusterSettings.workerStorage)) {
          onChange('workerStorage', clusterSettings.workerStorage);
        }
        if (!R.isNil(clusterSettings.computeEnvironmentRevisionSpec)) {
          onChange('computeEnvironmentRevisionSpec', clusterSettings.computeEnvironmentRevisionSpec);
        } else {
          onChange('computeEnvironmentRevisionSpec', ACTIVE_REVISION);
        }
        setMaximumExecutionSlotsPerUser(clusterSettings.maxUserExecutionSlots);
      }
      setAreClusterDefaultsFetched(true);
    } catch (err) {
      console.error(err);
      setAreClusterDefaultsFetched(true);
    }
    if (props.updateComputeClusterFieldsLoaded) {
      props.updateComputeClusterFieldsLoaded();
    }
  };

  const fetchAndSetMaximumExecutionSlotsPerUser = async (maxExecutionSlots?: number) => {
    if (!R.isNil(maxExecutionSlots)) {
      setMaximumExecutionSlotsPerUser(maxExecutionSlots);
    } else {
      try {
        const clusterSettings = await props.fetchDefaultClusterSettings(selectedClusterType);
        setMaximumExecutionSlotsPerUser(clusterSettings.maxUserExecutionSlots);
      } catch (e) {
        console.error(e);
        setMaximumExecutionSlotsPerUser(MAX_EXECUTIONS_ALLOWED_DEFAULT);
      }
    }
  };

  const getComputeRevisionSpec = () => {
    if (!R.isNil(clusterProperties) && !R.isNil(clusterProperties.computeEnvironmentRevisionSpec)) {
      return R.cond([
        [R.equals(ACTIVE_REVISION), () => ACTIVE_REVISION],
        [R.T, () => R.pathOr('', ['computeEnvironmentRevisionSpec', 'revisionId'], clusterProperties)]
      ])(clusterProperties.computeEnvironmentRevisionSpec);
    }
    return ACTIVE_REVISION;
  };

  React.useEffect(() => {
    const { defaultClusterProperties, executionSlots } = props;

    if (!R.equals(selectedClusterType, noClusterId)) {
      if (!R.isNil(defaultClusterProperties) && (selectedClusterType === getClusterType(defaultClusterProperties))) {
        fetchAndSetMaximumExecutionSlotsPerUser(executionSlots);
        if (!R.isNil((defaultClusterProperties as NewClusterProperties).clusterType)) {
          setClusterProperties(defaultClusterProperties as NewClusterProperties);
        } else {
          const clusterProps = getClusterPropertiesFromOldDTO(selectedClusterType as ComputeClusterType,
            defaultClusterProperties as OldClusterProperties);
          setClusterProperties(clusterProps);
        }
      } else {
        fetchDefaultClusterSettings();
      }
    } else {
      const { onChange: onFormChange } = props;
      if (!R.isNil(onFormChange)) {
        onFormChange(undefined);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClusterType, props.executionSlots]);

  const onChange = (key: ClusterPropertyKeysUnion, value: any) => {
    const { onChange: onFormChange } = props;
    setClusterProperties(prevClusterProps => {
      const newClusterProperties = {
        ...prevClusterProps,
        [key]: value,
        clusterType: selectedClusterType as ComputeClusterType
      };

      if (!R.isNil(onFormChange)) {
        onFormChange(newClusterProperties as NewClusterProperties);
      }
      return newClusterProperties as NewClusterProperties;
    });
  };

  React.useEffect(() => {
    const showClusterForm = !R.isNil(props.defaultClusterProperties) ?
    !R.isNil(clusterProperties) && !R.isNil(maximumExecutionSlotsPerUser) : areClusterDefaultsFetched;
    setCanShowClusterForm(showClusterForm)
  }, [props.defaultClusterProperties, clusterProperties, maximumExecutionSlotsPerUser, areClusterDefaultsFetched])

  const getWorkerHwtier = () => {
    if (!R.isNil(clusterProperties) && R.pathOr(false, ['workerHardwareTierId', 'value'], clusterProperties)) {
      return clusterProperties.workerHardwareTierId.value;
    }
    return undefined;
  };

  const getMasterHwtier = () => {
    if (!R.isNil(clusterProperties) && R.pathOr(false, ['masterHardwareTierId', 'value'], clusterProperties)) {
      return clusterProperties.masterHardwareTierId?.value;
    }
    return undefined;
  };

  const getComputeEnvironmentId = () => {
    if (
      !R.isNil(clusterProperties) &&
      !R.isNil(clusterProperties.computeEnvironmentId) &&
      R.equals(clusterProperties.clusterType, selectedClusterType)
    ) {
      return clusterProperties.computeEnvironmentId;
    }
    return undefined;
  };

  const getWorkerCount = () => {
    if (!R.isNil(clusterProperties) && !R.isNil(clusterProperties.workerCount)) {
      return clusterProperties.workerCount;
    }
    return undefined;
  };

  const getMaxWorkerCount = () => {
    return !R.isNil(clusterProperties) ? clusterProperties.maxWorkerCount : undefined;
  };

  const getWorkerStorage = () => {
    if (!R.isNil(clusterProperties) && !R.isNil(clusterProperties.workerStorage)) {
      return clusterProperties.workerStorage;
    }
    return undefined;
  };

  const onEnvChange = (envId: string) => {
    onChange('computeEnvironmentId', envId);
    onChange('computeEnvironmentRevisionSpec', 'ActiveRevision');
  };

  const { enableEnvironmentRevisions, hideMpirunInfoBox } = props;

  const handleChange = (field: string, value: FieldValue) => {
    setSelectedClusterType(value as ComputeClusterType);
    setClusterType && setClusterType(value as ComputeClusterType);
    setClusterProperties(undefined);
    setClusterDisabledMessageForCluster(undefined);
    if (props.updateComputeClusterFieldsLoaded) {
      props.updateComputeClusterFieldsLoaded(false);
    }
  };

  return ((!props.enableSparkClusters && !props.enableRayClusters && !props.enableDaskClusters && !enableMpiClusters) ||
    !isLoadingEnvLocally) ? (
    <>
      {
        !R.isNil(clusterDisabledMessageForCluster) &&
        <WarningBox className="clusters-disabled-warningbox">
          {clusterDisabledMessageForCluster} clusters have been disabled by your admin and are no longer available.
          Select another.
        </WarningBox>
      }
      <ComponentLayout>
        <DynamicFieldDisplayWrapper>
          <DynamicFieldDisplay
            data={{ selectedCluster: selectedClusterType}}
            onChange={handleChange}
            editable={true}
            fieldStyle={FieldStyle.FormItem}
            layout={{
              elements: [{
                fieldType: FieldType.radio,
                id: 'computeCluster',
                label: 'Attach Compute Cluster',
                path: 'selectedCluster',
                optionType: 'button',
                options: [{
                  label: '',
                  subLabel: <StyledRadioOptionContent data-test={`${noClusterId}-cluster`}>
                    {clusterIcon[noClusterId]}
                    <ClusterTitle>{noClusterId}</ClusterTitle>
                  </StyledRadioOptionContent>,
                  value: noClusterId,
                  disabled: false
                }, ...(!R.isEmpty(supportedClusters) ?
                R.map((clusterId: string) => {
                  const isClusterConfigValid =
                    isClusterConfigValidPerFF(clusterId, props.enableSparkClusters,
                      props.enableRayClusters, props.enableDaskClusters, enableMpiClusters);
                  return {
                    value: clusterId,
                    disabled: !isClusterConfigValid || R.isEmpty(clusterEnvironments[clusterId]),
                    'data-test': `${clusterId}-cluster`,
                    disabledReason: getClusterDisabledMessage(!isClusterConfigValid, clusterId, getAppName(whiteLabelSettings)),
                    label: '',
                    subLabel: <StyledRadioOptionContent data-test={`${clusterId}-cluster`}>
                      {clusterIcon[clusterId]}
                      <ClusterTitle>{clusterId}</ClusterTitle>
                    </StyledRadioOptionContent>,
                  };
                }, supportedClusters) : [])]
              }]
            }}
            fullWidthInput={false}
            antFormProps={{layout: 'vertical'}}
          />
        </DynamicFieldDisplayWrapper>
        <ClusterHelp justifyContent="flex-start" alignItems="center" itemSpacing={10}>
          <InfoCircleOutlined
            style={{
              fontSize: fontSizes.MEDIUM,
              color: colors.boulder,
              marginRight: 0
            }} />
          <ClusterHelpText>
            To learn more about Compute Clusters check out the docs.
            <ClusterHelpLink text="Read more" showIcon={false} articlePath={'user_guide/8b4418/clusters/'} />
          </ClusterHelpText>
        </ClusterHelp>
      </ComponentLayout>
      {
        R.equals(selectedClusterType, noClusterId) &&
        <NoClusterView />
      }
      {
        R.equals(selectedClusterType, ComputeClusterLabels.Spark) && canShowClusterForm &&
        <>
          {
            (R.isNil(props.sparkClusterMode) ||
            (!R.isNil(props.sparkClusterMode) && props.sparkClusterMode === 'OnDemand')) ?
              <SparkClusterForm
                clusterEnvironments={clusterEnvironments[selectedClusterType]}
                projectId={props.projectId}
                userQuota={maximumExecutionSlotsPerUser}
                workerHardwareTier={getWorkerHwtier()}
                masterHardwareTier={getMasterHwtier()}
                environment={getComputeEnvironmentId()}
                workerCount={getWorkerCount()}
                maxWorkerCount={getMaxWorkerCount()}
                defaultMaxWorkerCount={(props.defaultClusterProperties as NewClusterProperties)?.maxWorkerCount ||
                  defaultMaxWorkerCount}
                workerStorage={getWorkerStorage()}
                onSparkClusterComputeEnvironmentChange={(envId: string) => onEnvChange(envId)}
                onSparkClusterExecutorCountChange={(count?: number) => onChange('workerCount', count)}
                onSparkClusterMaxExecutorCountChange={(count?: number) => onChange('maxWorkerCount', count)}
                onSparkClusterExecutorHardwareTierIdChange={
                  (hardwareTierId: string) => onChange('workerHardwareTierId', { value: hardwareTierId })}
                onSparkClusterExecutorStorageChange={(storage: Information) => onChange('workerStorage', storage)}
                onSparkClusterMasterHardwareTierIdChange={
                  (hardwareTierId: string) => onChange('masterHardwareTierId', { value: hardwareTierId })}
                onClusterAutoScaleOptionChange={props.onClusterAutoScaleOptionChange}
                clusterType={selectedClusterType}
                runHwTierId={props.runHwTierId}
                onWorkerCountMaxChange={props.onWorkerCountMaxChange}
                projectEnvironments={props.projectEnvironments}
                isAutoScalingEnabled={enabledOnDemandSparkAutoscaling}
                hardwareTiersData={hardwareTiers}
                onClusterEnvRevisionChange = {(revision: EnvRevision) => onChange('computeEnvironmentRevisionSpec', revision)}
                computeRevisionSpec={getComputeRevisionSpec()}
                enableEnvironmentRevisions={enableEnvironmentRevisions}
                workerHardwareTierError={props.isClusterFormValidated && !getWorkerHwtier()}
                masterHardwareTierError={props.isClusterFormValidated && !getMasterHwtier()}
                executorsError={props.isClusterFormValidated}
                hideDefaultRevisionOptions={props.hideDefaultRevisionOptions}
                selectedDataPlaneId={props.selectedDataPlaneId}
                isRestrictedProject={props.isRestrictedProject}
              /> :
              <StandAloneClusterSetting
                projectName={props.projectName}
                ownerName={props.ownerName}
                sparkClusterMode={props.sparkClusterMode}
              />
          }
        </>
      }
      {
        R.equals(selectedClusterType, ComputeClusterLabels.Ray) && canShowClusterForm &&
        <RayClusterForm
          clusterEnvironments={clusterEnvironments[selectedClusterType]}
          projectId={props.projectId}
          userQuota={maximumExecutionSlotsPerUser}
          workerHardwareTier={getWorkerHwtier()}
          masterHardwareTier={getMasterHwtier()}
          environment={getComputeEnvironmentId()}
          workerCount={getWorkerCount()}
          maxWorkerCount={getMaxWorkerCount()}
          defaultMaxWorkerCount={(props.defaultClusterProperties as NewClusterProperties)?.maxWorkerCount ||
            defaultMaxWorkerCount}
          workerStorage={getWorkerStorage()}
          onRayClusterWorkerCountChange={(count?: number) => onChange('workerCount', count)}
          onRayClusterMaxWorkerCountChange={(count?: number) => onChange('maxWorkerCount', count)}
          onRayClusterWorkerStorageChange={(storage: Information) => onChange('workerStorage', storage)}
          onRayClusterHeadHardwareTierIdChange={
            (hardwareTierId: string) => onChange('masterHardwareTierId', { value: hardwareTierId })}
          onRayClusterComputeEnvironmentChange={(envId: string) => onEnvChange(envId)}
          onRayClusterWorkerHardwareTierIdChange={
            (hardwareTierId: string) => onChange('workerHardwareTierId', { value: hardwareTierId })}
          clusterType={selectedClusterType}
          onClusterAutoScaleOptionChange={props.onClusterAutoScaleOptionChange}
          runHwTierId={props.runHwTierId}
          onWorkerCountMaxChange={props.onWorkerCountMaxChange}
          projectEnvironments={props.projectEnvironments}
          isAutoScalingEnabled={enabledRayAutoscaling}
          hardwareTiersData={hardwareTiers}
          onClusterEnvRevisionChange = {(revision: EnvRevision) => onChange('computeEnvironmentRevisionSpec', revision)}
          computeRevisionSpec={getComputeRevisionSpec()}
          enableEnvironmentRevisions={enableEnvironmentRevisions}
          workerHardwareTierError={props.isClusterFormValidated && !getWorkerHwtier()}
          masterHardwareTierError={props.isClusterFormValidated && !getMasterHwtier()}
          hideDefaultRevisionOptions={props.hideDefaultRevisionOptions}
          executorsError={props.isClusterFormValidated}
          selectedDataPlaneId={props.selectedDataPlaneId}
          isRestrictedProject={props.isRestrictedProject}
        />
      }
      {
        R.equals(selectedClusterType, ComputeClusterLabels.Dask) && canShowClusterForm &&
        <DaskClusterForm
          clusterEnvironments={clusterEnvironments[selectedClusterType]}
          projectId={props.projectId}
          userQuota={maximumExecutionSlotsPerUser}
          workerHardwareTier={getWorkerHwtier()}
          masterHardwareTier={getMasterHwtier()}
          environment={getComputeEnvironmentId()}
          workerCount={getWorkerCount()}
          maxWorkerCount={getMaxWorkerCount()}
          defaultMaxWorkerCount={(props.defaultClusterProperties as NewClusterProperties)?.maxWorkerCount ||
            defaultMaxWorkerCount}
          workerStorage={getWorkerStorage()}
          onDaskClusterWorkerCountChange={(count?: number) => onChange('workerCount', count)}
          onDaskClusterMaxWorkerCountChange={(count?: number) => onChange('maxWorkerCount', count)}
          onDaskClusterWorkerStorageChange={(storage: Information) => onChange('workerStorage', storage)}
          onDaskClusterHeadHardwareTierIdChange={
            (hardwareTierId: string) => onChange('masterHardwareTierId', { value: hardwareTierId })}
          onDaskClusterComputeEnvironmentChange={(envId: string) => onEnvChange(envId)}
          onDaskClusterWorkerHardwareTierIdChange={
            (hardwareTierId: string) => onChange('workerHardwareTierId', { value: hardwareTierId })}
          clusterType={selectedClusterType}
          onClusterAutoScaleOptionChange={props.onClusterAutoScaleOptionChange}
          runHwTierId={props.runHwTierId}
          onWorkerCountMaxChange={props.onWorkerCountMaxChange}
          projectEnvironments={props.projectEnvironments}
          isAutoScalingEnabled={enabledDaskAutoscaling}
          hardwareTiersData={hardwareTiers}
          onClusterEnvRevisionChange = {(revision: EnvRevision) => onChange('computeEnvironmentRevisionSpec', revision)}
          computeRevisionSpec={getComputeRevisionSpec()}
          enableEnvironmentRevisions={enableEnvironmentRevisions}
          workerHardwareTierError={props.isClusterFormValidated && !getWorkerHwtier()}
          masterHardwareTierError={props.isClusterFormValidated && !getMasterHwtier()}
          hideDefaultRevisionOptions={props.hideDefaultRevisionOptions}
          executorsError={props.isClusterFormValidated}
          selectedDataPlaneId={props.selectedDataPlaneId}
          isRestrictedProject={props.isRestrictedProject}
        />
      }
      {
        R.equals(selectedClusterType, ComputeClusterLabels.MPI) && canShowClusterForm &&
        <MpiClusterForm
          clusterEnvironments={clusterEnvironments[selectedClusterType]}
          projectId={props.projectId}
          userQuota={maximumExecutionSlotsPerUser}
          workerHardwareTier={getWorkerHwtier()}
          environment={getComputeEnvironmentId()}
          workerCount={getWorkerCount()}
          workerStorage={getWorkerStorage()}
          onMpiClusterWorkerCountChange={(count?: number) => onChange('workerCount', count)}
          onMpiClusterWorkerStorageChange={(storage: Information) => onChange('workerStorage', storage)}
          onMpiClusterComputeEnvironmentChange={(envId: string) => onEnvChange(envId)}
          onMpiClusterWorkerHardwareTierIdChange={
            (hardwareTierId: string) => onChange('workerHardwareTierId', { value: hardwareTierId })}
          clusterType={selectedClusterType}
          runHwTierId={props.runHwTierId}
          onWorkerCountMaxChange={props.onWorkerCountMaxChange}
          projectEnvironments={props.projectEnvironments}
          hardwareTiersData={hardwareTiers}
          onClusterEnvRevisionChange = {(revision: EnvRevision) => onChange('computeEnvironmentRevisionSpec', revision)}
          computeRevisionSpec={getComputeRevisionSpec()}
          enableEnvironmentRevisions={enableEnvironmentRevisions}
          workerHardwareTierError={props.isClusterFormValidated && !getWorkerHwtier()}
          hideDefaultRevisionOptions={props.hideDefaultRevisionOptions}
          hideMpirunInfoBox={hideMpirunInfoBox}
          selectedDataPlaneId={props.selectedDataPlaneId}
          isRestrictedProject={props.isRestrictedProject}
        />
      }
    </>
  ) : <WaitSpinner />;
};

export default ClusterContent;
