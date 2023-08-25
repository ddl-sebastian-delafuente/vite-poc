import {
  find,
  forEach,
  fromPairs,
  keys,
  path as Rpath,
  pipe,
  toPairs
} from 'ramda';
import { matchPath } from 'react-router';
import getIcon, { IconType } from './components/utils/getNavIcon';
import {
  downloadClientView,
  jobsDashboardBase,
  launchpadPublisher,
  projectEndpoints,
  projectSection,
  dataIndexPath,
  workspaceDashboardBase,
  workspaceSessionBase,
  jobSection,
  projectBase,
  sharedViewWorkspaceSection,
  experimentsDashboardBase
} from '../core/routes';
import { modelRegistryListViewProjectRouteHelper, modelRegistryListViewProjectRoutePattern, modelRegistryListViewGlobalRoutePattern } from '../modelregistry/routes'
import { appendToQuery } from '../utils/searchUtils';
import { HELP_PREFIX } from '../core/supportUtil';

export type Route = {
  displayName: string;
  target: LinkTarget;
  path: (...args: string[]) => string;
  matchingPattern?: string;
  exactMatch?: boolean;
  iconType?: IconType;
  children?: Routes;
  isActive?: boolean;
  dataTest?: string;
};

export interface Routes {
  [key: string]: Route;
}

export enum LinkTarget {
  // nucleus pages
  SELF = '_self',
  // new pages
  BLANK = '_blank',
  // react-router-able pages
  NONE = ''
}

