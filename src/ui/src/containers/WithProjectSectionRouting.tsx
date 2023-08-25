import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { projectBase } from '../core/routes';

type Component = any;

type RouteProps = {
  ChildComponent: Component;
};

const ProjectRoute = ({
    ChildComponent,
    ...rest
  }: RouteProps) => (
  <Route
    exact={false}
    path={projectBase()}
    render={(routeProps: any) => (
      <ChildComponent {...routeProps} {...rest} />
    )}
  />
);

const withBrowserRouter = (component: Component) => (props: any) => (
  <BrowserRouter>
    <ProjectRoute {...props} ChildComponent={component} />
  </BrowserRouter>
);

export {
  RouteProps,
  Component,
  ProjectRoute,
  withBrowserRouter,
};

export default withBrowserRouter;
