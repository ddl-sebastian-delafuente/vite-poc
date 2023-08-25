import { listDataPlanes } from '@domino/mocks/dist/mock-stories/Dataplanes';
import {
  getCurrentUserOrganizations,
  getAllOrganizations,
  getProjectSummary,
  listUsers,
} from '@domino/mocks/dist/mockStories';
import fetchMock from 'fetch-mock';
import loremIpsum from 'lorem-ipsum';
import * as React from 'react';

import { componentType as ButtonType } from '../../Button/Button';
import { ValidationState, ValidationStatus } from '../../DynamicWizard/useValidationState';
import { getDevStoryPath } from '../../../utils/storybookUtil';
import { 
  AntFormLayout,
  ButtonAction,
  DynamicFieldDisplayProps,
  DynamicFieldDisplay,
  FieldStyle,
  FieldType,
  LayoutDirection,
  Layout
} from '../';

type MockType = {
  accountName: string,
  checkbox1: boolean,
  checkbox2: boolean,
  databaseName: string,
  date: string,
  longField: string,
  name: string,
  nameLong: string,
  nested: {
    nestedString: string,
    nestedDate: number,
  },
  otherName: string,
  password: string,
  port: number,
  projectId: string,
  selectedType1: string,
  selectedType2: string,
  selectedType3: string,
  userName: string,
  users: string[]
};

type RequiredMark = boolean | 'optional';

const MOCK_DATA: MockType = {
  accountName: 'Account Name',
  checkbox1: true,
  checkbox2: false,
  databaseName: 'DatabaseName',
  date: '2022-09-30T19:26:07.498Z',
  longField: loremIpsum({ count: 30 }),
  name: 'Test Name',
  nameLong: 'ThisIsALongStrongThatIsUnbrokenToTestTheOverflowPropertiesOfAString',
  nested: {
    nestedDate: 1636418198832,
    nestedString: 'Test Nested String'
  },
  otherName: 'Other Name',
  port: 1234,
  password: 'somepassword',
  projectId: 'test-project-id',
  selectedType1: 'Individual',
  selectedType2: 'SnowflakeConfig',
  selectedType3: 'OAuth',
  userName: 'Test Username',
  users: []
}

const BASE_LAYOUT: Layout = {
  elements: [
    { fieldType: FieldType.title, text: 'Example Title' },
    { fieldType: FieldType.title, text: 'Example Title With Icon', path: 'offlineStoreType', value: 'Snowflake' },
    { path: 'name', label: 'Name Label' },
    { path: 'nameLong', label: 'Name Long Label' },
    { fieldType: FieldType.date, path: 'date', label: 'Date Label' },
    { path: 'userName', label: 'Username Label', helpText: 'Example help text', regexp: '[a-z]+' },
    { fieldType: FieldType.banner, message: 'Banner Message' },
    { fieldType: FieldType.banner, message: 'Another Banner Message', bannerType: 'Warning' },
    {
      justify: 'flex-start',
      elements: [
        { fieldType: FieldType.button, label: 'Button Label', action: ButtonAction.validateStep },
        { fieldType: FieldType.button, label: 'Button Label', action: ButtonAction.validateStep, buttonType: ButtonType.secondary },
        { fieldType: FieldType.button, label: 'Button Label', action: ButtonAction.validateStep, buttonType: ButtonType.link },
      ]
    },
    { fieldType: FieldType.password, label: 'Password Label', path: 'password' },
    { fieldType: FieldType.radio, label: 'Radio Group Label', path: 'selectedType1', id: 'credentialType', options: [ { label: 'Shared', value: 'Shared' }, { label: 'Individual', value: 'Individual' } ] },
    { fieldType: FieldType.radio, label: 'Radio Group Label', path: 'selectedType3', id: 'authenticationType', orientation: 'vertical', options: [ { label: 'OAuth', value: 'OAuth' }, { label: 'Basic', value: 'Basic' } ] },
    { fieldType: FieldType.checkbox, label: 'Checkbox defaulted to true', path: 'checkbox1' },
    { fieldType: FieldType.checkbox, label: 'Checkbox defaulted to false', path: 'checkbox2' },
    { fieldType: FieldType.select, label: 'Select Group Label', path: 'selectedType2', id: 'datasourceType' },
    { 
      fieldType: FieldType.select, 
      label: 'Select OptGroup Label', 
      path: 'selectedType3', 
      id: 'selectType3',
      options: [
        {
          label: 'Group 1',
          value: false,
          options: [
            { label: 'Option 1', value: 'value 1' },
            { label: 'Option 2', value: 'value 2' },
            { label: 'Option 3', value: 'value 3' },
          ]
        },
        {
          label: 'Group 2',
          value: false,
          options: [
            { label: 'Option 4', value: 'value 4' },
            { label: 'Option 5', value: 'value 5' },
            { label: 'Option 6', value: 'value 6' },
          ]
        }
      ]
    },
    { fieldType: FieldType.usersAndOrgs, label: 'User and Orgs', path: 'users' },
    { fieldType: FieldType.textarea, label: 'Text Area', path: 'longField' },
  ]
}

