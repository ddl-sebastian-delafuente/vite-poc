import * as React from 'react';
import styled from 'styled-components';
import { Form } from '@ant-design/compatible';
import { FormItemProps } from 'antd/lib/form';

import { themeHelper } from '../styled/themeUtils';

const StyledFormItem = styled(Form.Item)<FormItemProps>`
  flex-direction: column;

  label {
    margin-bottom: 0px;
    font-weight: ${themeHelper('fontWeights.thick')};
  }

  .ant-legacy-form-item-label {
    line-height: ${themeHelper('sizes.extraLarge')};
  }

  .ant-legacy-form-item-label label::after {
    content: "";
  }
  .ant-legacy-form-item-label > label.ant-legacy-form-item-no-colon::after {
    display: none !important;
  }
`;

const FormItem: React.FC<FormItemProps & { children?: React.ReactNode }> = props => <StyledFormItem {...props} />;

export default FormItem;
