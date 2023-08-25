import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { FileTextOutlined, FolderOutlined } from '@ant-design/icons';
import { themeHelper } from '../styled/themeUtils';
import { prettyBytes } from '../utils/prettyBytes';
import { numberComparer } from '../utils/dataManipulation/utils';
import Table, { ColumnProps, TableProps, ColumnConfiguration } from './Table/Table';
import SimpleBreadCrumbs from './SimpleBreadCrumbs';

const GoUpEllipses = styled.span`
  top: -1px;
  position: relative;
`;

const ClickableCrumb = styled.a`
  &.clickable-crumb-fb {
    color: ${themeHelper('link.basic.color')};
  }
`;

const BrowserBreadcrumbContainer = styled.div`
  margin-left: ${themeHelper('margins.tiny')};
  margin-bottom: ${themeHelper('margins.small')};
`;

const noOp = () => void 0;

function getUtilityBar<T>(
    showBreadcrumbs: boolean,
    path: string[],
    handleGoUpDirectory: (toDirectoryPath?: string[]) => () => void,
    CustomBreadCrumbs?: Props<T>['CustomBreadCrumbs'],
    root?: string,
    onDynamicBreadcrumb?: DynamicBreadcrumbType,
): (() => JSX.Element) | undefined {
  if (showBreadcrumbs && (!onDynamicBreadcrumb || !onDynamicBreadcrumb.isReplaceComponentVisible)) {
    if (!R.isNil(CustomBreadCrumbs)) {
      return () => (
        <CustomBreadCrumbs
          path={path}
          onNavigate={handleGoUpDirectory}
          root={root}
        />
      );
    }
    return getBreadcrumbs(path, handleGoUpDirectory, root);
  }

  if (onDynamicBreadcrumb && onDynamicBreadcrumb.isReplaceComponentVisible) {
    return () => (
      <BrowserBreadcrumbContainer>
        <onDynamicBreadcrumb.ReplaceComponent/>
      </BrowserBreadcrumbContainer>
    );
  }
  return;
}

export type BreadcrumbProps = {
  PathContainer?: React.FC<{ children: React.ReactNode }>;
  path: string[],
  onNavigate: (path: string[]) => ()  => void
  root?: string,
};

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({
  path,
  onNavigate,
  PathContainer,
  root = '/',
}) => (
  <div>
    <BrowserBreadcrumbContainer>
      <SimpleBreadCrumbs
        path={path}
        onNavigate={onNavigate}
        PathContainer={PathContainer}
        root={root}
      />
    </BrowserBreadcrumbContainer>
  </div>
);

/**
 * Returns a react element which is a very basic bread crumb for navigation in the table
 */
const getBreadcrumbs = (
    path: string[],
    onNavigate: (path: string[]) => ()  => void,
    root = '/',
  ) => () => (
  <Breadcrumbs
    path={path}
    onNavigate={onNavigate}
    root={root}
  />
);

/**
 * returns the function which will get the value in the row object which is at the path specified by the
 * pathDataIndex or default to the defaultValue if doesn't exist
 */
function getValueFromPathIndex<D>(pathDataIndex: string | string[], defaultValue: D): (obj: any) => D {
  return R.pathOr(defaultValue, Array.isArray(pathDataIndex) ? pathDataIndex : [pathDataIndex]);
}

/**
 * returns only the values for the directories in the path passed to the function
 * removes any empty strings that may exist because of extra slashes
 */
const getCleanSplitPath = (path?: string): string[] => path ? path.split('/').filter(x => !!x) : [];

/**
 * This table provides rendering and navigation, that is generally expected from a file
 * tree browser.
 * It can do url based or client side state based drilldown when specified
 */
const EntityIconContainer = styled.div`
  margin-right: ${themeHelper('margins.tiny')};
`;

const GoBackRow = styled.tr`
  cursor: pointer;
`;

const DirectoryName = styled.div`
  display: flex;
  align-items: center;
  color: ${themeHelper('link.basic.color')};
  cursor: pointer;
  width: fit-content;
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  color: ${themeHelper('label.basic.color')};
`;

const StyledTable = styled(Table)`
  table td a {
    display: inline-flex;
  }
`;

export type BaseDataSourceType = {};

