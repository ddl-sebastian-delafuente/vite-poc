import * as React from 'react';
import styled from 'styled-components';
import { ReactMarkdownProps } from 'react-markdown';
import { withRouter } from 'react-router-dom';
// Todo: Install @types/react-mathjax
// @ts-ignore
import MathJax from 'react-mathjax';
import FlagManagerProvider from '../core/FlagManagerProvider';
import { colors, themeHelper } from '../styled';
import { CoreState } from '../core/redux/reducer';

const RemarkMathPlugin = require('remark-math');
let ReactMarkdown = require('react-markdown');
if (ReactMarkdown.default) {
  ReactMarkdown = ReactMarkdown.default;
}

const StyledReactMarkdown = styled(ReactMarkdown)`
  & > blockquote {
    border-left: ${themeHelper('paddings.tiny')} solid ${colors.silverGrayLighter};
    margin-left: ${themeHelper('paddings.small')};
    padding-left: ${themeHelper('paddings.tiny')};
  }
`;

export const MarkdownRender = (props: ReactMarkdownProps) => {
  const newProps = {
    ...props,
    plugins: [
      RemarkMathPlugin,
    ],
    renderers: {
      ...props.renderers,
      math: (p: { value: string }) => <MathJax.Node formula={p.value}/>,
      inlineMath: (p: { value: string }) => <MathJax.Node inline={true} formula={p.value} />,
    }
  };

  return (
    <MathJax.Provider>
      <StyledReactMarkdown {...newProps as any} />
    </MathJax.Provider>
  );
};

export interface MarkdownRendererProps {
  children: string;
  supportMentions?: boolean;
  dataTest?: string;
}

export const replaceAtMentionsWithLink = (text: string) => text.replace(/\B@([a-z\d_-]+)/ig, '[@$1](/u/$1)');

// wrapping ReactMarkdown to declare type and then use elsewhere
export const Markdown: React.FC<EnhancedProps> = ({
  shouldExecuteHtmlInMarkdown,
  children,
  supportMentions = true,
  dataTest,
}) => (
  <div data-test={dataTest}>
      <MarkdownRender
        allowDangerousHtml={shouldExecuteHtmlInMarkdown}
        source={supportMentions ? replaceAtMentionsWithLink(children) : children}
      />
  </div>
);

type EnhancedProps = {
  shouldExecuteHtmlInMarkdown: boolean;
  supportMentions?: boolean;
} & MarkdownRendererProps;

const FlagManagerWithRouter = withRouter(FlagManagerProvider);

const _Markdown: React.FC<MarkdownRendererProps> = (props) => (
  <FlagManagerWithRouter {...props}>
    {(state: CoreState) => <Markdown {...props} shouldExecuteHtmlInMarkdown={state.shouldExecuteHtmlInMarkdown} />}
  </FlagManagerWithRouter>);

export default _Markdown;
