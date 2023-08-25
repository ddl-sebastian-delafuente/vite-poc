import * as React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { filter, find, isEmpty, length, map, not, propEq, isNil } from 'ramda';
import { CaretDownOutlined } from '@ant-design/icons';
// eslint-disable-next-line no-restricted-imports
import { Dropdown, Menu } from 'antd';
import Button from '@domino/ui/dist/components/Button/Button';
import NotMonitoredState from '@domino/ui/dist/components/NotMonitoredState';
import MonitoringEmptyStateIcon from '@domino/ui/dist/icons/MonitoringEmptyStateIcon';
import Select from '@domino/ui/dist/components/Select/Select';
import {
  JobDashboardFilterStatusEnum,
  JobHistoryResponseJobTypeEnum,
  JobPaginationOrderEnum,
  JobPaginationSortEnum,
  ModelModelTypeEnum,
  ModelResponse,
  ModelResponseModelTypeEnum
} from '@domino/api/dist/dmm-api-client';
import { error as ToastError } from '@domino/ui/dist/components/toastr';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import TestsAndThresholds from './TestsAndThresholds';
import ScheduleChecks from './ScheduleChecks';
import AddData from './AddData';
import {
  DriftAndQualityContainer,
  MonitoringActionsContainer,
  MonitoringWrapper,
  StyledLink,
  ExternalLinkIcon
} from './atoms';
import { getLastNDaysEpochTime, getCronNextSchedule } from '../utils/common';
import { modelApi, datasetApi } from '../dmmApis';
import AlertRecipients from './AlertRecipients';
import { DMM_LINK as basePath } from '../dmmConfiguration';
import { fetchModelSummary, MonitoringTabBadgeHydrator } from './ModelListingTableHydrator';
import { Domino30ThemeProvider } from '../styled';
import { AlertType, EmptyStateTypes } from './constants';
import { trackMonitoringTabVisits } from './MonitoringMixpanelTracking';
import HelpLink from '../components/HelpLink';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';
import axios from 'axios';

// types
export interface ModelVersionDetailWithExportStatus {
  id: string;
  summary: string;
  createdBy: string;
  number: number;
  projectId: string;
  modelVersionStatus?: string;
  exportStatus?: string;
}

interface ModelMonitoringProps {
  modelName: string;
  modelVersionsDetail: Array<ModelVersionDetailWithExportStatus>;
  modelId: string;
  activeModelVersionId: string | null;
  isExport?: boolean;
}

interface ConfigureMonitoringDropdownProps {
  setActiveMenu: (key: string) => void;
  isPredictionDataAdded: boolean;
}

interface VersionsDropdownProps {
  setModelVersion: (key: ModelVersionDetailWithExportStatus) => void;
  selectedVersion: ModelVersionDetailWithExportStatus;
  modelVersionsDetail: Array<ModelVersionDetailWithExportStatus>;
}

export interface MonitoringDriftAndQualityProps {
  monitoredModelId: string | undefined | null;
  isLoading: boolean;
  hasDriftOrQualityCheck: boolean;
  setIsIframeLoading: (iframeLoading: boolean) => void;
  scheduleCheckPaused: boolean | undefined;
  cronExpression: string;
  timezone: string;
  isExport: boolean;
}

const EmptyStateDescriptions = {
  [EmptyStateTypes.NOT_MONITORED]: () => (
    <p>
      Monitoring alerts you when your model shows signs of degraded performance. <br />
      To learn how to set up monitoring, click the button below{' '}
    </p>
  ),
  [EmptyStateTypes.FINISH_CONFIGURING_MONITORING]: (modelId: string, appName: string) => (
    <p>
      To finish configuring monitoring, <StyledLink
        type="icon-link-end"
        icon={<ExternalLinkIcon height={14} width={14} />}
        onClick={() =>
          window.open(`${window.location.origin}/model-monitor/data-drift/${modelId}?activeTab=analyze`)
        }>
        open this model
      </StyledLink> in {appName} Model Monitor <br />
      and configure both prediction data and a schedule for monitoring checks.
    </p>
  ),
  [EmptyStateTypes.WAITING_FOR_SCHEDULE_CHECK_RESULTS]: (numberOfHoursForScheduleCheck = 'NA') => (
    <p>Your first Monitoring check will run on {numberOfHoursForScheduleCheck}.</p>
  ),
  [EmptyStateTypes.WAITING_FOR_DATA_INGESTION]: (appName: string) => (
    <p>
      Monitoring appears to be configured, but {appName} is waiting for prediction data. <br />
      To learn how to set up monitoring, click the button below{' '}
    </p>
  )
};

