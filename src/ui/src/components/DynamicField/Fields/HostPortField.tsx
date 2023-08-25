// eslint-disable-next-line no-restricted-imports
import { DeleteOutlined } from '@ant-design/icons';
import { Rule } from 'antd/lib/form';
// eslint-disable-next-line no-restricted-imports
import { Form, Input } from 'antd';
import * as React from 'react';
import styled from 'styled-components';

import { themeHelper } from '../../../styled';
import Button from '../../Button/Button';
import LabelAndValue, { LabelAndValueProps } from '../../LabelAndValue';
import { LayoutFieldFactoryProps } from '../DynamicFieldFactory';
import { FieldStyle, LayoutFieldHostPort }  from '../DynamicField.types';
import {
  getFormItemProps,
  getLabelAndValueProps,
} from '../DynamicField.utils';
import { FormItem } from './CommonComponents';

const CompositeFieldWrapper = styled.div`
  align-items: start;
  display: flex;
  justify-content: space-between;
  width: 100%;

  & > *:not(:last-child) {
    margin-right: ${themeHelper('margins.small')};
  }
`;

const HostPortListWrapper = styled.div``;

const StyledButton = styled(Button)`
  margin-top: 11px;
`

type PickedProps =
  'hostRegexp' |
  'hostRegexpError' |
  'multiple' |
  'portRegexp' |
  'portRegexpError';

interface CompositeFieldProps extends
  Pick<LayoutFieldHostPort, PickedProps> {
  host?: string;
  onAdd: () => void;
  onHostChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPortChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  port?: string;
}

interface ValidateStruct {
  validateStatus?: 'success' | 'error';
  errorMsg?: string;
}

const CompositeField = ({
  hostRegexpError,
  hostRegexp,
  host,
  onAdd,
  onHostChange,
  onPortChange,
  multiple,
  portRegexpError,
  portRegexp,
  port,
}: CompositeFieldProps) => {
  const [validateHost, setValidateHost] = React.useState<ValidateStruct>({});
  const [validatePort, setValidatePort] = React.useState<ValidateStruct>({});

  const hostRegex = React.useMemo(() => new RegExp(hostRegexp || ''), [hostRegexp]);
  const portRegex = React.useMemo(() => new RegExp(portRegexp || ''), [portRegexp]);

  const hostFieldProps = !multiple ? {
    ...getFormItemProps({
      label: 'Host',
      path: '__host',
      isRequired: true,
      regexp: hostRegexp,
      regexpError: hostRegexpError,
    }),
    initialValue: host,
  } : {
    label: 'Host',
    required: true,
    validateStatus: validateHost.validateStatus ?? validateHost.validateStatus,
    help: validateHost.errorMsg ?? validateHost.errorMsg,
  };

  const portFieldProps = !multiple ? {
    ...getFormItemProps({
      label: 'Port',
      path: '__port',
      isRequired: true,
      regexp: portRegexp,
      regexpError: portRegexpError,
    }),
    initialValue: port,
  } : {
    label: 'Port',
    required: true,
    validateStatus: validatePort.validateStatus ?? validatePort.validateStatus,
    help: validatePort.errorMsg ?? validatePort.errorMsg,
  };

  const handleAdd = React.useCallback(() => {
    // manually validate and ensure all required fields are present
    if (validateHost.validateStatus === 'error' || validatePort.validateStatus === 'error') {
      return;
    }

    if (!validateHost.validateStatus || !validatePort.validateStatus) {
      if (!validateHost.validateStatus) {
        setValidateHost({
          ...validateHost,
          validateStatus: 'error',
          errorMsg: 'Host is required',
        });
      }

      if (!validatePort.validateStatus) {
        setValidatePort({
          ...validatePort,
          validateStatus: 'error',
          errorMsg: 'Port is required',
        });
      }

      return;
    }

    onAdd();
  }, [onAdd, setValidateHost, setValidatePort, validateHost, validatePort]);

  const handleHostChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setValidateHost({
        ...validateHost,
        validateStatus: 'error',
        errorMsg: 'Host is required',
      });
      return;
    }

    if (!hostRegex.test(value)) {
      setValidateHost({
        ...validateHost,
        validateStatus: 'error',
        errorMsg: hostRegexpError,
      });
      return;
    }

    if (validateHost.validateStatus !== 'success') {
      setValidateHost({
        validateStatus: 'success'
      });
    }

    onHostChange(e);
  }, [
    hostRegexpError,
    hostRegex,
    onHostChange,
    setValidateHost,
    validateHost,
  ]);

  const handlePortChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setValidatePort({
        ...validatePort,
        validateStatus: 'error',
        errorMsg: 'Port is required',
      });
      return;
    }

    if (!portRegex.test(value)) {
      setValidatePort({
        ...validatePort,
        validateStatus: 'error',
        errorMsg: portRegexpError,
      });
      return;
    }

    if (validatePort.validateStatus !== 'success') {
      setValidatePort({
        validateStatus: 'success'
      });
    }

    onPortChange(e);
  }, [
    onPortChange,
    portRegex,
    portRegexpError,
    setValidatePort,
    validatePort,
  ]);

  return (
    <CompositeFieldWrapper>
      <FormItem {...hostFieldProps} style={{ width: '100%' }}>
        <Input onChange={multiple ? handleHostChange : onHostChange} placeholder="hostname"/>
      </FormItem>
      <FormItem {...portFieldProps} style={{}}>
        <Input onChange={multiple ? handlePortChange : onPortChange} placeholder="port"/>
      </FormItem>
      {multiple && (<StyledButton onClick={handleAdd}>Add</StyledButton>)}
    </CompositeFieldWrapper>
  )
};