function baseColumns<T extends BaseDataSourceType>(
    isDir: (row: T) => boolean,
    renderEntityName: (entityName: string, row: T) => React.ReactNode,
    getEntityName: (dataIndexValue: any) => string,
    getSizeBytes: (dataIndexValue: any) => number,
    nameDataIndex: string | string[],
    sizeDataIndex: string | string[],
    getSortableName: (row: T) => string,
    getSortableBytes: (row: T) => number,
    handleOnRow?: (row: T) => any,
    sortByNameAndDir?: (a: T, b: T, sortDirection: 'ascend' | 'descend' | undefined) => number,
  ): ColumnConfiguration<T>[] {
  return [
    {
      key: 'name',
      title: 'Name',
      dataIndex: nameDataIndex,
      sorter: sortByNameAndDir,
      render: (name: any, row: T) => {
        return <>
          {isDir(row) ?
            <DirectoryName>
              <EntityIconContainer>
                <FolderOutlined />
              </EntityIconContainer>
              {renderEntityName(getEntityName(name), row)}
            </DirectoryName> :
            <FileName>
              <EntityIconContainer>
                <FileTextOutlined style={{ fontSize: '13px' }} />
              </EntityIconContainer>
              {renderEntityName(getEntityName(name), row)}
            </FileName>
          }
        </>;
      },
      onCell: handleOnRow
    },
    {
      key: 'size',
      title: 'Size',
      dataIndex: sizeDataIndex,
      width: 100,
      sorter: numberComparer<T>(getSortableBytes),
      render: (size: number) => prettyBytes(getSizeBytes(size)),
    },
  ];
}

export const GoUpButton: React.FC = () => (
  <ClickableCrumb className="clickable-crumb-fb" data-test="go-up-button">
    <FolderOutlined /><GoUpEllipses> ..</GoUpEllipses>
  </ClickableCrumb>
);

const getGoBackRow = (hasCheckboxes: boolean, totalColumns: number, handleGoUpDirectory: () => void) => ({
  body: {
    wrapper: (prs: any) => (
      <tbody {...R.omit(['children'], prs)}>
        <GoBackRow onClick={handleGoUpDirectory}>
          {hasCheckboxes && <td />}
          <td>
            <GoUpButton />
          </td>
          {R.range(0, totalColumns - 1).map((i: number) => <td key={i} />)}
        </GoBackRow>
        {prs.children}
      </tbody>
    )
  }
});

export type DynamicBreadcrumbType = {
  isReplaceComponentVisible: boolean;
  ReplaceComponent: React.FC;
};

type DefaultProps<T> = {
  renderEntityName?: (entityName: string, row: T) => React.ReactNode; // used to do UI related
  // additions to the entityName, add a link, icons, et c...
  showBreadcrumbs?: boolean; // whether or not to show the file navigation breadcrumbs inside of the table
  nameDataIndex?: string | string[]; // see ant.design dataIndex on Table's ColumnProp. Is used to get the first argument of the
  // render fnction on the ColumnProp
  sizeDataIndex?: string | string[]; // size version of nameDataIndex
  isDir?: (row: T) => boolean; // takes a row and indicates whether this row is a directory or not
  getEntityName?: (dataIndexValue: any) => string; // takes output of what is mapped to by nameDataIndex
  // and maps to entity name, name of directory or file
  getSizeBytes?: (dataIndexValue: any) => number; // takes output of what is mapped to by sizeDataIndex
  // and does extra manipulation if necessary
  hideRowSelection?: TableProps<T>['hideRowSelection'];
  columnIndex?: number;
  root?: string; // custom root path
  onDynamicBreadcrumb?: DynamicBreadcrumbType; // the component that replace the path
};

type Props<T> = TableProps<T> & DefaultProps<T> & {
  sortByNameAndDir?: (a: T, b: T, sortDirection: 'ascend' | 'descend' | undefined) => number;
  getSortableName?: (row: T) => string;
  getSortableBytes?: (row: T) => number;
  onDrilldown?: (row: T, path: string) => Promise<T[] | void>; // executes when a user clicks on an directory row.
  // if promise contains rows, table will do client side drilldown
  onGoUpDirectory?: (cwd: string) => Promise<T[] | void>; // executes when a user clicks the go up directory row.
  // if promise contains rows, table will handle the "go up" action
  path: string; // the path at which we are
  // is used to determine whether to show the "go up" row and to render the breadcrumbs

  CustomBreadCrumbs?: React.FC<BreadcrumbProps>,
  'data-test'?: string;
};

