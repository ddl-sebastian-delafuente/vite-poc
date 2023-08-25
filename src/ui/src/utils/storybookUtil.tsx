/**
 * If you work on a storybook, please follow Domino Storybook Best Practice:
 * https://dominodatalab.atlassian.net/wiki/spaces/ENG/pages/2124742716/pageId=2124742716
 */

import React from 'react';
import styled from 'styled-components';

// the following is storybook paragraph css
const Text = styled.p`
  font-family: "Nunito Sans",-apple-system,".SFNSText-Regular","San Francisco",BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif;
  margin: 16px 0;
  font-size: 14px;
  line-height: 24px;
  color: #333333;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
`;

// the following is storybook link css
const Link = styled.a`
  color: #1EA7FD;
`;

export const STANDARD_LIBRARY = 'Standard Library';
export const DEV_LIBRARY = 'Dev Sandbox';

// This location is for official stories. The directory structure is designed by UX team.
// Each story requires Figma documents of story design and component design. It should be written
// in mdx format, and placed under __stories__ directory.
export const getStandardStoryPath = (name: string) => `${STANDARD_LIBRARY}/${name}`;

// This location is for development stories. It is highly recommended to use subdirectory to categorize features,
// for example, Datasource. The newly created stories should be in mdx or CSF format.
export const getDevStoryPath = (name: string) => `${DEV_LIBRARY}/${name}`;

const COMPONENT_PATH = 'packages/ui/src/components';
const NAVBAR_PATH = 'packages/ui/src/navbar';
const FRONTEND_PATH = 'https://github.com/cerebrotech/domino/tree/develop/frontend';
const FULL_COMPONENT_PATH = `${FRONTEND_PATH}/${COMPONENT_PATH}`;
const FULL_NAVBAR_PATH = `${FRONTEND_PATH}/${NAVBAR_PATH}`;
const ANT_PATH = 'https://ant.design/components';

const getComponentLinkText = (relativeName: string) => (
  <Text>This component is a custom Domino component. It lives in&nbsp;
    <Link href={`${FULL_COMPONENT_PATH}/${relativeName}`}>{`${COMPONENT_PATH}/${relativeName}`}</Link>.
  </Text>
);

const getTwoComponentLinkText = (relativeName1: string, relativeName2: string) => (
  <Text>This component is a custom Domino component. It lives in&nbsp;
    <Link href={`${FULL_COMPONENT_PATH}/${relativeName1}`}>{`${COMPONENT_PATH}/${relativeName1}`}</Link>
    &nbsp;and&nbsp;
    <Link href={`${FULL_COMPONENT_PATH}/${relativeName2}`}>{`${COMPONENT_PATH}/${relativeName2}`}</Link>.
  </Text>
);

const getNavbarLinkText = (relativeName: string) => (
  <Text>This component is a custom Domino component. It lives in&nbsp;
    <Link href={`${FULL_NAVBAR_PATH}/${relativeName}`}>{`${NAVBAR_PATH}/${relativeName}`}</Link>.
  </Text>
);

const getAntLinkText = (relativeName: string) => (
  <Text>This component is an Ant component. It is defined at&nbsp;
    <Link href={`${ANT_PATH}/${relativeName}`}>{`${ANT_PATH}/${relativeName}`}</Link>.
  </Text>
);

const getMixedLinkText = (antRelativeName: string, dominoRelativeName: string) => (
  <Text>Ant icons are located at&nbsp;
    <Link href={`${ANT_PATH}/${antRelativeName}`}>{`${ANT_PATH}/${antRelativeName}`}</Link>, and Domino icons are located at &nbsp;
    <Link href={`${FULL_COMPONENT_PATH}/${dominoRelativeName}`}>{`${COMPONENT_PATH}/${dominoRelativeName}`}</Link>.
  </Text>
);

const getAntAndDominoLinkText = (antRelativeName: string, dominoRelativeName: string) => (
  <Text>This component is a derivation of an Ant component whose documentation can be found at &nbsp;
    <Link href={`${ANT_PATH}/${antRelativeName}`}>{`${ANT_PATH}/${antRelativeName}`}</Link>.
    The Domino component can be found at &nbsp;
    <Link href={`${FULL_COMPONENT_PATH}/${dominoRelativeName}`}>{`${COMPONENT_PATH}/${dominoRelativeName}`}</Link>.
  </Text>
);

