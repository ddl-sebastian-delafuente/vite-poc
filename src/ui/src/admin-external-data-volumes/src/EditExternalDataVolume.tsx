import * as React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { DominoDatamountApiDataMountDto as ExternalVolume, DominoDataplaneDataPlaneDto } from '@domino/api/dist/types';
import { isMountPathValid, updateDataMount, getAllPvcsByType } from '@domino/api/dist/Datamount';
import { colors, themeHelper } from '../../styled';
import ModalWithButton from '../../components/ModalWithButton';
import InvisibleButton from '../../components/InvisibleButton';
import Drive from '../../icons/Drive';
import FlexLayout from '../../components/Layouts/FlexLayout';
import FormattedForm, { InputType } from '../../components/FormattedForm';
import { InputOptions } from '../../components/FormattedForm';
import HelpLink from '../../components/HelpLink';
import { success } from '../../components/toastr';
import ExternalDataVolumeAccessSelector from './ExternalDataVolumeAccessSelector';
import { SUPPORT_ARTICLE } from '../../core/supportUtil';
import { getErrorMessage } from '../../components/renderers/helpers';
import Tag from '@domino/ui/dist/components/Tag/Tag'

const StyledInvisibleButton = styled(InvisibleButton)`
  &.ant-btn {
    padding: 0;
    width: 100%;
  }
`;
const StyledFlexLayout = styled(FlexLayout)`
  color: ${colors.doveGreyDarker};
  font-size: ${themeHelper('fontSizes.large')};
  font-weight: ${themeHelper('fontWeights.normal')};
`;
const Content = styled.div`
  .row-group{
    margin-bottom: ${themeHelper('paddings.medium')};
  }
  .ant-legacy-form-item-label label {
    color: ${colors.emperorGrey};
  }
  .ant-legacy-form-item {
    margin: 0;
  }
`;
const StyledParagraph = styled.p`
 font-size: ${themeHelper('fontSizes.tiny')};
 margin-bottom: 0;
 line-height: ${themeHelper('fontSizes.medium')};
`;

export interface Props {
  externalVolume: ExternalVolume;
  editModalContainer?: HTMLDivElement | null;
  onUpdate: () => void;
  hybridEnabled?: boolean;
}

export interface State {
  users: string[];
  newDataPlanes: DominoDataplaneDataPlaneDto[];
}
const defaultFields = (
  externalVolume: ExternalVolume,
  onChangeUsers: (users: string[]) => void,
  users: string[]
) => [
  [
    {
      inputType: 'input' as InputType,
      inputOptions: {
        key: 'name',
        label: 'Name',
        validated: true,
        validators: [
          {
            checker: (value: string) => !value,
            errorCreator: () => 'Please enter a name.'
          }
        ]
      } as InputOptions
    }
  ],
  [
    {
      inputType: 'input' as InputType,
      inputOptions: {
        key: 'mountPath',
        label: 'Relative Mount Path',
        validated: true,
        validators: [
          {
            checker: (value: string) => !value,
            errorCreator: () => 'Please enter a mount path.'
          },
          {
            checker: (value: string) => {
              return value.search(/^(\/)/) > -1;
            },
            errorCreator: () => 'Mount path should not start with "/".'
          },
          {
            checker: (value: string) => {
              return value.includes('..');
            },
            errorCreator: () => 'Mount path should not contain ".."'
          }
        ],
        help: (
          <>
            This path is relative to a default root path. <HelpLink
              text={'Read more in docs.'}
              showIcon={false}
              articlePath={SUPPORT_ARTICLE.EXTERNAL_DATA_VOLUMES}
            />
          </>
        )
      } as InputOptions
    }, {
      inputType: 'checkbox' as InputType,
      inputOptions: {
        key: 'readOnly',
        label: 'Mount as read-only',
      }
    }
  ],
  [
    {
      inputType: 'input' as InputType,
      inputOptions: {
        key: 'description',
        label: 'Description'
      } as InputOptions
    }
  ],
  [
    {
      inputType: 'custom' as InputType,
      inputOptions: {
        key: 'isPublic',
        label: 'Volume Access',
        Component: (props: any) => (
          <ExternalDataVolumeAccessSelector
            isPublic={externalVolume.isPublic}
            users={users}
            onChangeUsers={onChangeUsers}
            onAccessChange={props.onFieldChange}
            {...props}
          />
        )
      }
    }
  ],
];

