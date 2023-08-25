import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { jobsDashboardBase } from '../core/routes';

type Component = any;

type RouteProps = {
  ChildComponent: Component;
};

const JobsDashboardRoute = ({
    ChildComponent,
    ...rest
  }: RouteProps) => (
  <Route
    exact={false}
    path={jobsDashboardBase()}
    render={(routeProps: any) => (
      <ChildComponent {...routeProps} {...rest} />
    )}
  />
);

const withBrowserRouter = (component: Component) => (props: any) => (
  <BrowserRouter>
    <JobsDashboardRoute {...props} ChildComponent={component} />
  </BrowserRouter>
);

export {
  RouteProps,
  Component,
  JobsDashboardRoute,
  withBrowserRouter,
};

export default withBrowserRouter;
