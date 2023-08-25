import { 
  datasourceModelDatasourceConfigSnowflake
} from '@domino/test-utils/dist/mock-usecases';

import { DataSourceType } from '../../../data/data-sources/CommonData';
import { 
  DATASOURCE_CONFIG_SPECIFIC_FIELDS 
} from '../../DynamicWizard/ProxiedRequestClientSideStaticData/createDatasource';
import { 
  flattenLayoutElements,
  mergeLayoutAndFieldMap 
} from '../DynamicField.utils';

describe('Merging a layout with a field map', () => {
  it('Should merge field data into a layout', () => {
    const mockLayout = {
      elements: DATASOURCE_CONFIG_SPECIFIC_FIELDS[DataSourceType.SnowflakeConfig]
    }
    const result = mergeLayoutAndFieldMap(mockLayout, datasourceModelDatasourceConfigSnowflake.fields);

    expect(result).toEqual(expect.objectContaining({
      elements: expect.arrayContaining([
        expect.objectContaining({ regexp: expect.any(String), regexpError: expect.any(String) }),
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({ regexp: expect.any(String), regexpError: expect.any(String) }),
            expect.objectContaining({ regexp: expect.any(String), regexpError: expect.any(String) }),
          ])
        }),
        expect.objectContaining({
          elements: expect.arrayContaining([
            expect.objectContaining({ regexp: expect.any(String), regexpError: expect.any(String) }),
            expect.objectContaining({ regexp: expect.any(String), regexpError: expect.any(String) }),
          ])
        }),
      ])
    }));
  });
});

describe('Flattening a layout', () => {
  it('should flatten a nested layout', () => {
    const result = flattenLayoutElements(DATASOURCE_CONFIG_SPECIFIC_FIELDS[DataSourceType.SnowflakeConfig]);

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'accountName' }),
      expect.objectContaining({ path: 'database' }),
      expect.objectContaining({ path: 'warehouse' }),
      expect.objectContaining({ path: 'schema' }),
      expect.objectContaining({ path: 'role' }),
    ]));
  });
});
