import React, { useCallback, useState } from 'react';
import InvisibleButton from '../../components/InvisibleButton';
import Modal from '../../components/Modal';
import { ReloadOutlined } from '@ant-design/icons';
import WarningBox from '@domino/ui/dist/components/Callout/WarningBox';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import { restartAgent } from '@domino/api/dist/Dataplanes';
import { DominoDataplaneDataPlaneDto as DataPlane } from '@domino/api/dist/types';

import styled from 'styled-components';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';
import { success as toastrSuccess, error as toastrError } from '@domino/ui/dist/components/toastr';


export const StyledIconOutlined = styled(ReloadOutlined)`
  margin-right: ${themeHelper('margins.tiny')};
`;

type Props = {
	dataplaneId: string;
	onDataplaneChange: () => void;
}

const RestartAgent: React.FC<Props> = (props: Props) => {
	const {dataplaneId} = props
	const [visible, setVisible] = useState(false);
	const showModal = useCallback(() => setVisible(true), [setVisible]);
	const hideModal = useCallback(() => {
		setVisible(false);
	}, []);

	const handleRestart = async () => {
		try {
			const resp = await restartAgent({dataPlaneId: dataplaneId})
			toastrSuccess(`Initiated restart of the data plane agent ${(resp as DataPlane).name}.`)
		} catch (e) {
			try {
				const body = await e.body.json()
				if (body.message) {
					toastrError(body.message)
				}
			} catch (err) {
				console.error(err)
				toastrError("Restarting data plane agent failed.")
			}
		}
		hideModal();
	}

return (
	<>
		<InvisibleButton onClick={showModal}>
			<FlexLayout className='restart-button' padding={0}>
				<StyledIconOutlined />
				<span>Restart</span>
			</FlexLayout>
		</InvisibleButton>
		<Modal
			title={"Restart Confirmation"}
			visible={visible}
			closable={true}
			noFooter={false}
			bodyStyle={{ padding: 25 }}
			destroyOnClose={true}
			onOk={handleRestart}
			okText="Restart Data Plane Agent"
			onCancel={hideModal}
			isDanger={true}
		>
			<WarningBox fullWidth={true}>Are you sure you want to restart this Data Plane Agent?</WarningBox>
		</Modal>
	</>
)
}

export default RestartAgent;
