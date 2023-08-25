import React, { useEffect, useState } from 'react';
import { unescape } from 'lodash';

export interface EnvironmentCodeEditorProps {
  name: string;
  editorMode: string;
  isDisabled: boolean;
  initialValue: string;
}

export default function EnvironmentCodeEditor(props: EnvironmentCodeEditorProps) {
  const { name, editorMode, isDisabled, initialValue } = props;
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    // @ts-ignore
    const ace = window.ace;
    const editor = ace.edit(`${name}`);

    editor.$blockScrolling = Infinity;
    if (isDisabled) {
      editor.setOptions({
        readOnly: true,
        highlightActiveLine: false,
        highlightGutterLine: false
      });
      editor.renderer.$cursorLayer.element.style.opacity = 0;
    }
    const editorSession = editor.getSession();
    editorSession.setMode(`ace/mode/${editorMode}`);
    editorSession.on('change', function () {
      setValue(editorSession.getValue());
    });

    const content = JSON.parse(unescape(initialValue).replace(/&#x27;/g, "'")); // replace Apostrophe
    setValue(content as string);
    editor.setValue(content, -1);
    editor.setAutoScrollEditorIntoView(true);
    editor.setOption('maxLines', 35);
    editor.setOption('minLines', 6);

    editor.setTheme('ace/theme/github');
  }, [editorMode, initialValue, isDisabled, name]);

  return (
    <textarea name={name} style={{ display: 'none' }} value={value}/>
  );
}
