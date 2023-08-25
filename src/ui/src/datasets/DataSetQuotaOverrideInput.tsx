import * as React from 'react';
import styled from 'styled-components';
import { setLimitOverride as setReadWriteDatasetLimitOverride} from '@domino/api/dist/Datasetrw';
import { Checkbox } from '@domino/ui/dist/components';

const StyledCheckbox = styled(Checkbox)`
    span {
      font-weight: 500;
    }
`;

export interface Props {
  projectId: string;
  ignoreDatasetLimits: boolean;
}

export interface State {
  ignoreDatasetLimits: boolean;
}

export class DataSetQuotaOverrideInput extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ignoreDatasetLimits: props.ignoreDatasetLimits
    };
  }

  onUpdateOverride = (projectId: string) => (event: any) => {

    setReadWriteDatasetLimitOverride({projectId, ignoreLimit: event.target.checked}).then(() => {
      this.setState({ ignoreDatasetLimits: event.target.checked });
      const successMessage = event.target.checked ? "Dataset limits disabled for this project" : "Dataset limits enabled for this project";
      window.dispatchEvent(
        new CustomEvent('slideintoggle', {
          detail: {
            show: true,
            message: {
              primary: {
                content: successMessage,
              },
            },
            messageType: 'success',
            isDismissable: true,
            shouldDisappear: true,
            isClickable: true,
          },
        }),
      );
    })
    .catch((error : Error) => {
      console.error(`There was an error while updaing the dataset quota override status for this project: ${error}`);
    });
  }
  render() {
    const {
      projectId
    } = this.props;

    const {
      ignoreDatasetLimits,
    } = this.state;

    return (
      <StyledCheckbox
      defaultChecked={ignoreDatasetLimits}
      onChange={this.onUpdateOverride(projectId)}
    >
      <input type="hidden" value={String(ignoreDatasetLimits)} />
      Ignore Dataset Limits
    </StyledCheckbox>
    );
  }
}

export default DataSetQuotaOverrideInput;
