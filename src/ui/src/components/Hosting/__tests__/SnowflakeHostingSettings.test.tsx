import * as React from 'react';
import { render } from '@testing-library/react';
import SnowflakeHostingSettings from '../SnowflakeHostingSettings';

const props = {
  udfName: "udfName",
  hostUrl: "hostUrl",
  warehouseName: "warehouseName",
  databaseName: "databaseName",
  stage: "stage",
  schema: "schema",
};

describe('Snowflake Hosting Settings', () => {
  describe('render()', () => {
    it('should render', () => {
      const { container } = render(<SnowflakeHostingSettings {...props}/>);
      expect(!!container).toBe(true);
    });
  });
});