export default {
  title: getDevStoryPath('Components/Dynamic Field Display'),
  component: DynamicFieldDisplay,
  argTypes: {
    antFormLayout: {
      control: {
        type: 'select',
        options: Object.values(AntFormLayout),
      }
    },
    requiredMark: {
      control: {
        type: 'select',
        options: [
          true,
          false,
          'optional'
        ]
      },

    },
    data: { control: false },
    depth: { control: false },
    fieldStyle: {
      control: {
        type: 'select',
        options: Object.values(FieldStyle),
      }
    },
    fullWidthInput: { control: 'boolean' },
    layout: { control: false },
    maxElements: { control: false },
    onButtonAction: { action: 'onButtonAction' },
    onChange: { action: 'onChange' }
  },
  args: {
    antFormLayout: AntFormLayout.vertical,
    data: MOCK_DATA,
    editable: false,
    fieldStyle: FieldStyle.LabelAndValue,
    fullWidthInput: true,
    layout: BASE_LAYOUT,
    testIdPrefix: 'example',
  }
}

type TemplateProps = DynamicFieldDisplayProps<MockType> & {
  antFormLayout: AntFormLayout
  requiredMark: RequiredMark,
}

const Template = ({
  antFormLayout, 
  requiredMark,
  ...args
}: TemplateProps) => {
  React.useEffect(() => {
    fetchMock.restore()
      .mock(...getAllOrganizations())
      .mock(...getCurrentUserOrganizations())
      .mock(...getProjectSummary())
      .mock(...listDataPlanes())
      .mock(...listUsers())
  }, [])

  return (
    <DynamicFieldDisplay<MockType> 
      {...args}
      antFormProps={{
        layout: antFormLayout,
        requiredMark,
      }}
    />
  );
}

