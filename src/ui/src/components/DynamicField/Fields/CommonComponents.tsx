// eslint-disable-next-line no-restricted-imports
import { Form } from 'antd';
import styled from 'styled-components';

import { themeHelper } from '../../../styled';

export const FormItem = styled(Form.Item)`
  .ant-form-item-label {
    font-weight: ${themeHelper('fontWeights.thick')};
    padding-bottom: 2px;
  }

  .ant-select-selection__placeholder {
    font-size: ${themeHelper('fontSizes.tiny')};
  }

  .ant-input::placeholder, 
  .ant-input-number-input-wrap > input::placeholder {
    font-size: ${themeHelper('fontSizes.tiny')};
  }
`;
