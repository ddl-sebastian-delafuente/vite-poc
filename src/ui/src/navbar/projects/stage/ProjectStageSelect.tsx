import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import {
  DominoServerProjectsApiProjectGatewayOverview as Project,
  DominoProjectsApiProjectStage as ProjectStage,
  DominoProjectsApiProjectStageAndStatus as ProjectStageAndStatus,
} from '@domino/api/dist/types';
import { getCurrentProjectStageAndStatus } from '@domino/api/dist/Projects';
import { getStagesForProject, moveProjectToStage } from '@domino/api/dist/ProjectManagement';
import Select from '@domino/ui/dist/components/Select';
import { themeHelper } from '../../../styled';
import { error } from '../../../components/toastr';
import WaitSpinner from '../../../components/WaitSpinner';
import InlineWaitSpinner from '../../../components/InlineWaitSpinner';

const Option = Select.Option;
const selectDropdownStyle = { zIndex: 2500 };

export type Props = {
  project: Project;
  updateProject?: (p: Project) => void;
  updateProjectStageAndStatus?: (projectStageAndStatus: ProjectStageAndStatus) => void;
  title?: string;
  className?: string;
  areStagesStale?: boolean;
  setAreStagesStale?: (areStagesStale: boolean) => void;
};

export type State = {
  isStageUpdating: boolean;
  projectStages: ProjectStage[];
  isLoading: boolean;
  allStagesFetched: boolean;
};

const SelectLabel = styled.div`
  width: 100%;
  margin-bottom: 5px;
  font-size: ${themeHelper('fontSizes.tiny')};
`;

const StyledSelect = styled(Select)`
  width: 100%;
`;
const SelectWrapper = styled.div`
  padding: 15px 10px;
`;

const stageOptions = (stages: ProjectStage[]) =>
    R.map(stage => (<Option value={stage.id} key={stage.id}>{stage.stage}</Option>), stages);
class ProjectStageSelect extends React.PureComponent<Props, State> {
  state: State = {
    isStageUpdating: false,
    projectStages: [],
    isLoading: true,
    allStagesFetched: false
  };

  getStagesForProject = async () => {
    try {
      this.setState({allStagesFetched: false});
      const response: any = await getStagesForProject({projectId: this.props.project.id});
      if (!response.code) {
        this.setState({projectStages: response});
      } else {
        error(response.message);
      }
    } catch (e) {
      console.warn(e);
      switch (e.name) {
        case 'Unauthorized':
          error('You are not authorized for this operation');
          break;
        default:
          error('Failed to get project stages');
      }
    } finally {
      this.setState({allStagesFetched: true});
    }
  }

  getCurrentProjectStageAndStatus = async () => {
    try {
      const response = await getCurrentProjectStageAndStatus({projectId: this.props.project.id});
      if (this.props.updateProject) {
        this.props.updateProject({
          ...this.props.project,
          stageId: response.stage.id
        });
      }
      if (this.props.updateProjectStageAndStatus) {
        this.props.updateProjectStageAndStatus(response);
      }
    } catch (e) {
      console.warn(e);
      error('Failed to get current project stage');
    }
  }

  updateStageData = () => {
    this.getCurrentProjectStageAndStatus();
    this.getStagesForProject();
  }

  componentDidMount() {
    try {
      getCurrentProjectStageAndStatus({projectId: this.props.project.id}).then(currentStageAndStatus => {
        this.setState({
          projectStages: [currentStageAndStatus.stage],
          isLoading: false,
          allStagesFetched: true
        });
      });
    } catch (e) {
      console.warn(e);
      error('Failed to get current project stage');
    }
  }

  async componentDidUpdate(prevProps: Props) {
    if (this.props.areStagesStale && this.props.setAreStagesStale) {
      await this.getStagesForProject();
      this.props.setAreStagesStale(false);
    } else if (!R.equals(this.props.project.stageId, prevProps.project.stageId)) {
      const currentStage = R.find(R.propEq('id', this.props.project.stageId))(this.state.projectStages);
      if (R.isNil(currentStage)) {
        this.setState({isLoading: true});
        await this.getStagesForProject();
        this.setState({isLoading: false});
      }
    }
  }

  constructor(props: Props) {
    super(props);
  }

  handleChange = async (value: any) => {
    try {
      this.setState({isStageUpdating: true});
      const response: any = await moveProjectToStage({ body: {
          stageId: value,
          projectId: this.props.project.id
        }});
      if (!response.code) {
        if (this.props.updateProject) {
          this.props.updateProject({
            ...this.props.project,
            stageId: response.stage.id
          });
        }
        if (this.props.updateProjectStageAndStatus) {
          this.props.updateProjectStageAndStatus(response);
        }
      } else {
        error(response.message);
      }
    } catch (e) {
      console.warn(e);
      error('Failed to update project stage');
    } finally {
      this.setState({isStageUpdating: false});
    }
  }

  render() {
    const { project, title, className } = this.props;
    const {projectStages, isStageUpdating, isLoading} = this.state;
    return (
      <SelectWrapper className={className} data-test="stagePopover">
        <SelectLabel className={'title'} data-test="title">{R.defaultTo('Current Stage')(title)}</SelectLabel>
        {
          isStageUpdating
          ? <WaitSpinner/>
          : isLoading
            // Looks odd, but we need to have the div's in here for the default selection to show as selected
            ? <div><StyledSelect placeholder={'Loading stages...'} /></div>
            : (
              <StyledSelect
                dropdownStyle={selectDropdownStyle}
                value={project.stageId}
                onChange={this.handleChange}
                onFocus={this.updateStageData}
                data-test="stageDropdown"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.stopPropagation()}
              >
                {this.state.allStagesFetched ? (projectStages && stageOptions(projectStages)) : (
                    <Option disabled={true} key="spinner"><InlineWaitSpinner /></Option>
                  )
                }
              </StyledSelect>)
        }
      </SelectWrapper>
    );
  }
}

export default ProjectStageSelect;
