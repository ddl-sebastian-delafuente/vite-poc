import { getAllDataSourcesResponse } from '@domino/test-utils/dist/mockResponses';

import { AuthenticationType } from '../CommonData';
import { 
  dataSourceOwnerSorter,
  doesAuthHaveRequiredFields,
} from '../utils';

describe('dataSourceOwnerSorter', () => {
  it('should sort data sources by owner', () => {
    const [ds1, ds2] = getAllDataSourcesResponse;
    const dataSources = getAllDataSourcesResponse.concat([
      {
        ...ds1,
        id: 'id3',
        ownerInfo: {
          ...ds1.ownerInfo,
          ownerName: 'Test Owner',
        }
      },
      {
        ...ds2,
        id: 'id4',
        ownerInfo: {
          ...ds2.ownerInfo,
          ownerName: 'Domino Owner',
        }
      },
    ]);

    dataSources.sort(dataSourceOwnerSorter);
    const ids = dataSources.map(({ id }) => id);
    expect(ids).toEqual(['test-snowflake-id-2', 'id4', 'test-snowflake-id-1', 'id3']);
  });
});

describe('Does Auth Have Required Fields', () => {
  describe(AuthenticationType.AWSIAMBasic, () => {
    it('Should return true when required fields are present', () => {
      expect(doesAuthHaveRequiredFields(AuthenticationType.AWSIAMBasic, 'username', 'password')).toBe(true);
    });
    
    it('Should return false when required fields are missing', () => {
      expect(doesAuthHaveRequiredFields(AuthenticationType.AWSIAMBasic, undefined, 'password')).toBe(false);
      expect(doesAuthHaveRequiredFields(AuthenticationType.AWSIAMBasic, 'username', undefined)).toBe(false);
      expect(doesAuthHaveRequiredFields(AuthenticationType.AWSIAMBasic)).toBe(false);
    });
  });
  
  describe(AuthenticationType.AWSIAMRoleWithUsername, () => {
    it('Should return true when required fields are present', () => {
      expect(doesAuthHaveRequiredFields(AuthenticationType.AWSIAMRoleWithUsername, 'username')).toBe(true);

    });
    
    it('Should return false when required fields are missing', () => {
      expect(doesAuthHaveRequiredFields(AuthenticationType.AWSIAMRoleWithUsername)).toBe(false);
    });
  });
  
  describe(AuthenticationType.AzureBasic, () => {
    it('Should return true when required fields are present', () => {
      expect(doesAuthHaveRequiredFields(AuthenticationType.AzureBasic, undefined, 'access-key')).toBe(true);

    });
    
    it('Should return false when required fields are missing', () => {
      expect(doesAuthHaveRequiredFields(AuthenticationType.AzureBasic)).toBe(false);
    });
  });
  
  describe(AuthenticationType.GCPBasic, () => {
    it('Should return true when required fields are present', () => {
      expect(doesAuthHaveRequiredFields(AuthenticationType.GCPBasic, undefined, 'acccess-key')).toBe(true);

    });
    
    it('Should return false when required fields are missing', () => {
      expect(doesAuthHaveRequiredFields(AuthenticationType.GCPBasic)).toBe(false);

    });
  });
  
  describe(AuthenticationType.Basic, () => {
    it('Should return true when required fields are present', () => {
      expect(doesAuthHaveRequiredFields(AuthenticationType.Basic, 'username', 'password')).toBe(true);
    });
    
    it('Should return false when required fields are missing', () => {
      expect(doesAuthHaveRequiredFields(AuthenticationType.Basic, undefined, 'password')).toBe(false);
      expect(doesAuthHaveRequiredFields(AuthenticationType.Basic, 'username', undefined)).toBe(false);
      expect(doesAuthHaveRequiredFields(AuthenticationType.Basic)).toBe(false);
    });
  });
});
