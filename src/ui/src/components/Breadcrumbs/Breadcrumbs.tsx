import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
// eslint-disable-next-line no-restricted-imports
import { Breadcrumb as AntBreadcrumb } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import { basicLink } from '../../styled/colors';
import { SMALL } from '../../styled/fontSizes';
import Link from '../Link/Link';

export interface Props {
  /**
   * The list of breadcrumbs leading to the current view
   */
  routes?: Route[];
}

const StyledBreadcrumb = styled(AntBreadcrumb)`
  .ant-breadcrumb-link a {
    color: ${basicLink};
    font-size: ${SMALL};
    &:hover {
      text-decoration: none;
    }
  }
`;

const renderCrumb = (route: Route, params: any, routes: any, paths: any) => {
  const isLastItem = R.equals(routes.indexOf(route), routes.length - 1);
  return isLastItem ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link href={route.path}>{route.breadcrumbName}</Link>
  )
}

const Breadcrumbs = (props: Props) => (
  <StyledBreadcrumb itemRender={renderCrumb} routes={props.routes} />
);

export { Route };
export default Breadcrumbs;
