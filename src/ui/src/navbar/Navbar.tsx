import * as React from 'react';
import styled, {
  ThemeProviderProps,
  withTheme
} from 'styled-components';
import Primary from './Primary';
import ProjectSubNav from './projects/SubNav';
import SearchBar from './SearchBar';
import Search from './components/Search';
import { findMatchedRoute } from './routes';
import { ViewProps } from './types';
import {
  RouteComponentProps,
  withRouter
} from 'react-router';
import {
  cond,
  isNil,
  T
} from 'ramda';
import { mixpanel } from '../mixpanel';
import {
  getLocalStorageItem,
  LocalStorageItemKey,
  setLocalStorageItem
} from '../utils/localStorageService';
import { setIsNucleusApp } from '../core/environment';
import WhatsNewCarousel from '../components/Carousel/WhatsNewCarousel';
import '@domino/ui/dist/navbar/stylePrimaryNav.css';

console.log("seba")

const StyledContainer = styled.div`
  z-index: 500;
  display: flex;
  height: 100vh;
`;

const getSelectedItems = (pathname: string) => {
  const matchedRoute = findMatchedRoute(pathname);
  return matchedRoute ? matchedRoute.split('.') : [];
};

const shouldDisplaySubNav = (items: string[]): boolean => {
  return items[1] === 'PROJECTS' && items.length > 2;
};

const MainComponent = (props: EnhancedViewProps) => {
  const {
    location,
    pathnameOverride,
    username,
    userId,
    project,
    flags,
    toggleExpandSearch,
    togglePrimaryCollapsed,
    toggleSecondaryCollapsed,
    primaryCollapsed,
    secondaryCollapsed,
    updateProject,
    whiteLabelSettings,
    isSwitchToPopoverVisible,
    onSwitchToPopoverVisibilityChange,
    globalSocket,
    setGlobalSocket,
    currentUser,
    dmmLink,
    onError,
    isMixpanelOff,
  } = props;
  const matchedParts = getSelectedItems(pathnameOverride || location.pathname);
  const displaySubNav = shouldDisplaySubNav(matchedParts);

  return (
    <StyledContainer>
      { currentUser && !['/loggedout'].includes(location.pathname) &&
        !isNil(flags.hideWelcomeCarousel) && !flags.hideWelcomeCarousel &&
        <WhatsNewCarousel />
      }
      <Primary
        showToggle={!displaySubNav}
        username={username}
        selectedKeyPath={matchedParts}
        collapsed={displaySubNav || primaryCollapsed}
        toggleExpandSearch={toggleExpandSearch}
        toggleCollapsed={togglePrimaryCollapsed}
        flags={flags}
        whiteLabelSettings={whiteLabelSettings}
        isLoggedOutPage={location.pathname.indexOf('loggedout') > -1}
        isSwitchToPopoverVisible={isSwitchToPopoverVisible}
        onSwitchToPopoverVisibilityChange={onSwitchToPopoverVisibilityChange}
        currentUser={currentUser}
        dmmLink={dmmLink}
        isMixpanelOff={isMixpanelOff}
      />
      {
        displaySubNav ? (
          <ProjectSubNav
            enableSparkClusters={flags.enableSparkClusters}
            selectedKeyPath={matchedParts}
            collapsed={secondaryCollapsed}
            toggleCollapsed={toggleSecondaryCollapsed}
            project={project}
            updateProject={updateProject}
            flags={flags}
            username={username}
            userId={userId}
            projectStageAndStatus={props.projectStageAndStatus}
            updateProjectStageAndStatus={props.updateProjectStageAndStatus}
            areStagesStale={props.areStagesStale}
            setAreStagesStale={props.setAreStagesStale}
            enableExternalDataVolumes={flags.enableExternalDataVolumes}
            globalSocket={globalSocket}
            setGlobalSocket={setGlobalSocket}
            onError={onError}
            enableGitCredentialFlowForCollaborators={flags.enableGitCredentialFlowForCollaborators}
          />
        ) : ''
      }
    </StyledContainer>
  );
};

const _Navbar: React.FC<EnhancedViewProps> = cond([
  [({ expandSearch }) => expandSearch, ({ toggleExpandSearch, whiteLabelSettings }) => (
    <StyledContainer>
      <SearchBar toggleCollapsed={toggleExpandSearch} whiteLabelSettings={whiteLabelSettings}/>
      <Search dismissSearch={toggleExpandSearch} />
    </StyledContainer>
  )],
  [T, MainComponent]
]);

type StateProps = {
  primaryCollapsed: boolean;
  secondaryCollapsed: boolean;
  expandSearch: boolean;
  isSwitchToPopoverVisible: boolean;
};

type StateHandlerProps = {
  toggleExpandSearch: () => void;
  togglePrimaryCollapsed: () => void;
  toggleSecondaryCollapsed: () => void;
  onSwitchToPopoverVisibilityChange: (isVisible: boolean) => void;
};

export type ContainerProps = ViewProps & RouteComponentProps<never> & ThemeProviderProps<never>;

type EnhancedViewProps = ContainerProps & StateProps & StateHandlerProps;

const getCollapsedFromLocalStorage = (): boolean => {
  const stored = getLocalStorageItem(LocalStorageItemKey.IsSideNavClosed);
  return stored === 'true';
};

const NavbarContainer = (props: ContainerProps) => {

  const [primaryCollapsed, setPrimaryCollapsed] = React.useState<boolean>(getCollapsedFromLocalStorage());
  const [secondaryCollapsed, setSecondaryCollapsed] = React.useState<boolean>(getCollapsedFromLocalStorage());
  const [expandSearch, setExpandSearch] = React.useState<boolean>(false);
  const [isSwitchToPopoverVisible, onSwitchToPopoverVisibilityChange] = React.useState<boolean>(false);

  const toggleExpandSearch = React.useCallback(() => setExpandSearch(!expandSearch), [expandSearch]);

  const togglePrimaryCollapsed = React.useCallback(() => {
    const collapsed = !primaryCollapsed;
    setLocalStorageItem(LocalStorageItemKey.IsSideNavClosed, collapsed);
    setPrimaryCollapsed(collapsed);
  }, [primaryCollapsed]);

  const toggleSecondaryCollapsed = React.useCallback(() => {
    const collapsed = !secondaryCollapsed;
    setLocalStorageItem(LocalStorageItemKey.IsSideNavClosed, collapsed);
    setSecondaryCollapsed(collapsed);
    setPrimaryCollapsed(true);
  }, [secondaryCollapsed]);

  React.useEffect(() => {
    const { isNucleusApp = false, isMixpanelOff = false } = props as ViewProps;
    setIsNucleusApp(Boolean(isNucleusApp));
    if (!isMixpanelOff) mixpanel.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <_Navbar
      {...props}
      primaryCollapsed={primaryCollapsed}
      secondaryCollapsed={secondaryCollapsed}
      expandSearch={expandSearch}
      isSwitchToPopoverVisible={isSwitchToPopoverVisible}
      onSwitchToPopoverVisibilityChange={onSwitchToPopoverVisibilityChange}
      toggleExpandSearch={toggleExpandSearch}
      togglePrimaryCollapsed={togglePrimaryCollapsed}
      toggleSecondaryCollapsed={toggleSecondaryCollapsed}
    />
  );
};

export default withTheme<any>(withRouter(NavbarContainer));
