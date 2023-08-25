import * as React from 'react';
import { getPrincipal } from '@domino/api/dist/Auth';
import {
  DominoNucleusLibAuthPrincipalWithFeatureFlags as PrincipalWithFeatureFlags,
} from '@domino/api/dist/types';
import DataFetcher from '../utils/DataFetcher';

const dataGetter = (principal: PrincipalWithFeatureFlags): Result => ({ principal });

export type Result = { principal?: PrincipalWithFeatureFlags };
const PrincipalDataFetcher: new() => DataFetcher<{}, Result> = DataFetcher as any;

export type ChildProps<OuterProps> = OuterProps & Result;

function WithPrincipalFetching<OuterProps>(
   Component: React.FunctionComponent<ChildProps<OuterProps>> | React.ComponentClass<ChildProps<OuterProps>>,
): React.FunctionComponent<OuterProps> {
  return props => (
    <PrincipalDataFetcher
      initialChildState={{}}
      dataGetter={dataGetter}
      fetchData={getPrincipal}
    >
      {({ principal }: Result) => (
        <Component {...props} principal={principal} />
      )}
    </PrincipalDataFetcher>
  );
}

export default WithPrincipalFetching;