export const CodeLocation = {
  Accordion: () => getComponentLinkText('Accordion/Accordion.tsx'),
  ActionDropdown: ()=> getComponentLinkText('ActionDropdown/ActionDropdown.tsx'),
  Badge: ()=> getComponentLinkText('Badge/Badge.tsx'),
  Breadcrumbs: () => getComponentLinkText('Breadcrumbs/Breadcrumbs.tsx'),
  Button: ()=> getComponentLinkText('Button/Button.tsx'),
  Callout: ()=> getTwoComponentLinkText('Callout/InfoBox.tsx', 'Callout/DangerBox.tsx'),
  Card: () => getComponentLinkText('Card/Card.tsx'),
  Carousel: () => getComponentLinkText('Carousel/Carousel.tsx'),
  Checkbox: () => getAntLinkText('checkbox'),
  Confirmation: ()=> getComponentLinkText('Modals/ConfirmationModal.tsx'),
  DatePicker: () => getAntLinkText('date-picker'),
  EditInline: () => getAntAndDominoLinkText('/typography/#components-typography-demo-interactive', 'EditInline/EditInlineContainer.tsx'),
  EmailSelect: ()=> getComponentLinkText('EmailSelection/EmailSelection.tsx'),
  Icons: ()=> getMixedLinkText('icon', 'Icons/Icons.tsx'),
  Input: () => getComponentLinkText('TextInput/Input.tsx'),
  Link: ()=> getComponentLinkText('Link/Link.tsx'),
  Radio: () => getAntLinkText('radio'),
  Modal: () => getComponentLinkText('Modal.tsx'),
  Navbar: () => getNavbarLinkText('Navbar.tsx'),
  Paginator: () => getComponentLinkText('pagination/Paginator.tsx'),
  Popover: () => getAntLinkText('popover'),
  Search: ()=> getComponentLinkText('Search/Search.tsx'),
  SingleSelect: ()=> getComponentLinkText('Select/Select.tsx'),
  Table: ()=> getComponentLinkText('Table/Table.tsx'),
  Tabs: () => getComponentLinkText('NavTabs/NavTabs.tsx'),
  Tag: () => getComponentLinkText('Tag/Tag.tsx'),
  Toast: ()=> getComponentLinkText('toastr.tsx'),
  Toggle: () => getAntLinkText('switch'),
  Tooltip: () => getComponentLinkText('renderers/TooltipRenderer.tsx'),
  Wizard: () => getTwoComponentLinkText('Modal.tsx', 'StepperContent/StepperContent.tsx'),
  Tree: () => getComponentLinkText('Tree/Tree.tsx')
};

export const getDisabledProps = (disabledNames: string[]) => disabledNames.reduce((obj, item) => ({
  ...obj,
  [item]: {
    table: {
      disable: true,
    }
  }
}), {});

export const bookMarks = {
  ACCORDION: '?path=/docs/standard-library-content-containers-accordion--accordion',
  BADGE: '?path=/docs/standard-library-message-badge--badge',
  CALLOUT: '?path=/docs/standard-library-message-callout--callout',
  CARD: '?path=/docs/standard-library-content-containers-card--card',
  CAROUSEL: '?path=/docs/standard-library-content-containers-carousel--carousel',
  CHECKBOX: '?path=/docs/standard-library-form-select-checkbox--checkbox',
  CONFIRMATION: '?path=/docs/standard-library-message-confirmation--confirmation',
  ITEM_LEVEL_ACTIONS_BUTTON: '?path=/docs/standard-library-action-item-level-actions-button--item-level-actions-button',
  LINK: '?path=/docs/standard-library-action-link--link',
  MODAL: '?path=/docs/standard-library-content-containers-modal--modal',
  MULTI_ACTION_BUTTON: '?path=/docs/standard-library-action-multi-action-button--multi-action-button',
  MULTI_SELECT: '?path=/docs/standard-library-form-select-multi-select--multi-select',
  POPOVER: '?path=/docs/standard-library-content-containers-popover--popover',
  PRIMARY_BUTTON: '?path=/docs/standard-library-action-primary-button--primary-button',
  RADIO: '?path=/docs/standard-library-form-select-radio--radio',
  SEARCH: '?path=/docs/standard-library-search--search',
  SECONDARY_BUTTON: '?path=/docs/standard-library-action-secondary-button--secondary-button',
  SINGLE_SELECT: '?path=/docs/standard-library-form-select-single-select--single-select',
  TABLE: '?path=/docs/standard-library-table--table',
  TABS: '?path=/docs/standard-library-content-containers-tabs--tabs',
  TOGGLE: '?path=/docs/standard-library-action-toggle--toggle',
  TOOLTIP: '?path=/docs/standard-library-message-tooltip--tooltip',
  TEXTAREA: '?path=/docs/standard-library-form-input-text-area--text-area',
  TEXT_INPUT: '?path=/docs/standard-library-form-input-text-input--text-input',
};

export const getDisabledObj = (disabledNames: string[]) => disabledNames.reduce((obj, disabledName) => ({
  ...obj,
  [disabledName]: {
    table: {
      disable: true,
    },
  },
}), {});