type State<T extends BaseDataSourceType> = {
  path: string[];
  rows: T[];
};

export {
  ColumnProps,
  State,
  Props,
  DefaultProps,
  ColumnConfiguration
};

export default class FilesBrowserTable<T extends BaseDataSourceType> extends React.PureComponent<Props<T>, State<T>> {
  static defaultProps: DefaultProps<any> = {
    hideRowSelection: true,
    renderEntityName: (eName: string) => eName,
    showBreadcrumbs: true,
    getEntityName: (dataIndexValue: any) => dataIndexValue,
    getSizeBytes: (dataIndexValue: any) => dataIndexValue,
    nameDataIndex: 'name',
    sizeDataIndex: 'size',
    isDir: (row: any) => row.isDir,
    root: '/',
  };

  constructor(props: Props<T>) {
    super(props);
    const { sortByNameAndDir, dataSource } = props;

    const rows = !R.isNil(
      sortByNameAndDir
    ) && !R.isNil(dataSource) ? dataSource.sort((a, b) => sortByNameAndDir(a, b, 'ascend'))
      : dataSource;

    this.state = {
      path: getCleanSplitPath(props.path),
      rows: rows || [],
    };
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (prevProps.path !== this.props.path || this.props.dataSource !== prevProps.dataSource) {
      const path = getCleanSplitPath(this.props.path);
      this.setState({ path,  rows: this.props.dataSource || [] });
    }
  }

  handleOnRow = (row: T) => ({
    onClick: (e: MouseEvent) => {
      const { path } = this.state;
      const { getEntityName, nameDataIndex, onDrilldown } = this.props;
      // Prevent onDrilldown from firing when ctrl-clicking on the link.
      if (onDrilldown && !(e.ctrlKey || e.metaKey)) {
        const drilled = onDrilldown(row, path.join('/'));
        drilled.then((rows?: T[]) => {
          if (rows) {
            const dirPath = getValueFromPathIndex<string | undefined>(nameDataIndex!, undefined)(row);
            if (dirPath) {
              const dirName = getEntityName!(dirPath);
              this.setState({ rows, path: [...path, dirName] });
            }
          }
        });
      }
    },
  })

  handleGoUpDirectory = (toDirectoryPath?: string[]) => ()  => {
    const { onGoUpDirectory } = this.props;
    const { path } = this.state;
    const targetDirectory = toDirectoryPath || path.slice(0, path.length - 1);

    if (onGoUpDirectory) {
      onGoUpDirectory(targetDirectory.join('/'))
      .then((rows?: T[]) => {
        if (rows) {
          this.setState({ rows, path: targetDirectory });
        }
      });
    }
  }

  getColumns = () => {
    const {
      getSortableName,
      sizeDataIndex,
      nameDataIndex,
      getSizeBytes,
      getEntityName,
      getSortableBytes,
      renderEntityName,
      isDir,
      columns,
      columnIndex,
      sortByNameAndDir
    } = this.props;
    const base = baseColumns(
      isDir!,
      renderEntityName!,
      getEntityName!,
      getSizeBytes!,
      nameDataIndex!,
      sizeDataIndex!,
      getSortableName || getValueFromPathIndex<string>(nameDataIndex!, ''),
      getSortableBytes || getValueFromPathIndex<number>(sizeDataIndex!, Infinity),
      this.props.onDrilldown ? this.handleOnRow : noOp,
      sortByNameAndDir
    );
    const cols = R.insertAll(R.defaultTo(base.length)(columnIndex), columns, base);

    return cols;
  }

  render() {
    const { rows, path } = this.state;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {CustomBreadCrumbs, showBreadcrumbs, onGoUpDirectory, onDrilldown, root, onDynamicBreadcrumb, resizable,
      ...rest} = this.props;
    const columns = this.getColumns();
    const totalColumns = columns.length;
    return (
      <StyledTable
        {...rest}
        CustomUtilityBar={getUtilityBar(showBreadcrumbs!, path,
          this.handleGoUpDirectory, CustomBreadCrumbs, root, onDynamicBreadcrumb)}
        components={
          path.length && onGoUpDirectory ?
          getGoBackRow(!!rest.rowSelection, totalColumns, this.handleGoUpDirectory())
          : undefined
        }
        dataSource={rows}
        columns={columns}
        resizable={resizable === true} // resizable must be explicitly set to true for resizing
      />
    );
  }
}
