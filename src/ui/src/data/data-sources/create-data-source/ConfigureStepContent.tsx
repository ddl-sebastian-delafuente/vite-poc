import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
// eslint-disable-next-line no-restricted-imports
import { Input, Tooltip } from 'antd';
import { FormComponentProps } from '@ant-design/compatible/lib/form/Form';
import { Form } from '@ant-design/compatible';
import Select from '@domino/ui/dist/components/Select';
import {
  checkValidDataSourceName,
} from '@domino/api/dist/Datasource';
import {
  DominoDatasourceModelField as DatasourceModelField,
} from '@domino/api/dist/types';
import withStore, { StoreProps } from '@domino/ui/dist/globalStore/withStore';
import { flattenLayoutElements, LayoutFieldMutable } from '../../../components/DynamicField';
import { DATASOURCE_CONFIG_SPECIFIC_FIELDS } from '../../../components/DynamicWizard/ProxiedRequestClientSideStaticData/createDatasource';
import { getErrorMessage } from '../../../components/renderers/helpers';
import FlexLayout from '../../../components/Layouts/FlexLayout';
import { usePrevious } from '../../../utils/CustomHooks';
import {
  AuthenticationType,
  ConfigObjProps,
  DataSourceType,
  EngineType,
  getDataSourceIcon
} from '../CommonData';
import {
  Container,
  DoubleColumnItem,
  OptionalText,
  StyledFormItem,
  StyledSelect
} from '../CommonStyles';
import { 
  getDatasourceName,
  useDatasourceConfigs 
} from '../utils';
import { getAppName, replaceWithWhiteLabelling } from '@domino/ui/dist/utils/whiteLabelUtil';

const { Option } = Select;

const DATA_SOURCE_NAME_PLACEHOLDER_TEXT = 'The name you will use to refer to your data source within Domino';
const DATA_SOURCE_PATTERN = /^[a-zA-Z0-9_.-]+$/;

interface DynamicFieldProps {
  fieldMetadata: LayoutFieldMutable,
  fieldConfig: DatasourceModelField;
  dataType?: DataSourceType;
  configObj: ConfigObjProps;
  // eslint-disable-next-line
  getFieldDecorator: Function;
  setConfigObj: (obj: ConfigObjProps) => void;
}

const DynamicField  = ({
  fieldMetadata: {
    defaultValue,
    label,
  },
  fieldConfig: {
    name, 
    isOptional, 
    regexp, 
    regexpErrorMessage, 
  },
  dataType,
  configObj,
  getFieldDecorator,
  setConfigObj
}: DynamicFieldProps) => {
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setConfigObj({...configObj, [name]: value});
  }, [configObj, name, setConfigObj]);

  return (
    <StyledFormItem
      label={isOptional ? <span>{label} <OptionalText>(Optional)</OptionalText></span> : label}
      key={`data-store-${dataType}-${name}-form-item`}
    >
      {getFieldDecorator(`${dataType}-${name}`, {
        initialValue: configObj[name] || defaultValue,
        rules: [{
          required: !isOptional,
          pattern: new RegExp(regexp || ''),
          message: `Please input a valid ${label}. ${regexpErrorMessage}`
        }],
      })(
        <Input
          data-test={`data-source-${dataType}-${name}-input`}
          onChange={onChange}
        />
      )}
    </StyledFormItem>
  );
};

interface ConfigureStepContentProps extends StoreProps {
  configObj: ConfigObjProps;
  dataSourceName?: string;
  dataType?: DataSourceType;
  onDependencyChange?: () => void;
  setAuthTypes: (authTypes: AuthenticationType[]) => void;
  setConfigObj: (obj: ConfigObjProps) => void;
  setDataSourceDescription: (description: string|undefined) => void;
  setDataSourceName: (name: string) => void;
  setDataType: (type: DataSourceType | undefined) => void;
  setDataTypeDisplayName: (displayName: string) => void;
  setEngineType: (engineType?: EngineType) => void;
  setIsConfigureComplete: (isComplete: boolean) => void;
  setIsConfigureRequiredFieldsComplete: (isComplete: boolean) => void;
}