const FormTemplate = ({
  antFormLayout, 
  editable,
  requiredMark,
  ...args
}: TemplateProps) => {
  const [reload, setReload] = React.useState(false);
  const [validationState, setValidationState] = React.useState<ValidationState>({
    validationError: '',
    validationStatus: ValidationStatus.waiting,
  });

  const waitForValidationToComplete = () => new Promise<void>((resolve, reject) => {
    const checkStatus = () => {
      if ([ValidationStatus.success, ValidationStatus.failed].indexOf(validationState.validationStatus) === -1) {
        setTimeout(checkStatus, 10);
        return;
      }

      if (validationState.validationStatus === ValidationStatus.failed) {
        reject(validationState.validationError);
        return;
      }

      resolve();
    }

    checkStatus();
  });

  const handleTriggerValidation = React.useCallback(async () => {
    setValidationState({
      ...validationState,
      validationStatus: ValidationStatus.initialized,
    });
    await waitForValidationToComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValidationState, validationState]);

  const setValidationStatus = React.useCallback((validationStatus: ValidationStatus) => {
    setValidationState({
      ...validationState,
      validationStatus,
    });
  }, [setValidationState, validationState]);

  React.useEffect(() => {
    setReload(true);
  } ,[editable, setReload]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  if (reload) {
    return <div/>
  }

  return (
    <>
      <button disabled={validationState.validationStatus !== ValidationStatus.waiting} onClick={handleTriggerValidation}>Form Validate ({validationState.validationStatus})</button>
      <button  onClick={() => setValidationState({ ...validationState, validationStatus: ValidationStatus.waiting })}>Reset Validation State</button>
      <DynamicFieldDisplay<MockType> 
        {...args}
        antFormProps={{
          layout: antFormLayout,
          requiredMark,
        }}
        editable={editable}
        setValidationStatus={setValidationStatus}
        validationStatus={validationState.validationStatus}
      />
    </>
  );
};

export const InteractiveExample = Template.bind({});

export const ComplexLayout = Template.bind({});
ComplexLayout.args = {
  layout: {
    elements: [
      { path: 'name', label: 'Name Label' },
      {
        elements: [
          { path: 'name', label: 'Name Label' },
          { path: 'userName', label: 'Username Label' },
          { path: 'name', label: 'Name Label' },
        ]
      },
      {
        elements: [
          { path: 'nested.nestedString', label: 'Nested String Label' },
          { path: 'nested.nestedDate', label: 'Nested Date Label', fieldType: 'date' },
        ]
      },
      {
        elements: [
          { path: 'badPath', label: 'Bad Path Label' },
          { path: 'userName', label: 'Username Label' },
        ]
      }
    ]
  }
}

export const LongStrings = Template.bind({});
LongStrings.args = {
  layout: {
    elements: [
      {
        elements: [
          { path: 'name', label: 'Name Label' },
          { path: 'longField', label: 'Long Field Label' },
          { path: 'nameLong', label: 'Name Label' },
        ]
      },
      {
        elements: [
          { path: 'nested.nestedString', label: 'Nested String Label' },
          { path: 'nested.nestedDate', label: 'Nested Date Label', fieldType: 'date' },
        ]
      },
      {
        elements: [
          { path: 'badPath', label: 'Bad Path Label' },
          { path: 'userName', label: 'Username Label' },
        ]
      }
    ]
  }
}

export const Overrides = Template.bind({});
Overrides.args = {
  layout: {
    arrange: LayoutDirection.row,
    elements: [
      {
        arrange: LayoutDirection.column,
        elements: [
          { path: 'name', label: 'Name Label' },
          { path: 'userName', label: 'Username Label' },
          { path: 'name', label: 'Name Label' },
        ]
      },
      {
        arrange: LayoutDirection.column,
        elements: [
          { path: 'nested.nestedString', label: 'Nested String Label' },
          { path: 'nested.nestedDate', label: 'Nested Date Label', fieldType: 'date' },
        ]
      },
      {
        arrange: LayoutDirection.column,
        elements: [
          { path: 'badPath', label: 'Bad Path Label' },
          { path: 'userName', label: 'Username Label' },
        ]
      }
    ]
  }
}

export const DefaultValues = FormTemplate.bind({})
DefaultValues.args = {
  data: {},
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { fieldType: FieldType.radio, label: 'Radio Group Label', path: 'selectedType1', id: 'credentialType', defaultValue: 'Shared', options: [ { label: 'Shared', value: 'Shared' }, { label: 'Individual', value: 'Individual' } ] },
      { fieldType: FieldType.checkbox, label: 'Checkbox defaulted to true', path: 'checkbox1', defaultValue: true },
      { fieldType: FieldType.checkbox, label: 'Checkbox defaulted to false', path: 'checkbox2', defaultValue: false },
    ]
  },
}

export const Validation = FormTemplate.bind({})
Validation.args = {
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { path: 'name', label: 'Name Label', isRequired: true },
      { path: 'port', label: 'Port Label', isRequired: true, regexp: '\\d+', regexpError: 'Must only be numbers' },
      {
        elements: [
          { path: 'databaseName', label: 'Database Name Label' },
          { path: 'userName', label: 'Username Label' },
          { path: 'accountName', label: 'Account Name Label', isRequired: true },
        ]
      },
      {
        elements: [
          { path: 'nested.nestedString', label: 'Nested String Label' },
          { path: 'nested.nestedDate', label: 'Nested Date Label', fieldType: 'date' },
        ]
      },
      {
        elements: [
          { path: 'badPath', label: 'Bad Path Label' },
          { path: 'otherName', label: 'Other Name Label' },
        ]
      }
    ]
  },
};

