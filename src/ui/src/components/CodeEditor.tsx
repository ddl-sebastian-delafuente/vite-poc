import * as React from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

export interface CodeEditorProps {
  name: string;
  editorMode: string;
  isDisabled: boolean;
  id: string;
  value: string;
  label: string;
}

export interface CodeEditorState {
  editorValue: string;
}

class CodeEditor extends React.Component<CodeEditorProps, CodeEditorState> {
  editor: any;
  constructor(props: CodeEditorProps) {
    super(props);
    this.state = {
      editorValue: props.value,
    };
  }

  onEditorValueChange = (newValue: string) => {
    this.setState({ editorValue: newValue });
  }

  UNSAFE_componentWillReceiveProps(newProps: CodeEditorProps) {
    if (this.state.editorValue !== newProps.value) {
      this.editor.setValue(newProps.value);
      this.setState({editorValue: newProps.value});
    }
  }

  componentDidMount(): void {
    const {
      isDisabled,
      name,
      editorMode,
      value,
    } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const component = this;
    // @ts-ignore
    const ace = window.ace;
    const editor = ace.edit(name);
    editor.$blockScrolling = Infinity;
    if (isDisabled) {
      editor.setOptions({ readOnly: true, highlightActiveLine: false, highlightGutterLine: false });
      editor.renderer.$cursorLayer.element.style.opacity = 0;
    }
    const editorSession = editor.getSession();
    editorSession.setMode(`ace/mode/${editorMode}`);

    editorSession.on('change', function () {
      component.onEditorValueChange(editorSession.getValue());
    });

    editor.setValue(value);
    editor.setAutoScrollEditorIntoView(true);
    editor.setOption('maxLines', 35);
    editor.setOption('minLines', 6);
    editor.setTheme('ace/theme/github');
    this.editor = editor;
  }

  render() {
    const {
      id,
      name,
      isDisabled,
      label,
    } = this.props;
    return (
      <React.Fragment>
        <div>{label}</div>
        <div className={`formatted-editor ${isDisabled && 'is-disabled'}`} id={id}/>
        <TextArea name={name} style={{display: 'none'}} id={name} value={this.state.editorValue}/>
      </React.Fragment>
    );
  }
}

export default CodeEditor;