// API calls

export const getScheduleCheckData = async (dmmModelId: string) => {
  try {
    /**
     * This is a temporary workaround, till the DMM scheduler service
     *  is refactored properly, allowing us to have a typescript client.
     */
    const { data } = await axios.get(`${basePath}/api/scheduler/${dmmModelId}/get_drift_schedule_check`, {
      withCredentials: true
    });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status == 404) {
      return null;
    }
    else {
      ToastError('Something went wrong.');
      return false;
    }
  }
};

export const doesPredictionDataExist = async (modelId: string) => {
  const { endDate } = getLastNDaysEpochTime(7);

  const filters = {
    status: Object.values(JobDashboardFilterStatusEnum),
    job_type: [JobHistoryResponseJobTypeEnum.Prediction]
  };

  const jobHistoryRequest = {
    start: 0,
    end: endDate,
    search: '',
    pagination: {
      order: JobPaginationOrderEnum.NUMBER_1,
      sort: JobPaginationSortEnum.CreatedAt,
      page: 1,
      size: 5
    },
    filters: filters
  };
  try {
    const {
      data: { jobs }
    } = await datasetApi.getDatasetJobs(modelId, jobHistoryRequest);
    return not(isEmpty(jobs));
  } catch (e) {
    return false;
  }
};

export const getMonitoredModel = async (modelId: string, modelVersionId: string): Promise<ModelResponse | null> => {
  try {
    const response = await modelApi.getModelById(undefined, modelVersionId);
    const { data } = response;
    return data;
  } catch (err) {
    switch (err.response.status) {
      case 404:
        return null;
      default:
        ToastError('Something went wrong.');
        return null;
    }
  }
};

export const doesDriftOrQualityCheckExist = async (modelVersionId: string) => {
  try {
    const modelSummaries = await fetchModelSummary([modelVersionId]);
    if (modelSummaries && modelSummaries.length > 0) {
      const [modelSummary] = modelSummaries;
      const { driftedVariablesCount, failedMetricsCount } = modelSummary;
      return not(isNil(driftedVariablesCount) && isNil(failedMetricsCount));
    }
    return false;
  } catch (e) {
    return false;
  }
};

// constants
export const configureMonitoringOptions = {
  data: 'Data',
  testsAndThresholds: 'Target Ranges',
  notification: 'Alert Recipients',
  schedule: 'Schedule'
};

// helpers
export const getDefaultModelVersion = (
  modelVersionsDetail: Array<ModelVersionDetailWithExportStatus>,
  activeModelVersionId: string | null
): ModelVersionDetailWithExportStatus | undefined => {
  const mayBeDefaultSelectedModelVersion = find(({ id }) => id === activeModelVersionId, modelVersionsDetail);
  const [defaultModelVersion] = mayBeDefaultSelectedModelVersion
    ? [mayBeDefaultSelectedModelVersion]
    : modelVersionsDetail;

  return defaultModelVersion;
};

export const getConfigureMonitoringOptions = (isPredictionDataAdded: boolean) => [
  {
    label: configureMonitoringOptions.data,
    disabled: false
  },
  {
    label: configureMonitoringOptions.testsAndThresholds,
    disabled: !isPredictionDataAdded
  },
  {
    label: configureMonitoringOptions.notification,
    disabled: !isPredictionDataAdded
  },
  {
    label: configureMonitoringOptions.schedule,
    disabled: !isPredictionDataAdded
  }
];

// state and effect
export const configureDataAndVersionEffectHook = (
  modelId: string,
  selectedVersionId: string,
  setMonitoredModelId: (id: string | undefined | null) => void,
  setIsPredictionDataAdded: (isAdded: boolean) => void,
  setModelType: (modelType: ModelResponseModelTypeEnum | undefined) => void,
  setLoading: (isLoading: boolean) => void,
  setHasDriftOrQualityCheck: (hasCheck: boolean) => void,
  setIsIframeLoading: (iframeLoading: boolean) => void,
  setScheduleCheckPaused: (isPaused: boolean | undefined) => void,
  setScheduleCheckCronExpression: (cronExpression: string) => void,
  setScheduleCheckTimezone: (scheduleCheckTimezone: string) => void
) =>
  (async function () {
    const model = await getMonitoredModel(modelId, selectedVersionId);
    if (model) {
      const { id: dmmModelId, modelType } = model;
      setModelType(modelType);
      setMonitoredModelId(dmmModelId);
      const isPredictionDataPresent = await doesPredictionDataExist(dmmModelId);
      setIsPredictionDataAdded(isPredictionDataPresent);
      const hasDriftOrQualityCheck = await doesDriftOrQualityCheckExist(selectedVersionId);
      setHasDriftOrQualityCheck(hasDriftOrQualityCheck);
      const scheduleCheckData = await getScheduleCheckData(dmmModelId);
      setScheduleCheckPaused(scheduleCheckData && scheduleCheckData.isPaused);
      setScheduleCheckCronExpression(scheduleCheckData ? scheduleCheckData.cronExpression : 'NA');
      setScheduleCheckTimezone(scheduleCheckData ? scheduleCheckData.timezone : 'NA');
      setLoading(false);
      if (not(hasDriftOrQualityCheck)) {
        setIsIframeLoading(false);
      }
      return;
    }
    setMonitoredModelId(undefined);
    setModelType(undefined);
    setIsPredictionDataAdded(false);
    setLoading(false);
    setHasDriftOrQualityCheck(false);
    setIsIframeLoading(false);
    setScheduleCheckPaused(false);
    setScheduleCheckCronExpression('NA');
    setScheduleCheckTimezone('NA');
  })();