export const DataplaneField = Template.bind({});
DataplaneField.args = {
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        fieldType: FieldType.dataplane,
        id: 'dataPlanes',
        label: 'Dataplanes Label',
        path: 'dataPlanes', 
      },
    ]
  },
}
export const DataplaneFieldSelectAll = Template.bind({});
DataplaneFieldSelectAll.args = {
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        fieldType: FieldType.dataplane,
        id: 'dataPlanes',
        label: 'Dataplanes Label',
        path: 'dataPlanes', 
        selectAllByDefault: true,
      },
    ]
  },
}

export const DataplaneFieldWithValuesPartial = Template.bind({});
DataplaneFieldWithValuesPartial.args = {
  data: {
    dataPlanes: ['000000000000000000000000', 'mock-data-plane-id-2']
  },
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        fieldType: FieldType.dataplane,
        id: 'dataPlanes',
        label: 'Dataplanes Label',
        path: 'dataPlanes', 
      },
    ]
  },
}

export const DataplaneFieldWithValuesAll = Template.bind({});
DataplaneFieldWithValuesAll.args = {
  data: {
    dataPlanes: ['000000000000000000000000', 'mock-data-plane-id-1', 'mock-data-plane-id-2']
  },
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        fieldType: FieldType.dataplane,
        id: 'dataPlanes',
        label: 'Dataplanes Label',
        path: 'dataPlanes', 
      },
    ]
  },
}

export const DataplaneFieldWithValuesPartialDisabled = Template.bind({});
DataplaneFieldWithValuesPartialDisabled.args = {
  data: {
    dataPlanes: ['000000000000000000000000', 'mock-data-plane-id-2']
  },
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        disabled: true,
        fieldType: FieldType.dataplane,
        id: 'dataPlanes',
        label: 'Dataplanes Label',
        path: 'dataPlanes', 
      },
    ]
  },
}

export const DataplaneFieldDefaultValues = Template.bind({});
DataplaneFieldDefaultValues.args = {
  data: {},
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        defaultValue: ['000000000000000000000000'],
        disabled: true,
        fieldType: FieldType.dataplane,
        id: 'dataPlanes',
        label: 'Dataplanes Label',
        path: 'dataPlanes', 
      },
    ]
  },
}

export const HostPortField = Template.bind({});
HostPortField.args = {
  data: {},
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        fieldType: FieldType.hostPort,
        id: 'hostPort',
        label: '',
        path: 'hostPort', 
      },
    ]
  },
}

export const HostPortFieldWithData = Template.bind({});
HostPortFieldWithData.args = {
  data: {
    hostPort: [
      { host: 'mockhost1', port: '1234' },
    ]
  },
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        fieldType: FieldType.hostPort,
        id: 'hostPort',
        label: '',
        path: 'hostPort', 
      },
    ]
  },
}

export const HostPortMultipleField = Template.bind({});
HostPortMultipleField.args = {
  data: {},
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        fieldType: FieldType.hostPort,
        id: 'hostPort',
        label: '',
        path: 'hostPort', 
        multiple: true,
      },
    ]
  },
}

export const HostPortMultipleFieldWithData = Template.bind({});
HostPortMultipleFieldWithData.args = {
  data: {
    hostPort: [
      { host: 'mockhost1', port: '1234' },
      { host: 'mockhost2', port: '1234' },
      { host: 'mockhost3', port: '1234' },
    ]
  },
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        fieldType: FieldType.hostPort,
        id: 'hostPort',
        label: '',
        path: 'hostPort', 
        multiple: true,
      },
    ]
  },
}

export const UserAndOrgsField = Template.bind({});
UserAndOrgsField.args = {
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        fieldType: FieldType.usersAndOrgs,  
        label: 'Users Label',
        ownerId: 'test-owner-id',
        ownerName: 'Owner Name',
        path: 'users', 
      },
    ]
  },
}

export const UserRoleField = Template.bind({});
UserRoleField.args = {
  editable: true,
  fieldStyle: FieldStyle.FormItem,
  layout: {
    elements: [
      { 
        fieldType: FieldType.userRoles,  
        label: 'Users Label',
        path: 'userRoles', 
      },
    ]
  },
}
