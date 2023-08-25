import * as React from 'react';
import { equals, has, isNil, values as rValues, omit } from 'ramda';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import { getPrincipal } from '@domino/api/dist/Auth';
import styled from 'styled-components';
import { SeparatedToolbar } from '../components/Toolbar';
import { startJob } from '@domino/api/dist/Jobs';
import { getCommand } from '@domino/ui/dist/utils/common';
import { ProjectSectionRestfulJobsLauncher } from '../runs/JobsLauncherWithNucleus';
import ValidatedForm, { InputValues, State } from '../components/ValidatedForm';
import Button from '../components/Button/Button';
import { themeHelper } from '../styled/themeUtils';
import DominoLogoOnSubmitButton from '../components/DominoLogoOnSubmitButton';
import RenameFileDirModal from './RenameFileDirModal';
import {
  createNewFilePath,
  getNewFilePath,
  getFileDirName,
  validateFileDirName,
} from '../utils/shared-components/validateFileNameFormUtil';
import { EntityType } from './types';
import {
  clearPreviousDataStorage,
  getPreviouslySelectedValue,
  previousDataStorageKeys
} from '../confirmRedirect/confirmRedirectToLogin';
import { warning as ToastWarning } from '../components/toastr';
import { RELOGIN_WS_LAUNCH_FAIL } from '../restartable-workspaces/Launcher';
import { RELOGIN_JOB_START_FAIL }  from '../navbar/projects/SubNavJobLauncher';
import { runDashboardRun } from '../core/routes';
import LaunchNotebook from './LaunchNotebook';
import { launchNotebookAfterRelogin, ReturnValues } from './LaunchNotebookUtil';
import tooltipRenderer from '../components/renderers/TooltipRenderer';
import { colors } from '../styled';

const cancelLabel = 'Cancel';
const saveAndRunLabel = 'Save and Run';

const EditContainer = styled.div`
  display: inline-flex;
`;

const DisabledInput = styled.div`
  margin-right: ${themeHelper('margins.tiny')};
`;

type FileNameEditorContainerProps = { hasButtons: boolean };
const FileNameEditorContainer = styled.div<FileNameEditorContainerProps>`
  display: inline-block;
  ${props => props.hasButtons ? 'top: 3px;' : 'top: 1px;'}
  font-size: 16px;
  position: relative;
  #open-modal-button {
    color: ${colors.white}
  }
`;

const FileName = styled.span`
  padding-right: 10px;
  color: #172434;
`;

const StyledForm = styled.div`
  position: relative;
  top: 3px;
  color: #172434;
  display: inline-flex;
  align-items: center;
  .ant-legacy-form-explain {
    width: 200px;
  }
  .has-error.has-feedback .ant-legacy-form-item-children-icon {
    height: 13px;
    right: 5px;
  }
  .ant-legacy-form-item-control {
    line-height: 22px;
  }
`;

const StyledFormInput = styled.div`
  min-width: 200px;
  display: inline-block;

  &.editing {
    width: auto;
    min-width: auto;
  }

  input {
    font-size: 16px;
    border: 1px solid #DDDDDD;
    border-radius: 3px;
    box-shadow: none;
  }
  .ant-input::placeholder {
    font-style: normal
  }
`;

const ErrorsContainer = styled.div`
  font-size: 13px;
  color: red;
  position: absolute;
  top: 35px;
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  button {
    margin-left: 15px;
  }
`;

const ButtonContainer = styled.div`
  height: fit-content; 
`;

export interface DefaultFormFieldsProps {
  path?: string;
  content?: string;
  mustRun?: boolean;
  redirectToOverviewPageOnSave: boolean;
}

const DefaultFormFields = ({
  path,
  content,
  mustRun = false,
  redirectToOverviewPageOnSave,
}: DefaultFormFieldsProps) => (
  <>
    <input id="path" type="hidden" name="path" value={path} />
    <input id="content" type="hidden" name="content" value={content} />
    <input id="mustRun" type="hidden" name="mustRun" value={`${mustRun}`} />
    <input
      id="redirectToOverviewPageOnSave"
      type="hidden"
      name="redirectToOverviewPageOnSave"
      value={`${redirectToOverviewPageOnSave}`}
    />
  </>
);

