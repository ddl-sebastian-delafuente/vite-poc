import * as React from 'react';
import { ChangeEvent } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import Select from '@domino/ui/dist/components/Select';
import {
  DominoDatamountApiDataMountDto as ExternalVolume
} from '@domino/api/dist/types';
import {
  getAvailablePvcsByType,
  isMountPathValid,
  registerDataMount
} from '@domino/api/dist/Datamount';
import { Checkbox, CheckboxChangeEvent } from '@domino/ui/dist/components';
import { colors, themeHelper } from '../../styled';
import ModalWithButton from '../../components/ModalWithButton';
import StepperContent from '../../components/StepperContent/StepperContent';
import { DDFormItem } from '../../components/ValidatedForm';
import HelpLink from '../../components/HelpLink';
import { error, success } from '../../components/toastr';
import ExternalDataVolumeAccessSelector from './ExternalDataVolumeAccessSelector';
import { SUPPORT_ARTICLE } from '../../core/supportUtil';
import { getErrorMessage } from '../../components/renderers/helpers';
import WaitSpinner from '../../components/WaitSpinner';
import { getVolumeType } from '../index';
import Tag from '@domino/ui/dist/components/Tag/Tag'
import InfoTooltipIcon from '@domino/ui/dist/icons/InfoTooltipIcon';
import Radio, { RadioChangeEvent } from '@domino/ui/dist/components/Radio';
import useStore from '../../globalStore/useStore';
import { getAppName } from '../../utils/whiteLabelUtil';
import { PlusOutlined } from '@ant-design/icons';

const Container = styled.div`
  .ant-legacy-form-item-label label {
    color: ${colors.emperorGrey};
  }
`;
const StyledSelect = styled(Select)`
  width: 100%;
`;
const StepDescription = styled.div`
  font-size: ${themeHelper('fontSizes.tiny')};
  color: ${colors.brownGrey};
  width: 100px;
`;
const StyledDDFormItem = styled(DDFormItem)`
  .ant-legacy-form-item-control {
    height: 160px;
    overflow-y: scroll;
    background: ${colors.white};
    border: 1px solid ${colors.btnGrey};
    border-radius: ${themeHelper('borderRadius.standard')};
    padding: 0 ${themeHelper('paddings.small')};
  }
  &.ant-legacy-form-item {
    margin-bottom: 0;
  }
`;
const ValidationError = styled.div`
  color: ${colors.torchRed};
`;

const openButtonProps = {
  icon: <PlusOutlined />,
  btnType: 'btn-with-icon'
};

export enum VolumeType {
  Nfs = 'Nfs',
  Smb = 'Smb',
}

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

interface VolumeStepContentProps {
  volumeType?: VolumeType;
  showVolumeTypeError: boolean;
  handleVolumeTypeChange: (value: string) => void;
  selectedVolume?: ExternalVolume;
  showSelectedVolumeError: boolean;
  handleSelectedVolumeChange: (e: RadioChangeEvent) => void;
  availableVolumes: ExternalVolume[];
  isLoading: boolean;
  hybridEnabled?: boolean;
}

const DataplanesLabel = () => {
  const { whiteLabelSettings } = useStore();
  const iconTooltipText = `Your deployment is running a hybrid ${getAppName(whiteLabelSettings)} Nexus infrastructure. Nexus provides regional Data Planes as separate Kubernetes clusters to provide additional security between data and hardware. For more information review the Nexus documentation.`;
  return (
    <React.Fragment>
      Data Planes <InfoTooltipIcon title={iconTooltipText} />
    </React.Fragment>
  );
}

