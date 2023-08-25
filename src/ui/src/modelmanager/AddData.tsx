import React, { useEffect, useState } from 'react';
import { Divider, Spin } from 'antd';
import { LoadingOutlined, WarningFilled } from '@ant-design/icons';
import { filter, find, length, map, propEq, not, isEmpty } from 'ramda';
import {
  AddDataHeader,
  AddText,
  ExternalLinkIcon,
  FeatureSetHelperText,
  FeatureSetInputsContainer,
  IngestDataHeader,
  IngestDataText,
  ModelTypeWrapper,
  StyledLink
} from './atoms';
import DominoModal from '@domino/ui/dist/components/Modal';
import tooltipRenderer from '@domino/ui/dist/components/renderers/TooltipRenderer';
import Select, { OptionProp } from '@domino/ui/dist/components/Select/Select';
import DangerBox from '@domino/ui/dist/components/Callout/DangerBox';
import { featureSetApi } from '../featureSetApis';
import { secondaryWarningRed } from '../styled/colors';
import { TrainingSetVersion } from '@domino/api/dist/training-set-client';
import { datasetApi, modelApi } from '../dmmApis';
import {
  DatasetConfigRegistrationRequestDatasetTypeEnum,
  DatasourceType,
  FileFormat,
  JobDashboardFilterStatusEnum,
  JobHistoryResponseJobTypeEnum,
  JobPaginationOrderEnum,
  JobPaginationSortEnum,
  ModelModelTypeEnum,
  SourceType,
  ValueType,
  VariableType
} from '@domino/api/dist/dmm-api-client';
import { getLastNDaysEpochTime } from '../utils/common';
import { trackConfigureMonitoring } from './MonitoringMixpanelTracking';
import PredictionDataSettings from './PredictionDataSettings';
import HelpLink from '../components/HelpLink';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';

interface Props {
  visible: boolean;
  closeModal: () => void;
  workbenchModelId: string;
  workbenchModelVersionId: string;
  modelName: string;
  dmmModelId: string | null | undefined;
  description: string;
  versionNumber: number;
  author: string;
  projectId: string;
  modelType: ModelModelTypeEnum | undefined;
  isExport?: boolean;
}

interface FeatureSetInputsProps {
  isOptionsLoading: boolean;
  setSelectedFeatureSetId: (key: string) => void;
  featureSets: Array<OptionProp>;
  setFeatureSetVersionId: (key: string) => void;
  featureSetVersions: Array<OptionProp>;
  setFeatureSetVersion: (key: TrainingSetVersion | null) => void;
  dmmModelId: string | null | undefined;
  selectedFeatureSetId: string;
  featureSetVersionId: string;
  isExport: boolean;
}

interface ColumnSchema {
  name: string;
  valueType: ValueType;
  variableType: VariableType;
}

interface ColumnNamesByType {
  predictionColumn: string | undefined;
  categoricalColumns: Array<string>;
  numericalColumns: Array<string>;
}

type SavedFeatureSetDetails = {
  featureSetId: string;
  featureSetVersionId: string;
};

// constants

const limit = 99999;
export const dataSourceName = 'domino-efs-data-source';
const modelTypeOptions = [
  {
    label: 'Classification',
    value: ModelModelTypeEnum.Classification
  },
  {
    label: 'Regression',
    value: ModelModelTypeEnum.Regression
  }
];


const disableTooltipMessageModelAPI = 'To change these settings, you must publish a new version of this Model API';
const disableTooltipMessageExport = 'To change these settings, you must publish a new version of this Export'
const featureSetPlaceholderText = 'Search Training Sets';
// helper methods

export const getVariableType = (column: string, predictionColumn: string | undefined) =>
  column === predictionColumn ? VariableType.Prediction : VariableType.Feature;

export const removeElementsFromList = (targetList: Array<string>, listToBeRemoved: Array<string>): Array<string> => {
  const toRemove = new Set(listToBeRemoved);
  return filter((x) => !toRemove.has(x), targetList);
};

