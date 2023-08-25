import * as React from 'react';
import styled from 'styled-components';

import { changeImportedProjectFork } from '../core/legacyApiEndpoints';
import MinimalSelect from '../components/MinimalSelect';

const dropdownStyle = { width: '100%' };

const getOption = (value: string) => ({
  value,
  label: value
});

const Form = styled.form`
  width: 100%;
  display: inline-block;
  max-width: fit-content;
`;

const ProjectCell = styled.div`
  display: flex;
  align-items: center;
`;

export type DropdownProps = {
  row: {
    projects: string[];
    ownerUsername: string;
    projectName: string;
  },
  ownerUsername: string;
  projectName: string;
  csrfToken: string;
};
const ProjectDropdown = ({
  row,
  ownerUsername,
  projectName,
  csrfToken,
}: DropdownProps) => {
  const {
    projects,
  } = row;
  const projectUser = row.ownerUsername;
  const importedProjectName = row.projectName;
  const depName = `${projectUser}/${importedProjectName}/`;
  const url = changeImportedProjectFork(ownerUsername, projectName, projectUser, importedProjectName);
  const options = [getOption(depName)].concat(projects.map(getOption));

  const formRef: React.RefObject<any> = React.createRef();
  const onProjectSelect = () => {
    if (formRef && formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <ProjectCell data-test="ProjectDependencyDropdownCell">
      <Form
        ref={formRef}
        action={url}
        method="POST"
      >
        {csrfToken && <input type="hidden" name="csrfToken" value={csrfToken} />}
        <MinimalSelect
          style={dropdownStyle}
          data-test="ProjectDependencyDropdown"
          name="newDependencyProjectId"
          noToggleBorder={true}
          defaultValue={depName}
          shouldSubmitOnSelect={true}
          onChange={onProjectSelect}
        >
          {options}
        </MinimalSelect>
      </Form>
    </ProjectCell>
  );
};

export default ProjectDropdown;
