import styled from 'styled-components';
import * as React from 'react';
import { AppContent } from '../components/Layouts/AppContent';
import { colors } from '../styled';

type FileBrowserAppContentProps = {
  atOldFilesVersion: boolean;
};
export const FileBrowserAppContent = styled(AppContent) <FileBrowserAppContentProps & React.HTMLProps<Element>>`
  ${({ atOldFilesVersion }) => atOldFilesVersion ? `background: ${colors.warningPageBackgroundColor};` : ''};
`;