export const projectRoutes = {
  displayName: 'Projects',
  matchingPattern: '/projects',
  path: () => '/projects',
  target: LinkTarget.NONE,
  iconType: IconType.Projects,
  children: {
    DEFAULT: {
      displayName: 'Overview',
      matchingPattern: projectBase(),
      path: projectBase,
      target: LinkTarget.NONE,
      iconType: IconType.ProjectOverview
    },
    DATASETS: {
      displayName: 'Data',
      matchingPattern: projectSection('data')(),
      path: projectSection('data'),
      target: LinkTarget.NONE,
      iconType: IconType.FastDatasets
    }, 
    OVERVIEW: {
      displayName: 'Overview',
      matchingPattern: projectSection('overview')(),
      path: projectSection('overview'),
      target: LinkTarget.NONE,
      iconType: IconType.ProjectOverview, // seriously this needs to be the project specific overview icon
      children: {
        FORK_UPDATE: {
          displayName: 'Fork Info',
          matchingPattern: projectSection('forkUpdate')(),
          path: projectSection('forkUpdate'),
          target: LinkTarget.SELF,
        }
      }
    },
    SCHEDULED_RUNS: {
      displayName: 'Scheduled',
      matchingPattern: projectSection('scheduledruns')(),
      path: projectSection('scheduledruns'),
      target: LinkTarget.SELF,
      iconType: IconType.Schedule
    },
    JOBS: {
      displayName: 'Jobs',
      matchingPattern: jobsDashboardBase(),
      path: jobsDashboardBase,
      target: LinkTarget.NONE,
      iconType: IconType.Runs,
      children: {
        TAG: {
          displayName: 'Tags',
          path: (ownerName: string, projectName: string, tagName: string) =>
            `${jobsDashboardBase(ownerName, projectName)}${appendToQuery(location.search, { tag: tagName })}`,
          target: LinkTarget.NONE,
        },
        SINGLE_JOB: {
          displayName: 'Job',
          matchingPattern: jobsDashboardBase(),
          path: (ownerName: string, projectName: string, jobId: string, tab = 'logs') =>
            `${jobSection(ownerName, projectName, jobId, tab)}`,
          target: LinkTarget.SELF,
          iconType: IconType.Runs
        }
      }
    },
    ACTIVITY: {
      displayName: 'Activity',
      matchingPattern: '/activity/:ownerName/:projectName',
      path: (ownerName: string, projectName: string, filter?: string, expand?: string) =>
        `/activity/${ownerName}/${projectName}${filter ? appendToQuery(location.search, { filter, expand }) : ''}`,
      target: LinkTarget.NONE,
      iconType: IconType.Activity
    },
    PROJECT_EXPORTS: {
      displayName: 'Exports',
      matchingPattern: projectSection('exports')(),
      path: projectSection('exports'),
      target: LinkTarget.NONE,
      iconType: IconType.ImportOutlined,
    },        
    WORKSPACES: {
      displayName: 'Workspaces',
      matchingPattern: workspaceDashboardBase(),
      path: workspaceDashboardBase,
      target: LinkTarget.NONE,
      iconType: IconType.Workspaces,
      children: {
        SINGLE_WORKSPACE: {
          displayName: 'Workspace',
          matchingPattern: workspaceDashboardBase(),
          path: (projectOwnerName: string, projectName: string, workspaceId: string, tab = 'logs') =>
            `${sharedViewWorkspaceSection(workspaceId, tab)(projectOwnerName, projectName)}`,
          target: LinkTarget.SELF,
          iconType: IconType.Workspaces
        }
      }
    },
    EXPERIMENTS: {
      displayName: 'Experiments',
      matchingPattern: experimentsDashboardBase(),
      path: experimentsDashboardBase,
      target: LinkTarget.NONE,
      iconType: IconType.Experiments
    },
    DISCUSSION: {
      displayName: 'Discussions',
      matchingPattern: projectSection('newsfeed')(),
      path: projectSection('newsfeed'),
      target: LinkTarget.SELF,
      iconType: IconType.Discussion
    },
    CODE: {
      displayName: 'Code',
      matchingPattern: projectSection('code')(),
      path: projectSection('code'),
      target: LinkTarget.SELF,
      iconType: IconType.CodeFile
    },
    FILES: {
      displayName: 'Files',
      matchingPattern: projectSection('browse')(),
      path: projectSection('browse'),
      target: LinkTarget.SELF,
      iconType: IconType.Files,
      children: {
        VIEW: {
          displayName: 'View File',
          matchingPattern: projectSection('view')(),
          path: projectSection('view'),
          target: LinkTarget.SELF,
          iconType: IconType.Files,
        },
        EDIT: {
          displayName: 'Edit File',
          matchingPattern: projectSection('edit')(),
          path: projectSection('edit'),
          target: LinkTarget.SELF,
          iconType: IconType.Files,
        },
        CREATE: {
          displayName: 'Create File',
          matchingPattern: projectSection('create')(),
          path: projectSection('create'),
          target: LinkTarget.SELF,
          iconType: IconType.Files,
        },
        COMPARE_REVISIONS: {
          displayName: 'Compare Revision',
          matchingPattern: projectSection('compare-revisions')(),
          path: projectSection('compare-revisions'),
          target: LinkTarget.SELF,
          iconType: IconType.Files,
        },
      }
    },
    // Duplicates FILES but for git-based projects. Will eventually replace FILES
    ARTIFACTS: {
      displayName: 'Artifacts',
      matchingPattern: projectSection('browse')(),
      path: projectSection('browse'),
      target: LinkTarget.SELF,
      iconType: IconType.Files,
      children: {
        VIEW: {
          displayName: 'View File',
          matchingPattern: projectSection('view')(),
          path: projectSection('view'),
          target: LinkTarget.SELF,
          iconType: IconType.Files,
        },
        EDIT: {
          displayName: 'Edit File',
          matchingPattern: projectSection('edit')(),
          path: projectSection('edit'),
          target: LinkTarget.SELF,
          iconType: IconType.Files,
        },
        CREATE: {
          displayName: 'Create File',
          matchingPattern: projectSection('create')(),
          path: projectSection('create'),
          target: LinkTarget.SELF,
          iconType: IconType.Files,
        },
        COMPARE_REVISIONS: {
          displayName: 'Compare Revision',
          matchingPattern: projectSection('compare-revisions')(),
          path: projectSection('compare-revisions'),
          target: LinkTarget.SELF,
          iconType: IconType.Files,
        },
      }
    },
    RESULTS: {
      displayName: 'Results',
      matchingPattern: projectSection('results')(),
      path: projectSection('results'),
      target: LinkTarget.SELF,
    },
    REVIEWS: {
      displayName: 'Reviews',
      matchingPattern: projectSection('reviews')(),
      path: projectSection('reviews'),
      target: LinkTarget.SELF,
      iconType: IconType.Reviews
    },
    PUBLISH: {
      displayName: 'Publish',
      path: launchpadPublisher,
      target: LinkTarget.NONE,
      iconType: IconType.Publish,
      children: {
        PUBLISHER: {
          displayName: 'App',
          matchingPattern: launchpadPublisher(),
          path: launchpadPublisher,
          target: LinkTarget.NONE,
        },
        MODELS_API: {
          displayName: 'Model APIs',
          matchingPattern: projectEndpoints('modelManager')(),
          path: projectEndpoints('modelManager'),
          target: LinkTarget.SELF,
        },
        MODEL_REGISTRY: {
          displayName: 'Models',
          matchingPattern: modelRegistryListViewProjectRoutePattern,
          path: modelRegistryListViewProjectRouteHelper,
          target: LinkTarget.SELF,
        },
        LAUNCHERS: {
          displayName: 'Launchers',
          matchingPattern: projectEndpoints('launchers')(),
          path: projectEndpoints('launchers'),
          target: LinkTarget.SELF,
          children: {
            RUNL_AUNCHERS: {
              displayName: 'Run Launchers',
              matchingPattern: projectSection('runLaunchers')(),
              path: projectSection('runLaunchers'),
              target: LinkTarget.SELF,
            }
          }
        },
        API_ENDPOINT: { // Obsolete
          displayName: 'API Endpoint',
          matchingPattern: projectEndpoints('apiEndpoint')(),
          path: projectEndpoints('apiEndpoint'),
          target: LinkTarget.SELF,
          children: {
            LOGS: {
              displayName: 'API Endpoint Logs',
              matchingPattern: projectEndpoints('logs')(),
              path: projectEndpoints('logs'),
              target: LinkTarget.SELF,
            }
          }
        },
      }
    },
    SETTINGS: {
      displayName: 'Settings',
      matchingPattern: projectSection('settings')(),
      path: projectSection('settings#execution'),
      target: LinkTarget.SELF,
      iconType: IconType.Settings
    },
    SETTINGS_INTEGRATION: {
      displayName: 'Settings',
      matchingPattern: projectSection('settings')(),
      path: projectSection('settings#integrations'),
      target: LinkTarget.SELF,
      iconType: IconType.Settings
    },
    SETTINGS_SHARING: {
      displayName: 'Sharing',
      matchingPattern: projectSection('sharing')(),
      path: projectSection('settings#sharing'),
      target: LinkTarget.SELF,
      iconType: IconType.Settings
    },
    WORKSPACE_SESSION: {
      displayName: 'Workspace Session',
      matchingPattern: workspaceSessionBase(),
      path: workspaceSessionBase,
      target: LinkTarget.SELF,
      iconType: IconType.Settings
    }
  }
};

