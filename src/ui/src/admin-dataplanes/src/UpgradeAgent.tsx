import React, { useCallback, useState } from 'react';
import InvisibleButton from '../../components/InvisibleButton';
import Modal from '../../components/Modal';
import WarningBox from '@domino/ui/dist/components/Callout/WarningBox';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import { upgradeAgent } from '@domino/api/dist/Dataplanes';
import { DominoDataplaneDataPlaneDto as DataPlane } from '@domino/api/dist/types';

import { success as toastrSuccess, error as toastrError } from '@domino/ui/dist/components/toastr';


type Props = {
  dataPlaneId: string;
  onDataplaneChange: () => void;
}

const UpgradeAgent: React.FC<Props> = (props: Props) => {
	const {dataPlaneId} = props
	const [visible, setVisible] = useState(false);
	const showModal = useCallback(() => setVisible(true), [setVisible]);
	const hideModal = useCallback(() => {
		setVisible(false);
	}, []);

	const handleUpgrade = async () => {
		try {
			const resp = await upgradeAgent({dataPlaneId: dataPlaneId})
			toastrSuccess(`Initiated upgrade of the data plane agent ${(resp as DataPlane).name}.`)
		} catch (e) {
			try {
				const body = await e.body.json()
				if (body.message) {
					toastrError(body.message)
				}
			} catch (err) {
				console.error(err)
				toastrError("Upgrading data plane agent failed.")
			}
		}
		hideModal();
	}

return (
	<>
		<InvisibleButton onClick={showModal}>
			<FlexLayout className='upgrade-button' padding={0}>
				<span>Upgrade</span>
			</FlexLayout>
		</InvisibleButton>
		<Modal
			title={"Upgrade Confirmation"}
			visible={visible}
			closable={true}
			noFooter={false}
			bodyStyle={{ padding: 25 }}
			destroyOnClose={true}
			onOk={handleUpgrade}
			okText="Upgrade Data Plane Agent"
			onCancel={hideModal}
			isDanger={true}
		>
			<WarningBox fullWidth={true}>Are you sure you want to upgrade this Data Plane Agent?</WarningBox>
		</Modal>
	</>
)
}

export default UpgradeAgent;
