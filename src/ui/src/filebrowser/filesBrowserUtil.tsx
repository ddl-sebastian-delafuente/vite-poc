import * as React from 'react';
import styled from 'styled-components';
import Link from '../components/Link/Link';
import { IconProps } from '../icons/Icon';
import Directory from '../icons/Directory';
import { FileBrowserNameColumnData } from './types';
import tooltipRenderer from '../components/renderers/TooltipRenderer';
import HelpLink from '../components/HelpLink';

const resultsHelp = 'Learn how to control which files are shown in the results dashboard.';
const ignoreHelp = 'Learn how to control which files are synced in projects.';
const statsHelp = 'Learn how to enable Run Diagnostic Statistics.';
export const searchBoxColor = '#CCCCCC';
export const baseClickableColor = '#4c89d6';
export const fontSize = '13px';

export const FileSummary = styled.div`
  padding: 5px 0px;
`;

export const entityIconStyle = `
  position: relative;
  top: 2px;
  margin-right: 5px;
`;

export const StyledDirectoryIcon = styled(Directory)<IconProps>`
  ${entityIconStyle};
`;

export const QuestionLink: any = styled(HelpLink)`
  font-size: 10px;
  margin: 3px;
`;

function renderQuestionLink(href: string, tooltipContent: React.ReactNode): JSX.Element {
  return tooltipRenderer(
    tooltipContent,
    <span><QuestionLink articlePath={href} showIcon={true} /></span>,
    'top'
  );
}

export function renderFileName(label: React.ReactNode, value: FileBrowserNameColumnData) {
  const { helpUrl, fileName, disableLink , url} = value;

  const linkableFileElement = (
    <Link key="fileelt" className="data-filename" href={url}>
      {label}
    </Link>
  );

  const standardFileElement = (
    <div key="fileelt" className="data-filename">
      {label}
    </div>
  );
  const fileElement = disableLink === true ? standardFileElement : linkableFileElement;

  switch (fileName) {
    case 'dominostats.json':
      return [
      fileElement, (
          <span
            key="inline-help"
            aria-label={statsHelp}
          >
            {renderQuestionLink(helpUrl, statsHelp)}
          </span>
        )
      ];
    case '.dominoresults':
      return [
      fileElement, (
          <span
            key="results-helpelt"
            aria-label={resultsHelp}
          >
            {renderQuestionLink(helpUrl, resultsHelp)}
          </span>
        )
      ];
    case '.dominoignore':
      return [
      fileElement, (
          <span
            key="ignore-helpelt"
            aria-label={ignoreHelp}
          >
            {renderQuestionLink(helpUrl, ignoreHelp)}
          </span>
        )
      ];

    default:
      return fileElement;
  }
}

export const atOldFilesVersion = (thisCommitId: string, headCommitId: string): boolean =>
  thisCommitId !== headCommitId;
