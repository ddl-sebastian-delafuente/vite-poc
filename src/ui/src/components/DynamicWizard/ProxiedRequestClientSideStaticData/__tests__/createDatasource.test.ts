/**
 * @jest-environment node
 **/
import { 
  AdminProfile,
  makeMocks,
  MakeMocksReturn
} from '@domino/test-utils/dist/mock-manager';
import { DataSourceConfigMap } from '@domino/test-utils/dist/mock-usecases';
import {
  AuthenticationType,
  CredentialType,
  DataSourceType,
  EngineType,
} from '../../../../data/data-sources/CommonData';
import {
  BannerType
} from '../../../DynamicField';
import { 
  runWorkflowMetaDataTests,
  runWorkflowStepTests,
} from '../../__tests__/proxiedDynamicWizardApi.test';
import { 
  MetaRequestObject,
  RequestDataObject,
} from '../../proxiedDynamicWizardApiCalls.types';
import {
  getWorkflowMetadata,
  getWorkflowStep,
  WORKFLOW,
} from '../../proxiedDynamicWizardApiCalls';
import { CREATE_DATASOURCE_STEP } from '../createDatasource';

let mocks: MakeMocksReturn;
beforeAll(() => {
  mocks = makeMocks();

  mocks.loadProfile(AdminProfile);
})

afterEach(() => {
  mocks.clear();
});
afterAll(() => {
  mocks.unmock();
});

const Expected = {
  AuthStepMetaWithNextButton: expect.objectContaining({
    steps: expect.arrayContaining([
      expect.objectContaining({ 
        id: CREATE_DATASOURCE_STEP.authentication,
        nextButtonText: undefined
      }),
    ])
  }),
  AuthStepMetaWithSkipButton: expect.objectContaining({
    steps: expect.arrayContaining([
      expect.objectContaining({ 
        id: CREATE_DATASOURCE_STEP.authentication,
        nextButtonText: 'Skip for now'
      }),
    ])
  }),
  AuthStepMetaWithTestCredentialsButton: expect.objectContaining({
    steps: expect.arrayContaining([
      expect.objectContaining({ 
        id: CREATE_DATASOURCE_STEP.authentication,
        nextButtonText: 'Test Credentials'
      }),
    ])
  }),
}

let metadata: MetaRequestObject = {};
const requestData: RequestDataObject = {};

