import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { Tag as AntTag, TagProps } from 'antd';
import styled from 'styled-components';
import { themeHelper } from '../../styled/themeUtils';

const TagContainer = styled((props: TagProps) => <AntTag {...props}/>)`
  &.ant-tag, .ant-tag-close-icon {
    border-width: 0;
    color: ${themeHelper('tag.color')};
    background: ${themeHelper('tag.background')};
  }
`;

const Tag = (props: TagProps) => props.children ? <TagContainer {...props}/> : null;

export default Tag;
