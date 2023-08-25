import * as React from 'react';
import { Menu, Layout } from 'antd';
import {
  contains,
  omit,
  merge,
  mergeDeepRight
} from 'ramda';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus,
} from '@domino/api/dist/types';
import styled, { withTheme } from 'styled-components';
import {
  ClickableNavItem,
  generateNavItemsAsMenuItems,
  generateGroupNavItems,
} from '../components/NavItem';
import { IconType } from '../components/utils/getNavIcon';
import {
  COLLAPSED_SIDEBAR_WIDTH,
  Container,
  EXPANDED_SIDEBAR_WIDTH,
  StyledSidebarContainer,
} from '../components/utils/styled';
import FlexLayout from '../../components/Layouts/FlexLayout';
import { useAccessControl, AccessControl } from '@domino/ui/dist/core/AccessControlProvider';
import { themeHelper } from '../../styled';
import {
  getLink,
  routes,
  Routes,
} from '../routes';
import { Flags } from '../types';
import ProjectStageAndStatusSelect from './stage/ProjectStageAndStatusSelect';
import SubNavWorkspaceLauncher from './SubNavWorkspaceLauncher';
import SubNavJobLauncher from './SubNavJobLauncher';

export type ViewProps = {
  theme?: any;
  collapsed: boolean;
  enableSparkClusters: boolean;
  selectedKeyPath: string[];
  project?: Project;
  toggleCollapsed: () => void;
  flags: Flags;
  username?: string;
  userId?: string;
  updateProject?: (project: Project) => void;
  projectStageAndStatus?: ProjectStageAndStatus;
  updateProjectStageAndStatus?: (projectStageAndStatus: ProjectStageAndStatus) => void;
  areStagesStale?: boolean;
  setAreStagesStale?: (areStagesStale: boolean) => void;
  enableExternalDataVolumes?: boolean;
  globalSocket?: SocketIOClient.Socket;
  setGlobalSocket: (socket?: SocketIOClient.Socket) => void;
  onError?: (err: any) => void;
  enableGitCredentialFlowForCollaborators?: boolean;
};

const Title = styled.div`
  font-size: ${themeHelper('fontSizes.large')};
  word-break: break-word;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

type TitlesContainerProps = {
  hasSubtitle?: boolean;
  isCollapsed?: boolean;
};
const TitlesContainer = styled.div<TitlesContainerProps>`
  width: 100%;
  overflow: hidden;
  min-height: ${({ isCollapsed }) => (!isCollapsed ? '98px' : 0)};
  .title {
    color: ${themeHelper('nav.secondary.title.main.color')};
    font-size: ${themeHelper('nav.secondary.title.main.hasSubtitle.fontSize')};
    margin-bottom: ${themeHelper('nav.secondary.title.main.hasSubtitle.marginBottom')};
    line-height: ${themeHelper('nav.secondary.title.main.hasSubtitle.lineHeight')};
    font-weight: ${themeHelper('nav.secondary.title.main.fontWeight')};
  }

  .sub-title {
    line-height: normal;
    font-size: ${themeHelper('fontSizes.tiny')};
    color: ${themeHelper('nav.secondary.title.sub.color')};
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
  }
`;

const TitleMenuItem = styled(Menu.Item)`
  .anticon {
    color: ${themeHelper('nav.secondary.color')};
  }
`;

const StyledContainer = styled(FlexLayout)`
  position: relative;
  & > div {
    margin: 0 0 4px;
  }
  .run-modal-container {
    display: none;
  }
`;

const StyledContainerForWorkspace = styled(StyledContainer)`
  place-content: end flex-start;
  & > div {
    margin: 0;
  }
`;

const StyledContainerForJobs = styled(StyledContainer)`
  margin-top: 0 !important;
`;

const GroupNavTitle = styled.span`
  text-transform: uppercase;
