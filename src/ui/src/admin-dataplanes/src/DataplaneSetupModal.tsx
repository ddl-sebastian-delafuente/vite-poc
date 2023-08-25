import React, { useCallback, useState } from 'react';
import { Typography } from 'antd';
import Card from '@domino/ui/dist/components/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal';
import { LoadingOutlined, CopyOutlined, SettingOutlined } from '@ant-design/icons';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import styled from 'styled-components';
import { themeHelper } from '../../styled';
import copyToClipboard from 'copy-to-clipboard';
import { dataPlaneInstallCommand } from '@domino/api/dist/Dataplanes';
import SecondaryButton from '../../components/SecondaryButton';
import WarningBox from '@domino/ui/dist/components/Callout/WarningBox';
import SuccessBox from '@domino/ui/dist/components/Callout/SuccessBox';
import { success } from '@domino/ui/dist/components/toastr';
import InvisibleButton from '../../components/InvisibleButton';
import { DominoDataplaneDataPlaneDto } from '@domino/api/dist/types';
import * as toastr from '@domino/ui/dist/components/toastr';
import useStore from '../../globalStore/useStore';
import { getAppName } from '../../utils/whiteLabelUtil';


const { Paragraph, Text } = Typography;
const modalWidth = '560px';

const StyledFlexLayout = styled(FlexLayout)`
  margin-top: ${themeHelper('margins.small')};
`;

const StyledWarningBox = styled(WarningBox)`
	p{
		width: 408px;
		margin-bottom: 0;
	}
`;

const StyledCard = styled(Card)`
	min-height: 42px;
	margin-top: ${themeHelper('margins.large')};
	.ant-card-body{
		padding: ${themeHelper('paddings.small')};
	}
	.ant-card-body p{
		font-family: 'RobotoMono';
		margin-bottom: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

export const StyledSettingOutlined = styled(SettingOutlined)`
  margin-right: ${themeHelper('margins.tiny')};
`;

const InfoboxWrapper = styled.div`
	margin-top: ${themeHelper('margins.large')};
`;

const NoteWrapper = styled.div`
	font-size: ${themeHelper('fontSizes.tiny')};
`;

//type Status = 'disconnected' | 'unhealthy' | 'healthy';
type InstallationContentFormProps = {
	installCommand: string | undefined;
	status: string;
	loadCommand: () => void;
}

type DataplaneSetupModalprops = {
	status: string;
	initialView: boolean;
	trigger?: 'button'| 'actions';
	dataplane: DominoDataplaneDataPlaneDto;
	resetRegister?: () => void;
}

const handleCopyText = (text: string) => {
	copyToClipboard(text);
	success("Installation command copied");
}

const renderStatus = (status: string) => {
	if (status === 'Healthy') {
		return <SuccessBox fullWidth={true} >
			<>The Data Plane connection is Healthy.</>
			<NoteWrapper>
				<Text type="secondary" strong>Note: </Text>
				<Text type="secondary">to avoid infrastructure configuration issues, do not redeploy this command while a Data Plane connection is healthy.</Text>
			</NoteWrapper>
		</SuccessBox>
	}else{
		return <StyledWarningBox fullWidth={true}>
			<FlexLayout justifyContent="space-between">
				<p>The Data Plane is waiting for registration.</p>
				<LoadingOutlined />
			</FlexLayout>
		</StyledWarningBox>
	}
}

const InstallationContentForm = (props: InstallationContentFormProps) => {
  const { whiteLabelSettings } = useStore();
  const { installCommand, status } = props;

	return (
		<>
			<Paragraph>
				{`This command installs the necessary Data Plane infrastructure and API tokens in your ${getAppName(whiteLabelSettings)} deployment. Requires Helm 3.8+`}
			</Paragraph>
			<StyledCard style={{ width: '100%' }}><p>{installCommand}</p></StyledCard>
			<StyledFlexLayout justifyContent="flex-end">
				{ props.installCommand == undefined &&
					<Button onClick={() => props.loadCommand()}>{"Load install command"}</Button>
				}
				{ installCommand != undefined &&
					<SecondaryButton onClick={() => handleCopyText(installCommand)}><CopyOutlined /> Copy command</SecondaryButton>
				}
			</StyledFlexLayout>
			<InfoboxWrapper className='infoboxWrapper'>
				{renderStatus(status)}
			</InfoboxWrapper>
		</>
	);
}

const DataplaneSetupModal = (props: DataplaneSetupModalprops) => {
	const { trigger, initialView, resetRegister, dataplane } = props;
	const [visible, setVisible] = React.useState<boolean>(initialView ? initialView : false);
	const [installCommand, setInstallCommand] = useState<string | undefined>(undefined);
	const showModal = useCallback(() => setVisible(true), [setVisible]);
	const hideModal = useCallback(() => {
		setVisible(false);
		setInstallCommand(undefined)
		resetRegister && resetRegister();
	}, [resetRegister])

	const fetchInstallCommand = async () => {
		try{
			const command = await dataPlaneInstallCommand({ dataPlaneId: dataplane.id });
			setInstallCommand(command.join(" "));
		}catch(error){
			toastr.error(`Unable to load install command. ${error.status}: ${error.name}`);
		}
	};

	const modalButton = (trigger: string) => {
		if (trigger === 'actions'){
			return <InvisibleButton onClick={showModal}>
				<FlexLayout padding={0}>
					<StyledSettingOutlined />
					<span>Setup</span>
				</FlexLayout>
			</InvisibleButton>
		}
		if(trigger === 'button'){
			return <Button btnType="tertiary" onClick={showModal}>Setup</Button>
		}
		return null;
	}

	return (
		<>
			{trigger && modalButton(trigger)}
			<Modal
				titleText={"Data Plane Setup & Instructions"}
				titleIconName="CheckCircleFilled"
				visible={visible}
				closable={true}
				noFooter={false}
				bodyStyle={{ padding: 25 }}
				width={modalWidth}
				style={{ height: '420px' }}
				destroyOnClose={true}
				onOk={hideModal}
				okText="Done"
				onCancel={hideModal}
			>
				<InstallationContentForm installCommand={installCommand} status={dataplane.status.state} loadCommand={fetchInstallCommand} />
			</Modal>
		</>
	)
}

export default DataplaneSetupModal;
