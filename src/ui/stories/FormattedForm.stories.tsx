import * as React from 'react';
import 'whatwg-fetch';
import { storiesOf } from '@storybook/react';
import FormattedForm, {
  InputSpec,
  Props,
} from '../src/components/FormattedForm';
import {
  InputValues,
} from '../src/components/ValidatedForm';
import { getDevStoryPath } from '../src/utils/storybookUtil';

const HEAD = "head";
const BRANCHES = "branches";
const TAGS = "tags";
const COMMITID = "commitId";
const REF = "ref";

const stories = storiesOf(getDevStoryPath('Components/FormattedForm'), module);

const selectOptions = [
  { value: HEAD, label: "Use default branch" },
  { value: BRANCHES, label: "Branches" },
  { value: TAGS, label: "Tags" },
  { value: COMMITID, label: "Commit ID" },
  { value: REF, label: "Custom Git Ref" },
];

const allDataTypesProp = {
  fieldMatrix: [
    [
      {
        inputType: "input",
        inputOptions: {
          key: "addgitrepo",
          label: "Name",
          sublabel: "optional",
          link: "abc",
          linklabel: "learn more about git repos",
          placeholder: "add a git repo",
          validated: true,
          validators: [
            {
              checker: (value: string) => value === "error",
              errorCreator: () => "you typed error",
            },
            {
              checker: (value: string) => !value,
              errorCreator: () => "you typed nothing",
            },
          ],

        },
      },
      {
        inputType: "warning",
        inputOptions: {
          key: "warning",
          content: "This is a warning",
          link: 'link_href',
          linklabel: 'link link',
        },
      }
    ], [
      {
        inputType: "select",
        inputOptions: {
          key: "defaultref",
          className: "defaultref",
          label: "Default ref",
          options: selectOptions,
          onValuesUpdate: (value, context) => {
            if (value === "commitId") {
              context.setState({showAfterFormMessage: true});
            } else {
              context.setState({showAfterFormMessage: false});
            }

            // @ts-ignore
            const labelToUse = selectOptions.find(ref => ref.value === value);
            return {
              label: labelToUse ? labelToUse.label : "Default ref",
            };
          },
        },
      },
      {
        inputType: "input",
        inputOptions: {
          key: "refname",
          onValuesUpdate: (value: any, props: any, allValues: any) => ({
            placeholder: allValues.defaultref ?
              `enter a valid ${allValues.defaultref} element` :
              "",
          }),
        },
      },
    ], [
      {
        inputType: "checkbox",
        inputOptions: {
          label: "Always show commit message",
          sublabel: "(optional)",
          link: "abc",
          linklabel: "learn more",
          key: "showcommitmessage"
        },
      },
      {
        inputType: "text",
        inputOptions: "this is a bunch of text. the quick brown fox jumped over the lazy dog. I am ok at math. Who's that guy over there?",
      },
      {
        inputType: "textarea",
        inputOptions: {
          label: "Commit Message",
          key: "commitmessage",
          sublabel: "(optional)",
          link: "abc",
          linklabel: "learn more",
          placeholder: "enter a commit message here",
          validated: true,
          validators: [
            {
              checker: (value: string, props: Props, allValues: InputValues) => allValues.showcommitmessage ? !value : undefined,
              errorCreator: () => "Please enter a commit message",
            },
          ],
        },
      },
    ]
  ] as InputSpec[][],
  csrfToken: 'abc',
  // eslint-disable-next-line
  onChange: () => console.log('change'),
  onSubmit: async function (values: any) {
    // eslint-disable-next-line
    console.log('passing submit', values);
    return true;
  },
  // eslint-disable-next-line
  onCancel: () => console.log('cancel'),
  cancelLabel: "Cancel",
  submitLabel: "Submit",
};


stories.add('simple', () => <FormattedForm{...allDataTypesProp}/>);

const propsWithOnSubmitError = {
  ...allDataTypesProp,
  onSubmit: function () {
    return Promise.reject(new Error('this is an error in onSubmit'));
  },
};

stories.add('with on submit error', () => <FormattedForm{...propsWithOnSubmitError}/>);

const withDefaultValuesProp = {
  ...allDataTypesProp,
  defaultValues: {
    defaultref: TAGS,
    commitmessage: "Commit with this message",
    addgitrepo: "NAMENAME",
    showcommitmessage: true,
  },
};

stories.add('with default values', () => <FormattedForm{...withDefaultValuesProp}/>);

const getWithFailingSubmit = (response: any) => class WithFailingSubmit extends FormattedForm {
  onSubmit = () => Promise.reject(response);
};

const WithFetchError = getWithFailingSubmit(
  { body: new Response('this is a failure message from your BE') }
);
stories.add('with network "fetch" error on submit', () => (
  <WithFetchError
    {...withDefaultValuesProp}
  />
));

const WithMysteriouErrorOnSubmit = getWithFailingSubmit({ randomKey: 'random error message' });
stories.add('with network error on submit', () => (
  <WithMysteriouErrorOnSubmit
    {...withDefaultValuesProp}
  />
));
