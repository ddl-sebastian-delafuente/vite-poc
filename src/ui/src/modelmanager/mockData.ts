import {
  ModelResponseModelTypeEnum as ModelType,
  SourceType,
} from '@domino/api/dist/dmm-api-client';
import { TrainingSetVersion } from '@domino/api/dist/training-set-client';
import {
  DominoDatasetrwApiDatasetRwViewDto as DatasetRwViewDto,
  DominoDatasetrwApiDatasetRwDto as DatasetRwDto,
  DominoDatasetrwApiDatasetRwSnapshotSummaryDto as DatasetRwSnapshotSummaryDto,
} from '@domino/api/dist/types';
import { ModelVersionDetailWithExportStatus } from './ModelMonitoring';

export const dmmModel = {
  createdAt: 1631632224,
  id: '6140bb60113cb0792a1b9777',
  modelType: ModelType.Classification,
  name: 'iris_model',
  sourceType: SourceType.Standalone,
  version: '1.06'
  // The following properties no longer exists on ModelResponse Type
  // dataDriftChecks: [],
  // isDataDriftCheckScheduled: false,
  // isModelQualityCheckScheduled: false,
  // modelQualityChecks: [],
  // modelStatus: 'created',
};

export const scheduleCheck = {
  id: 'id',
  name: 'schedule-check',
  modelId: '6140bb60113cb0792a1b9777',
  cronExpression: '* * * * *',
  timezone: 'UTC',
  isPaused: false,  
  dataSinceLastCheck: true
}

export const projects = [
  {
    id: '60dc31603626bc13d3c7feef',
    name: 'quick-start',
    ownerId: '60dc315e3626bc13d3c7feed',
    ownerName: 'integration-test',
    description:
      'This is a sample Domino Project. This project contains examples for using notebooks, publishing models as APIs, and publishing Python/Flask and R/Shiny web applications.',
    visibility: 'Private',
    tags: [],
    runCounts: [],
    relationship: 'Owned',
    projectType: 'Analytic',
    stageId: '60dc016f3626bc13d3c7fec0',
    status: { status: 'active', isBlocked: false }
  }
];

export const modelVersionDetail1: ModelVersionDetailWithExportStatus = {
  id: 'id',
  summary: 'summary',
  createdBy: 'author',
  number: 1,
  projectId: 'pid',
  modelVersionStatus: 'Running'
};

export const modelVersionDetail2: ModelVersionDetailWithExportStatus = {
  id: 'id2',
  summary: 'summary2',
  createdBy: 'author2',
  number: 2,
  projectId: 'pid2',
  modelVersionStatus: 'Running'
};

export const trainingSetVersion: TrainingSetVersion = {
  id: '60dc016f3626bc13d3c7fec0',
  trainingSetId: '60dc016f3626bc13d3c7fec7',
  trainingSetName: 'name',
  number: 1,
  creationTime: '',
  path: '/trainingset/60dc016f3626bc13d3c7fec9/60dc016f3626bc13d3c7fec8/60dc016f3626bc13d3c7fec7',
  containerPath: '',
  keyColumns: ['key1', 'key2'],
  targetColumns: ['output1', 'output2'],
  excludeColumns: ['exclude1', 'exclude2'],
  allColumns: ['key1', 'key2', 'output1', 'output2', 'exclude1', 'exclude2', 'feature1', 'feature2', 'feature3'],
  monitoringMeta: {
    timestampColumns: ['ts1'],
    categoricalColumns: ['feature1', 'output2'],
    ordinalColumns: ['feature2']
  },
  description: 'desc',
  meta: {},
  pending: false
};

export const trainingSetVersion2: TrainingSetVersion = {
  id: '60dc016f3626bc13d3c7fec0',
  trainingSetId: '60dc016f3626bc13d3c7fec7',
  trainingSetName: 'name',
  number: 1,
  creationTime: '',
  path: '/trainingset/60dc016f3626bc13d3c7fec9/60dc016f3626bc13d3c7fec8/60dc016f3626bc13d3c7fec7',
  containerPath: '',
  keyColumns: ['key1', 'key2'],
  targetColumns: [],
  excludeColumns: ['exclude1', 'exclude2'],
  allColumns: ['key1', 'key2', 'exclude1', 'exclude2', 'feature2'],
  monitoringMeta: {
    timestampColumns: ['ts1'],
    categoricalColumns: [],
    ordinalColumns: ['feature2']
  },
  description: 'desc',
  meta: {},
  pending: false
};