export const getFeatureSetSuffixIcon = (isOptionsLoading: boolean) =>
  isOptionsLoading ? <Spin data-test="feature-set-suffix-icon" indicator={loaderIcon} /> : undefined;

export const isFeatureSetSelectDisabled = (isOptionsLoading: boolean, dmmModelId: string | null | undefined) =>
  isOptionsLoading || !!dmmModelId;

export const isVersionSelectDisabled = (selectedFeatureSetId: string, featureSetSelectDisabled: boolean) =>
  featureSetSelectDisabled || isEmpty(selectedFeatureSetId);

export const getColumnsByType = (trainingSetVersion: TrainingSetVersion): ColumnNamesByType => {
  const {
    monitoringMeta: { categoricalColumns, timestampColumns, ordinalColumns },
    keyColumns,
    targetColumns,
    excludeColumns,
    allColumns
  } = trainingSetVersion;

  const columnsThatAreNotNumerical = [
    ...keyColumns,
    ...excludeColumns,
    ...categoricalColumns,
    ...timestampColumns,
    ...ordinalColumns
  ];

  const numericalColumns = removeElementsFromList(allColumns, columnsThatAreNotNumerical);
  const [
    categoricalColumnsAfterExcluding,
    numericalColumnsAfterExcluding,
    predictionColumnsAfterExcluding
  ] = map(
    (columns) => removeElementsFromList(columns, excludeColumns),
    [categoricalColumns, numericalColumns, targetColumns]
  );

  const [predictionColumn] = map(
    (columns) => columns.shift(),
    [predictionColumnsAfterExcluding]
  );

  return {
    predictionColumn,
    categoricalColumns: categoricalColumnsAfterExcluding,
    numericalColumns: numericalColumnsAfterExcluding
  };
};

export const createModelSchema = (trainingSetVersion: TrainingSetVersion): Array<ColumnSchema> => {
  const { predictionColumn, categoricalColumns, numericalColumns } =
    getColumnsByType(trainingSetVersion);

  const modelSchemaForCategoricalColumns = map(
    (column) => ({
      name: column,
      valueType: ValueType.Categorical,
      variableType: getVariableType(column, predictionColumn)
    }),
    categoricalColumns
  );

  const modelSchemaForNumericalColumns = map(
    (column) => ({
      name: column,
      valueType: ValueType.Numerical,
      variableType: getVariableType(column, predictionColumn)
    }),
    numericalColumns
  );

  return [...modelSchemaForCategoricalColumns, ...modelSchemaForNumericalColumns];
};

export const getModelConfig = (
  trainingSetVersion: TrainingSetVersion,
  modelName: string,
  featureSetId: string,
  featureSetVersionId: string,
  versionNumber: number,
  modelType: ModelModelTypeEnum,
  description: string,
  author: string,
  workbenchModelVersionId: string,
  workbenchModelId: string,
  isExport?: boolean
) => {
  const { trainingSetName, number, path } = trainingSetVersion;
  return {
    variables: createModelSchema(trainingSetVersion),
    datasetDetails: {
      name: `${trainingSetName}-${number}`,
      datasetType: DatasetConfigRegistrationRequestDatasetTypeEnum.File,
      datasetConfig: {
        path: path,
        fileFormat: FileFormat.Parquet
      },
      datasourceName: dataSourceName,
      datasourceType: DatasourceType.Nfs,
      featureSetId,
      featureSetVersionId
    },
    modelMetadata: {
      name: modelName,
      modelType,
      version: String(versionNumber),
      description: description || '',
      author,
      sourceType: isExport ? SourceType.Standalone : SourceType.DominoWorkbench,
      sourceDetails: {
        workbenchModelId,
        workbenchModelVersionId
      }
    }
  };
};