describe('Create Data Source', () => {
  describe('Admin Page', () => {
    metadata = {
      isAdminPage: true,
      isAdminUser: true,
    };
    
    it('Should display 4 steps when hybrid is disabled', async () => {
      const response = await getWorkflowMetadata(WORKFLOW.createDataSource, {}, { isAdminPage: true, isAdminUser: true });

      expect(response).toEqual(
        expect.objectContaining({
          steps: [
            expect.objectContaining({ id: 'Configure' }),
            expect.objectContaining({ id: 'Credentials' }),
            expect.objectContaining({ id: 'Authenticate' }),
            expect.objectContaining({ id: 'Permissions' }),
          ]
        })
      );
    });
    
    it('Should display 5 steps when hybrid is enabled', async () => {
      const response = await getWorkflowMetadata(WORKFLOW.createDataSource, {}, { flags: { hybridEnabled: true }, isAdminPage: true, isAdminUser: true });

      expect(response).toEqual(
        expect.objectContaining({
          steps: [
            expect.objectContaining({ id: 'Configure' }),
            expect.objectContaining({ id: 'Credentials' }),
            expect.objectContaining({ id: 'Authenticate' }),
            expect.objectContaining({ id: 'Permissions' }),
            expect.objectContaining({ id: 'Dataplanes' }),
          ]
        })
      );
    });

    describe('Configure Step', () => {
      runWorkflowStepTests([
        [
          'Should only display a select dropdown if no datasource type is selected', 
          expect.objectContaining({
            layout: expect.objectContaining({
              elements: [
                expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
              ]
            })
          }),
          {}, {}
        ]
      ], CREATE_DATASOURCE_STEP.configure, { ...requestData }, { ...metadata });

      Object.keys(DataSourceType).map((dataSourceType) => {
        const engineType = DataSourceConfigMap[dataSourceType].engineType as string;

        describe(dataSourceType, () => {
          switch(dataSourceType) {
            case DataSourceType.ADLSConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'accountName' }),
                        expect.objectContaining({ path: 'bucket' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.BigQueryConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'project' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.GCSConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'bucket' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.GenericS3Config:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'bucket' }),
                        expect.objectContaining({ path: 'host' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.MySQLConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'host' }),
                        expect.objectContaining({ path: 'port' }),
                        expect.objectContaining({ path: 'database' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.OracleConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'host' }),
                        expect.objectContaining({ path: 'port' }),
                        expect.objectContaining({ path: 'database' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.PostgreSQLConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'host' }),
                        expect.objectContaining({ path: 'port' }),
                        expect.objectContaining({ path: 'database' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.RedshiftConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'host' }),
                        expect.objectContaining({ path: 'port' }),
                        expect.objectContaining({ path: 'database' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.S3Config:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'bucket' }),
                        expect.objectContaining({ path: 'region' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.SQLServerConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'host' }),
                        expect.objectContaining({ path: 'port' }),
                        expect.objectContaining({ path: 'database' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.SnowflakeConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'accountName' }),
                        expect.objectContaining({
                          elements: [
                            expect.objectContaining({ path: 'database' }),
                            expect.objectContaining({ path: 'warehouse' }),
                          ]
                        }),
                        expect.objectContaining({
                          elements: [
                            expect.objectContaining({ path: 'schema' }),
                            expect.objectContaining({ path: 'role' }),
                          ]
                        }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.TabularS3GlueConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'accountID' }),
                        expect.objectContaining({ path: 'database' }),
                        expect.objectContaining({ path: 'region' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.TeradataConfig:
              runWorkflowStepTests([
                [
                  'Should return correct fields for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'host' }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            case DataSourceType.TrinoConfig:
              runWorkflowStepTests([
                [
                  'Should return the correct field for datasource type',
                  expect.objectContaining({
                    layout: expect.objectContaining({
                      elements: [
                        expect.objectContaining({ fieldType: 'select', path: 'dataSourceType' }),
                        expect.objectContaining({ path: 'host' }),
                        expect.objectContaining({ path: 'port' }),
                        expect.objectContaining({
                          elements: [
                            expect.objectContaining({ path: 'catalog' }),
                            expect.objectContaining({ path: 'schema' }),
                          ]
                        }),
                        expect.objectContaining({ path: 'name' }),
                        expect.objectContaining({ fieldType: 'textarea', path: 'description' }),
                        expect.objectContaining({ fieldType: 'hidden', path: 'engineType' }),
                      ]
                    })
                  }),
                  {}, {}
                ]
              ], CREATE_DATASOURCE_STEP.configure, { ...requestData, dataSourceType, engineType }, { ...metadata });
              break;
            default:
              it.todo('Should have tests for this datasource type');
          }
        });
      });
    });

    describe('Credential Step', () => {
      runWorkflowStepTests([
        [
          'Should display correct fields',
          expect.objectContaining({
            layout: expect.objectContaining({
              elements: [
                expect.objectContaining({ fieldType: 'title' }),
                expect.objectContaining({ fieldType: 'textblock' }),
                expect.objectContaining({ fieldType: 'radio' }),
              ]
            })
          }),
          {}, {}
        ],
      ], CREATE_DATASOURCE_STEP.credentials, { ...requestData }, { ...metadata })
    });

    describe('Authenticate Step', () => {
      describe('Individual Credentials', () => {
        requestData.credentialType = CredentialType.Individual;

        runWorkflowMetaDataTests([
          ['AWS IAM Basic should have a skip button with Domino Engine Type', Expected.AuthStepMetaWithSkipButton, { authType: AuthenticationType.AWSIAMBasic, engineType: EngineType.Domino }, {}],
          ['AWS IAM Basic should have a next button with Starburst Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.AWSIAMBasic, engineType: EngineType.Starburst }, {}],
          ['AWS IAM Role With Username should have a skip button with Domino Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.AWSIAMRoleWithUsername, engineType: EngineType.Domino }, {}],
          ['Azure Basic should have a skip button with Domino Engine Type', Expected.AuthStepMetaWithSkipButton, { authType: AuthenticationType.AzureBasic, engineType: EngineType.Domino }, {}],
          ['Basic should have a skip button with Domino Engine Type', Expected.AuthStepMetaWithSkipButton, { authType: AuthenticationType.Basic, engineType: EngineType.Domino }, {}],
          ['Basic should have a next button with Starburst Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.Basic, engineType: EngineType.Starburst }, {}],
          ['GCP Basic should have a skip button with Domino Engine Type', Expected.AuthStepMetaWithSkipButton, { authType: AuthenticationType.GCPBasic, engineType: EngineType.Domino }, {}],
          ['OAuth should have a next button with Domino Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.OAuth, engineType: EngineType.Domino }, {}],
        ], { ...requestData }, { ...metadata });

        Object.keys(DataSourceType).map((dataSourceType) => {
          const engineType = DataSourceConfigMap[dataSourceType].engineType as string;

          describe(dataSourceType, () => {
            switch(dataSourceType) {
              case DataSourceType.ADLSConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKey' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.BigQueryConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'privateKey' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'privateKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.GCSConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'privateKey' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'privateKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.GenericS3Config:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.MySQLConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.Basic }, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.Basic }, { validated: true }
                  ],
                  [
                    'Should display correct fields for datasource type when AWS IAM Role with Username is selected',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.AWSIAMRoleWithUsername }),
                          expect.objectContaining({ path: 'username' }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.AWSIAMRoleWithUsername }, {}
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.OracleConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.PostgreSQLConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                  [
                    'Should display correct fields for datasource type when AWS IAM Role with Username is Selected',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.AWSIAMRoleWithUsername }),
                          expect.objectContaining({ path: 'username' }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.AWSIAMRoleWithUsername }, {}
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.RedshiftConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                  [
                    'Should display correct fields for datasource type when AWS IAM Role with Username is selected',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.AWSIAMRoleWithUsername }),
                          expect.objectContaining({ path: 'username' }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.AWSIAMRoleWithUsername }, {}
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.S3Config:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.SQLServerConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.SnowflakeConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.OAuth }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type when Basic is selected',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.Basic }, {}
                  ],
                  [
                    'Should display correct fields for datasource type when Basic is selected after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.Basic }, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.TabularS3GlueConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.TeradataConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.TrinoConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'button' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after successful validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              default:
                it.todo('Should have tests for this datasource type');
            }
          });
        });
      });

      describe('Service Accounts', () => {
        requestData.credentialType = CredentialType.Shared;

        runWorkflowMetaDataTests([
          ['AWS IAM Basic should have a test credentials button with Domino Engine Type', Expected.AuthStepMetaWithTestCredentialsButton, { authType: AuthenticationType.AWSIAMBasic, engineType: EngineType.Domino }, {}],
          ['AWS IAM Basic should have a next button with Starburst Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.AWSIAMBasic, engineType: EngineType.Starburst }, {}],
          ['Azure Basic should have a test credentials button with Domino Engine Type', Expected.AuthStepMetaWithTestCredentialsButton, { authType: AuthenticationType.AzureBasic, engineType: EngineType.Domino }, {}],
          ['Basic should have a test credentials button with Domino Engine Type', Expected.AuthStepMetaWithTestCredentialsButton, { authType: AuthenticationType.Basic, engineType: EngineType.Domino }, {}],
          ['Basic should have a next button with Starburst Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.Basic, engineType: EngineType.Starburst }, {}],
          ['GCP Basic should have a test credentials button with Domino Engine Type', Expected.AuthStepMetaWithTestCredentialsButton, { authType: AuthenticationType.GCPBasic, engineType: EngineType.Domino }, {}],
        ], { ...requestData }, { ...metadata });

        Object.keys(DataSourceType).map((dataSourceType) => {
          const engineType = DataSourceConfigMap[dataSourceType].engineType as string;

          describe(dataSourceType, () => {
            switch(dataSourceType) {
              case DataSourceType.ADLSConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata });
                break;
              case DataSourceType.BigQueryConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'privateKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'privateKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.GCSConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'privateKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'privateKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.GenericS3Config:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.MySQLConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.OracleConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.PostgreSQLConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.RedshiftConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.S3Config:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.SQLServerConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.SnowflakeConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.TabularS3GlueConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.TeradataConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.TrinoConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Warning }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation success',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              default:
                it.todo('Should have tests for this datasource type');
            }
          });
        });
      });
    });
  });

  describe('Regular Page', () => {
    metadata.isAdminPage = false;
    metadata.isAdminUser = false;

    it('Should display 3 steps', async () => {
      const response = await getWorkflowMetadata(WORKFLOW.createDataSource, {}, { ...metadata });

      expect(response).toEqual(
        expect.objectContaining({
          steps: [
            expect.objectContaining({ id: 'Configure' }),
            expect.objectContaining({ id: 'Authenticate' }),
            expect.objectContaining({ id: 'Permissions' }),
          ]
        })
      );
    });

    describe('Authenticate Step', () => {
      it('Should return the correct fields even if being passed a incompatable authType', async () => {
        const response = await getWorkflowStep(WORKFLOW.createDataSource, CREATE_DATASOURCE_STEP.authentication, {
          authType: AuthenticationType.Basic,
          credentialType: CredentialType.Individual,
          dataSourceType: DataSourceType.BigQueryConfig,
        });

        expect(response).toEqual(
          expect.objectContaining({
            layout: expect.objectContaining({
              elements: [
                expect.objectContaining({ fieldType: 'title' }),
                expect.objectContaining({ fieldType: 'textblock' }),
                expect.objectContaining({ fieldType: 'hidden' }),
                expect.objectContaining({ fieldType: 'banner' }),
                expect.objectContaining({ path: 'privateKey' })
              ]
            })
          })
        );
      });
      
      it('Should return the correct fields even if being passed a invalid authType', async () => {
        const response = await getWorkflowStep(WORKFLOW.createDataSource, CREATE_DATASOURCE_STEP.authentication, {
          authType: 'bad-auth-type',
          credentialType: CredentialType.Individual,
          dataSourceType: DataSourceType.BigQueryConfig,
        });

        expect(response).toEqual(
          expect.objectContaining({
            layout: expect.objectContaining({
              elements: [
                expect.objectContaining({ fieldType: 'title' }),
                expect.objectContaining({ fieldType: 'textblock' }),
                expect.objectContaining({ fieldType: 'hidden' }),
                expect.objectContaining({ fieldType: 'banner' }),
                expect.objectContaining({ path: 'privateKey' })
              ]
            })
          })
        );
      });

      describe('Individual Credentials', () => {
        requestData.credentialType = CredentialType.Individual;

        runWorkflowMetaDataTests([
          ['AWS IAM Basic should have a test credentials button with Domino Engine Type', Expected.AuthStepMetaWithTestCredentialsButton, { authType: AuthenticationType.AWSIAMBasic, engineType: EngineType.Domino }, {}],
          ['AWS IAM Basic should have a next button with Starburst Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.AWSIAMBasic, engineType: EngineType.Starburst }, {}],
          ['AWS IAM Role With Username should have a next button with Domino Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.AWSIAMRoleWithUsername, engineType: EngineType.Domino }, {}],
          ['Azure Basic should have a test credentials button with Domino Engine Type', Expected.AuthStepMetaWithTestCredentialsButton, { authType: AuthenticationType.AzureBasic, engineType: EngineType.Domino }, {}],
          ['Basic should have a test credentials button with Domino Engine Type', Expected.AuthStepMetaWithTestCredentialsButton, { authType: AuthenticationType.Basic, engineType: EngineType.Domino }, {}],
          ['Basic should have a next button with Starburst Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.Basic, engineType: EngineType.Starburst }, {}],
          ['GCP Basic should have a test credentials button with Domino Engine Type', Expected.AuthStepMetaWithTestCredentialsButton, { authType: AuthenticationType.GCPBasic, engineType: EngineType.Domino }, {}],
          ['OAuth should have a next button with Domino Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.OAuth, engineType: EngineType.Domino }, {}],
        ], { ...requestData }, { ...metadata });

        Object.keys(DataSourceType).map((dataSourceType) => {
          const engineType = DataSourceConfigMap[dataSourceType].engineType as string;

          describe(dataSourceType, () => {
            switch(dataSourceType) {
              case DataSourceType.ADLSConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'accessKey' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'accessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ]
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.BigQueryConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'privateKey' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'privateKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ]
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.GCSConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'privateKey' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'privateKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ]
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.GenericS3Config:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ]
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.MySQLConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                  [
                    'Should display correct fields for datasource type when AWS IAM Role with Username is selected',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.AWSIAMRoleWithUsername }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.AWSIAMRoleWithUsername }, {}
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.OracleConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.PostgreSQLConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                  [
                    'Should display correct fields for datasource type when AWS IAM Role with Username is selected',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.AWSIAMRoleWithUsername }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.AWSIAMRoleWithUsername }, {}
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.RedshiftConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                  [
                    'Should display correct fields for datasource type when AWS IAM Role with Username is selected',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.AWSIAMRoleWithUsername }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.AWSIAMRoleWithUsername }, {}
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.S3Config:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ]
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.SQLServerConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.SnowflakeConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type when AWS IAM Role with Username is selected',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.OAuth }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.AWSIAMRoleWithUsername }, {}
                  ],
                  [
                    'Should display correct fields for datasource type when Basic is selected',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.Basic }, {}
                  ],
                  [
                    'Should display correct fields for datasource type when Basic is selected after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    { authType: AuthenticationType.Basic }, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.TabularS3GlueConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'accessKeyID' }),
                          expect.objectContaining({ path: 'secretAccessKey' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.TeradataConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              case DataSourceType.TrinoConfig:
                runWorkflowStepTests([
                  [
                    'Should display correct fields for datasource type',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                        ]
                      })
                    }),
                    {}, {}
                  ],
                  [
                    'Should display correct fields for datasource type after validation',
                    expect.objectContaining({
                      layout: expect.objectContaining({
                        elements: [
                          expect.objectContaining({ fieldType: 'title' }),
                          expect.objectContaining({ fieldType: 'textblock' }),
                          expect.objectContaining({ fieldType: 'hidden' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Info }),
                          expect.objectContaining({ path: 'username' }),
                          expect.objectContaining({ path: 'password' }),
                          expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                        ]
                      })
                    }),
                    {}, { validated: true }
                  ],
                ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                break;
              default:
                it.todo('Should have tests for this datasource type');
            }
          });
        });
      });
    })

    describe('Admin users', () => {
      metadata.isAdminUser = true;

      describe('Authenticate Step', () => {
        describe('Individual Credentials', () => {
          requestData.credentialType = CredentialType.Individual;

          runWorkflowMetaDataTests([
            ['AWS IAM Basic should have a skip button with Domino Engine Type', Expected.AuthStepMetaWithSkipButton, { authType: AuthenticationType.AWSIAMBasic, engineType: EngineType.Domino }, {}],
            ['AWS IAM Basic should have a next button with Starburst Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.AWSIAMBasic, engineType: EngineType.Starburst }, {}],
            ['AWS IAM Role With Username should have a skip button with Domino Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.AWSIAMRoleWithUsername, engineType: EngineType.Domino }, {}],
            ['Azure Basic should have a skip button with Domino Engine Type', Expected.AuthStepMetaWithSkipButton, { authType: AuthenticationType.AzureBasic, engineType: EngineType.Domino }, {}],
            ['Basic should have a skip button with Domino Engine Type', Expected.AuthStepMetaWithSkipButton, { authType: AuthenticationType.Basic, engineType: EngineType.Domino }, {}],
            ['Basic should have a next button with Starburst Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.Basic, engineType: EngineType.Starburst }, {}],
            ['GCP Basic should have a skip button with Domino Engine Type', Expected.AuthStepMetaWithSkipButton, { authType: AuthenticationType.GCPBasic, engineType: EngineType.Domino }, {}],
            ['OAuth should have a next button with Domino Engine Type', Expected.AuthStepMetaWithNextButton, { authType: AuthenticationType.OAuth, engineType: EngineType.Domino }, {}],
          ], { ...requestData }, { ...metadata });

          Object.keys(DataSourceType).map((dataSourceType) => {
            const engineType = DataSourceConfigMap[dataSourceType].engineType as string;

            describe(dataSourceType, () => {
              switch(dataSourceType) {
                case DataSourceType.ADLSConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'accessKey' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'accessKey' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ]
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.BigQueryConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'privateKey' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'privateKey' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ]
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.GCSConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'privateKey' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'privateKey' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ]
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.GenericS3Config:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'accessKeyID' }),
                            expect.objectContaining({ path: 'secretAccessKey' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'accessKeyID' }),
                            expect.objectContaining({ path: 'secretAccessKey' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ]
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.MySQLConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ],
                    [
                      'Should display correct fields for datasource type when AWS IAM Role with Username is selected',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.AWSIAMRoleWithUsername }),
                            expect.objectContaining({ path: 'username' }),
                          ]
                        })
                      }),
                      { authType: AuthenticationType.AWSIAMRoleWithUsername }, {}
                    ],
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.OracleConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ],
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.PostgreSQLConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ],
                    [
                      'Should display correct fields for datasource type when AWS IAM Role with Username is selected',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.AWSIAMRoleWithUsername }),
                            expect.objectContaining({ path: 'username' }),
                          ]
                        })
                      }),
                      { authType: AuthenticationType.AWSIAMRoleWithUsername }, {}
                    ],
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.RedshiftConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ],
                    [
                      'Should display correct fields for datasource type when AWS IAM Role with Username is selected',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.AWSIAMRoleWithUsername }),
                            expect.objectContaining({ path: 'username' }),
                          ]
                        })
                      }),
                      { authType: AuthenticationType.AWSIAMRoleWithUsername }, {}
                    ],
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.S3Config:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'accessKeyID' }),
                            expect.objectContaining({ path: 'secretAccessKey' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'accessKeyID' }),
                            expect.objectContaining({ path: 'secretAccessKey' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ]
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.SQLServerConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ],
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.SnowflakeConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.OAuth }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type when Basic is selected',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      { authType: AuthenticationType.Basic }, {}
                    ],
                    [
                      'Should display correct fields for datasource type when Basic is selected after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'radio', path: 'authType', defaultValue: AuthenticationType.Basic }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      { authType: AuthenticationType.Basic }, { validated: true }
                    ],
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.TabularS3GlueConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'accessKeyID' }),
                            expect.objectContaining({ path: 'secretAccessKey' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.TeradataConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                case DataSourceType.TrinoConfig:
                  runWorkflowStepTests([
                    [
                      'Should display correct fields for datasource type',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'button' }),
                          ]
                        })
                      }),
                      {}, {}
                    ],
                    [
                      'Should display correct fields for datasource type after validation',
                      expect.objectContaining({
                        layout: expect.objectContaining({
                          elements: [
                            expect.objectContaining({ fieldType: 'title' }),
                            expect.objectContaining({ fieldType: 'textblock' }),
                            expect.objectContaining({ fieldType: 'hidden' }),
                            expect.objectContaining({ path: 'username' }),
                            expect.objectContaining({ path: 'password' }),
                            expect.objectContaining({ fieldType: 'banner', bannerType: BannerType.Success }),
                          ]
                        })
                      }),
                      {}, { validated: true }
                    ],
                  ], CREATE_DATASOURCE_STEP.authentication, { ...requestData, dataSourceType, engineType }, { ...metadata })
                  break;
                default:
                  it.todo('Should have tests for this datasource type');
              }
            });
          });
        });
      });

      describe('Permissions step', () => {
        it('Should default to Everyone permissionType when credentialType is set to Individual', async () => {
          const response = await getWorkflowStep(WORKFLOW.createDataSource, CREATE_DATASOURCE_STEP.permissions, {
            credentialType: CredentialType.Individual,
          }, { ...metadata });

          expect(response).toEqual(
            expect.objectContaining({
              layout: expect.objectContaining({
                elements: expect.arrayContaining([
                  expect.objectContaining({ fieldType: 'radio', defaultValue: 'Everyone' }),
                  expect.objectContaining({ fieldType: 'hidden', path: 'isEveryone', defaultValue: false, }),
                ])
              })
            })
          );
        })
        
        it('Should default to Specific permissionType when credentialType is set to Shared', async () => {
          const response = await getWorkflowStep(WORKFLOW.createDataSource, CREATE_DATASOURCE_STEP.permissions, {
            credentialType: CredentialType.Shared,
          }, { ...metadata });

          expect(response).toEqual(
            expect.objectContaining({
              layout: expect.objectContaining({
                elements: expect.arrayContaining([
                  expect.objectContaining({ fieldType: 'radio', defaultValue: 'Specific' }),
                  expect.objectContaining({ fieldType: 'hidden', path: 'isEveryone', defaultValue: false, }),
                ])
              })
            })
          );
        })
      });
    })
  });
});