const ConfigureStepContent = ({
  configObj,
  dataSourceName,
  dataType,
  form,
  onDependencyChange = () => undefined,
  setAuthTypes,
  setConfigObj,
  setDataSourceDescription,
  setDataSourceName,
  setDataType,
  setDataTypeDisplayName,
  setEngineType,
  setIsConfigureComplete,
  setIsConfigureRequiredFieldsComplete,
  whiteLabelSettings
}: ConfigureStepContentProps & FormComponentProps) => {
  const {getFieldDecorator, resetFields} = form;
  const prevDataType = usePrevious<DataSourceType | undefined>(dataType);

  const {
    error: dataSourceConfigError,
    getConfigByDataSourceType,
    data: configs,
    mapping,
  } = useDatasourceConfigs();

  useEffect(() => {
    if (dataSourceConfigError) {
        //ToastError(errorBody?.message);
    }
  }, [dataSourceConfigError]);
  
  const selectedConfig = getConfigByDataSourceType(dataType);
  const didDataTypeChange = useMemo(() => dataType && prevDataType && dataType !== prevDataType, [dataType, prevDataType])
  
  useEffect(() => {
    if (didDataTypeChange) {
      resetFields(['dataSourceName']);
      setDataSourceName('');
      setDataSourceDescription(undefined);
      onDependencyChange();
    }
  }, [didDataTypeChange, resetFields, setDataSourceName, setDataSourceDescription, onDependencyChange]);

  const configFieldArray: DatasourceModelField[] = Object.values(selectedConfig?.fields || {});
  const fieldLayout = DATASOURCE_CONFIG_SPECIFIC_FIELDS[dataType || ''] || [];
  const fieldMetadata = flattenLayoutElements(fieldLayout);

  useEffect(() => {
    if (configFieldArray.length === 0) {
      return;
    }
    // check require fields
    let isConfigureRequiredFieldsComplete = Boolean(dataType) && Boolean(dataSourceName);
    if (isConfigureRequiredFieldsComplete) {
      isConfigureRequiredFieldsComplete = configFieldArray.every(({name, isOptional, regexp}) =>
        isOptional || Boolean(configObj[name]) && new RegExp(regexp || '').test(configObj[name]));
    }
    setIsConfigureRequiredFieldsComplete(isConfigureRequiredFieldsComplete);

    // in addition, check optional fields
    let isComplete = isConfigureRequiredFieldsComplete && !!dataSourceName && DATA_SOURCE_PATTERN.test(dataSourceName);
    if (isComplete) {
      isComplete = configFieldArray.every(({name, isOptional, regexp}) =>
        !isOptional || !configObj[name] || new RegExp(regexp || '').test(configObj[name]));
    }
    setIsConfigureComplete(isComplete);
  }, [
    configFieldArray,
    configObj,
    dataSourceName,
    dataType,
    setIsConfigureComplete,
    setIsConfigureRequiredFieldsComplete,
  ]);

  const handleDatasourceTypeSelect = React.useCallback((value: string) => {
    const selectedDatasourceType = value as DataSourceType;
    const configIndex = mapping[selectedDatasourceType] || 0;

    const selectedDataSource = configs[configIndex];

    setDataType(selectedDatasourceType);
    setDataTypeDisplayName(getDatasourceName(selectedDatasourceType));
    setEngineType(selectedDataSource.engineType);

    setAuthTypes(selectedDataSource.authTypes);

    const selectedLayout = DATASOURCE_CONFIG_SPECIFIC_FIELDS[selectedDatasourceType];
    const selectedLayoutFlattened = flattenLayoutElements(selectedLayout);

    // Check to see if any default values are defined and set them.
    const defaultConfig = Object.values(selectedDataSource.fields).reduce((memo: ConfigObjProps, { name }) => {
      const metadata = selectedLayoutFlattened.find(fieldMetadataObj => 
        fieldMetadataObj.path === name
      ) as LayoutFieldMutable;
      
      if (metadata?.defaultValue) {
        memo[name] = metadata.defaultValue;
      }

      return memo;
    }, {})
    
    setConfigObj(defaultConfig as ConfigObjProps);
  }, [
    configs,
    mapping,
    setAuthTypes,
    setConfigObj,
    setDataType,
    setDataTypeDisplayName,
    setEngineType,
  ]);

  const getFixedWhiteLabelledText = replaceWithWhiteLabelling(getAppName(whiteLabelSettings));

  return (
    <Container>
      <Form
        layout="vertical"
        autoComplete="off"
        hideRequiredMark={true}
      >
        <StyledFormItem
          label="Select Data Store"
        >
          {getFieldDecorator('dataType', {
            rules: [{
              required: true,
            }],
            initialValue: dataType,
          })(
            <StyledSelect
              showSearch={true}
              onSelect={handleDatasourceTypeSelect}
              placeholder="Select a data store"
              data-test="data-store-select-field"
            >
              {configs.map(({ datasourceType }) =>
                <Option key={datasourceType} data-test={`data-store-${datasourceType}-select`}>
                  {getDataSourceIcon(datasourceType as DataSourceType)}
                  {` `}
                  {getDatasourceName(datasourceType)}
                </Option>)}
            </StyledSelect>
          )}
        </StyledFormItem>

        {selectedConfig &&
        <>
          {fieldMetadata.map((fieldMetadataObj, index, arr) => {
            const fieldConfig = selectedConfig.fields[fieldMetadataObj.path || ''];

            // single column if there are less than 4 fields
            // or the first field of the odd number of fields
            if (arr.length < 4 || (arr.length % 2 === 1 && index === 0)) {
              return (
                <DynamicField
                  key={fieldConfig.name}
                  fieldConfig={fieldConfig}
                  fieldMetadata={fieldMetadataObj as LayoutFieldMutable}
                  dataType={dataType}
                  configObj={configObj}
                  getFieldDecorator={getFieldDecorator}
                  setConfigObj={setConfigObj}
                />
              );
            }
            if (arr.length % 2 === index % 2) { // double columns
              const nextFieldMetadata = arr[index + 1];
              const nextFieldName = nextFieldMetadata && nextFieldMetadata.path || '';
              const nextFieldConfig = selectedConfig.fields[nextFieldName];
              return (
                <FlexLayout key={fieldConfig.name} justifyContent="space-between" alignItems="flex-start" itemSpacing={0}>
                  <DoubleColumnItem>
                    <DynamicField
                      fieldConfig={fieldConfig}
                      fieldMetadata={fieldMetadataObj as LayoutFieldMutable}
                      dataType={dataType}
                      configObj={configObj}
                      getFieldDecorator={getFieldDecorator}
                      setConfigObj={setConfigObj}
                    />
                  </DoubleColumnItem>
                  <DoubleColumnItem>
                    <DynamicField
                      fieldConfig={nextFieldConfig}
                      fieldMetadata={nextFieldMetadata as LayoutFieldMutable}
                      dataType={dataType}
                      configObj={configObj}
                      getFieldDecorator={getFieldDecorator}
                      setConfigObj={setConfigObj}
                    />
                  </DoubleColumnItem>
                </FlexLayout>
              );
            }

            return null;
          })}
          <StyledFormItem
            label={
              <Tooltip title={getFixedWhiteLabelledText(DATA_SOURCE_NAME_PLACEHOLDER_TEXT)}>
                <span>Data Source Name</span>
              </Tooltip>
            }>
            {getFieldDecorator('dataSourceName', {
              initialValue: dataSourceName,
              rules: [
                {
                  required: true,
                  pattern: DATA_SOURCE_PATTERN,
                  message: 'Please input a valid Data Source Name. Only letter, numbers, underscore, period and hyphens are allowed.',
                },
                {
                  validator: async (_, value, callback) => {
                    try {
                      await checkValidDataSourceName({name: value!});
                    } catch (err) {
                      callback(await getErrorMessage(err, 'Failed to valid the data source name.'));
                    }

                    callback();
                  },
                }],
              validateTrigger: 'onBlur',
              validateFirst: true,
            })(
              <Input
                data-test="data-source-name-input"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  setDataSourceName(value);
                }}
                placeholder={getFixedWhiteLabelledText(DATA_SOURCE_NAME_PLACEHOLDER_TEXT)}
              />
            )}
          </StyledFormItem>
          <StyledFormItem
            label={<span>Description <OptionalText>(Optional)</OptionalText></span>}
          >
            <Input.TextArea
              placeholder="A clear description helps others understand the purpose of this data source"
              data-test="data-source-description-textarea"
              rows={2}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                const value = e.target.value.trim();
                setDataSourceDescription(value);
              }}
            />
          </StyledFormItem>
        </>}
      </Form>
    </Container>
  );
};

export default Form.create<ConfigureStepContentProps & FormComponentProps>()(withStore(ConfigureStepContent));
