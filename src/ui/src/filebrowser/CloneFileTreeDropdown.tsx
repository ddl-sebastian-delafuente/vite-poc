import * as React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Input } from 'antd';
import SecondaryButton from '../components/SecondaryButton';
import ActionDropdown from '../components/ActionDropdown';
import Link from '../components/Link';
import useStore from '../globalStore/useStore';
import { getAppName } from '../utils/whiteLabelUtil';

const stopPropagation = (event: any) => event.stopPropagation();

const Centered = styled.div`
  text-align: center;
`;

const cloneDropdownStyle = {
  width: 275
};

export type Props = {
  downloadProjectFolderAsZipEndpoint: string;
  allowFolderDownloads: boolean;
  downloadCLIPageEndpoint: string;
  ownerUsername: string;
  projectName: string;
  disabled?: boolean;
  isLiteUser?: boolean;
  children?: React.ReactNode;
};

const CloneFileTreeDropdown = ({
  downloadProjectFolderAsZipEndpoint,
  allowFolderDownloads,
  ownerUsername,
  projectName,
  downloadCLIPageEndpoint,
  disabled = false,
  isLiteUser
}: Props) => {
  const { whiteLabelSettings } = useStore();
  const appName = getAppName(whiteLabelSettings);
  return (
  <ActionDropdown
    dataTest="CloneFileTreeDropdownButton"
    menuTestKey="CloneFileTreeDropdownMenu"
    showCaret={true}
    menuStyle={cloneDropdownStyle}
    label="Clone"
    CustomTrigger={SecondaryButton}
    disabled={isLiteUser || disabled}
    menuItems={[
      {
        key: 'cloneviacli',
        content: (
          <div onClick={stopPropagation}>
            <div>
              Clone with <Link href={downloadCLIPageEndpoint} data-test="CloneWithCLILink">{`${appName} CLI`}</Link>
            </div>
            <Input
              id="clone-input"
              className="form-control input-sm"
              type="text"
              value={`domino get ${ownerUsername}/${projectName}`}
            />
          </div>
        ),
      },
      ...(allowFolderDownloads ? [{
        key: 'downloadaszip',
        content: (
          <Centered>
            <Link href={downloadProjectFolderAsZipEndpoint} data-test="DownloadZIPLink">
              Download as ZIP
            </Link>
          </Centered>
        ),
      }] : [])
    ]}
  />);
};

export default CloneFileTreeDropdown;
