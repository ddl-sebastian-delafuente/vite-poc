import * as React from 'react';
import * as Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prism-themes/themes/prism-vs.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-log';
import 'prismjs/components/prism-ini';
import 'prismjs/components/prism-properties';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-xml-doc';
import 'prismjs/components/prism-rest';

const lang  = Object.keys(Prism?.languages || {}).reduce((memo, languageName) => {
  const languageObject = Prism.languages[languageName];

  if (typeof languageObject === 'function') {
    return memo;
  }

  memo.LanguageAry.push(languageName);
  memo.Language[languageName] = languageName;

  return memo;
}, {
  LanguageAry: [] as string[],
  Language: {} as { [key: string]: string }
});
export type Language = typeof lang.LanguageAry[number];
export const Language = lang.Language;
export const LanguageAry = lang.LanguageAry;

export interface Props {
  language: string;
  code: string;
}

export const findLanguageByExtension = (fileExtension = '', defaultLanguage: string = Language.plain) => {
  return Language[fileExtension] || defaultLanguage;
}

export const CodeViewer = (props: Props) => {
  const {language, code} = props;

  React.useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre className={`language-${language}`}>
      <code>
        {code}
      </code>
    </pre>
  );
};

export default CodeViewer;