export const routes = { 
  LAB: {
    displayName: 'Lab',
    path: () => '/projects',
    target: LinkTarget.NONE,
    iconType: IconType.Lab,
    children: {
      DATASETS: {
        displayName: 'Data',
        matchingPattern: dataIndexPath(),
        path: dataIndexPath,
        target: LinkTarget.SELF,
        iconType: IconType.FastDatasets,
        dataTest: 'global-data'
      },
      PROJECTS: projectRoutes,
      ENVIRONMENT: {
        displayName: 'Environments',
        matchingPattern: '/environment',
        path: () => '/environment',
        target: LinkTarget.SELF,
        iconType: IconType.Environments,
        // @TODO data-deny-data-analyst is v0 flag to hide this menu item
        dataDenyDataAnalyst: true,
      },
      MODELS: {
        displayName: 'Model APIs',
        matchingPattern: '/models',
        path: () => '/models',
        target: LinkTarget.SELF,
        iconType: IconType.Models,
        // @TODO data-deny-data-analyst is v0 flag to hide this menu item
        dataDenyDataAnalyst: true,
        children: {
          CREATE: {
            displayName: 'Create Model',
            matchingPattern: '/models/getBasicInfo',
            path: () => '/models/getBasicInfo',
            target: LinkTarget.SELF,
          },
          VERSIONS: {
            displayName: 'Model Versions',
            matchingPattern: '/models/:modelId/versions/:versionId',
            path: (modelId: string, versionId: string) => `/models/${modelId}/versions/${versionId}`,
            target: LinkTarget.SELF,
          },
          OVERVIEW: {
            displayName: 'Model Overview',
            matchingPattern: '/models/:modelId/overview',
            path: (modelId: string) => `/models/${modelId}/overview`,
            target: LinkTarget.SELF,
          },
          AUDIT_LOG: {
            displayName: 'Model Audit Log',
            matchingPattern: '/models/:modelId/auditLog',
            path: (modelId: string) => `/models/${modelId}/auditLog`,
            target: LinkTarget.SELF,
          },
          SETTINGS: {
            displayName: 'Model Settings',
            matchingPattern: '/models/:modelId/settings',
            path: (modelId: string) => `/models/${modelId}/settings`,
            target: LinkTarget.SELF,
          }
        }
      },
      MODEL_REGISTRY: {
        displayName: 'Models',
        matchingPattern: modelRegistryListViewGlobalRoutePattern,
        path: () => modelRegistryListViewGlobalRoutePattern,
        target: LinkTarget.SELF,
        iconType: IconType.ModelMonitor,
      },
      TAGS: {
        displayName: 'Tags',
        matchingPattern: '/projectTags',
        path: () => '/projectTags',
        target: LinkTarget.SELF,
        iconType: IconType.Tags
      },
      DOWNLOAD_CLI: {
        displayName: 'Download CLI',
        matchingPattern: downloadClientView(),
        path: downloadClientView,
        iconType: IconType.Download,
        target: LinkTarget.SELF
      },
      ACCOUNT_SETTINGS: {
        displayName: 'Account Settings',
        matchingPattern: '/account',
        path: () => '/account',
        target: LinkTarget.SELF,
        iconType: IconType.AccountSetting
      },
      OVERVIEW: {
        displayName: 'Overview',
        matchingPattern: '/overview',
        path: () => '/overview',
        iconType: IconType.Overview,
        target: LinkTarget.SELF,
      }
    }
  },
  LAUNCHPAD: {
    displayName: 'Launchpad',
    path: () => '/launchpad',
    target: LinkTarget.SELF,
    iconType: IconType.Launchpad,
    children: {
      APPS: {
        displayName: 'Apps',
        matchingPattern: '/launchpad',
        path: () => '/launchpad',
        target: LinkTarget.NONE,
        iconType: IconType.Apps,
      },
      MODELS: {
        displayName: 'Model APIs',
        matchingPattern: '/models/lp',
        exactMatch: true,
        path: () => '/models/lp',
        target: LinkTarget.SELF,
        iconType: IconType.Models,
      }
    }
  },
  CONTROL_CENTER: {
    displayName: 'Control Center',
    path: () => '/controlcenter/projects-portfolio',
    iconType: IconType.ControlCenter,
    target: LinkTarget.NONE,
    children: {
      PROJECTS_PORTFOLIO: {
        displayName: 'Projects Portfolio',
        matchingPattern: '/controlcenter/projects-portfolio',
        path: () => '/controlcenter/projects-portfolio',
        exactMatch: true,
        target: LinkTarget.NONE,
        iconType: IconType.Projects,
      },
      ASSETS_PORTFOLIO: {
        displayName: 'Assets',
        matchingPattern: '/controlcenter/project-assets-portfolio',
        path: () => '/controlcenter/project-assets-portfolio',
        exactMatch: true,
        target: LinkTarget.NONE,
        iconType: IconType.AssetsPortfolio,
      },
      COMPUTE_PORTFOLIO: {
        displayName: 'Compute & Spend',
        matchingPattern: '/controlcenter/compute',
        path: () => '/controlcenter/compute',
        target: LinkTarget.NONE,
        iconType: IconType.ComputeAndSpend
      }
    }
  },
  SEARCH: {
    displayName: 'Search',
    path: () => '/search',
    target: LinkTarget.SELF,
    iconType: IconType.Search
  },
  ADMIN: {
    displayName: 'Admin',
    matchingPattern: '/admin',
    iconType: IconType.Admin,
    path: () => '/admin',
    target: LinkTarget.BLANK,
  },
  DMM: {
    displayName: 'Model Monitor',
    matchingPattern: '/model-monitor',
    iconType: IconType.ModelMonitor,
    path: () => '/model-monitor',
    target: LinkTarget.BLANK,
  },
  LOGOUT: {
    displayName: 'Logout',
    target: LinkTarget.SELF,
    iconType: IconType.Logout,
    path: () => '/logout'
  },
  HELP: {
    displayName: 'Help',
    path: () => HELP_PREFIX,
    target: LinkTarget.BLANK,
  },
  NOTIFICATIONS: {
    displayName: 'Notifications',
    path: () => '/notifications',
    target: LinkTarget.BLANK,
  }
};