export type FileNamEditorProps = {
  resetStateOnSuccess: boolean;
  isFileRunnableAsApp: boolean;
  isFileRunnableFromView: boolean;
  isFileLaunchableAsNotebook: boolean;
  publishAppEndpoint: string;
  atHeadCommit: boolean;
  action: string;
  ownerUsername: string;
  projectName: string;
  oldPath: string;
  redirectToOverviewPageOnSave: boolean;
  creating?: boolean;
  editing: boolean;
  saveAndRunHandler?: () => void;
  defaultValues?: {};
  showSaveAndRun: boolean;
  cancelLink?: string;
  filename?: string;
  locationUrl: string;
  csrfToken: string;
  currentCommitId: string;
  formProps?: {};
  getEditor?: () => any;
  canEditName?: boolean;
  enableExternalDataVolumes?: boolean;
  enableSparkClusters?: boolean;
  enableRayClusters?: boolean;
  enableDaskClusters?: boolean;
  projectId?: string;
};

export type LocalState = {
  content?: string;
  mustRun: boolean;
  isTouched: boolean;
};

class FileNameEditor extends ValidatedForm<FileNamEditorProps, State & LocalState> {

  static defaultProps = {
    formProps: {},
    defaultValues: {},
    creating: false,
    editing: false,
    saveAndRunHandler: () => undefined,
    showSaveAndRun: true,
    cancelLink: '',
    filename: '',
    locationUrl: '',
    canEditName: true,
  };

  oldName?: string;

  constructor(props: FileNamEditorProps) {
    super(props);
    const { creating } = props;

    this.oldName = creating ? undefined : getFileDirName(props.oldPath.trim());

    this.state = {
      content: undefined,
      mustRun: false,
      showAfterFormMessage: false,
      submitted: false,
      submitError: '',
      values: {
        ...props.defaultValues,
        newName: this.oldName,
      },
      errors: {},
      isTouched: false
    };
  }

  async componentDidMount () {
    const { ownerUsername, projectName, csrfToken, projectId, getEditor } = this.props;
    // Check if any launch notebook details stored after credentials expired. If any, pick details and launch notebook
    const result: ReturnValues = await launchNotebookAfterRelogin(ownerUsername, projectName, csrfToken, projectId);
    if (result === ReturnValues.RELOGIN_FAILED_TO_ACQUIRE_CREDENTIALS) {
      ToastWarning(RELOGIN_WS_LAUNCH_FAIL, '', 0);
    }

    const previousData = getPreviouslySelectedValue(previousDataStorageKeys.runJobFromFiles);
    if (!isNil(previousData) && !isNil(this.props.projectId)) {
      this.submitStartRunFormWithPreReloginValues(previousData);
    }

    if (getEditor && getEditor()) {
      const editor = getEditor();
      editor.on("input", () => {
        this.setState({isTouched: editor.session.getUndoManager().hasUndo()})
      })
    }
  }

