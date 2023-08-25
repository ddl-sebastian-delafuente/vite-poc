import styled from 'styled-components';
import { Form } from 'antd';
import { themeHelper } from '../styled';

export const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${themeHelper('margins.medium')};
`;

export const Section = styled.section`
  &:not(:last-child) {
    margin-bottom: ${themeHelper('margins.medium')};
  }
`;

export const SectionHeader = styled.header`
  border-bottom: 1px solid;
  font-size: ${themeHelper('fontSizes.large')};
  font-weight: ${themeHelper('fontWeights.medium')};
  margin-bottom: ${themeHelper('margins.tiny')};
`;

export const StyledFormItem = styled(Form.Item)`
  font-weight: ${themeHelper('fontWeights.medium')};
`;

export const StyledFormItemComposite = styled(StyledFormItem)`
  .ant-form-item-control-input-content {
    display: flex;

    & > *:not(:last-child) {
      margin-right: ${themeHelper('margins.medium')};
    }
  }
`