export const isSchemaDefinitionValid = (
  trainingSetVersion: TrainingSetVersion | null,
  featureSetVersionId: string,
  modelType: ModelModelTypeEnum
) => {
  if (!featureSetVersionId || !trainingSetVersion) {
    return false;
  }
  const {
    monitoringMeta: { timestampColumns, ordinalColumns },
    keyColumns,
    excludeColumns,
    allColumns
  } = trainingSetVersion;

  const { predictionColumn, numericalColumns, categoricalColumns } = getColumnsByType(trainingSetVersion);

  const isNumericalPredictionForClassificationModel =
    modelType === ModelModelTypeEnum.Classification &&
    !!predictionColumn &&
    numericalColumns.includes(predictionColumn);

  const isCategoricalPredictionForRegressionModel =
    modelType === ModelModelTypeEnum.Regression && !!predictionColumn && categoricalColumns.includes(predictionColumn);

  return (
    !isNumericalPredictionForClassificationModel &&
    !isCategoricalPredictionForRegressionModel &&
    !!length(
      removeElementsFromList(allColumns, [...keyColumns, ...excludeColumns, ...timestampColumns, ...ordinalColumns])
    )
  );
};

// API calls

export const fetchSavedFeatureSetDetails = async (dmmModelId: string): Promise<SavedFeatureSetDetails> => {
  const { endDate } = getLastNDaysEpochTime(7);

  const filters = {
    status: Object.values(JobDashboardFilterStatusEnum),
    job_type: [JobHistoryResponseJobTypeEnum.Training]
  };

  const pageNumber = 1;
  const pageSize = 5;
  const startEpochTime = 0;

  const jobHistoryRequest = {
    start: startEpochTime,
    end: endDate,
    search: '',
    pagination: {
      order: JobPaginationOrderEnum.NUMBER_1,
      sort: JobPaginationSortEnum.CreatedAt,
      page: pageNumber,
      size: pageSize
    },
    filters: filters
  };
  try {
    const {
      data: { jobs }
    } = await datasetApi.getDatasetJobs(dmmModelId, jobHistoryRequest);

    const [{ dataset_path }] = jobs;
    const [, , , featureSetId, featureSetVersionId] = dataset_path.split('/');
    return {
      featureSetId: featureSetId || '',
      featureSetVersionId: featureSetVersionId || ''
    };
  } catch (e) {
    return {
      featureSetId: '',
      featureSetVersionId: ''
    };
  }
};

export const getAllFeatureSets = async (projectId: string): Promise<Array<OptionProp>> => {
  try {
    const { data: featureSets } = await featureSetApi.findPost({ projectId }, 0, limit, false);
    return map(({ name, id }) => ({ label: name, value: id }), featureSets);
  } catch (e) {
    return [];
  }
};

