/**
 * Styleguide configuration for Domino component library
 */
const path = require('path');

const webpackConfig = require('../react-components/config/webpack.config.dev');

const parserOptions = {
  propFilter: {
    skipPropsWithoutDoc: true
  }
};

module.exports = {
  title: 'Domino Component Library',
  version: '0.1.0',
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide/ThemeWrapper')
  },
  skipComponentsWithoutExample: true,
  propsParser: require('react-docgen-typescript').withDefaultConfig([parserOptions]).parse,
  webpackConfig: webpackConfig
};
