import * as React from 'react';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import styled from 'styled-components';
import * as colors from '@domino/ui/dist/styled/colors';

interface Props {
	status: 'Healthy' | 'Unhealthy' | 'Error' | 'Disconnected';
}

const statusColors = {
	Error: colors.cabaret,
	Healthy: colors.mantis,
	Unhealthy: colors.tulipTree,
	Disconnected: colors.tulipTree,
}

const StyledFlexWrapper = styled(FlexLayout)`
 	text-transform: capitalize;
 
`
const StyledFlexLayout = styled(FlexLayout)`
	p{
		margin-bottom: 0;
		margin-left: 5px;
	}
`

const Dot = styled.div<Props>`
  height: 10px;
  width: 10px;
  background-color: ${(props) => statusColors[props.status]};
  border-radius: 50%;
  display: inline-block;
`

const DataplaneStatus = (props: Props) => {
const { status } = props;
	return <>
		<StyledFlexWrapper justifyContent={'flex-end'}>
			<StyledFlexLayout justifyContent={'space-between'}><Dot status={status} /><p>{status}</p></StyledFlexLayout>
		</StyledFlexWrapper>
	</>
}

export default DataplaneStatus;
