import * as React from 'react';
import { storiesOf } from '@storybook/react';
import PluggableTypeaheadInput from '../src/components/PluggableTypeaheadInput';
import { getDevStoryPath } from '../src/utils/storybookUtil';
import { SearchOutlined } from '@ant-design/icons';
import { fontSizes } from '@domino/ui/dist';


const stories = storiesOf(getDevStoryPath('Components/PluggableTypeaheadInput'), module);

const basicStyle = {
  onChange: function g(text: string) {
    // eslint-disable-next-line no-console
    console.log(text)
  },
  placeholder: "This is a placeholder for you to read.",
  dropdownStyle: { width: 300 },
  style: { width: 300 },
};

const basicOptions = [
  "cat",
  "hat",
  "green eggs",
  "ham",
];

function basicHTMLFormatter(text: string) {
  return {
    key: text,
    value: text,
    content: (
      <div>
        <h1>{text}</h1>
      </div>
    ),
  };
}

const formattedOptions = [
  basicHTMLFormatter("cat"),
  basicHTMLFormatter("hat"),
  basicHTMLFormatter("green eggs"),
  basicHTMLFormatter("ham"),
];

class WithResults extends React.Component<any, any> {
  state = {
    shouldShowResults: false,
  }

  render() {
    const {
      shouldShowResults,
    } = this.state;
    const {
      options,
      ...rest
    } = this.props;

    return (
      <PluggableTypeaheadInput
        {...basicStyle}
        {...rest}
        onChange={(text: string) => {
          // eslint-disable-next-line no-console
          console.log(text);
          this.setState({ shouldShowResults: !!text })
        }}
        searchBoxIcon={
          <SearchOutlined className="certain-category-icon" style={{ fontSize: fontSizes.TINY }} />
        }
        showSearchIcon={true}
        iconPosition="suffix"
        options={shouldShowResults ? options : []}
      />
    );
  }
}

stories.add('defaults', () =>
  <PluggableTypeaheadInput
    {...basicStyle}
  />
);

stories.add('with prefixed icon', () =>
  <PluggableTypeaheadInput
    {...basicStyle}
    searchBoxIcon={
      <SearchOutlined className="certain-category-icon" style={{ fontSize: fontSizes.TINY }} />
    }
    iconPosition="prefix"
    showSearchIcon={true}
  />
);

stories.add('with suffixed icon', () =>
  <PluggableTypeaheadInput
    {...basicStyle}
    searchBoxIcon={
      <SearchOutlined className="certain-category-icon" style={{ fontSize: fontSizes.TINY }} />
    }
    iconPosition="suffix"
    showSearchIcon={true}
  />
);

stories.add('with basic results', () =>
  <WithResults
    options={basicOptions}
  />
);

stories.add('with html containing results', () =>
  <WithResults
    optionType="option"
    options={formattedOptions}
  />
);

stories.add('with html groups', () =>
  <WithResults
    optionType="groupoption"
    options={[{
      key: "group",
      label: "Dr Seuss",
      children: formattedOptions
    }]}
  />
);

stories.add('with html group label', () =>
  <WithResults
    optionType="groupoption"
    options={[{
      key: "group",
      label: (
        <h1>Dr Seuss</h1>
      ),
      children: formattedOptions
    }]}
  />
);