export const getBadgeUpdateDependencies = (selectedVersionId: string | undefined) => [selectedVersionId];

export const getConfigureDataDependencies = (
  selectedVersionId: string | undefined,
  activeConfigureMonitoringOption: string
) => [selectedVersionId, activeConfigureMonitoringOption];

export const useMonitoring = (
  modelVersionsDetail: Array<ModelVersionDetailWithExportStatus>,
  activeModelVersionId: string | null,
  modelId: string
) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [hasDriftOrQualityCheck, setHasDriftOrQualityCheck] = useState<boolean>(false);
  const [activeConfigureMonitoringOption, setActiveConfigureMonitoringOption] = useState<string>('');
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const defaultModelVersion = getDefaultModelVersion(modelVersionsDetail, activeModelVersionId);
  const [selectedVersion, setSelectedVersion] = useState<ModelVersionDetailWithExportStatus | undefined>(defaultModelVersion);
  const [monitoredModelId, setMonitoredModelId] = useState<string | undefined | null>(undefined);
  const [isPredictionDataAdded, setIsPredictionDataAdded] = useState<boolean>(false);
  const [modelType, setModelType] = useState<ModelResponseModelTypeEnum | undefined>(undefined);
  const [scheduleCheckPaused, setScheduleCheckPaused] = useState<boolean>();
  const [scheduleCheckCronExpression, setScheduleCheckCronExpression] = useState<string>('NA');
  const [scheduleCheckTimezone, setScheduleCheckTimezone] = useState<string>('NA');
  const { id: selectedVersionId } = selectedVersion || {};

  useEffect(() => {
    (() => trackMonitoringTabVisits(modelId))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    !!modelId && !!selectedVersionId &&
      createRoot(document.getElementById(AlertType.DriftAndQuality) as HTMLElement).render(
        <Domino30ThemeProvider>
          <MonitoringTabBadgeHydrator modelVersionId={selectedVersionId} />
        </Domino30ThemeProvider>
      );
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getBadgeUpdateDependencies(selectedVersionId));

  useEffect(() => {
    (() =>
      !!selectedVersionId &&
      configureDataAndVersionEffectHook(
        modelId,
        selectedVersionId,
        setMonitoredModelId,
        setIsPredictionDataAdded,
        setModelType,
        setLoading,
        setHasDriftOrQualityCheck,
        setIsIframeLoading,
        setScheduleCheckPaused,
        setScheduleCheckCronExpression,
        setScheduleCheckTimezone
      ))();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getConfigureDataDependencies(selectedVersionId, activeConfigureMonitoringOption));

  return {
    isLoading,
    hasDriftOrQualityCheck,
    activeConfigureMonitoringOption,
    setActiveConfigureMonitoringOption,
    isIframeLoading,
    setIsIframeLoading,
    selectedVersion,
    setSelectedVersion,
    monitoredModelId,
    setMonitoredModelId,
    isPredictionDataAdded,
    setIsPredictionDataAdded,
    modelType,
    setModelType,
    scheduleCheckPaused,
    setScheduleCheckPaused,
    scheduleCheckCronExpression,
    setScheduleCheckCronExpression,
    scheduleCheckTimezone,
    setScheduleCheckTimezone
  };
};

// components and event handlers

export const handleConfigureDataChange = (key: string, setActiveMenu: (key: string) => void) => {
  setActiveMenu(key);
};

export const ConfigureMonitoringDropdown = ({
  setActiveMenu,
  isPredictionDataAdded
}: ConfigureMonitoringDropdownProps) => {
  const configureMonitoringOverlay = (
    <Menu
      onClick={(e) => handleConfigureDataChange(e.key, setActiveMenu)}
      items={map(
        ({ label, disabled }) => ({
          disabled: disabled,
          key: label,
          label: label
        }),
        getConfigureMonitoringOptions(isPredictionDataAdded)
      )}
    />
  );
  return (
    <Dropdown overlay={configureMonitoringOverlay} trigger={['click']} placement="bottomRight">
      <Button btnType="secondary" testId="configure-monitoring-dropdown-button">
        Configure monitoring <CaretDownOutlined />
      </Button>
    </Dropdown>
  );
};

export const handleVersionChange = (
  version: string,
  modelVersionsDetail: Array<ModelVersionDetailWithExportStatus>,
  setModelVersion: (version: ModelVersionDetailWithExportStatus) => void
) => {
  const selectedVersionData = find(propEq('id', version), modelVersionsDetail);
  setModelVersion(selectedVersionData);
};

export const VersionsDropdown = ({
  setModelVersion,
  selectedVersion,
  modelVersionsDetail
}: VersionsDropdownProps) => {
  const { id: selectedVersionId } = selectedVersion;
  const options = map(({ id, number }) => ({ label: `Version ${number}`, value: id }), modelVersionsDetail);
  return (
    <FlexLayout data-test="versions-dropdown">
      <span>Show monitoring for:</span>
      <Select
        value={selectedVersionId}
        onChange={(version) => handleVersionChange(version as string, modelVersionsDetail, setModelVersion)}
        options={options}
        data-test="versions-dropdown-select"
      />
    </FlexLayout>
  );
};

export const MonitoringDriftAndQuality = ({
  monitoredModelId,
  isLoading,
  hasDriftOrQualityCheck,
  setIsIframeLoading,
  scheduleCheckPaused,
  cronExpression,
  timezone,
  isExport
}: MonitoringDriftAndQualityProps) => {
  const { whiteLabelSettings } = useStore();
  const appName = getAppName(whiteLabelSettings);
  if (isLoading) return <React.Fragment />;

  if (isNil(monitoredModelId) || not(hasDriftOrQualityCheck) || scheduleCheckPaused) {
    const isMonitoringDisabled = isNil(monitoredModelId) || scheduleCheckPaused;
    const isWaitingForScheduleCheck =
      not(isNil(scheduleCheckPaused)) && not(scheduleCheckPaused) && not(hasDriftOrQualityCheck);
    const emptyStateType = isMonitoringDisabled
      ? EmptyStateTypes.NOT_MONITORED
      : isWaitingForScheduleCheck
        ? EmptyStateTypes.WAITING_FOR_SCHEDULE_CHECK_RESULTS
        : isExport
          ? EmptyStateTypes.FINISH_CONFIGURING_MONITORING
          : EmptyStateTypes.WAITING_FOR_DATA_INGESTION;
    const nextScheduleCheckTime = isWaitingForScheduleCheck
      ? getCronNextSchedule(cronExpression, timezone, "MMMM Do, HH:mm:ss z", timezone)
      : 'NA';
    const description =
      emptyStateType === EmptyStateTypes.WAITING_FOR_SCHEDULE_CHECK_RESULTS
        ? EmptyStateDescriptions[emptyStateType](nextScheduleCheckTime)
        : emptyStateType === EmptyStateTypes.FINISH_CONFIGURING_MONITORING
          ? EmptyStateDescriptions[emptyStateType](monitoredModelId!, appName)
          : EmptyStateDescriptions[emptyStateType](appName);

    return (
      <NotMonitoredState
        icon={<MonitoringEmptyStateIcon />}
        title={emptyStateType}
        description={description}
        actions={
          <HelpLink
            text="Learn More"
            type="primary"
            articlePath={SUPPORT_ARTICLE.MODEL_API_MONITORING_SET_UP}
            iconAfter={true}
          />
        }
      />
    );
  }

  return (
    <DriftAndQualityContainer data-test="drift-and-quality-container">
      <iframe
        onLoad={() => setIsIframeLoading(false)}
        src={`${basePath}/workbench-history/${monitoredModelId}`}
        title="Data Drift"
      />
    </DriftAndQualityContainer>
  );
};

export const ModelMonitoring = ({
  modelName,
  modelVersionsDetail,
  modelId,
  activeModelVersionId,
  isExport
}: ModelMonitoringProps) => {
  const runningModelVersions = filter(
    ({ modelVersionStatus, exportStatus }) => modelVersionStatus === 'Running' || exportStatus === 'complete',
    modelVersionsDetail
  );
  const {
    activeConfigureMonitoringOption,
    setActiveConfigureMonitoringOption,
    isIframeLoading,
    setIsIframeLoading,
    selectedVersion,
    setSelectedVersion,
    monitoredModelId,
    isPredictionDataAdded,
    modelType,
    isLoading,
    hasDriftOrQualityCheck,
    scheduleCheckPaused,
    scheduleCheckCronExpression,
    scheduleCheckTimezone
  } = useMonitoring(runningModelVersions, activeModelVersionId, modelId);

  if (!selectedVersion) {
    return (
      <MonitoringWrapper>
        <NotMonitoredState
          icon={<MonitoringEmptyStateIcon />}
          title="Model not running"
          description={
            <p>
              To monitor, you must have a running version of this model. <br />
              To learn how to set up monitoring, click the button below{' '}
            </p>
          }
          actions={
            <HelpLink
              text="Learn More"
              type="primary"
              articlePath={SUPPORT_ARTICLE.MONITORING_TROUBLESHOOTING}
              iconAfter={true}
            />
          }
        />
      </MonitoringWrapper>
    );
  }

  const {
    id: selectedVersionId,
    createdBy: author,
    number: versionNumber,
    summary: description,
    projectId
  } = selectedVersion;

  const showTestsAndThresholdsModal = activeConfigureMonitoringOption === configureMonitoringOptions.testsAndThresholds;
  const showScheduleChecksModal = activeConfigureMonitoringOption === configureMonitoringOptions.schedule;
  const showNotificationsModal = activeConfigureMonitoringOption === configureMonitoringOptions.notification;
  const showAddData = activeConfigureMonitoringOption === configureMonitoringOptions.data;
  const closeModal = () => setActiveConfigureMonitoringOption('');
  const multipleRunningVersions = length(runningModelVersions) > 1;

  // This is a workaround to close the schedule check modal on save, as the save button is rendered inside the iframe.
  // @ts-ignore
  window.closeMonitoringModal = closeModal;

  const actions = (
    <MonitoringActionsContainer
      data-test="monitoring-actions-container"
      justifyContent={multipleRunningVersions ? 'space-between' : 'flex-end'}
    >
      {multipleRunningVersions && (
        <VersionsDropdown
          setModelVersion={setSelectedVersion}
          selectedVersion={selectedVersion}
          modelVersionsDetail={runningModelVersions}
        />
      )}
      <ConfigureMonitoringDropdown
        setActiveMenu={setActiveConfigureMonitoringOption}
        isPredictionDataAdded={isPredictionDataAdded}
      />
    </MonitoringActionsContainer>
  );

  const addDataModal = (
    <AddData
      workbenchModelId={modelId}
      workbenchModelVersionId={selectedVersionId}
      modelName={modelName}
      visible={showAddData}
      closeModal={closeModal}
      dmmModelId={monitoredModelId}
      description={description}
      versionNumber={versionNumber}
      author={author}
      projectId={projectId}
      modelType={modelType as unknown as ModelModelTypeEnum}
      isExport={isExport}
    />
  );

  const thresholdAndScheduleModal = !!monitoredModelId && isPredictionDataAdded && (
    <React.Fragment>
      <TestsAndThresholds visible={showTestsAndThresholdsModal} closeModal={closeModal} dmmModelId={monitoredModelId} />
      <ScheduleChecks visible={showScheduleChecksModal} closeModal={closeModal} dmmModelId={monitoredModelId} />
      {showNotificationsModal && (
        <AlertRecipients visible={showNotificationsModal} closeModal={closeModal} dmmModelId={monitoredModelId} />
      )}
    </React.Fragment>
  );

  const driftAndQualityContainer = (
    <MonitoringDriftAndQuality
      isLoading={isLoading}
      hasDriftOrQualityCheck={hasDriftOrQualityCheck}
      monitoredModelId={monitoredModelId}
      setIsIframeLoading={setIsIframeLoading}
      scheduleCheckPaused={scheduleCheckPaused}
      cronExpression={scheduleCheckCronExpression}
      timezone={scheduleCheckTimezone}
      isExport={!!isExport}
    />
  );

  return (
    <MonitoringWrapper>
      {actions}
      {activeConfigureMonitoringOption === configureMonitoringOptions.data && addDataModal}
      {thresholdAndScheduleModal}
      {(isLoading || (!!monitoredModelId && isIframeLoading)) && 'Loading...'}
      {driftAndQualityContainer}
    </MonitoringWrapper>
  );
};

export default ModelMonitoring;