  submitStartRunFormWithPreReloginValues = async (previousData: string) => {
    try {
      const principal = await getPrincipal({});
      const previousUserId = getPreviouslySelectedValue(previousDataStorageKeys.credPropInitiator);
      if (equals(previousUserId, principal.canonicalId!)) {
        const payload = JSON.parse(previousData);
        if (equals(payload.projectId, this.props.projectId)) {
          startJob({ body: payload })
            .then(result => {
              clearPreviousDataStorage(previousDataStorageKeys.runJobFromFiles);
              clearPreviousDataStorage(previousDataStorageKeys.credPropInitiator);
              if (has('redirectPath', result)) {
                ToastWarning(RELOGIN_JOB_START_FAIL, '', 0);
              } else {
                window.location.assign(runDashboardRun(result.id)(this.props.ownerUsername, this.props.projectName));
              }
            });
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }

  validate = (newData: InputValues) => {
    const {
      newName = '',
    } = newData;
    const {
      editing,
    } = this.props;

    return {
      newName: editing ? undefined : validateFileDirName(newName.trim(), (this.oldName || '')),
    } as any; // toBe typed properly from inception
  }

  shouldDisableSubmit = (newData: InputValues): boolean =>
    !!rValues(this.validate(newData)).find((value?: string) => !!value)

  submitFormElement = () => {
    const form = document.getElementById('file-view-editable-file-path') as (null | HTMLFormElement);
    if (form) {
      form.submit();
    }
  }

  handleSaveAndRun = () => {
    const { getEditor } = this.props;
    if (getEditor && getEditor()) {
      const content = getEditor().getValue();
      this.setState({
        content,
        mustRun: true,
      }, () => {
        this.submitFormElement();
      });

    } else {
      console.error('Could not find ace editor instance');
    }
  }

  renderForm = () => {
    const {
      isFileRunnableAsApp,
      csrfToken,
      isFileRunnableFromView,
      isFileLaunchableAsNotebook,
      publishAppEndpoint,
      atHeadCommit,
      showSaveAndRun,
      cancelLink,
      filename,
      creating,
      editing,
      redirectToOverviewPageOnSave,
      oldPath,
      currentCommitId,
      ownerUsername,
      projectName,
      action,
      enableExternalDataVolumes,
      projectId,
      enableSparkClusters,
      enableRayClusters,
      enableDaskClusters
    } = this.props;
    const {
      content,
      mustRun,
      submitted,
      submitError,
      values,
      isTouched
    } = this.state;
    const submitLabel = 'Save';

    if (creating) {
      return (
        <StyledForm>
          <input type="hidden" name="createFile" value="true" />
          <DefaultFormFields
            path={createNewFilePath(oldPath, values.newName)}
            content={content}
            mustRun={mustRun}
            redirectToOverviewPageOnSave={redirectToOverviewPageOnSave}
          />
          <ActionsContainer>
            {this.inputBootstrapper('newName', x => x.target.value)(({ value, onFieldChange }: any) => (
                <StyledFormInput>
                  {
                    tooltipRenderer('File name', <span>
                      <Input
                        onChange={onFieldChange}
                        id="newNameInput"
                        defaultValue={value}
                        disabled={submitted}
                        aria-label="File name input"
                        placeholder="File name"
                        data-test="new-name-input"
                      />
                    </span>)
                  }
                </StyledFormInput>
              )
            )}
            <SeparatedToolbar alignItems="unset">
              <Button href={cancelLink} btnType="secondary">
                {cancelLabel}
              </Button>
              {showSaveAndRun && (
                <Button 
                  onClick={this.handleSaveAndRun} 
                  btnType="primary"
                >
                  {saveAndRunLabel}
                </Button>
              )}
              <DominoLogoOnSubmitButton
                htmlType="submit"
                disabled={this.shouldDisableSubmit(values)}
                submitError={submitError}
                submitted={submitted}
                onSubmit={this.handleSubmit}
                label={submitLabel}
              />
            </SeparatedToolbar>
          </ActionsContainer>
          <ErrorsContainer>
            {this.renderSubmitError()}
          </ErrorsContainer>
        </StyledForm>
      );
    }

    if (editing) {
      return (
        <StyledForm>
          <input type="hidden" name="createFile" value="false" />
          <DefaultFormFields
            path={getNewFilePath(values.newName, oldPath)}
            content={content}
            mustRun={mustRun}
            redirectToOverviewPageOnSave={redirectToOverviewPageOnSave}
          />
          <ActionsContainer>
            <EditContainer>
              {this.renderDisabledInputGroup()}
              {this.getEditButton()}
            </EditContainer>
            <SeparatedToolbar alignItems="unset">
              <Button href={cancelLink} btnType="secondary">
                {cancelLabel}
              </Button>
              {showSaveAndRun &&
                tooltipRenderer(!isTouched && 'There are no changes to save.',(
                  <ButtonContainer>
                    <Button
                      onClick={this.handleSaveAndRun}
                      btnType="primary"
                      disabled={!isTouched}
                    >
                      {saveAndRunLabel}
                    </Button>
                  </ButtonContainer>
                  )  
                )
              }
              {
                tooltipRenderer(!isTouched && 'There are no changes to save.', (
                  <ButtonContainer>
                    <DominoLogoOnSubmitButton
                      htmlType="submit"
                      disabled={this.shouldDisableSubmit(values) || !isTouched}
                      submitError={submitError}
                      submitted={submitted}
                      onSubmit={this.handleSubmit}
                      label={submitLabel}
                    />
                  </ButtonContainer>
                  )
                )
              }
            </SeparatedToolbar>
          </ActionsContainer>
          <ErrorsContainer>
            {this.renderSubmitError()}
          </ErrorsContainer>
        </StyledForm>
      );
    }

    return (
      <FileNameEditorContainer
        hasButtons={isFileLaunchableAsNotebook || isFileRunnableAsApp || isFileRunnableFromView}
      >
        <ActionsContainer>
          <EditContainer>
            <FileName>
              {filename}
            </FileName>
            {this.getEditButton()}
          </EditContainer>
          <SeparatedToolbar>
            {isFileLaunchableAsNotebook && (
              <LaunchNotebook
                csrfToken={csrfToken}
                commitId={currentCommitId}
                filePath={oldPath}
                btnLabel="Launch Notebook"
                submitUrl={action}
                reloginDataStorageKey={previousDataStorageKeys.launchNotebookFromFiles}
                ownerUsername={ownerUsername}
                projectName={projectName}
                showButton={true}
                projectId={projectId!}
              />
            )}
            {isFileRunnableAsApp && (
              <Button href={publishAppEndpoint}>
                Publish
              </Button>
            )}
            {!isFileRunnableAsApp && isFileRunnableFromView && (
              <ProjectSectionRestfulJobsLauncher
                commandToRun={getCommand(oldPath, true)}
                commitId={atHeadCommit ? undefined : currentCommitId}
                atHeadCommit={atHeadCommit}
                preReloginDataStorageKey={previousDataStorageKeys.runJobFromFiles}
                enableExternalDataVolumes={enableExternalDataVolumes}
                sparkClustersEnabled={enableSparkClusters}
                rayClustersEnabled={enableRayClusters}
                daskClustersEnabled={enableDaskClusters}
                fromFilesBrowser={true}
              />
            )}
          </SeparatedToolbar>
        </ActionsContainer>
      </FileNameEditorContainer>
    );
  }

  getEditButton() {
    return (this.props.canEditName) ? (
      <RenameFileDirModal
        {...omit(['defaultValues'], this.props)}
        entityType={EntityType.FILE}
        defaultValues={{
          newName: this.state.values.newName,
        }}
      /> ) : null;
  }

  onSubmit = () => {
    // uses the code in fileCreateOrEdit.scala.html
    // to submit data
    return new Promise((resolve, reject) => {
      const { getEditor } = this.props;
      if (getEditor && getEditor()) {
        const content = getEditor().getValue();
        this.setState({
          content,
          mustRun: false,
        }, () => {
          // submit
          this.submitFormElement();
          resolve({});
        });

      } else {
        reject('Could not find ace editor instance');
      }
    });
  }

  renderDisabledInputGroup() {
    const {
      editing,
    } = this.props;
    const formInputClass = editing ? 'editing' : undefined;

    return (
      this.inputBootstrapper('newName')(({ value }: { value: any }) => (
          <StyledFormInput className={formInputClass}>
            <DisabledInput>
              {value}
              <input type="hidden" id="newNameInput" value={value} />
            </DisabledInput>
          </StyledFormInput>
        )
      )
    );
  }

  renderSubmitError() {
    const {
      submitError,
    } = this.state;

    return (
      <div>
        {submitError}
      </div>
    );
  }

  handleSubmit = () => {
    const {
      values,
    } = this.state;
    this._onSubmit(values, this.state, this.props, this);
  }

  render() {
    return this.renderValidatedForm(this.renderForm);
  }
}

export default FileNameEditor;