const dataPlaneField = (
  externalVolume: ExternalVolume,
  newDataPlanes: DominoDataplaneDataPlaneDto[],
) => [
  {
    inputType: 'custom' as InputType,
    inputOptions: {
      key: 'dataPlanes',
      label: 'Data Planes',
      Component: () => {
        const newIds = newDataPlanes.map(dp => dp.id);
        const oldIds = externalVolume.dataPlanes.map(dp => dp.id);
        const newDps = newDataPlanes.filter(dp => !oldIds.includes(dp.id));
        const expiredDps = externalVolume.dataPlanes.filter(dp => !newIds.includes(dp.id));
        const unchangedDps = newDataPlanes.filter(dp => oldIds.includes(dp.id));
        return (<>
          {unchangedDps.length > 0 && <StyledParagraph>Existing Data Planes already enabled for this volume.</StyledParagraph>}
          {unchangedDps.map(dataPlane => (
            <Tag key={dataPlane.id}>{dataPlane.name}</Tag>
          ))}
          {newDps.length > 0 && <StyledParagraph>These new Data Planes have been detected and will be enabled for this volume.</StyledParagraph>}
          {newDps.map(dataPlane => (
            <Tag key={dataPlane.id} color={colors.success}>{dataPlane.name}</Tag>
          ))}
          {expiredDps.length > 0 && <StyledParagraph>These Data Planes are no longer available and will be removed.</StyledParagraph>}
          {expiredDps.map(dataPlane => (
            <Tag key={dataPlane.id} color={colors.error}>{dataPlane.name}</Tag>
          ))}
        </>)
      }
    }
  }
]

const fields = (
  hybridEnabled: boolean | undefined,
  externalVolume: ExternalVolume,
  newDataPlanes: DominoDataplaneDataPlaneDto[],
  onChangeUsers: (users: string[]) => void,
  users: string[]
) => hybridEnabled ? [...defaultFields(externalVolume, onChangeUsers, users), dataPlaneField(externalVolume, newDataPlanes)] : defaultFields(externalVolume, onChangeUsers, users);

const Title: React.FunctionComponent = () => (
  <StyledFlexLayout justifyContent="flex-start" itemSpacing={8}>
    <Drive width={20} height={15} primaryColor={colors.mineShaftColor}/>
    <div>Edit an External Volume</div>
  </StyledFlexLayout>
);
class EditExternalDataVolume extends React.Component<Props, State> {
  state: State = {
    users: this.props.externalVolume.users,
    newDataPlanes: this.props.externalVolume.dataPlanes
  };

  updateExternalDataVolume = async (dataMount: ExternalVolume) => {
    const mountPath = dataMount.mountPath.trim();
    if (!R.equals(this.props.externalVolume.mountPath, mountPath)) {
      try {
        const isValidMountPath = await isMountPathValid({mountPath: mountPath});
        if (!isValidMountPath) {
          return Promise.reject('Please enter a valid mount path');
        }
      } catch (e) {
        return Promise.reject(await getErrorMessage(e, 'Please enter a valid mount path'));
      }
    }
    if (dataMount.isPublic || !R.isEmpty(this.state.users)) {
      return updateDataMount({
        datamountId: this.props.externalVolume.id,
        body: R.mergeDeepRight(dataMount, {
          users: dataMount.isPublic ? [] : this.state.users,
          mountPath: mountPath,
          dataPlaneIds: Array.from(this.state.newDataPlanes, dp => dp.id)
        })
      }).then(() => {
        this.props.onUpdate();
        success(`Volume '${dataMount.name}' has been updated successfully!`);
      });
    } else {
      return Promise.reject('Please select accessibility');
    }
  }

  
  componentDidMount = () => {
    const loadUpdatedDataPlanes = async () => {
      const pvcs = await getAllPvcsByType({ volumeType: this.props.externalVolume.volumeType});
      const newMount = pvcs.find((pvc) => pvc.pvcName===this.props.externalVolume.pvcName);
      if (newMount) {
        this.setState({
          newDataPlanes: newMount.dataPlanes
        })
      }
    }
    loadUpdatedDataPlanes()
  }

  onChangeUsers = (selectedUsers: string[]) => {
    this.setState({
      users: selectedUsers
    });
  }

  render() {
    return (
      <ModalWithButton
        showFooter={false}
        ModalButton={StyledInvisibleButton}
        openButtonLabel="Edit"
        modalProps={{
          title: <Title/>,
          bodyStyle: {
            paddingTop: '0'
          },
          getContainer: () => this.props.editModalContainer
        }}
        handleFailableSubmit={this.updateExternalDataVolume}
      >
        {(modalContext: ModalWithButton) => (
          <Content>
            <FormattedForm
              defaultValues={this.props.externalVolume}
              submitOnEnter={true}
              asModal={true}
              submitLabel="Update"
              onCancel={modalContext.handleCancel}
              onSubmit={modalContext.handleOk}
              fieldMatrix={fields(
                this.props.hybridEnabled,
                this.props.externalVolume,
                this.state.newDataPlanes,
                this.onChangeUsers,
                this.state.users
              )}
            />
          </Content>
        )}
      </ModalWithButton>
    );
  }
}

export default EditExternalDataVolume;
