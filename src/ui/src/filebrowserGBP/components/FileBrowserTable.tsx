import * as React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { FileOutlined } from '@ant-design/icons';
import { CompactTable } from '@domino/ui/dist/components/Table/CompactTable';
import Directory from '@domino/ui/dist/icons/Directory';
import { DominoProjectsApiRepositoriesResponsesBrowseRepoBrowserEntryDto as BrowseEntryDto } from '@domino/api/dist/types';
import { trimExtraLines } from '../utils';
import { colors, themeHelper } from '../../styled';
import ActionDropdown from '../../components/ActionDropdown';
import { ColumnConfiguration, ColumnProps } from '../../components/FileBrowserTable';
import FlexLayout from '../../components/Layouts/FlexLayout';

const LinkContainer = styled.span`
  color: ${colors.linkBlue};
  font-size: 14px;
  cursor: pointer;
  &:hover {
   text-decoration: underline;
  }
`;

const TextContainer = styled.span`
  font-size: ${themeHelper('fontSizes.small')};
`;

const IconContainer = styled.span`
  margin-right: ${themeHelper('margins.tiny')};
  margin-top: 3px;
  flex-shrink: 0;
`;

const StyledCell = styled.span.attrs({className: 'blur-on-fetch'})`
  font-size: 14px;
`;

const StyledCellWithEllipsis = styled(StyledCell)`
  display: block;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
`;

const HeaderContainer = styled.span`
  font-size: 12px;
`;

export type EntryClickHandler = (path: string) => void;
const defaultColumns = (onDirectoryClick: EntryClickHandler, onFileClick: EntryClickHandler) => [
  {
    key: 'name',
    title: <HeaderContainer>NAME</HeaderContainer>,
    dataIndex: 'name',
    sorter: false,
    render: (name: string, props: TableEntry) => {
      const MainDisplay  = () => props.isFile ? (
        <FlexLayout justifyContent="flex-start" alignItems="center" flexWrap="nowrap" key={name}>
          <IconContainer>
            <FileOutlined style={{fontSize: '16px'}}/>
          </IconContainer>
          <TextContainer>{name}</TextContainer>
        </FlexLayout>
      ) : (
        <FlexLayout justifyContent="flex-start" alignItems="center" flexWrap="nowrap"  key={name}>
          <IconContainer>
            <Directory width={16} height={16}/>
          </IconContainer>
          <LinkContainer onClick={() => onDirectoryClick(props.path)}>
            {<StyledCell>{name}</StyledCell>}
          </LinkContainer>
        </FlexLayout>
      );
      return <MainDisplay />;
    },
  },
  {
    key: 'lastModified',
    title: <HeaderContainer>LAST MODIFIED</HeaderContainer>,
    dataIndex: 'lastModified',
    sorter: false,
    render: (lastModified: string) => <StyledCell>{lastModified}</StyledCell>,
  },
  {
    key: 'lastCommitMessage',
    title: <HeaderContainer>LAST COMMIT</HeaderContainer>,
    dataIndex: 'lastCommitMessage',
    colSpan: 3,
    ellipsis: {
      showTitle: false
    },
    sorter: false,
    render: (lastCommitMessage: string) => (
      <StyledCellWithEllipsis title={lastCommitMessage}>
        {lastCommitMessage === null ? 'No Commit Message' : trimExtraLines(lastCommitMessage)}
      </StyledCellWithEllipsis>
    )
  },
  {
    key: 'lastCommitId',
    title: 'COMMIT ID', // title will not be visible because previous header has colSpan=3
    colSpan: 0,
    dataIndex: 'lastCommitId',
    sorter: false,
    render: (lastCommitID: string) => (
      <StyledCell style={{paddingRight: '1rem'}}>
        {lastCommitID ? lastCommitID.substr(0, 7) : 'None'}
      </StyledCell>
    ),
    width: '10rem'
  },
  {
    key: 'actions',
    title: 'ACTIONS', // title will not be visible because previous header has colSpan=3
    colSpan: 0,
    dataIndex: 'isFile',
    width: '10rem',
    sorter: false,
    render: (isFile: boolean, entry: TableEntry) => isFile ? (
    <StyledCell style={{paddingRight: '1rem'}}>
      <ActionDropdown
        label="Actions"
        showCaret={true}
        menuItems={[{
          key: 'download',
          content: (
            <div onClick={() => onFileClick(entry.path)}>
              Download file
            </div>
          ),
        }]}
      />
    </StyledCell>
    ) : <></>,
  },
] as ColumnConfiguration<ColumnProps<any>>[];

export interface FileBrowserTableProps {
  entries: BrowseEntryDto[];
  onDirectoryClick: EntryClickHandler;
  onFileClick: EntryClickHandler;
  errorState?: any;
}

const determineEmptyMessage = (errorState: any) => {
  return errorState ? errorState : 'No data found';
};

const FileBrowserTable: React.FC<FileBrowserTableProps> = ({entries, errorState, onDirectoryClick, onFileClick}) => {
  const defaultPageSize = parseInt(localStorage.getItem('gbpfilebrowser.pagesize') as string, 10) || 50;
  const [pageSize, setPageSize] = React.useState<number>(defaultPageSize);
  const handleChangePageSize = (newSize: number) => {
    localStorage.setItem('gbpfilebrowser.pagesize', String(newSize));
    setPageSize(newSize);
  };

  const data = entries.map(castToTable);
  return (
    <CompactTable
      columns={defaultColumns(onDirectoryClick, onFileClick)}
      dataSource={data}
      showPagination={true}
      showPageSizeSelector={true}
      defaultPageSize={pageSize}
      onChangePageSize={handleChangePageSize}
      pageSizeSelectorOptions={[10, 50, 100, 200]}
      showSearch={false}
      hideColumnFilter={true}
      hideRowSelection={false}
      isStriped={true}
      highlightSortedColumn={true}
      onRowClick={() => { return; }}
      emptyMessage={determineEmptyMessage(errorState)}
      rowKey="path"
    />
  );
};
FileBrowserTable.displayName = 'FileBrowserTable';

export default FileBrowserTable;

export type TableEntry = {
  kind: string;
  name: string;
  path: string;
  isFile: boolean;
  lastModified: string;
  lastCommitMessage: string | null;
  lastCommitId: string | null;
};
const castToTable: (data: BrowseEntryDto) => TableEntry = (data: BrowseEntryDto) => ({
  kind: data.kind,
  name: data.name,
  path: data.path,
  lastModified: moment(
    new Date(data.modified.author.date as number)
  ).format('MM/DD/YYYY, h:mma'),
  isFile: data.kind === 'file',
  lastCommitMessage: data && data.modified ? data.modified.message : null,
  lastCommitId: data && data.modified ? data.modified.sha : null,
});
