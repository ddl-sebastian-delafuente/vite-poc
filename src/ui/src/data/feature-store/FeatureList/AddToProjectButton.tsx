import { addFeatureViewToProject, getProjectsForFeatureView } from '@domino/api/dist/Featurestore';
import { Form } from 'antd';
import * as React from 'react';
import styled from 'styled-components';

import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal';
import Select, { OptionProp } from '../../../components/Select/Select';
import {
  error as raiseToastError,
  success,
} from '../../../components/toastr';
import { themeHelper } from '../../../styled/themeUtils';
import { Awaited } from '../../../utils/typescriptUtils'
import { useRemoteData } from '../../../utils/useRemoteData';

const StyledFormItem = styled(Form.Item)`
  font-weight: ${themeHelper('fontWeights.medium')};
`

const RaiseModalLink = styled.span`
  color: blue;
  cursor: pointer;
`

interface AddToProjectButtonProps {
  buttonStyle?: 'button' | 'link';
  buttonText?: string;
  featureViewId: string;
  onModalClosed?: () => void;
  onModalRaised?: () => void;
  originProjectId?: string;

  /**
   * If projectId is set, this will change how the button works
   * instead of opening a modal to select a project. The button
   * will now just add the feature view to a project
   */
  projectId?: string;
}

export const AddToProjectButton = ({
  buttonStyle,
  buttonText = '+ Add to Project',
  featureViewId,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onModalClosed = () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onModalRaised = () => {},
  originProjectId,
  projectId,
}: AddToProjectButtonProps) => {
  const [shouldShowModal, setShouldShowModal] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<string>();

  const {
    data: projects,
    refetch,
  } = useRemoteData<Awaited<ReturnType<typeof getProjectsForFeatureView>>>({
    canFetch: shouldShowModal,
    fetcher: () => getProjectsForFeatureView({ featureViewId: featureViewId }),
    initialValue: [],
  });

  const selectOptions = React.useMemo(() => {
    return projects.reduce((memo, { name, id }) => {
      if (originProjectId && id === originProjectId) {
        return memo;
      }

      memo.push({
        label: name,
        value: id,
      });

      return memo;
    }, [] as OptionProp[]);
  }, [originProjectId, projects]);

  const RaiseModalButton = React.useMemo(() => {
    return buttonStyle === 'button' ? Button : RaiseModalLink;
  }, [buttonStyle])

  const handleHideModal = React.useCallback(() => {
    setShouldShowModal(false);
    onModalClosed();
  }, [onModalClosed, setShouldShowModal]);

  const addToProject = React.useCallback(async (passedProjectId: string) => {
    try {
      await addFeatureViewToProject({
        featureViewId,
        projectId: passedProjectId,
      });

      success('Added feature to project');
    } catch(e) {
      console.warn(`Failed to add feature view to project`, e);
      raiseToastError(`Failed to add feature to project ${e}`);
    }
  }, [featureViewId]);

  const handleAddToProject = React.useCallback(() => {
    if (selectedProject) {
      addToProject(selectedProject)
    }

    if (!projectId) {
      handleHideModal();
    }
  }, [addToProject, projectId, selectedProject, handleHideModal]);

  const handleRaiseModal = React.useCallback((e: React.MouseEvent) => {
    if (projectId) {
      addToProject(projectId);
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    setShouldShowModal(true);
    onModalRaised();
  }, [
    addToProject,
    onModalRaised, 
    projectId,
    setShouldShowModal,
  ]);

  const handleSelectProject = React.useCallback((newSelectedProjectId: string) => {
    setSelectedProject(newSelectedProjectId);
  }, [setSelectedProject]);

  React.useEffect(() => {
    if (shouldShowModal) {
      refetch();
    }
  }, [refetch, shouldShowModal]);

  const clickTrap = React.useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <span onClick={clickTrap}>
      {shouldShowModal && (
        <Modal
          closable
          getContainer={() => document.body}
          okText="Add to Project"
          onCancel={handleHideModal}
          onOk={handleAddToProject}
          okButtonProps={{
            disabled: !selectedProject
          }}
          titleIconName="DataIcon"
          titleText="Add Feature View to Project"
          visible={true}
        >
          <Form
            layout="vertical"
          >
            <StyledFormItem label="Select the project to add this feature set to:">
              <Select
                showSearch
                id="add-to-project-select-project"
                onSelect={handleSelectProject}
                options={selectOptions}
                placeholder="Select a project"
                value={selectedProject}
              />
            </StyledFormItem>
          </Form>
        </Modal>
      )}
      <RaiseModalButton onClick={handleRaiseModal}>{buttonText}</RaiseModalButton>
    </span>
  );
}
