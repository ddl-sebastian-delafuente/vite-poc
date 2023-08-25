import { RouteComponentProps, WithRouterProps, WithRouterStatics } from 'react-router';
import * as dataManipulation from './dataManipulation/utils';
import * as microServiceHttpClient from './microServiceHttpClient/http';

type RouterType<P extends RouteComponentProps<any>, C extends React.ComponentType<P>>
  = React.ComponentClass<Omit<P, keyof RouteComponentProps<any>> & WithRouterProps<C>> & WithRouterStatics<C>;

type WithOptionalTheme<P extends { theme?: T }, T> = Omit<P, 'theme'> & {
  theme?: T;
};

type ThemeType<P extends { theme?: any }> = React.ForwardRefExoticComponent<WithOptionalTheme<P & { children?: React.ReactNode; }, any>>;

export {
  microServiceHttpClient,
  dataManipulation,
  RouterType,
  ThemeType,
};
