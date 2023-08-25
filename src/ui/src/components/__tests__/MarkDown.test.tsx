import * as React from 'react';
import { render } from '@domino/test-utils/dist/testing-library';
import { Markdown } from '@domino/ui/dist/components/Markdown';
import { WithRouterAndReduxContainer } from '../../../tests/util/testUtil';
import {
  replaceAtMentionsWithLink
} from '../Markdown';

// [I'm an inline-style link](https://www.google.com)
describe('Jobs Comments - List', () => {
  it('replace single mention with link, no dashes', () => {
    const text = `hello @john`;
    const replacedText = replaceAtMentionsWithLink(text);
    const expected = `hello [@john](/u/john)`;
    expect(replacedText).toEqual(expected);
  });
  it('no replace mention', () => {
    const text = `hello john-doe`;
    const replacedText = replaceAtMentionsWithLink(text);
    const expected = `hello john-doe`;
    expect(replacedText).toEqual(expected);
  });
  it('replace single mention with link with dash and underscore', () => {
    const text = `hello @john-doe_`;
    const replacedText = replaceAtMentionsWithLink(text);
    const expected = `hello [@john-doe_](/u/john-doe_)`;
    expect(replacedText).toEqual(expected);
  });
  it('replace multiple mentions with link', () => {
    const text = `hello _ @john-doe @dave - how are you now?`;
    const replacedText = replaceAtMentionsWithLink(text);
    const expected = `hello _ [@john-doe](/u/john-doe) [@dave](/u/dave) - how are you now?`;
    expect(replacedText).toEqual(expected);
  });
  it('Shoud not render HTML if feature flag is off', () => {
    const text = '<b>hello</b>';
    const view = render(
      <WithRouterAndReduxContainer>
        <Markdown
          shouldExecuteHtmlInMarkdown={false}
          supportMentions={false}
        >
          {text}
        </Markdown>
      </WithRouterAndReduxContainer>
    );
    expect(view.container.textContent).toEqual(text);
  });
  it('Shoud render HTML if feature flag is on', () => {
    const text = '<b>hello</b>';
    const view = render(
      <WithRouterAndReduxContainer>
        <Markdown
          shouldExecuteHtmlInMarkdown={true}
          supportMentions={true}
        >
          {text}
        </Markdown>
      </WithRouterAndReduxContainer>
    );
    expect(view.container.textContent).toEqual('hello');
  });
});