interface HostPort {
  host: string;
  port: string | number;
}

interface HostPortListProps {
  editable?: boolean;
  list: HostPort[];
  onChange?: (list: HostPort[]) => void;
}

const HostPortList = ({
  editable,
  onChange,
  list,
}: HostPortListProps) => {
  const makeChangeHandler = React.useCallback((index: number) => () => {
    if (onChange) {
      onChange(list.filter((v, idx) => idx !== index));
    }
  }, [list, onChange]);

  if (list.length === 0) {
    return null;
  }

  return (
    <HostPortListWrapper>
      {list.map(({ host, port }, index) => <div key={`${host}-${port}`}><span>{`${host}:${port}`}</span> {editable && <DeleteOutlined onClick={makeChangeHandler(index)}/>}</div>)}
    </HostPortListWrapper>
  );
};

export const HostPortField = ({
  data,
  editable,
  fieldStyle,
  fullWidthInput,
  testIdPrefix,
  onChange,
  value = [],
  width,
  ...props
}: LayoutFieldFactoryProps) => {
  const field = props.field as LayoutFieldHostPort;
  const form = Form.useFormInstance();

  const [objValue] = value;
  const {
    hostRegexpError = 'Only letters, numbers, underscore, period and hyphens are allowed.',
    hostRegexp = '^[a-zA-Z0-9_.-]+$',
    multiple,
    portRegexpError = 'Only numbers',
    portRegexp = '^\\d+$',
  } = field;

  const rootData = React.useMemo(() => {
    const pathParts = field.path.split('.');
    pathParts.pop();

    if (pathParts.length === 0) {
      return data;
    }

    const [nestedKey] = pathParts;
    return data[nestedKey] as { [key: string]: string };
  }, [data, field.path]);

  const readOnlyValue = React.useMemo(() => {
    if (editable) {
      return [];
    }


    const hosts = rootData?.host ? rootData.host as string : '';
    const ports = rootData?.port ? rootData.port as string : '';
    // merge hosts and ports into single structure
    const hostAry = hosts.split(',');
    const portAry = typeof ports === 'number' ? [ports] : ports.split(',');

    return hostAry.map((host, index) => {
      return {
        host,
        port: portAry[index] || ''
      }
    });

  }, [rootData, editable]);

  const [reload, setReload] = React.useState(false);
  const [host, setHost] = React.useState(!multiple && objValue && objValue.host ? objValue?.host : '');
  const [port, setPort] = React.useState(!multiple && objValue && objValue.port ? objValue?.port : '');

  const fieldProps = {
    hostRegexpError,
    hostRegexp,
    multiple,
    portRegexpError,
    portRegexp,
  };

  const handleHostChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHost(value);

    if (!multiple && port && onChange) {
      onChange(field.path, [{ host: value, port }])
    }
  }, [
    field.path,
    multiple,
    onChange,
    port,
    setHost
  ]);

  const handlePortChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value  = e.target.value;
    setPort(value);

    if (!multiple && host && onChange) {
      onChange(field.path, [{ host, port: value }]);
    }
  }, [
    field.path,
    host,
    multiple,
    onChange,
    setPort,
  ]);

  const showCompositeField = React.useMemo(() => {
    if (reload || !editable && multiple) {
      return false;
    }

    return true;
  }, [editable, multiple, reload]);

  const handleAdd = React.useCallback(() => {
    if (onChange) {
      const newList = [
        ...value,
        { host, port }
      ];

      onChange(field.path, newList);

      if (fieldStyle === FieldStyle.FormItem) {
        form.setFieldsValue({
          [field.path]: newList
        });
      }
    }

    // reset input field after add;
    setHost('');
    setPort('');
    setReload(true);
  }, [fieldStyle, field.path, form, onChange, host, port, setHost, setPort, setReload, value]);

  const formattedValue = React.useMemo(() => {
    if (!Array.isArray(readOnlyValue) || readOnlyValue.length === 0) {
      return '--';
    }

    const [hostPort] = readOnlyValue;
    return `${hostPort.host}:${hostPort.port}`;
  }, [readOnlyValue]);

  const handleRemove = React.useCallback((list: HostPort[]) => {
    if (onChange) {
      onChange(field.path, list);

      if (fieldStyle === FieldStyle.FormItem) {
        form.setFieldsValue({
          [field.path]: list
        });
      }
    }
  }, [fieldStyle, field.path, form, onChange]);

  React.useEffect(() => {
    if (reload) {
      setReload(false);
    }
  }, [reload, setReload]);

  const hostPortRules = React.useMemo(() => {
    return [
      {
        validator: async (rule: Rule, value: HostPort[]) => {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('Must have 1 host defined');
          }
        }
      }
    ]
  }, []);

  const labelProps = getLabelAndValueProps(field, testIdPrefix, width, fullWidthInput);
  const inputElement = (
    <>
      {showCompositeField && (
        <CompositeField
          {...fieldProps}
          host={host}
          onAdd={handleAdd}
          onHostChange={handleHostChange}
          onPortChange={handlePortChange}
          port={port}
        />
      )}
      {multiple && (
        <FormItem required name={field.path} rules={hostPortRules} initialValue={value}>
          <HostPortList
            editable={editable}
            onChange={handleRemove}
            list={value}
          />
        </FormItem>
      )}
    </>
  );

  if (fieldStyle === FieldStyle.FormItem) {
    return inputElement;
  }

  return (
    <LabelAndValue
      {...labelProps as LabelAndValueProps}
      value={!editable ? (
        multiple ? (
          <HostPortList
            editable={editable}
            onChange={handleRemove}
            list={readOnlyValue}
          />
        ) : formattedValue
      ) : inputElement}
    />
  )
}
