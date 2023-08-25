/**
 *  @jest-environment node
 **/
import {
  AdminProfile,
  makeMocks,
  MakeMocksReturn
} from '@domino/test-utils/dist/mock-manager';
import {
  MetaRequestObject,
  RequestDataObject,
} from '../proxiedDynamicWizardApiCalls.types';
import {
  getFieldOptions,
  getWorkflowMetadata,
  getWorkflowStep,
  WORKFLOW,
} from '../proxiedDynamicWizardApiCalls';

type TestRun = [ string, any, RequestDataObject, MetaRequestObject ];

export const runWorkflowMetaDataTests = (testRuns: TestRun[] = [], requestData: RequestDataObject, metadata: MetaRequestObject) => {
  testRuns.forEach((testRun) => {
    const [description, expected, additionalRequestData = {}, additionalMetadata = {}] = testRun;

    it(description, async () => {
      const response = await getWorkflowMetadata(WORKFLOW.createDataSource, {
        ...requestData,
        ...additionalRequestData,
      }, {
        ...metadata,
        ...additionalMetadata,
      });
      expect(response).toEqual(expected);
    })
  });
}
export const runWorkflowStepTests = (testRuns: TestRun[] = [], stepId: string, requestData: RequestDataObject, metadata: MetaRequestObject) => {
  testRuns.forEach((testRun) => {
    const [description, expected, additionalRequestData = {}, additionalMetadata = {}] = testRun;

    it(description, async () => {
      const response = await getWorkflowStep(WORKFLOW.createDataSource, stepId, {
        ...requestData,
        ...additionalRequestData,
      }, {
        ...metadata,
        ...additionalMetadata,
      });
      expect(response).toEqual(expected);
    })
  });
}


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

describe('Proxied API Calls', () => {
  describe('getFieldOptions', () => {
    it('should call the real api call when no arguments match', async () => {
      const result = await getFieldOptions('unmatched-field-id');
      expect(result).toEqual([]);
    });

    it.skip('should return a static list of datasource types', async () => {
      const result = await getFieldOptions('dataSourceType');
      expect(result).toEqual([
        expect.objectContaining({
          options: [
            expect.objectContaining({ label: 'ADLS' }),
            expect.objectContaining({ label: 'Big Query' }),
            expect.objectContaining({ label: 'DB2' }),
            expect.objectContaining({ label: 'GCS' }),
            expect.objectContaining({ label: 'Generic S3' }),
            expect.objectContaining({ label: 'MySQL' }),
            expect.objectContaining({ label: 'Oracle' }),
            expect.objectContaining({ label: 'PostgreSQL' }),
            expect.objectContaining({ label: 'Amazon Redshift' }),
            expect.objectContaining({ label: 'Amazon S3' }),
            expect.objectContaining({ label: 'SQL Server' }),
            expect.objectContaining({ label: 'Snowflake' }),
            expect.objectContaining({ label: 'Trino' }),
          ]
        }),
        expect.objectContaining({
          options: [
            expect.objectContaining({ label: 'MongoDB' }),
            expect.objectContaining({ label: 'Palantir' }),
            expect.objectContaining({ label: 'Tabular S3 with AWS Glue' }),
            expect.objectContaining({ label: 'Teradata' }),
          ]
        }),
        expect.objectContaining({
          options: [
            expect.objectContaining({ label: 'ClickHouse' }),
            expect.objectContaining({ label: 'Druid' }),
            expect.objectContaining({ label: 'Generic JDBC' }),
            expect.objectContaining({ label: 'Greenplum' }),
            expect.objectContaining({ label: 'Ignite' }),
            expect.objectContaining({ label: 'MariaDB' }),
            expect.objectContaining({ label: 'Netezza' }),
            expect.objectContaining({ label: 'SAPHana' }),
            expect.objectContaining({ label: 'SingleStore' }),
            expect.objectContaining({ label: 'Synapse' }),
            expect.objectContaining({ label: 'Vertica' }),
          ]
        }),
      ]);
    });
  });

  describe('getWorkflowMetadata', () => {
    it('should call the real api call when no arguments match', async () => {
      const result = await getWorkflowMetadata('unmatch-workflow-id', {}, { isAdminPage: true });
      expect(result).toEqual({ id: '', steps: [], title: '' });
    });

    it('should get static workflow metadata for create datasource workflow', async () => {
      const result = await(getWorkflowMetadata(WORKFLOW.createDataSource, {}, { isAdminPage: true }));

      expect(result).toEqual(
        expect.objectContaining({
          steps: expect.arrayContaining([
            expect.objectContaining({ title: 'Configure' }),
            expect.objectContaining({ title: 'Type' }),
            expect.objectContaining({ title: 'Authenticate' }),
            expect.objectContaining({ title: 'Permissions' }),
          ])
        })
      );
    });
  });
});
