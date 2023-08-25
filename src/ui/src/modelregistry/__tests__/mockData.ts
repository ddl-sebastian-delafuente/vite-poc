import { DominoProjectsApiProjectSummary, DominoCommonUserPerson } from '@domino/api/dist/types'
import { ModelVersion, ReviewSummary } from '../api';
import { RegisteredModelV1,
  PaginatedRegisteredModelVersionOverviewEnvelopeV1 as ModelVersionsDto,
  RegisteredModelVersionDetailsV1 as ModelVersionDto,
  ModelStages
} from '../types';
import { Run, RunStatus, LifecycleStage } from '@domino/ui/dist/experiments/types';
export const sourceFileName = 'custom-metrics-example/mock-train.py';
export const mockModel: RegisteredModelV1 = {
  name: 'model',
  description: 'This model version is a scikit-learn random forest containing 100 decision trees',
  latestVersion: 1,
  project: {
    id: '6451200c6de24f0a2f67ed8a',
    name: 'tempest-project432_1683038220',
    ownerUsername: 'practitioner432'
  },
  tags: {
    'mlflow.domino.user_id': '6451223c96c55990b1ae1656',
    'mlflow.domino.run_id': '6451418ff3187b1275e38a2b',
    'mlflow.domino.user': 'integration-test',
    'mlflow.domino.dataset_info': 'unknown',
    'mlflow.domino.project_name': 'tempest-project432_1683038220',
    'mlflow.domino.environment_id': '64511a16d4d715414e9d82ef',
    'mlflow.source.type': 'NOTEBOOK',
    'domino.project': 'tempest-project432_1683038220',
    'mlflow.domino.run_number': '1',
    'mlflow.domino.environment_revision_id': '64511a16d4d715414e9d82f3',
    'mlflow.domino.project_id': '6451200c6de24f0a2f67ed8a',
    'mlflow.domino.hardware_tier': 'small-k8s',
    'mlflow.user': 'integration-test',
    'mlflow.domino.project': 'tempest-project432_1683038220'
  },
  ownerUsername: 'integration-test',
  createdAt: '2023-05-02T17:18:12.413Z',
  updatedAt: '2023-05-03T15:15:58.613Z',
  currentStage: 'None'

};

export const mockReviewSummary: ReviewSummary = {
  modelReviewId: '64537f2edbdfb475a35db39e',
  status: 'Open',
  notes: 'Please review',
  targetStage: 'Production',
  reviewerResponses: [
    {
      reviewer: {
        id: '6451200c6de24f0a2f67ed8b',
        username: 'reviewer-name',
        firstName: "First",
        lastName: "Last"
      }
    }, {
      reviewer: {
        id: '5e7e6a95fe3cf1077d3b6b6d',
        username: 'integration-test',
        firstName: "Integration",
        lastName: "Test"
      }
    }
  ]
};

export const modelVersion: ModelVersion = {
  modelName: 'model',
  modelVersion: 1,
  modelVersionDescription: 'This model version is a scikit-learn random forest containing 100 decision trees',
  experimentRunId: '6f8ce4fa083546fb81c133877ccb0c2d',
  ownerUsername: 'integration-test',
  project: {
    id: '6451200c6de24f0a2f67ed8a',
    name: 'tempest-project432_1683038220',
    ownerUsername: 'practitioner432'
  },
  currentStage: 'None',
  tags: {
    'mlflow.domino.user_id': '6451223c96c55990b1ae1656',
    'mlflow.domino.run_id': '6451418ff3187b1275e38a2b',
    'mlflow.domino.user': 'integration-test',
    'mlflow.domino.dataset_info': 'unknown',
    'mlflow.domino.project_name': 'tempest-project432_1683038220',
    'mlflow.domino.environment_id': '64511a16d4d715414e9d82ef',
    'mlflow.source.type': 'NOTEBOOK',
    'domino.project': 'tempest-project432_1683038220',
    'mlflow.domino.run_number': '1',
    'mlflow.domino.environment_revision_id': '64511a16d4d715414e9d82f3',
    'mlflow.domino.project_id': '6451200c6de24f0a2f67ed8a',
    'mlflow.domino.hardware_tier': 'small-k8s',
    'mlflow.user': 'integration-test',
    'mlflow.domino.project': 'tempest-project432_1683038220'
  },
  createdAt: '2023-05-02T17:18:12.413Z',
  updatedAt: '2023-05-03T15:15:58.613Z',
  reviewSummary: mockReviewSummary
};