const VolumeStepContent: React.FunctionComponent<VolumeStepContentProps> = (props) => (
  <Container>
    <DDFormItem
      label="Volume Type"
      dashedUnderline={true}
      error={props.showVolumeTypeError && 'Please select Volume Type'}
    >
      <StyledSelect
        onSelect={props.handleVolumeTypeChange}
        placeholder="Select a volume type"
        defaultValue={props.volumeType}
      >
        <Select.Option value="Nfs">NFS</Select.Option>
        <Select.Option value="Smb">Windows Share (SMB)</Select.Option>
        <Select.Option value="Efs">EFS</Select.Option>
        <Select.Option value="Generic">Generic</Select.Option>
      </StyledSelect>
    </DDFormItem>
    <StyledDDFormItem
      label="Available Volumes"
      dashedUnderline={true}
    >
      {
        props.isLoading ?
          <WaitSpinner
            height={25}
            width={25}
            margin={'10px 5px'}
          /> :
          R.isEmpty(props.availableVolumes) ?
            <span>No supported volumes found for the selected type.</span> :
            <Radio
              onChange={props.handleSelectedVolumeChange}
              defaultValue={props.selectedVolume && props.selectedVolume.id}
              spaceSize="small"
              items={[
                ...R.map(
                  (availableVolume) => {
                    return {
                      key: availableVolume.id,
                      value: availableVolume.id,
                      style: radioStyle,
                      label: availableVolume.name
                    }
                  },
                  props.availableVolumes
                )
              ]}
            />
      }
    </StyledDDFormItem>
    {props.hybridEnabled &&
      <DDFormItem
        label={<DataplanesLabel />}
        dashedUnderline={true}
        help={!props.selectedVolume && 'Select a volume above to view available Data Planes.'}
      >
        {props.selectedVolume &&
          <>
            {props.selectedVolume.dataPlanes.map(dataPlane => (
              <Tag key={dataPlane.id} color={colors.success}>{dataPlane.name}</Tag>
            ))}
          </>
        }
      </DDFormItem>
    }
    {props.showSelectedVolumeError && <ValidationError>Please select a Volume</ValidationError>}
  </Container>
);

interface ConfigurationStepContentProps {
  name?: string;
  showNameError: boolean;
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  mountPath: string;
  showMountPathError: boolean;
  handleMountPathChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isReadOnly: boolean;
  handleReadOnlyChange: (e: CheckboxChangeEvent) => void;
  description?: string;
  handleDescriptionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  mountPathErrorMsg: string;
}
const ConfigurationStepContent: React.FunctionComponent<ConfigurationStepContentProps> = (props) => (
  <Container>
    <DDFormItem label="Name" error={props.showNameError && 'Please enter a name'}>
      <Input onChange={props.handleNameChange} value={props.name} />
    </DDFormItem>
    <DDFormItem
      label="Relative Mount Path"
      help={(
        <>
          This path is relative to a default root path. <HelpLink
            text={'Read more in docs.'}
            showIcon={false}
            articlePath={SUPPORT_ARTICLE.EXTERNAL_DATA_VOLUMES}
          />
        </>
      )}
      error={props.showMountPathError && (props.mountPathErrorMsg || 'Please enter a mount path')}
    >
      <Input data-test="register-mountpath" onChange={props.handleMountPathChange} value={props.mountPath} />
    </DDFormItem>
    <DDFormItem>
      <Checkbox onChange={props.handleReadOnlyChange} defaultChecked={props.isReadOnly}>
        Mount as read-only
      </Checkbox>
    </DDFormItem>
    <DDFormItem label="Description">
      <Input onChange={props.handleDescriptionChange} defaultValue={props.description} />
    </DDFormItem>
  </Container>
);

interface AccessStepContentProps {
  handleAccessChange: (isPublic: boolean) => void;
  onChangeUsers: (users: string[]) => void;
  users: string[];
  isPublic: boolean;
  showVolumeAccessError: boolean;
}
const AccessStepContent: React.FunctionComponent<AccessStepContentProps> = (props) => (
  <Container>
    <DDFormItem
      label="Volume Access"
      dashedUnderline={true}
    >
      <div>
        <ExternalDataVolumeAccessSelector
          onAccessChange={props.handleAccessChange}
          onChangeUsers={props.onChangeUsers}
          users={props.users}
          isPublic={props.isPublic}
        />
        {props.showVolumeAccessError && <ValidationError>Please select accessibility</ValidationError>}
      </div>
    </DDFormItem>
  </Container>
);
export interface AvailableVolume {
  id: string;
  name: string;
}

