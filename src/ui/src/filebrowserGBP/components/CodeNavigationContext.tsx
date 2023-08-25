import * as React from 'react';
import { BrowserTab } from '../types/filebrowserTypes';
import { urlSearchStringToObject } from '../../utils/searchUtils';

interface CodeNavigationState {
  activeTab: BrowserTab;
  branch: string | null;
  commit: string | null;
  directory: string[];
}

interface CodeNavigationStateInternal extends CodeNavigationState {
  url: {
    selfLink: string,
    path: string;
  };
}

export interface CodeNavigationExportedContext extends CodeNavigationState {
  setActiveTab(newTab: BrowserTab): void;
  setBranch(branchName: string | null): void;
  setCommit(branchName: string, commitId: string): void;
  clearCommit(): void;
  setDirectory(newDir: string[]): void;
  resetAll(): void;
}

export type Action =
| { type: 'replaceState', state: CodeNavigationState }
| { type: 'changeTab', newTab: BrowserTab }
| { type: 'changeDir', newDir: string[] }
| { type: 'changeBranch', newBranch: string | null }
| { type: 'changeCommit', newCommit: string | null, newBranch?: string }
| { type: 'reset' };

export type CodeNavigationReducer = (state: CodeNavigationStateInternal, action: Action) => CodeNavigationState;
const codeNavigationReducer: CodeNavigationReducer = (state, action) => {
  const newState: CodeNavigationStateInternal = { ...state };
  switch (action.type) {
    case 'replaceState':
      return action.state;
    case 'changeTab':
      newState.activeTab = action.newTab;
      break;
    case 'changeDir':
      if (action.newDir.length === 0) {
        newState.directory = [];
      } else {
        newState.directory = [...action.newDir];
      }
      break;
    case 'changeBranch':
      newState.branch = action.newBranch;
      newState.commit = null;
      break;
    case 'changeCommit':
      if (typeof action.newCommit !== 'string') {
        newState.commit = null;
      } else {
        newState.commit = action.newCommit;
        newState.branch = action.newBranch!;
      }
      break;
    case 'reset':
      newState.directory = [];
      newState.branch = null;
      newState.commit = null;
      newState.activeTab = BrowserTab.MainRepository;
      break;
    default:
      return state;
  }
  const newUrl = toUrl(newState) + toQuery(newState);
  newState.url = { ...state.url, path: newUrl};
  window.history.pushState(newState, '', newState.url.selfLink + newState.url.path);
  return newState;
};
export default codeNavigationReducer;

const toUrl: (state: CodeNavigationState) => string = (state) => {
  if (state.activeTab === BrowserTab.ImportedRepositories) {
    return '/imported';
  }
  if (state.directory.length > 0) {
    return '/tree/' + state.directory.join('/');
  }
  return '';
};

const toQuery: (state: CodeNavigationState) => string = (state) => {
  if (state.activeTab !== BrowserTab.MainRepository) { return ''; }

  const queryThings: string[] = [];
  if (state.branch) { queryThings.push(`branch=${encodeURIComponent(state.branch)}`); }
  if (state.commit) { queryThings.push(`commit=${encodeURIComponent(state.commit)}`); }
  return queryThings.length ? `?${queryThings.join('&')}` : '';
};

const determineStateFromUrl: (selfLink: string) => CodeNavigationStateInternal = (selfLink) =>  {
  let activeTab = BrowserTab.MainRepository;
  let directory: string[] = [];

  if (!window.location.pathname.startsWith(selfLink)) {
    throw Error(`Unexpected path '${window.location.pathname}'. Cannot infer state.`);
  }
  const path = window.location.pathname.substr(selfLink.length);
  const query = urlSearchStringToObject(window.location.search);

  if (path.startsWith('/imported')) {
    activeTab = BrowserTab.ImportedRepositories;
  } else if (path.startsWith('/tree/')) {
    const restOfPath = path.substr(6);
    directory = restOfPath.split('/');
  }

  const branch = query.branch || null;
  const commit = typeof query.commit === 'string' && query.commit.toUpperCase() !== 'HEAD' ? query.commit : null;

  return {
    activeTab,
    branch,
    commit,
    directory,
    url: {
      selfLink,
      path
    }
  };
};

const CodeNavigationContext = React.createContext<CodeNavigationExportedContext>({} as CodeNavigationExportedContext);

export type CodeNavigationContextProviderProps = {
  selfLink: string;
  children?: React.ReactNode;
};
const CodeNavigationContextProvider: React.FC<CodeNavigationContextProviderProps> = ({selfLink, children}) => {
  const reducer = codeNavigationReducer;
  const [state, dispatch] = React.useReducer<CodeNavigationReducer, string>(reducer, selfLink, determineStateFromUrl);

  // Add an event listener for the 'popstate' event, which is fired when a user uses browser back/forward
  // to an entry inserted by history.pushState().
  // We only have to register this once. Even if CodeNavigationContextProvider gets re-rendered, `dispatch` is stable.
  React.useEffect(() => {
    window.addEventListener('popstate', (event) => {
      if (event.state) {
        dispatch({type: 'replaceState', state: event.state});
      } else {
        const newState = determineStateFromUrl(selfLink);
        dispatch({type: 'replaceState', state: newState});
      }
    });
  }, []);

  const value = {
    get activeTab() { return state.activeTab; },
    get branch() { return state.branch; },
    get commit() { return state.commit; },
    get directory() { return state.directory; },
    setActiveTab(newTab: BrowserTab) {
      dispatch({ type: 'changeTab', newTab });
    },
    setBranch(newBranch: string | null) {
      dispatch({ type: 'changeBranch', newBranch });
    },
    setCommit(newBranch: string, newCommit: string) {
      dispatch({ type: 'changeCommit', newCommit, newBranch });
    },
    clearCommit() {
      dispatch({ type: 'changeCommit', newCommit: null });
    },
    setDirectory(newDir: string[]) {
      dispatch({ type: 'changeDir', newDir });
    },
    resetAll() {
      dispatch({ type: 'reset' });
    }
  };
  return <CodeNavigationContext.Provider value={value}>{children}</CodeNavigationContext.Provider>;
};

const useCodeNavigationContext = () => {
  const context: CodeNavigationExportedContext = React.useContext(CodeNavigationContext);
  if (context === undefined) {
    throw new Error('useCodeNavigationConsumer must have a CodeNavigationProvider ancestor.');
  }
  return context;
};

export { CodeNavigationContextProvider, useCodeNavigationContext };
