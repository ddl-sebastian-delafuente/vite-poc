import React, { useCallback, useState } from 'react'; 
import InvisibleButton from '../../components/InvisibleButton';
import Modal from '../../components/Modal';
import { DeleteOutlined } from '@ant-design/icons';
import WarningBox from '@domino/ui/dist/components/Callout/WarningBox';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import { archiveDataPlane } from '@domino/api/dist/Dataplanes';
import { DominoDataplaneDataPlaneDto as DataPlane } from '@domino/api/dist/types';

import styled from 'styled-components';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';
import { success as toastrSuccess, error as toastrError } from '@domino/ui/dist/components/toastr';


export const StyledDeleteOutlined = styled(DeleteOutlined)`
  margin-right: ${themeHelper('margins.tiny')};
`;

type Props = {
	dataplaneId: string;
	onDataplaneChange: () => void;
}

const ArchiveDataplane: React.FC<Props> = (props: Props) => {
	const {dataplaneId} = props
	const [visible, setVisible] = useState(false);
	const showModal = useCallback(() => setVisible(true), [setVisible]);
	const hideModal = useCallback(() => {
		setVisible(false);
	}, []);

	const handleArchive = async () => {
		try {
			const resp = await archiveDataPlane({dataPlaneId: dataplaneId})
			toastrSuccess(`Data plane ${(resp as DataPlane).name} archived successfully.`)
		} catch (e) {
			try {
				const body = await e.body.json()
				if (body.message) {
					toastrError(body.message)
				}
			} catch (err) {
				console.error(err)
				toastrError("Archiving data plane failed.")
			}
		}
		hideModal();
	}

return (
	<>
		<InvisibleButton onClick={showModal}>
			<FlexLayout className='archive-button' padding={0}>
				<StyledDeleteOutlined /> 
				<span>Archive</span>
			</FlexLayout>
		</InvisibleButton>
		<Modal
			title={"Archive Data Plane Confirmation"}
			//titleIconName="CheckCircleFilled"
			visible={visible}
			closable={true}
			noFooter={false}
			bodyStyle={{ padding: 25 }}
			destroyOnClose={true}
			onOk={handleArchive}
			okText="Archive Data Plane"
			onCancel={hideModal}
			isDanger={true}
		>
			<p>All Hardware Tiers, Workspaces, Jobs and Executions using this data plane must be completed or shutdown prior to archiving.</p>
			<WarningBox fullWidth={true}>Are you sure you want to archive this Data Plane?</WarningBox>
		</Modal>
	</>
)
}

export default ArchiveDataplane;
