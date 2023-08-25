// This component should not be re-used.
// It may appear abstract, but given how it is styled and structured,
// it is unlikely to function well in any other use case.

import * as React from 'react';
import { omit, map, addIndex, equals } from 'ramda';
import styled from 'styled-components';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

const TruncatingBreadCrumbContainer = styled.div`
  flex-grow: 1;
  min-width: 0px;
`;

export type Props = {
  parentStyles?: {};
  terminalStyles?: {};
  readOnly?: boolean;
  children?: (props: {}) => React.ReactNode;
  breadCrumbs: { url: string; label: string }[];
  shouldTruncate?: boolean;
  'data-test'?: string;
  multipleComputeClustersEnabled?: boolean;
};

const FilePathBreadCrumbs: React.FC<Props> = ({
  shouldTruncate = false, readOnly = false, children, breadCrumbs, ...rest
}) => {
  const hasChildren = !!children;
  const Container = shouldTruncate ? TruncatingBreadCrumbContainer : 'div';
  const mapIndexed = addIndex(map);
  const routes: Route[] = mapIndexed((breadCrumb: { url: string; label: string }, index: number) => {
    return (
      {
        path: breadCrumb.url,
        breadcrumbName: equals(index, breadCrumbs.length -1) ?  (
          hasChildren ? children!(omit(['data-test'], rest)) : breadCrumb.label)
          : breadCrumb.label
      }
    )
  }, breadCrumbs) as Route[];
  breadCrumbs.map(({url, label},id) => ({path: url, breadcrumbName: id === breadCrumbs.length -1 ? hasChildren ? children!(omit(['data-test'], rest)) : label : label})) as Route[];
  return (
    <Container data-test={rest['data-test']}>
      <Breadcrumbs routes={routes}/>
    </Container>
  );
};

export default FilePathBreadCrumbs;
