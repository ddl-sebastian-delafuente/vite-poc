import * as React from 'react';
import { render, screen, waitFor, act } from '@domino/test-utils/dist/testing-library';
import EnvironmentCodeEditor from '../EnvironmentCodeEditor';

const mockEditorMode = '';
const mockName = 'name';
const mockInitialValue = '&quot;test initial value&quot;';
const expectedTextAreaValue = 'test initial value';
const mockNewTextValue = 'new value';

describe('EnvironmentCodeEditor component', () => {
  describe.each([[true], [false]])('When isDisabled: %s', (isDisabled: boolean) => {
    it('Renders the initial value', async () => {
      mockAceEditor();
      render(
        <EnvironmentCodeEditor
          name={mockName}
          editorMode={mockEditorMode}
          isDisabled={isDisabled}
          initialValue={mockInitialValue}
        />
      );
      await waitFor(() => expect(screen.queryByText(expectedTextAreaValue)).toBeTruthy());
    });
    it('update ace editor properties', async () => {
      const mockAce = mockAceEditor();
      render(
        <EnvironmentCodeEditor
          name={mockName}
          editorMode={mockEditorMode}
          isDisabled={isDisabled}
          initialValue={mockInitialValue}
        />
      );

      expect(mockAce.edit().$blockScrolling).toEqual(Infinity);
      expect(mockAce.edit().getSession().setMode).toHaveBeenCalledWith(`ace/mode/`);
      expect(mockAce.edit().setValue).toHaveBeenCalledWith(expectedTextAreaValue, -1);
      expect(mockAce.edit().setAutoScrollEditorIntoView).toHaveBeenCalledWith(true);
      expect(mockAce.edit().setOption).toHaveBeenCalledWith('maxLines', 35);
      expect(mockAce.edit().setOption).toHaveBeenCalledWith('minLines', 6);
      expect(mockAce.edit().setTheme).toHaveBeenCalledWith('ace/theme/github');
    });
    it('update text area value when ace editor session changes', async () => {
      const mockAce = mockAceEditor();
      render(
        <EnvironmentCodeEditor
          name={mockName}
          editorMode={mockEditorMode}
          isDisabled={isDisabled}
          initialValue={mockInitialValue}
        />
      );

      // simulate ace editor on change event
      const callbackOnChange =  mockAce.edit().getSession().on.mock.calls[0][1];
      act(() => {
        callbackOnChange();
      })

      await waitFor(() => expect(screen.queryByText(mockNewTextValue)).toBeTruthy());
    });
  });
  describe('when is disabled', () => {
    it('update ace editor options accordingly', async () => {
      const mockAce = mockAceEditor();
      render(
        <EnvironmentCodeEditor
          name={mockName}
          editorMode={mockEditorMode}
          isDisabled={true}
          initialValue={mockInitialValue}
        />
      );

      expect(mockAce.edit().setOptions).toHaveBeenCalledWith({
        readOnly: true,
        highlightActiveLine: false,
        highlightGutterLine: false
      });
      expect(mockAce.edit().renderer.$cursorLayer.element.style.opacity).toEqual(0);
    });
  })
});

function mockAceEditor() {
  const editor = {
    renderer: {
      $cursorLayer: {
        element: {
          style: {}
        }
      }
    },
    setOptions: jest.fn(),
    getSession: jest.fn().mockReturnValue({
      setMode: jest.fn(),
      on: jest.fn(),
      getValue: jest.fn().mockReturnValue(mockNewTextValue)
    }),
    setValue: jest.fn(),
    setAutoScrollEditorIntoView: jest.fn(),
    setOption: jest.fn(),
    setTheme: jest.fn()
  };

  const ace = {
    edit: jest.fn().mockReturnValue(editor)
  };

  // @ts-ignore
  window.ace = ace;

  return ace;
}
