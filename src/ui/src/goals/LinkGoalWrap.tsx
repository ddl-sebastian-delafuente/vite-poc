import * as React from 'react';
import { forEach } from 'ramda';
import { linkModelToGoal } from '@domino/api/dist/ModelManager';
import { error as ToastError, success as ToastSuccess } from '../components/toastr';
import { getErrorMessage } from '../components/renderers/helpers';
import LinkGoal from './LinkGoal';

export interface LinkGoalWrapProps {
  projectId: string;
  modelId: string;
  modelVersion: number;
  modelVersionId: string;
}

class LinkGoalWrap extends React.Component<LinkGoalWrapProps> {
  onGoalsSelect = (goalIds: Array<string>) => {
    const { projectId, modelId, modelVersion, modelVersionId } = this.props;
    const promises: Promise<any>[] = [];

    forEach((goalId) => {
      promises.push(
        linkModelToGoal({
          modelVersionId: modelVersionId,
          body: {
            modelId: modelId,
            projectId: projectId,
            goalId: goalId,
            modelVersion: modelVersion
          }
        })
      );
    }, goalIds);

    Promise.all(promises)
      .then(() => {
        ToastSuccess('Successfully linked goals to selected Model APIs');
      })
      .catch(async (e) => {
        ToastError(await getErrorMessage(e, 'Failed to link goals to one or more selected Model APIs'));
      });
  };

  render() {
    return (
      <React.Fragment>
        <LinkGoal
          selectedIds={[]}
          isDisabled={false}
          projectId={this.props.projectId}
          onSubmit={this.onGoalsSelect}
          buttonIcon={<React.Fragment>Link to Goal</React.Fragment>}
          noTooltip={true}
        />
      </React.Fragment>
    );
  }
}

export default LinkGoalWrap;
