import * as React from 'react';
import styled from 'styled-components';

const HiddenDiv = styled.div`
  display: none;
`;

export type Props = {
  csrfToken: string;
};

const CSRFInputField = ({
  csrfToken,
}: Props) => (
  <HiddenDiv id="csrfInput">
    <input type="hidden" name="csrfToken" value={csrfToken} />
  </HiddenDiv>
);

export default CSRFInputField;
