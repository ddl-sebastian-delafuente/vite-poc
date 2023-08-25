import * as React from 'react';
import * as R from 'ramda';
import Select from '@domino/ui/dist/components/Select';
import { regexMatch } from '../utils/regex';

export  type LabelAndValueType = {
  label: string;
  value: string;
};

export type ProjectIdOptionMap = { [id: string]: LabelAndValueType };

export type ProjectIdTableUrlMap = { [id: string]: string };

export interface Project {
  _id: string;
  name: string;
}

export type OwnerName = string;

export type ActiveProjectForUser = [OwnerName, Project];

const onFilter = (inputValue: string, option: LabelAndValueType) => regexMatch(option.label, inputValue);

function getProjectIdToOptionMap(activeProjectsForUser: ActiveProjectForUser[]): ProjectIdOptionMap {
  return activeProjectsForUser.reduce((map: ProjectIdOptionMap, next: ActiveProjectForUser) =>
    ({
      ...map,
      [next[1]._id]: {
        label: `${next[0]}/${next[1].name}`,
        value: next[1]._id,
      },
    }), {} as ProjectIdOptionMap);
}

function optionSort(a: LabelAndValueType, b: LabelAndValueType): number {
  if (a.label > b.label) {
    return 1;
  }
  if (a.label < b.label) {
    return -1;
  }
  return 0;
}

const getProjectIdToUrlMap = (activeProjectsForUser: ActiveProjectForUser[], projectUrls: string[]) =>
    R.zipObj(activeProjectsForUser.map(p => p[1]._id), projectUrls);

const getProjectId = (project: Project) => project._id;

const getIdIfExists = R.ifElse(R.isNil, () => undefined, getProjectId);

export interface Props {
  id: string;
  projectUrls: string[];
  activeProjectsForUser: ActiveProjectForUser[];
  defaultProject?: Project;
  isProjectEditable: boolean;
  dataTest?: string;
}

export interface State {
  selectedProjectId?: string;
  projectDropdownValue?: string;
}

class ModelProjectInput extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const defaultValue = getIdIfExists(props.defaultProject);
    this.state = {
      projectDropdownValue: defaultValue,
      selectedProjectId: defaultValue
    };
  }

  componentDidMount() {
    this.setState({
      selectedProjectId: getIdIfExists(this.props.defaultProject)
    });
  }

  updateSelectedValue(value?: string) {
    if (value) {
      this.setState({ selectedProjectId: value, projectDropdownValue: value });
    } else {
      this.setState({ selectedProjectId: undefined, projectDropdownValue: undefined });
    }
  }

  onChange = (renderFilesTableUrls: ProjectIdTableUrlMap) => (value: string) => {
    if (value) {
      this.updateSelectedValue(value);
      const renderFilesTableUrl = renderFilesTableUrls[value];
      if (renderFilesTableUrl !== undefined) {
        if (R.pathOr(false, ['domino', 'model', 'files', 'onProjectIdChange'])(window)) {
          // @ts-ignore
          window.domino.model.files.onProjectIdChange(renderFilesTableUrl);
        } else {
          console.warn('window.domino.model.files.onProjectIdChange does not exist. Cannot execute');
        }
      }
    } else {
      this.updateSelectedValue(undefined);
    }
  };

  handleFocus = () => {
    this.setState({ projectDropdownValue: undefined });
  };

  handleBlur = () => {
    this.setState({ projectDropdownValue: this.state.selectedProjectId });
  };

  render() {
    const { projectUrls, activeProjectsForUser, isProjectEditable, id, dataTest } = this.props;
    const { selectedProjectId, projectDropdownValue } = this.state;
    const projectIdOptionMap = getProjectIdToOptionMap(activeProjectsForUser);
    const options = R.values(projectIdOptionMap).sort(optionSort);

    return (
      <div>
        <Select
          filterOption={onFilter}
          value={projectDropdownValue}
          onChange={this.onChange(getProjectIdToUrlMap(activeProjectsForUser, projectUrls))}
          disabled={!isProjectEditable}
          id={id}
          options={options}
          useOptionsAsProp={true}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          showSearch={true}
          showArrow={false}
          data-test={dataTest}
        />
        <input type="hidden" name="projectId" value={selectedProjectId} />
      </div>
    );
  }
}

export default ModelProjectInput;
