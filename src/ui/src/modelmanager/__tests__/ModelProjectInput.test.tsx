import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@domino/test-utils/dist/testing-library';
import ModelProjectInput, { Props as ModelProjectInputProps } from '../ModelProjectInput';

describe('ModelProjectInput test cases', () => {
  const defaultProject = { _id: '619da6b9471c872592fc6760', name: 'quick-start-new' };
  const props: ModelProjectInputProps = {
    id: 'projectIdSelectBox',
    projectUrls: [
      '/projects/619da6b9471c872592fc6760/renderFilesTable',
      '/projects/619daae9471c872592fc677c/renderFilesTable'
    ],
    activeProjectsForUser: [
      ['integration-test', defaultProject],
      ['integration-test', { _id: '619daae9471c872592fc677c', name: 'project2' }]
    ],
    defaultProject,
    isProjectEditable: true,
    dataTest: 'model-project-input'
  };

  it('Should render successfully', () => {
    expect(render(<ModelProjectInput {...props} />).getByDominoTestId('model-project-input')).toBeTruthy();
  });

  it(`should select default value when clicking on input triggering 'onFocus'
  and should not select default value when triggering 'onBlur'`, async () => {
    const { getByRole, getByText } = render(<ModelProjectInput {...props} />);
    await userEvent.click(getByRole('combobox'));
    const defaultOption = getByText(defaultProject._id);
    expect(defaultOption.getAttribute('aria-selected')).toEqual("false");
    await userEvent.tab();
    expect(defaultOption.getAttribute('aria-selected')).toEqual("true");
  });
});