type TraversePair = [string, Route];
type ResultPair = [string, string];
const getMatchingPatternToRoute = () => {
  const someList = toPairs(routes) as TraversePair[];
  const collectMatchingPatterns = (nodes: TraversePair[], result: ResultPair[]) => {
    while (nodes.length > 0) {
      const n = nodes.pop();
      if (n) {
        const [key, { matchingPattern, children }] = n;
        if (matchingPattern) {
          result.push([matchingPattern as string, key]);
        }
        if (children) {
          forEach(([childKey, childValue]) => {
            nodes.push([`${key}.${childKey}`, childValue as Route]);
          }, toPairs(children));
        }
      }
    }
  };
  const resultTuples = [] as ResultPair[];
  collectMatchingPatterns(someList, resultTuples);
  return fromPairs(resultTuples);
};

export const JOB_TAG_PARAM_FIELD = 'tag';

export const matchingPatternToRoutes = getMatchingPatternToRoute();

export const getInRoutes = (p: string): Route | undefined =>
  Rpath(p.replace(/\./g, '.children.').split('.'), routes);

export const findMatchedRoute = (path: string) => {

  // can be removed after detwirl environment migration is completed
  // if (path.includes('/environments')) {
  //   path = path.replace('/environments', '/environment')
  // }
  
  const matchedRoute = pipe(
    keys,
    find(matchingPattern => {
      const exact = !!Rpath(['exactMatch'], getInRoutes(matchingPatternToRoutes[matchingPattern]) || {});
      return !!matchPath(path, {
        path: matchingPattern,
        exact,
        strict: false
      });
    })
  )(matchingPatternToRoutes);

  return matchedRoute && matchingPatternToRoutes[matchedRoute];
};

export const getLink = (
    route: Route | undefined,
    ...args: string[]
  ): { href?: string; target?: LinkTarget; icon?: JSX.Element } => route ?
  { href: route.path(...args), target: route.target, icon: route.iconType && getIcon(route.iconType) } :
  {};