export interface Props {
  onRegister: () => void;
  hybridEnabled?: boolean;
}
export interface State {
  isVolumeStepValidationExecuted: boolean;
  isMountPathTouched: boolean;
  isNameTouched: boolean;
  isAccessStepValidationExecuted: boolean;
  volumeType: VolumeType;
  showVolumeTypeError: boolean;
  selectedVolume?: ExternalVolume;
  showSelectedVolumeError: boolean;
  name?: string;
  showNameError: boolean;
  mountPath: string;
  showMountPathError: boolean;
  isReadOnly: boolean;
  description?: string;
  isPublic: boolean;
  users: string[];
  availableVolumes: ExternalVolume[];
  mountPathErrorMsg: string;
  showVolumeAccessError: boolean;
  isLoading: boolean;
}

const defaultState = {
  isVolumeStepValidationExecuted: false,
  isNameTouched: false,
  isMountPathTouched: false,
  isAccessStepValidationExecuted: false,
  volumeType: VolumeType.Nfs,
  showVolumeTypeError: false,
  selectedVolume: undefined,
  showSelectedVolumeError: false,
  name: undefined,
  showNameError: false,
  mountPath: '',
  showMountPathError: false,
  isReadOnly: true,
  description: undefined,
  isPublic: true,
  users: [],
  mountPathErrorMsg: '',
  showVolumeAccessError: false,
  isLoading: false
};

class RegisterExternalVolumeData extends React.Component<Props, State> {
  state: State = {
    ...defaultState,
    availableVolumes: []
  };
  modalContainer = React.createRef<HTMLDivElement>();

  registerExternalDataVolume = () => {
    const { name, description, volumeType, selectedVolume, users, isReadOnly, mountPath,
      isPublic } = this.state;
    if (isPublic || !R.isEmpty(users)) {

      return registerDataMount({
        body: {
          name: R.defaultTo('')(name),
          description: description,
          volumeType: R.defaultTo(VolumeType.Nfs)(volumeType),
          pvcName: selectedVolume ? selectedVolume.pvcName : '',
          pvId: selectedVolume ? selectedVolume.pvId : '',
          mountPath: mountPath.trim(),
          users: users,
          readOnly: isReadOnly,
          isPublic: isPublic,
          dataPlaneIds: selectedVolume ? Array.from(selectedVolume.dataPlanes, dp => dp.id) : []
        }
      }).then(() => {
        this.resetState();
        this.props.onRegister();
        success(`Volume '${name}' has been added successfully!`);
      }).catch(async (e) => {
        const failureCode = e.status;
        console.warn(e);
        if (failureCode != 403) {
          error(await getErrorMessage(e, 'Failed to register external data volume'));
        }
        return Promise.reject(e);
      });
    } else {
      this.setState({ showVolumeAccessError: true });
      return Promise.reject('Please select accessibility');
    }
  }

  onVolumeStepComplete = () => {
    this.setState({
      isVolumeStepValidationExecuted: true,
      showVolumeTypeError: !this.state.volumeType,
      showSelectedVolumeError: !this.state.selectedVolume
    });
    return !!this.state.volumeType && !!this.state.selectedVolume;
  }

