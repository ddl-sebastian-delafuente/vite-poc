import * as React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Button } from 'antd';
import { isEmpty, isNil } from 'ramda';
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions';
import { listUsers } from '@domino/api/dist/Users';
import PaperPlaneIcon from '../icons/PaperPlane';
import * as colors from '../styled/colors';
import { themeHelper } from '../styled/themeUtils';
import Markdown from './Markdown';
import HelpLink from './HelpLink';
import { SUPPORT_ARTICLE } from '../core/supportUtil';

const Wrapper = styled.div`
  padding-top: 10px;
  display: flex;
  width: 100%;
`;
const SubmitButtonWrapper = styled.div`
  position: relative;
`;

const SubmitButton = styled<any>(Button)`
  &.ant-btn {
    padding: 0;
    width: 40px;
    border: none;
    border-radius: ${themeHelper('borderRadius.standard')};
    position: absolute;
    bottom: 0;
    right: 10px;
    background: none;
    height: 30px;
    margin-top: 4px;
    &.disabled, &:disabled:hover {
      background: none;
      border: none;
      box-shadow: none;
    }
    &::after {
      border: none;
    }
  }
`;
const StyledMentionsInput = styled(MentionsInput)`
  width: 100%;
  border-radius: ${themeHelper('borderRadius.standard')};
  border: 1px solid ${colors.shady4};
  padding: 7px;
  max-height: 250px;

  .mentions__input {
    border: none;
    left: 0;
    padding-left: 7px;
    height: 100%;
    width: 100% !important;
  }

  textarea {
    display: block;
    position: absolute;
    top: 0px;
    background-color: transparent;
    width: 100%;
    height: 100%;
    bottom: 0px;
    overflow-y: auto !important;
    margin: 0px;
    padding: 7px 45px 7px 7px ;
    outline: 0px;
    border: 0px;
  }

  .mentions--singleLine .mentions__control {
    display: inline-block;
    width: 130px;
  }

  .mentions--multiLine .mentions__highlighter {
    padding: 9px;
  }
  .mentions--multiLine .mentions__input {
    padding: 9px;
    min-height: 63px;
    outline: 0;
    border: 0;
  }
  .mentions__suggestions{
    margin-top: 26px !important;
  }
  .mentions__suggestions__list {
    background-color: white;
    border: 1px solid ${colors.shady4};
  }

  .mentions__suggestions__item {
    padding: 5px 15px;
    border-bottom: 1px solid ${colors.shady4};
  }
  .mentions__suggestions__item--focused {
    background-color: ${colors.backgroundWhite};
  }
  .mentions__mention {
    background-color: ${colors.backgroundWhite};
  }
`;

const Preview = styled.div`
  padding: 10px;
  white-space: pre-line;
`;

const StyledMention = styled.span`
  font-weight: 800;
`;

const HelpContainer = styled.div`
  padding: 10px 0px;
  font-size: 11px;
`;

const StyledHelpLink = styled(HelpLink)`
  font-size: ${themeHelper('fontSizes.extraTiny')};
`;

const ButtonIcon = () => <PaperPlaneIcon height={25} width={25} />;

/**
 * The format the returned from the MentionInput component comes back as @{{name}}
 * @param text
 */
export const formatMentions = (text: string) => {
  const regex = /@{{([^}]+)}}/g;
  return text.replace(regex, '@$1');
};

const PreviewText = ({ text }: { text: string }) => text.length ? (
  <Preview data-test="preview-text">
    <Markdown supportMentions={false}>{formatMentions(text)}</Markdown>
  </Preview>) : <div />;

/**
 * Search the domino users
 * @param query letters inserted by the users that matches the @mention patterns
 * @param callback function to set the data used by the mentions component
 */
const fetchUsers = (query: string, callback: (data: SuggestionDataItem[]) => void) => {
  // return if theres no query
  if (!query) { return; }
  // lookup users based on query
  listUsers({ query })
    .then(users =>
      users.map(u => ({ display: `@${u.userName}`, id: u.userName })))
    .then(callback)
    .catch(err => {
      console.warn(`Search users error`, err);
      callback([]);
    });
};

type ComponentProps = {
  isPreviewEnabled?: boolean;
  useSmallStyle?: boolean;
  text: string;
  placeholder?: string;
  submitHandler?: () => void;
  changeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  working?: boolean;
};

const MarkdownWithMentions =
  ({
    isPreviewEnabled = true,
    useSmallStyle = false,
    submitHandler,
    changeHandler,
    text,
    working,
    placeholder
  }: ComponentProps) => (
    <div data-test="markdown-wrapper-container">
      <Wrapper>
        <StyledMentionsInput
          singleLine={useSmallStyle}
          value={text}
          onChange={changeHandler}
          placeholder={placeholder}
          displayTransform={(userName) => `@${userName}`}
          markup="@{{__id__}}"
          className="mentions"
          data-test="add-comment-input"
        >
          <Mention trigger="@" data={fetchUsers} />
        </StyledMentionsInput>
        {!isNil(submitHandler) && <SubmitButtonWrapper>
          <SubmitButton
            type="default"
            htmlType="submit"
            onClick={submitHandler}
            disabled={isEmpty(text) || working}
            data-test="add-comment-submit-button"
          >
            {!isNil(working) && <ButtonIcon />}
          </SubmitButton>
        </SubmitButtonWrapper>}
      </Wrapper>
      <HelpContainer>
        <StyledHelpLink
          text="Markdown"
          anchorText="#markdown-formatting"
          articlePath={SUPPORT_ARTICLE.COMMENTS}
          showIcon={false}
        />
        <span> and </span>
        <StyledHelpLink
          text="Mathjax"
          anchorText="#mathjax-formatting"
          articlePath={SUPPORT_ARTICLE.COMMENTS}
          showIcon={false}
        />
        <span> are supported. You can also <StyledMention>@mention</StyledMention> people.</span>
      </HelpContainer>
      {isPreviewEnabled && (
        <PreviewText text={formatMentions(text)} />
      )}
    </div>
  );

export default MarkdownWithMentions;