export const getAllFeatureSetVersions = async (
  projectId: string,
  featureSetId: string,
  featureSets: Array<OptionProp>
): Promise<Array<OptionProp>> => {
  const { label: trainingSetName } = find(propEq('value', featureSetId), featureSets) || { label: '' };
  try {
    const { data: featureSetVersions } = await featureSetApi.versionFindPost(
      {
        projectId,
        trainingSetName: trainingSetName as string,
        trainingSetMeta: {},
        meta: {}
      },
      0,
      limit,
      false
    );
    return map(
      ({ number, id }) => ({ label: number, value: id }),
      filter(({ pending }) => !pending, featureSetVersions)
    );
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getFeatureSetVersionById = async (
  featureSetVersionId: string,
  featureSetId: string,
  featureSets: Array<OptionProp>,
  featureSetVersions: Array<OptionProp>
): Promise<TrainingSetVersion | null> => {
  const { label: trainingSetName } = find(propEq('value', featureSetId), featureSets) || { label: '' };
  const { label: trainingSetVersion } = find(propEq('value', featureSetVersionId), featureSetVersions) || { label: '' };
  try {
    const { data: featureSetVersion } = await featureSetApi.trainingSetNameNumberGet(
      trainingSetName,
      Number(trainingSetVersion)
    );
    return featureSetVersion;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createDMMModel = async (
  trainingSetVersion: TrainingSetVersion | null,
  modelName: string,
  workbenchModelVersionId: string,
  workbenchModelId: string,
  description: string,
  versionNumber: number,
  author: string,
  featureSetId: string,
  featureSetVersionId: string,
  modelType: ModelModelTypeEnum,
  isExport?: boolean
) => {
  if (!trainingSetVersion) {
    return;
  }
  try {
    const modelConfig = getModelConfig(
      trainingSetVersion,
      modelName,
      featureSetId,
      featureSetVersionId,
      versionNumber,
      modelType,
      description,
      author,
      workbenchModelVersionId,
      workbenchModelId,
      isExport
    );
    await modelApi.registerModelThroughConfig(modelConfig);
    await trackConfigureMonitoring(workbenchModelId, workbenchModelVersionId);
  } catch (e) {
    console.error(e);
  }
};

// state and effects

export const hydrateFeatureSetsHook = (
  setIsOptionsLoading: (isLoading: boolean) => void,
  setFeatureSets: (featureSets: Array<OptionProp>) => void,
  setSelectedFeatureSetId: (id: string) => void,
  setFeatureSetVersionId: (id: string) => void,
  projectId: string,
  dmmModelId: string | null | undefined
) =>
  (async function () {
    setIsOptionsLoading(true);
    if (dmmModelId) {
      const { featureSetId, featureSetVersionId } = await fetchSavedFeatureSetDetails(dmmModelId);
      setSelectedFeatureSetId(featureSetId);
      setFeatureSetVersionId(featureSetVersionId);
    }
    const featureSets = await getAllFeatureSets(projectId);
    setFeatureSets(featureSets);
    setIsOptionsLoading(false);
  })();

export const hydrateFeatureSetVersionsHook = (
  setIsOptionsLoading: (isLoading: boolean) => void,
  setFeatureSetVersions: (featureSetVersions: Array<OptionProp>) => void,
  projectId: string,
  selectedFeatureSetId: string,
  featureSets: Array<OptionProp>
) =>
  (async function () {
    setIsOptionsLoading(true);
    const featureSetVersions = await getAllFeatureSetVersions(projectId, selectedFeatureSetId, featureSets);
    setFeatureSetVersions(featureSetVersions);
    setIsOptionsLoading(false);
  })();

export const fetchFeatureSetVersionByIdHook = (
  setFeatureSetVersion: (featureSetVersion: TrainingSetVersion | null) => void,
  featureSetVersionId: string,
  selectedFeatureSetId: string,
  featureSets: Array<OptionProp>,
  featureSetVersions: Array<OptionProp>
) =>
  (async function () {
    const featureSetVersion = await getFeatureSetVersionById(
      featureSetVersionId,
      selectedFeatureSetId,
      featureSets,
      featureSetVersions
    );
    setFeatureSetVersion(featureSetVersion);
  })();

export const useFeatureSet = (projectId: string, dmmModelId: string | null | undefined) => {
  const [featureSets, setFeatureSets] = useState<Array<OptionProp>>([]);
  const [selectedFeatureSetId, setSelectedFeatureSetId] = useState<string>('');
  const [featureSetVersions, setFeatureSetVersions] = useState<Array<OptionProp>>([]);
  const [featureSetVersionId, setFeatureSetVersionId] = useState<string>('');
  const [isOptionsLoading, setIsOptionsLoading] = useState<boolean>(false);
  const [featureSetVersion, setFeatureSetVersion] = useState<TrainingSetVersion | null>(null);
  const [modelType, setModelType] = useState<ModelModelTypeEnum>(ModelModelTypeEnum.Classification);

  useEffect(() => {
    (() =>
      hydrateFeatureSetsHook(
        setIsOptionsLoading,
        setFeatureSets,
        setSelectedFeatureSetId,
        setFeatureSetVersionId,
        projectId,
        dmmModelId
      ))();
  }, [projectId, dmmModelId]);

  useEffect(() => {
    (() =>
      hydrateFeatureSetVersionsHook(
        setIsOptionsLoading,
        setFeatureSetVersions,
        projectId,
        selectedFeatureSetId,
        featureSets
      ))();
  }, [selectedFeatureSetId, featureSets, projectId]);

  useEffect(() => {
    if (not(isEmpty(featureSetVersionId)) && not(isEmpty(selectedFeatureSetId)))
      (() =>
        fetchFeatureSetVersionByIdHook(
          setFeatureSetVersion,
          featureSetVersionId,
          selectedFeatureSetId,
          featureSets,
          featureSetVersions
        ))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureSetVersionId]);

  return {
    featureSets,
    setFeatureSets,
    selectedFeatureSetId,
    setSelectedFeatureSetId,
    featureSetVersions,
    setFeatureSetVersions,
    featureSetVersionId,
    setFeatureSetVersionId,
    isOptionsLoading,
    setIsOptionsLoading,
    featureSetVersion,
    setFeatureSetVersion,
    modelType,
    setModelType
  };
};

const loaderIcon = (
  <LoadingOutlined
    style={{
      fontSize: 16
    }}
    spin />
);

const dangerIcon = (
  <WarningFilled style={{ fontSize: '26px', color: secondaryWarningRed }} />
);

export const featureSetDropdownRender = (menu: React.ReactElement) => {
  return (
    <div data-test="feature-set-dropdown">
      {menu}
      <Divider data-test="feature-set-divider" style={{ margin: '4px 0px' }} />
      <FeatureSetHelperText data-test="feature-set-helper-text">
        Note: To monitor, you must first save your training data as a Training Set. To learn how to do this, read&nbsp;
        <span onMouseDown={(e) => e.preventDefault()}>
          <HelpLink
            text="Using Training Sets"
            articlePath={SUPPORT_ARTICLE.MONITORING_FEATURE_SETS}
            iconAfter={true}
            fontSize="12px"
          />
        </span>
      </FeatureSetHelperText>
    </div>
  );
};

const handleFeatureSetFilter = (input: string, option: any) => {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

export const handleFeatureSetChange = (
  value: string,
  setSelectedFeatureSetId: (id: string) => void,
  setFeatureSetVersionId: (id: string) => void,
  setFeatureSetVersion: (trainingSetVersion: TrainingSetVersion | null) => void
) => {
  setSelectedFeatureSetId(value as string);
  setFeatureSetVersion(null);
  setFeatureSetVersionId('');
};

export const handleFeatureSetVersionChange = (
  version: string,
  setFeatureSetVersionId: (id: string) => void,
  setFeatureSetVersion: (trainingSetVersion: TrainingSetVersion | null) => void
) => {
  setFeatureSetVersionId(version as string);
  setFeatureSetVersion(null);
};

export const canShowFeatureSetErrorMessage = (
  isSchemaInvalid: boolean,
  selectedFeatureSetId: string,
  featureSetVersionId: string,
  featureSetVersion: TrainingSetVersion | null
) =>
  isSchemaInvalid &&
  not(isEmpty(selectedFeatureSetId)) &&
  not(isEmpty(featureSetVersionId)) &&
  not(featureSetVersion === null);

export const FeatureSet = ({
  isOptionsLoading,
  setSelectedFeatureSetId,
  featureSets,
  setFeatureSetVersionId,
  featureSetVersions,
  setFeatureSetVersion,
  dmmModelId,
  selectedFeatureSetId,
  featureSetVersionId,
  isExport
}: FeatureSetInputsProps) => {
  const suffixIcon = getFeatureSetSuffixIcon(isOptionsLoading);
  const featureSetSelectDisabled = isFeatureSetSelectDisabled(isOptionsLoading, dmmModelId);
  const versionSelectDisabled = isVersionSelectDisabled(selectedFeatureSetId, featureSetSelectDisabled);
  const featureSetSelect = <Select
    data-test="feature-set-select"
    placeholder={featureSetPlaceholderText}
    value={selectedFeatureSetId || undefined}
    suffixIcon={suffixIcon}
    disabled={featureSetSelectDisabled}
    onChange={(id) =>
      handleFeatureSetChange(id as string, setSelectedFeatureSetId, setFeatureSetVersionId, setFeatureSetVersion)
    }
    showSearch
    dropdownMatchSelectWidth
    filterOption={handleFeatureSetFilter}
    style={{ width: '100%' }}
    dropdownRender={featureSetDropdownRender}
    options={featureSets}
    notFoundContent="This project has no Training Sets"
  />;

  const featureSetVersionSelect = <Select
    data-test="feature-set-version-select"
    value={featureSetVersionId}
    onChange={(id) => handleFeatureSetVersionChange(id as string, setFeatureSetVersionId, setFeatureSetVersion)}
    suffixIcon={suffixIcon}
    disabled={versionSelectDisabled}
    style={{ width: '100%' }}
    options={featureSetVersions as OptionProp[]}
  />;

  const disableTooltipMessage = isExport ? disableTooltipMessageExport : disableTooltipMessageModelAPI

  return (
    <FeatureSetInputsContainer data-test="feature-set-input">
      <div>
        <AddDataHeader data-test="feature-set-header">Training Data</AddDataHeader>
        {dmmModelId ?
          tooltipRenderer(disableTooltipMessage, featureSetSelect) :
          featureSetSelect
        }
        <AddText data-test="feature-set-text">Allows drift monitoring</AddText>
      </div>
      <div>
        <AddDataHeader data-test="feature-set-header">Version</AddDataHeader>
        {dmmModelId ?
          tooltipRenderer(disableTooltipMessage, featureSetVersionSelect) :
          featureSetVersionSelect
        }
      </div>
    </FeatureSetInputsContainer>
  );
};

export type PredictionAndGroundTruthDataType = { dmmModelId: Props['dmmModelId'], appName: string };

export const AddGroundTruth = ({ dmmModelId, appName }: PredictionAndGroundTruthDataType) => {
  return (
    <React.Fragment>
      <IngestDataHeader data-test="ingest-data-header">Ground Truth Data</IngestDataHeader>
      <IngestDataText data-test="ingest-data-text">
        Ground truth data allows model quality monitoring. To configure ground truth data,{' '}
        <StyledLink
          dataTest="modal-link"
          type="icon-link-end"
          icon={<ExternalLinkIcon height={14} width={14} />}
          onClick={() =>
            window.open(`${window.location.origin}/model-monitor/model-quality/${dmmModelId}?activeTab=analyze`)
          }>
          open this model
        </StyledLink>
        in {appName} Model Monitor.
      </IngestDataText>
    </React.Fragment>
  );
};

export const AddPredictionData = ({ dmmModelId, appName }: PredictionAndGroundTruthDataType) => (
  <React.Fragment>
    <IngestDataHeader>Prediction Data</IngestDataHeader>
    <IngestDataText>
      Prediction data allows data drift monitoring. To configure prediction data,{' '}
      <StyledLink
        type="icon-link-end"
        icon={<ExternalLinkIcon height={14} width={14} />}
        onClick={() =>
          window.open(`${window.location.origin}/model-monitor/data-drift/${dmmModelId}?activeTab=analyze`)
        }>
        open this model
      </StyledLink>
      in {appName} Model Monitor.
    </IngestDataText>
  </React.Fragment>
);

export const FeatureSetSchemaErrorMessage = () => {
  return (
    <DangerBox icon={dangerIcon} data-test="feature-set-schema-error-message">
      The selected Training Set Version cannot currently be used for monitoring because it does not contain a schema
      definition. Learn more about{' '}
      <HelpLink
        dataTest="error-help-link"
        text="Training Sets"
        articlePath={SUPPORT_ARTICLE.MONITORING_FEATURE_SETS}
        iconAfter={true}
      />
    </DangerBox>
  );
};

export type ModelTypeProps = {
  setModelType: (type: ModelModelTypeEnum) => void;
  disabled: boolean;
  value: ModelModelTypeEnum | undefined;
  isExport: boolean;
};
export const ModelType = ({ setModelType, value, disabled, isExport }: ModelTypeProps) => {
  const modelTypeSelect = <Select
    value={value}
    disabled={disabled}
    onChange={(type) => setModelType(type as ModelModelTypeEnum)}
    style={{ width: '30%' }}
    options={modelTypeOptions}
  />;
  const disableTooltipMessage = isExport ? disableTooltipMessageExport : disableTooltipMessageModelAPI
  return (
    <React.Fragment>
      <AddDataHeader data-test="model-type-header">Model Type</AddDataHeader>
      <ModelTypeWrapper data-test="model-type">
        {disabled ? tooltipRenderer(disableTooltipMessage, modelTypeSelect) : modelTypeSelect}
      </ModelTypeWrapper>
    </React.Fragment>
  );
};

const AddData = ({
  visible,
  closeModal,
  dmmModelId,
  modelName,
  workbenchModelVersionId,
  workbenchModelId,
  description,
  versionNumber,
  author,
  projectId,
  modelType: savedModelType,
  isExport,
}: Props) => {
  const { whiteLabelSettings } = useStore();
  const {
    featureSets,
    setSelectedFeatureSetId,
    featureSetVersions,
    setFeatureSetVersionId,
    isOptionsLoading,
    featureSetVersion,
    setFeatureSetVersion,
    selectedFeatureSetId,
    featureSetVersionId,
    modelType,
    setModelType
  } = useFeatureSet(projectId, dmmModelId);

  const appName = getAppName(whiteLabelSettings);
  const groundTruthAndPredictionCommonProps = { dmmModelId, appName };
  const isSchemaInvalid = !isSchemaDefinitionValid(featureSetVersion, featureSetVersionId, modelType);
  const showFeatureSetSchemaErrorMessage = canShowFeatureSetErrorMessage(
    isSchemaInvalid,
    selectedFeatureSetId,
    featureSetVersionId,
    featureSetVersion
  );

  const handleSave = async () => {
    await createDMMModel(
      featureSetVersion,
      modelName,
      workbenchModelVersionId,
      workbenchModelId,
      description,
      versionNumber,
      author,
      selectedFeatureSetId,
      featureSetVersionId,
      modelType,
      isExport
    );
    closeModal();
  };

  return (
    <DominoModal
      width="60%"
      destroyOnClose
      title="Configure Data"
      maskClosable={false}
      closable={true}
      visible={visible}
      onCancel={closeModal}
      onOk={handleSave}
      okText="Save"
      okButtonProps={{
        disabled: isSchemaInvalid || !!dmmModelId
      }}
      testId="add-data-modal-"
      data-test="add-data-modal"
    >
      <React.Fragment>
        {!isExport && <PredictionDataSettings
          modelName={modelName}
          versionNumber={versionNumber}
          modelVersionId={workbenchModelVersionId}
          projectId={projectId}
        />}
        <FeatureSet
          selectedFeatureSetId={selectedFeatureSetId}
          featureSetVersionId={featureSetVersionId}
          isOptionsLoading={isOptionsLoading}
          setSelectedFeatureSetId={setSelectedFeatureSetId}
          featureSets={featureSets}
          setFeatureSetVersionId={setFeatureSetVersionId}
          featureSetVersions={featureSetVersions}
          setFeatureSetVersion={setFeatureSetVersion}
          dmmModelId={dmmModelId}
          isExport={!!isExport}
        />
        <ModelType
          setModelType={setModelType}
          value={savedModelType || modelType}
          disabled={!!dmmModelId}
          isExport={!!isExport}
        />
        {showFeatureSetSchemaErrorMessage && <FeatureSetSchemaErrorMessage />}
        {isExport && !!dmmModelId && <AddPredictionData {...groundTruthAndPredictionCommonProps} />}
        {!!dmmModelId && <AddGroundTruth {...groundTruthAndPredictionCommonProps} />}
      </React.Fragment>
    </DominoModal>
  );
};

export default AddData;