export const trainingSetVersion3: TrainingSetVersion = {
  id: '60dc016f3626bc13d3c7fec0',
  trainingSetId: '60dc016f3626bc13d3c7fec7',
  trainingSetName: 'name',
  number: 1,
  creationTime: '',
  path: '/trainingset/60dc016f3626bc13d3c7fec9/60dc016f3626bc13d3c7fec8/60dc016f3626bc13d3c7fec7',
  containerPath: '',
  keyColumns: ['key1', 'key2'],
  targetColumns: ['feature3'],
  excludeColumns: ['exclude1', 'exclude2'],
  allColumns: ['key1', 'key2', 'exclude1', 'exclude2', 'feature2', 'feature3'],
  monitoringMeta: {
    timestampColumns: ['ts1'],
    categoricalColumns: ['feature3'],
    ordinalColumns: ['feature2']
  },
  description: 'desc',
  meta: {},
  pending: false
};

export const featureSets = [
  {
    label: 'featureSet1',
    value: 'value1'
  },
  {
    label: 'featureSet2',
    value: 'value2'
  }
];

export const featureSetVersions = [
  {
    label: 'featureSetVersion1',
    value: 'value1'
  },
  {
    label: 'featureSetVersion2',
    value: 'value2'
  }
];

export const datasets: DatasetRwDto[] = [{
  'id': '61557800b50edc4a5c49121a',
  'name': 'my-project2',
  'description': 'This is the default dataset provided for your project and will be available in all your executions. You can add/remove data, rename or delete this dataset.',
  'author': '615206f1e226e53904bef7dd',
  'snapshotIds': ['61557800b50edc4a5c491219'],
  'tags': {},
  'projectId': '615577feb50edc4a5c491215',
  'createdTime': 1632991232808,
  'lifecycleStatus': 'Active',
  'statusLastUpdatedBy': '615206f1e226e53904bef7dd',
  'statusLastUpdatedTime': 1632991232808,
  'readWriteSnapshotId': '61557800b50edc4a5c491219',
  'datasetPath': '/domino/datasets/local/my-project2'
}, {
  'id': '615eee715c82c80afe2c9a5b',
  'name': 'predictions-615577feb50edc4a5c491215',
  'description': 'Dataset to store predictions',
  'author': '615206f1e226e53904bef7dd',
  'snapshotIds': ['615eee715c82c80afe2c9a5a'],
  'tags': {},
  'projectId': '615577feb50edc4a5c491215',
  'createdTime': 1633611377136,
  'lifecycleStatus': 'Active',
  'statusLastUpdatedBy': '615206f1e226e53904bef7dd',
  'statusLastUpdatedTime': 1633611377136,
  'readWriteSnapshotId': '615eee715c82c80afe2c9a5a',
  'datasetPath': '/domino/datasets/local/predictions-615577feb50edc4a5c491215'
}];

export const createDatasetResponse: DatasetRwViewDto = {
  'id': '6163f827c67e4c64a7480b75',
  'name': 'prediction-data',
  'description': 'Dataset to store predictions',
  'snapshotIds': ['6163f827c67e4c64a7480b74'],
  'tags': {},
  'createdTime': 1633941543688,
  'projectId': '615577feb50edc4a5c491215',
  'projectOwner': 'integration-test',
  'projectName': 'my-project2'
};

export const getDatasetResponse: DatasetRwDto = {
  'id': '6163f827c67e4c64a7480b75',
  'name': 'prediction-data',
  'description': 'Dataset to store predictions',
  'author': '615206f1e226e53904bef7dd',
  'snapshotIds': ['6163f827c67e4c64a7480b74'],
  'tags': {},
  'projectId': '615577feb50edc4a5c491215',
  'createdTime': 1633941543688,
  'lifecycleStatus': 'Active',
  'statusLastUpdatedBy': '615206f1e226e53904bef7dd',
  'statusLastUpdatedTime': 1633941543688,
  'readWriteSnapshotId': '6163f827c67e4c64a7480b74',
  'datasetPath': '/domino/datasets/local/prediction-data'
};

export const snapShots: DatasetRwSnapshotSummaryDto[] = [{
  'snapshot': {
    'id': '6163f827c67e4c64a7480b74',
    'resource': {
      'claimName': "test-claim",
      'resourceId': "73f956b1-ea16-4ff0-b16b-e6d2e05afa99",
      'subDir': "filecache"
    },
    'datasetId': '6163f827c67e4c64a7480b75',
    'author': '615206f1e226e53904bef7dd',
    'version': 0,
    'creationTime': 1633941543695,
    'lifecycleStatus': 'Active',
    'statusLastUpdatedBy': '615206f1e226e53904bef7dd',
    'statusLastUpdatedTime': 1633941543695,
    'storageSize': 0,
    'isPartialSize': false,
    'isReadWrite': true
  }, 'authorUsername': 'integration-test', 'datasetDescription': 'Dataset to store predictions', 'isReadWrite': true
}];