export const mockRegisteredModelVersion: ModelVersionsDto = {
  items: [{
    modelName: 'model',
    modelVersion: 1,
    experimentRunId: '6f8ce4fa083546fb81c133877ccb0c2d',
    project: {
      id: '6451200c6de24f0a2f67ed8a',
      name: 'tempest-project432_1683038220',
      ownerUsername: 'practitioner432'
    },
    ownerUsername: 'integration-test',
    createdAt: '2023-05-02T17:18:12.413Z',
    updatedAt: '2023-05-03T15:15:58.613Z'
  }],
  metadata:  {
    requestId: '10098',
    notices: ['123', '345'],
    offset: 10,
    limit: 10,
    totalCount: 10
  }
}

export const mockModelVersion: ModelVersionDto = {
  modelName: 'model',
  modelVersion: 1,
  modelVersionDescription: 'This model version is a scikit-learn random forest containing 100 decision trees',
  experimentRunId: '6f8ce4fa083546fb81c133877ccb0c2d',
  ownerUsername: 'integration-test',
  currentStage: 'None',
  project: {
    id: '6451200c6de24f0a2f67ed8a',
    name: 'tempest-project432_1683038220',
    ownerUsername: 'practitioner432'
  },
  tags: {
    'mlflow.domino.user_id': '6451223c96c55990b1ae1656',
    'mlflow.domino.run_id': '6451418ff3187b1275e38a2b',
    'mlflow.domino.user': 'integration-test',
    'mlflow.domino.dataset_info': 'unknown',
    'mlflow.domino.project_name': 'tempest-project432_1683038220',
    'mlflow.domino.environment_id': '64511a16d4d715414e9d82ef',
    'mlflow.source.type': 'NOTEBOOK',
    'domino.project': 'tempest-project432_1683038220',
    'mlflow.domino.run_number': '1',
    'mlflow.domino.environment_revision_id': '64511a16d4d715414e9d82f3',
    'mlflow.domino.project_id': '6451200c6de24f0a2f67ed8a',
    'mlflow.domino.hardware_tier': 'small-k8s',
    'mlflow.user': 'integration-test',
    'mlflow.domino.project': 'tempest-project432_1683038220'
  },
  createdAt: '2023-05-02T17:18:12.413Z',
  updatedAt: '2023-05-03T15:15:58.613Z'
};

