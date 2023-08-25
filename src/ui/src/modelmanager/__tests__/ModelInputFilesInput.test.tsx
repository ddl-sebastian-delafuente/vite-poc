import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@domino/test-utils/dist/testing-library';
import ModelInputFilesInput from '../ModelInputFilesInput';

describe('<ModelInputFilesInput />', () => {
  const defaultProps = {
    selectedProjectsFiles: ["main.R", "main.py", "main.r", "model.py", "model.R", "model.r", "modea.R", "test.txt"],
    defaultSelectedFiles: ["model.py"],
    fileFieldName: "model.py",
    gitFirstProjectsEnabled: false
  };

  it('should populate a typeahead with appropriate placeholder', async () => {
    const view = render(<ModelInputFilesInput {...defaultProps} />);
    await userEvent.clear(view.getByRole('combobox'));
    expect(view.getByText('ex. model.py').getAttribute('class')).toContain('placeholder');
  });

  it('should populate a typeahead with appropriately sorted datasource, i.e. model.* first and filters invalid extensions', async () => {
    const view = render(<ModelInputFilesInput {...defaultProps} />);
    await userEvent.clear(view.getByRole('combobox'));
    ['model.r', 'model.R', 'model.py', 'main.R', 'main.py', 'main.r', 'modea.R']
      .forEach(fileName => expect(view.getAllByText(fileName).length).toBeGreaterThan(0));
  });

  it('should populate a typeahead with appropriate default value', () => {
    expect((render(<ModelInputFilesInput {...defaultProps} />).getByRole('combobox') as HTMLInputElement).value).toEqual('model.py');
  });

  it("typeahead value should update on change", async () => {
    const typeaheadElement = render(<ModelInputFilesInput {...defaultProps} />).getByRole('combobox') as HTMLInputElement;
    await userEvent.clear(typeaheadElement);
    await userEvent.type(typeaheadElement, 'mode');
    expect(typeaheadElement.value).toEqual('mode');
  });
});
