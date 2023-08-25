import * as React from 'react';
import Icon from './Icon';

/* The GitLab Logo Mark is from https://about.gitlab.com/press/press-kit/ */
class GitLabLogoMarkColor extends Icon<{}> {
  static defaultProps = {
    className: 'gitLablogo',
    height: 16,
    width: 16,
    viewBox: '0 0 586 559',
  };

  renderContent() {
    return (
      <g 
        xmlns="http://www.w3.org/2000/svg"
        transform="translate(-100, -100) scale(1.5)"
      >
        <g>
          <path fill="#E24329" d="M293.026,434.983L293.026,434.983l62.199-191.322H230.918L293.026,434.983L293.026,434.983z"/>
          <path fill="#FCA326" d="M143.798,243.662L143.798,243.662l-18.941,58.126c-1.714,5.278,0.137,11.104,4.661,14.394    l163.509,118.801L143.798,243.662L143.798,243.662z"/>
          <path fill="#E24329" d="M143.798,243.662h87.12l-37.494-115.224c-1.919-5.895-10.282-5.895-12.27,0L143.798,243.662    L143.798,243.662z"/>
          <path fill="#FCA326" d="M442.346,243.662L442.346,243.662l18.873,58.126c1.714,5.278-0.137,11.104-4.661,14.394    L293.026,434.983L442.346,243.662L442.346,243.662z"/>
          <path fill="#E24329" d="M442.346,243.662h-87.12l37.425-115.224c1.919-5.895,10.282-5.895,12.27,0L442.346,243.662    L442.346,243.662z"/>
          <polygon fill="#FC6D26" points="293.026,434.983 355.225,243.662 442.346,243.662   "/>
          <polygon fill="#FC6D26" points="293.026,434.983 143.798,243.662 230.918,243.662   "/>
        </g>
      </g>
    );
  }
}

export default GitLabLogoMarkColor;
