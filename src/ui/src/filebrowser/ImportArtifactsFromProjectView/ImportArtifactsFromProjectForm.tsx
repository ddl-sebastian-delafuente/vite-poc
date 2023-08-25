import * as React from 'react';
import * as R from 'ramda';
import axios from 'axios';
import FormattedForm, { InputSpec } from './../../components/FormattedForm';
import {
  searchForImportableProjectsEndpoint
} from '@domino/ui/dist/core/legacyApiEndpoints';
import { PluggableTypeaheadInput } from '@domino/ui/dist/components';
import { debounceInput } from '@domino/ui/dist/utils/sharedComponentUtil';
import InvisibleButton from '@domino/ui/dist/components/InvisibleButton';

export type Props = {
  csrfToken: string;
  handleSubmit?: any;
  onClose?: () => void;
};

const ImportArtifactsFromProjectForm = ({
  onClose,
  handleSubmit,
  csrfToken,
  ...rest
}: Props) => {
  const [currentProject, setCurrentProject] = React.useState<any>();
  const [currentProjectOptions, setCurrentProjectOptions] = React.useState<any>([]);
  const [projectOptionsCache, setProjectOptionsCache] = React.useState<any>({});

  const queryForProjects = async (queryString: any) => {
    // Use cache for a queryString if it's already been fetched
    if (projectOptionsCache[queryString]) {
      setCurrentProjectOptions(
        projectOptionsCache[queryString]
      );
    } else {
      // Else make the request and set results to cache
      const { data } = await axios(searchForImportableProjectsEndpoint(queryString));
      setCurrentProjectOptions(data);
      setProjectOptionsCache({
        ...projectOptionsCache,
        [queryString]: data
      });
    }
  };

  const submitForm = (data: any) => {
    handleSubmit(
      {
        ...(R.reject(R.equals(''))(data)),
        dependencyName: currentProject,
        csrfToken
      }
    );
  };

  const baseFields = [
    [
      {
        inputType: 'custom',
        inputOptions: {
          key: 'project',
          className: 'project',
          label: 'Select Project to Import',
          Component: () => (
            <PluggableTypeaheadInput
              bordered={true}
              style={{
                border: '1px solid rgb(217, 217, 217)',
                borderRadius: '4px'
              }}
              onChange={debounceInput(queryForProjects)}
              options={currentProjectOptions.map(
                ({ ownerUsername, projectName }: any) => ({
                  label: (<InvisibleButton type="text" data-test="import-project-option">
                    {ownerUsername}/{projectName}
                  </InvisibleButton>),
                  value: `${ownerUsername}/${projectName}`
                })
              )}
              onSelect={setCurrentProject}
            />
          )
        },
      },
    ],
    [{
      inputType: 'input',
      inputOptions: {
        key: 'directoryName',
        className: 'directoryName',
        label: 'Directory Name',
        sublabel: '(Optional, defaults to project name)'
      },
    }]
  ] as InputSpec[][];

  return (
    <FormattedForm
      asModal={true}
      fieldMatrix={baseFields}
      onCancel={onClose}
      onSubmit={submitForm}
      submitLabel="Import Project"
      {...rest}
    />
  );
};

export default ImportArtifactsFromProjectForm;