export const mockRun: Run = {
  'info': {
    'experiment_id': '75',
    'run_name': 'adaptable-shrike-267',
    'user_id': 'ubuntu',
    'status': RunStatus.FINISHED,
    'start_time': 1680158731306,
    'end_time': 1680158740134,
    'artifact_uri': 'mlflow-artifacts:/mlflow/6b17961b804840d899dbdb882ad2237a/artifacts',
    'lifecycle_stage': LifecycleStage.ACTIVE,
    'run_id': '6b17961b804840d899dbdb882ad2237a'
  },
  'data': {
    'metrics': [
      {
          'key': 'val_accuracy',
          'value': 0.931566476821899,
          'timestamp': 1680134177805,
          'step': 3
      },
      {
          'key': 'val_loss',
          'value': 0.222702369093895,
          'timestamp': 1680134177652,
          'step': 3
      }
  ],
    'params': [
      {
        'key': 'epochs',
        'value': '50'
      },
      {
        'key': 'batch_size',
        'value': '16'
      }
    ],
    'tags': [
      {
        'key': 'mlflow.user',
        'value': 'integration-test'
      },
      {
        'key': 'mlflow.source.name',
        'value': sourceFileName
      },
      {
        'key': 'mlflow.source.type',
        'value': 'JOB'
      },
      {
        'key': 'mlflow.domino.user',
        'value': 'integration-test'
      },
      {
        'key': 'mlflow.domino.project_id',
        'value': '63dcaed9ab88e114037d94cc'
      },
      {
        'key': 'domino.project',
        'value': 'quick-start'
      },
      {
        'key': 'mlflow.domino.project',
        'value': 'quick-start'
      },
      {
        'key': 'mlflow.domino.project_name',
        'value': 'quick-start'
      },
      {
        'key': 'mlflow.domino.run_id',
        'value': '64252fe651253e0e0208410f'
      },
      {
        'key': 'mlflow.domino.hardware_tier',
        'value': 'small-k8s'
      },
      {
        'key': 'mlflow.domino.environment_id',
        'value': '63dca76487b1bc30d1730025'
      },
      {
        'key': 'mlflow.domino.environment_revision_id',
        'value': '6423002137f5b612f55a862f'
      },
      {
        'key': 'mlflow.domino.run_number',
        'value': '71'
      },
      {
        'key': 'mlflow.domino.dataset_info',
        'value': '63dcaedeab88e114037d94d1-63dcaedeab88e114037d94d0,6401283ae524bf5ae245f233-6401283ae524bf5ae245f232'
      },
      {
        'key': 'mlflow.runName',
        'value': 'adaptable-shrike-267'
      },
      {
        'key': 'project',
        'value': 'ML Flow Testing'
      },
      {
        'key': 'user',
        'value': 'John'
      }
    ]
  }
};

export const mockModelStages: ModelStages = {
  'items': [
    {
      'label': 'staging'
    },
    {
      'label': 'production'
    },
    {
      'label': 'archived'
    }
  ],
  'metadata': {
    'requestId': 'e942641c-5051-4ad5-8b4c-26211918dce9',
    'notices': [
      'Beta endpoint with known limitations'
    ]
  }
}

export const mockProjectSummary: DominoProjectsApiProjectSummary = {
  'id': '6451200c6de24f0a2f67ed8a',
  'name': 'tempest-project432_1683038220',
  'description': 'project created by post_project.py locust file',
  'visibility': 'Private',
  'ownerId': '64511ed6213d166d6a7c8455',
  'ownerUsername': 'practitioner432',
  'importedGitRepositories': [],
  'collaboratorIds': [
    '64511e6c213d166d6a7c80fa',
    '64511e6e213d166d6a7c8105',
    '64511e72213d166d6a7c8128'
  ],
  'collaborators': [
    {
      'collaboratorId': '64511e6c213d166d6a7c80fa',
      'projectRole': 'Contributor'
    },
    {
      'collaboratorId': '64511e6e213d166d6a7c8105',
      'projectRole': 'Contributor'
    },
    {
      'collaboratorId': '64511e72213d166d6a7c8128',
      'projectRole': 'Contributor'
    }
  ],
  'tags': [],
  'stageId': '645119cf82f8477046ea7fd9',
  'status': {
    'status': 'active',
    'isBlocked': false
  }
}

export const mockUsers:DominoCommonUserPerson[] = [
  {
    avatarUrl: '',
    email: 'test-notifs+integration-test@dominodatalab.com',
    firstName: 'integration-test',
    fullName: 'integration-test Testuser',
    id: '5e7e6a95fe3cf1077d3b6b6d',
    lastName: 'Testuser',
    userName: 'integration-test',
  },
  {
    avatarUrl: '',
    email: 'test-notifs+integration-test2@dominodatalab.com',
    firstName: 'integration-test2',
    fullName: 'integration-test2 Testuser',
    id: '5e7e6a95fe3cf1077d3b6b3d',
    lastName: 'Testuser2',
    userName: 'integration-test2',
  }
];