`;

const PROJECT_ITEMS: Routes = routes.LAB.children.PROJECTS.children;
type AllowedOps = 'ChangeProjectSettings' | 'Run' | 'Edit' | 'UpdateProjectDescription' |
  'ProjectSearchPreview' | 'BrowseReadFiles' | 'EditTags' | 'RunLauncher' | 'ViewRuns' | 'ViewWorkspaces';
const isAllowed = (p: Project, op: AllowedOps) => contains(op, p.allowedOperations);
const canSeeOverview = (p: Project) => isAllowed(p, 'ProjectSearchPreview');
const canSeeRuns = (flags: Flags, p: Project) => isAllowed(p, 'ViewRuns');
const canSeeFiles = (p: Project) => isAllowed(p, 'BrowseReadFiles');
const canSeeSettings = (p: Project) => isAllowed(p, 'BrowseReadFiles');
const canSeePublish = (p: Project) => isAllowed(p, 'BrowseReadFiles') || isAllowed(p, 'RunLauncher');
const canSeeProjectLevelDatasets = (flags: Flags, p: Project) => isAllowed(p, 'BrowseReadFiles');
const canSeeReviews = (p: Project) => isAllowed(p, 'BrowseReadFiles');

const isGitBasedProject = (project?: Project) => project && !!project.mainRepository?.uri;

const getTitleMenuItem = (props: ViewProps) => {
  const {
    collapsed,
    project,
    updateProject,
    projectStageAndStatus,
    updateProjectStageAndStatus,
    areStagesStale,
    setAreStagesStale,
  } = props;

  if (!project) {
    return undefined;
  }
  return (
    <TitleMenuItem disabled style={{ cursor: 'auto', height: 'auto' }} key="title">
      <Title>
        <TitlesContainer isCollapsed={collapsed}>
          {!collapsed && (
          <ProjectStageAndStatusSelect
            project={project}
            projectStageAndStatus={projectStageAndStatus}
            updateProject={updateProject}
            updateProjectStageAndStatus={updateProjectStageAndStatus}
            areStagesStale={areStagesStale}
            setAreStagesStale={setAreStagesStale}
          />
          )}
        </TitlesContainer>
      </Title>
    </TitleMenuItem>
  );
};

const getHelperProps = (props: ViewProps) => {
  const {
    project, selectedKeyPath, collapsed, ...rest
  } = props;
  const linkParams = project && [project.owner.userName, project.name];
  const secondarySelectedKey = (selectedKeyPath[2] === 'PUBLISH')
    ? `${selectedKeyPath[2]}_${selectedKeyPath[3]}` : selectedKeyPath[2];

  return {
    linkParams,
    collapsed,
    selectedKey: secondarySelectedKey,
    ...omit(['toggleCollapsed'], rest),
  };
};

const getProjectMenuItems = (props: ViewProps & { accessControl: AccessControl }) => {
  const {
    accessControl,
    collapsed,
    flags,
    onError,
    project,
    selectedKeyPath,
    userId,
    username,
    theme
  } = props;
  const secondarySelectedKey = selectedKeyPath[2];
  const helperProps = getHelperProps(props);
  const linkParams = project ? [project.owner.userName, project.name] : [];
  const PUBLISH_ITEMS = PROJECT_ITEMS.PUBLISH.children;

  const projectPublishAppRoutes = getRouteWithIcon(
    PUBLISH_ITEMS!.PUBLISHER,
    { iconType: IconType.Apps },
  );

  const projectPublishModelAPIsRoutes = getRouteWithIcon(
    PUBLISH_ITEMS!.MODELS_API,
    { iconType: IconType.ModelAPI },
  );

  const projectPublishModelRegistryRoutes = getRouteWithIcon(
    PUBLISH_ITEMS!.MODEL_REGISTRY,
    { iconType: IconType.ModelMonitor },
  );

  const projectPublishLaunchersRoutes = getRouteWithIcon(
    PUBLISH_ITEMS!.LAUNCHERS,
    { iconType: IconType.Launchers },
  );
  const getDividerMenuItem = (blockName: string) => ({
    key: `divider-${blockName}`,
    type: 'divider',
    style: {
      display: 'block',
      width: 'calc(100% - 4px)',
      height: '0.5px',
      border: `0.5px solid ${theme.nav.secondary.color}`,
      marginLeft: '4px',
    }
  });

  return project ? [
    generateGroupNavItems(
      'run',
      <GroupNavTitle>Develop</GroupNavTitle>,
      'secondary',
      'MenuItem',
      [
        canSeeProjectLevelDatasets(flags, project) ? ['DATASETS', PROJECT_ITEMS.DATASETS] : undefined,
        canSeeFiles(project) ? isGitBasedProject(project) ? ['CODE', PROJECT_ITEMS.CODE]
        : ['FILES', mergeDeepRight(PROJECT_ITEMS.FILES, { displayName: 'Code' })] : undefined,
        [
          'WORKSPACES',
          PROJECT_ITEMS.WORKSPACES,
          (
            <StyledContainerForWorkspace key="workspaces" justifyContent="flex-start" alignItems="center">
              <ClickableNavItem
                type="secondary"
                collapsed={collapsed}
                selected={secondarySelectedKey === 'WORKSPACES'}
                tooltipLabel="Workspaces"
                {...getLink(PROJECT_ITEMS.WORKSPACES, ...linkParams)}
                data-test="WORKSPACES"
              >
                Workspaces
              </ClickableNavItem>
              <SubNavWorkspaceLauncher
                project={project}
                username={username!}
                userId={userId}
                enableExternalDataVolumes={!!props.enableExternalDataVolumes}
                globalSocket={props.globalSocket}
                setGlobalSocket={props.setGlobalSocket}
                onError={onError}
              />
            </StyledContainerForWorkspace>
          ),
        ],
        canSeeRuns(flags, project) ? [
          'JOBS',
          PROJECT_ITEMS.JOBS,
          (
            <StyledContainerForJobs key="jobs" justifyContent="flex-start" alignItems="center">
              <ClickableNavItem
                type="secondary"
                collapsed={collapsed}
                selected={contains(
                  secondarySelectedKey, ['JOBS', 'SCHEDULED_RUNS'])}
                tooltipLabel="Jobs"
                {...getLink(PROJECT_ITEMS.JOBS, ...linkParams)}
                data-test="JOBS"
              >
                Jobs
              </ClickableNavItem>
              <SubNavJobLauncher
                project={project}
                userId={userId}
                enableGitCredentialFlowForCollaborators={props.enableGitCredentialFlowForCollaborators}
              />
            </StyledContainerForJobs>
          ),
        ] : undefined,
      ],
      helperProps,
    ),
    getDividerMenuItem('divider-materials'),
    generateGroupNavItems(
      'materials',
      <GroupNavTitle>Track</GroupNavTitle>,
      'secondary',
      'MenuItem',
      [
        // ToDo: update experiments permission
        canSeeRuns(flags, project) ? [
          'EXPERIMENTS',
          PROJECT_ITEMS.EXPERIMENTS,
          (
            <ClickableNavItem
              key="experiments"
              type="secondary"
              collapsed={collapsed}
              selected={secondarySelectedKey === 'EXPERIMENTS'}
              tooltipLabel="Experiments"
              {...getLink(PROJECT_ITEMS.EXPERIMENTS, ...linkParams)}
              data-test="EXPERIMENTS"
            >
              Experiments
            </ClickableNavItem>
          ),
        ] : undefined,
        isGitBasedProject(project) && canSeeFiles(project) ? ['FILES', PROJECT_ITEMS.ARTIFACTS] : undefined,
      ]
        ,
      helperProps,
    ),
    getDividerMenuItem('divider-publish'),
    generateGroupNavItems(
      'publish',
      <GroupNavTitle>Publish</GroupNavTitle>,
      'secondary',
      'MenuItem',
      [
        PUBLISH_ITEMS && canSeePublish(project)
          ? ['PUBLISH_PUBLISHER', flags.enableApps
            ? projectPublishAppRoutes : merge(projectPublishAppRoutes, { isActive: false })] : undefined,
        accessControl.hasAccess() && PUBLISH_ITEMS && canSeePublish(project)
          ? ['PUBLISH_MODELS_API', flags.enableModelAPIs
            ? projectPublishModelAPIsRoutes : merge(projectPublishModelAPIsRoutes, { isActive: false })] : undefined,
        accessControl.hasAccess() && PUBLISH_ITEMS && flags.enableModelRegistry && canSeePublish(project)
          ? ['PUBLISH_MODEL_REGISTRY', projectPublishModelRegistryRoutes] : undefined,
        PUBLISH_ITEMS && canSeePublish(project)
          ? ['PUBLISH_LAUNCHERS', projectPublishLaunchersRoutes] : undefined,
        accessControl.hasAccess() && flags.enableExportsWorkflow && canSeePublish(project)
          ? ['PROJECT_EXPORTS', PROJECT_ITEMS.PROJECT_EXPORTS, (
            <ClickableNavItem
              key="PROJECT_EXPORTS"
              type="secondary"
              collapsed={collapsed}
              selected={secondarySelectedKey === 'PROJECT_EXPORTS'}
              tooltipLabel={'Exports'}
              {...getLink(PROJECT_ITEMS.PROJECT_EXPORTS, ...linkParams)}
              data-test="exports"
            >
              Exports
            </ClickableNavItem>
          )] : undefined,
      ],
      helperProps,
    ),
    getDividerMenuItem('divider-publish-end'),
  ] : [];
};

interface RouteIconTypeProp {
  iconType: React.ReactNode;
}

const getRouteWithIcon = (routeObj: any, iconProp: RouteIconTypeProp) => merge(routeObj, iconProp);

export type MenuItemProps = {
  project: Project;
} & ViewProps;

const getSubNavMenuItems = (props: MenuItemProps) => {
  const { project, theme } = props;
  const helperProps = getHelperProps(props);
  const projectOverviewRoutes = getRouteWithIcon(
    PROJECT_ITEMS.OVERVIEW,
    { iconType: IconType.ProjectOverview },
  );

  const accessControl = useAccessControl(); // eslint-disable-line
  const dividerMenuItem = {
    key: 'divider',
    type: 'divider',
    style: {
      display: 'block',
      width: 'calc(100% - 4px)',
      height: '0.5px',
      border: `0.5px solid ${theme.nav.secondary.color}`,
      marginLeft: '4px',
    }
  };

  const items = [
    {
      key: 'title',
      label: getTitleMenuItem(props),
      style: { height: 'auto' }
    }
    ,
    ...generateNavItemsAsMenuItems(
      'secondary',
      'MenuItem',
      [
        canSeeOverview(project) ? ['OVERVIEW', projectOverviewRoutes] : undefined,
        !isGitBasedProject(project) && canSeeReviews(project)
          ? ['REVIEWS', PROJECT_ITEMS.REVIEWS] : undefined,
      ],
      helperProps,
    ),
    dividerMenuItem,
    ...getProjectMenuItems({ ...props, accessControl }),
    ...generateNavItemsAsMenuItems(
      'secondary',
      'MenuItem',
      [canSeeSettings(project) ? ['SETTINGS', PROJECT_ITEMS.SETTINGS] : undefined],
      helperProps,
    )
  ];

  return items;
};

const Component: React.FC<ViewProps> = (props) => {
  const {
    // @ts-ignore disable-next-line
    selectedKeyPath, collapsed, toggleCollapsed, project,
  } = props;
  const secondarySelectedKey = selectedKeyPath[2];

  return (
    <StyledSidebarContainer type="secondary" collapsed={collapsed}>
      <Container type="secondary" collapsed={collapsed}>
        <Layout.Sider
          style={{ background: 'transparent' }}
          collapsible
          onCollapse={toggleCollapsed}
          collapsed={collapsed}
          trigger=""
          collapsedWidth={COLLAPSED_SIDEBAR_WIDTH}
        >
          {
            !!project
            && (
            <Menu
              mode="inline"
              style={{
                width: collapsed ? COLLAPSED_SIDEBAR_WIDTH : EXPANDED_SIDEBAR_WIDTH,
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
              defaultOpenKeys={[secondarySelectedKey]}
              items={getSubNavMenuItems({ ...props, project })}
            />
            )
          }
        </Layout.Sider>
      </Container>
    </StyledSidebarContainer>
  );
};

export default withTheme(Component);