  onConfigurationStepComplete = async () => {
    const mountPath = this.state.mountPath.trim();
    if (!R.isEmpty(mountPath)) {
      try {
        const isValidMountPath = await isMountPathValid({ mountPath: mountPath });
        const includesDotDot = mountPath.includes('..');
        this.setState({
          showNameError: !this.state.name,
          isMountPathTouched: true,
          isNameTouched: true,
          showMountPathError: !mountPath || includesDotDot || !isValidMountPath,
          mountPathErrorMsg: includesDotDot ? 'Mount path should not contain ".."' :
            isValidMountPath ? '' : 'Please enter a valid mount path'
        });
        return !this.checkConfigurationStepError(false);
      } catch (e) {
        this.setState({
          showNameError: !this.state.name,
          showMountPathError: true,
          isMountPathTouched: true,
          isNameTouched: true,
          mountPathErrorMsg: await getErrorMessage(e, 'Please enter a valid mount path')
        });
        return false;
      }
    } else {
      this.setState({
        showMountPathError: true,
        showNameError: !this.state.name,
        isMountPathTouched: true,
        isNameTouched: true
      });
      return false;
    }
  }

  handleVolumeTypeChange = (value: VolumeType) => {
    this.setState({
      volumeType: value,
      showVolumeTypeError: !value,
    }, () => this.getAvailableExternalVolumesByType());
  }

  handleSelectedVolumeChange = (e: RadioChangeEvent) => {
    const selectedId = e.target.value;
    const selectedVolume: ExternalVolume = R.find(R.propEq('id', selectedId))(this.state.availableVolumes);
    this.setState({
      selectedVolume: selectedVolume,
      showSelectedVolumeError: !selectedId,
      name: selectedVolume.pvcName,
      mountPath: selectedVolume.pvcName,
      showNameError: R.either(R.isEmpty, R.isNil)(selectedVolume.pvcName),
      showMountPathError: R.either(R.isEmpty, R.isNil)(selectedVolume.pvcName)
    });
  }

  handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.setState({
      isNameTouched: true,
      name: value,
      showNameError: !value
    });
  }

  handleMountPathChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = (e.target.value).replace(/^(\/)/, '');
    this.setState({
      mountPath: value,
      isMountPathTouched: true,
      showMountPathError: !value || value.includes('..'),
      mountPathErrorMsg: value.includes('..') ? 'Mount path should not contain ".."' : ''
    });
  }

  handleReadOnlyChange = (e: CheckboxChangeEvent) => {
    this.setState({ isReadOnly: e.target.checked });
  }

  handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) =>
    this.setState({ description: e.target.value })

  handleAccessChange = (isPublic: boolean) =>
    this.setState({ isPublic: isPublic, showVolumeAccessError: false })

  onChangeUsers = (selectedUsers: string[]) => {
    this.setState({
      users: selectedUsers,
      showVolumeAccessError: false
    });
  }

  getAvailableExternalVolumesByType = async () => {
    try {
      this.setState({
        isLoading: true
      });
      const availableVolumes = await getAvailablePvcsByType({ volumeType: this.state.volumeType });
      this.setState({ availableVolumes: availableVolumes, isLoading: false });
    } catch (e) {
      this.setState({
        isLoading: false
      });
      const failureCode = e.status;
      console.warn(e);
      if (failureCode != 403) {
        error('Failed to get available volumes');
      }
    }
  }

  checkConfigurationStepError = (validateTouchedFieldsOnly = true) => {
    const mountPath = this.state.mountPath.trim();
    const { name, isNameTouched, isMountPathTouched } = this.state;
    if (validateTouchedFieldsOnly) {
      if (!isMountPathTouched && !isNameTouched) {
        return undefined;
      }
      return (isMountPathTouched && (R.isNil(mountPath) || R.isEmpty(mountPath) || mountPath.includes('..'))) ||
        (isNameTouched && (R.isNil(name) || R.isEmpty(name)));
    }
    return (R.isNil(name) || R.isEmpty(name)) || R.isNil(mountPath) || R.isEmpty(mountPath) || mountPath.includes('..');
  }

  componentDidMount() {
    this.getAvailableExternalVolumesByType();
  }

  resetState = () => {
    this.setState(defaultState, () => this.getAvailableExternalVolumesByType());
  }

  render() {
    const {
      isVolumeStepValidationExecuted,
      isAccessStepValidationExecuted,
      volumeType,
      showVolumeTypeError,
      selectedVolume,
      showSelectedVolumeError,
      name,
      showNameError,
      mountPath,
      showMountPathError,
      isReadOnly,
      description,
      isPublic,
      users,
      availableVolumes,
      mountPathErrorMsg,
      showVolumeAccessError,
      isLoading
    } = this.state;
    const getSteps = (handleOk: (data: any) => Promise<any>) => [
      {
        title: 'Volume',
        content: (
          <VolumeStepContent
            isLoading={isLoading}
            volumeType={volumeType}
            showVolumeTypeError={showVolumeTypeError}
            handleVolumeTypeChange={this.handleVolumeTypeChange}
            selectedVolume={selectedVolume}
            showSelectedVolumeError={showSelectedVolumeError}
            handleSelectedVolumeChange={this.handleSelectedVolumeChange}
            availableVolumes={availableVolumes}
            hybridEnabled={this.props.hybridEnabled}
          />
        ),
        description: (
          <StepDescription>
            {R.join(', ', R.filter(val => !!val,
              [getVolumeType(volumeType), selectedVolume && selectedVolume.name]))}
          </StepDescription>
        ),
        onNavigationAttempt: this.onVolumeStepComplete,
        hasError: isVolumeStepValidationExecuted ? !this.state.volumeType || !this.state.selectedVolume : undefined
      },
      {
        title: 'Configuration',
        content: (
          <ConfigurationStepContent
            name={name}
            showNameError={showNameError}
            handleNameChange={this.handleNameChange}
            mountPath={mountPath}
            showMountPathError={showMountPathError}
            handleMountPathChange={this.handleMountPathChange}
            isReadOnly={isReadOnly}
            handleReadOnlyChange={this.handleReadOnlyChange}
            description={description}
            handleDescriptionChange={this.handleDescriptionChange}
            mountPathErrorMsg={mountPathErrorMsg}
          />
        ),
        description: (
          <StepDescription>
            {isReadOnly ? 'Read-Only' : 'Read-Write'}
          </StepDescription>
        ),
        isDisabled: showMountPathError,
        hasError: this.checkConfigurationStepError(),
        onNavigationAttempt: this.onConfigurationStepComplete,
      },
      {
        title: 'Access',
        content: (
          <AccessStepContent
            handleAccessChange={this.handleAccessChange}
            onChangeUsers={this.onChangeUsers}
            users={users}
            isPublic={isPublic}
            showVolumeAccessError={showVolumeAccessError}
          />
        ),
        description: (
          <StepDescription>
            {isPublic ? 'Everyone' :
              !R.isEmpty(users) && `${users.length} users and organizations`}
          </StepDescription>
        ),
        btnText: 'Register',
        isSuccessBtn: true,
        hasError: isAccessStepValidationExecuted ? false : undefined,
        onNavigationAttempt: (fromNavigationButton?: boolean) => {
          if (fromNavigationButton) {
            handleOk({});
          }
          return true;
        }
      }
    ];

    return (
      <div >
        <ModalWithButton
          openButtonLabel="Register External Volume"
          openButtonProps={openButtonProps}
          modalProps={{
            titleIconName: 'Drive',
            titleText: 'Register an External Volume',
            width: 760,
            bodyStyle: { padding: 0 },
            getContainer: () => this.modalContainer.current,
            destroyOnClose: true
          }}
          showFooter={false}
          handleCancel={this.resetState}
          handleFailableSubmit={this.registerExternalDataVolume}
          closable={true}
        >
          {(modalContext: ModalWithButton) => (
            <StepperContent
              steps={getSteps(modalContext.handleOk)}
              stepsWidth="185px"
              contentWidth="560px"
              height="550px"
              onCancel={modalContext.handleCancel}
              outlineSecondaryButton={true}
            />
          )}
        </ModalWithButton>
        <div ref={this.modalContainer} id="modal-mount" />
      </div >
    );
  }
}

export default RegisterExternalVolumeData;
