import * as React from 'react';
import Domino30ThemeProvider from '../src/styled/Domino30ThemeProvider';
import 'antd/dist/antd.css';
import '@ant-design/compatible/assets/index.css';

interface Props {
  children: JSX.Element;
}

export default class ThemeWrapper extends React.Component<Props> {
  render() {
    return (
      <Domino30ThemeProvider>
        {this.props.children}
      </Domino30ThemeProvider>
    );
  }
}
