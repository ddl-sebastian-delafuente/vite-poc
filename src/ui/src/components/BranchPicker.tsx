import * as React from 'react';
import styled from 'styled-components';
import Select from '@domino/ui/dist/components/Select/Select';
import { error as toastrError } from './toastr';
import { debounceInput } from '../utils/sharedComponentUtil';
import { CSSProperties } from 'react';
import tooltipRenderer from './renderers/TooltipRenderer';

const SelectWrapper = styled.div`
  width: 100%;
  .rc-virtual-list-holder {
    overflow: hidden;
  }
`
export type BranchPickerProps = {
  currentBranchName: string;
  setBranch: (branchName: string | null) => void | Promise<void>;
  listBranches: (searchPattern: string) => Promise<BranchState>;
  style?: CSSProperties
  disabled?: boolean,
  disabledReason?: string
};

export type BranchState = {
  branches: string[],
  totalItems: number
};

const BranchPicker: React.FC<BranchPickerProps> = ({
  currentBranchName,
  setBranch,
  listBranches,
  style,
  disabled,
  disabledReason
}: BranchPickerProps) => {
  const [data, setData] = React.useState<BranchState>({
    branches: [],
    totalItems: 0
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchPattern, setSearchPattern] = React.useState<string>('');
  const [mountId] = React.useState<string>(`${Math.random()}`);

  React.useEffect(() => {
    handleOpenDropdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateBranchesData = async (inputPattern?: string) => {
    setLoading(true);
    setSearchPattern(inputPattern || '');
    try {
      const result = await listBranches(inputPattern || '');
      setData(result);
    } catch (e) {
      console.error('Failed to fetch branches', e);
      toastrError('Failed to fetch branches.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDropdown = async () => {
    if (data.branches.length === 0) {
      await updateBranchesData();
    }
  };

  const handleSelect = async (selected: string) => {
    setLoading(true);
    try {
      if (selected === currentBranchName) {
        // Sets back to default if possible, otherwise does nothing
        await setBranch(null);
      } else {
        await setBranch(selected);
      }
    } catch (e) {
      console.error('Failed to switch branches', e);
      toastrError('Failed to switch branches.');
    } finally {
      setLoading(false);
      setSearchPattern('');
      updateBranchesData();
    }

  };

  const handleSearch = debounceInput(async (inputPattern: string) => {
    await updateBranchesData(inputPattern);
  });

  const branchHeaderLabel = `Showing ${data.branches.length} branches out of ${data.totalItems} - type to search`;

  return (tooltipRenderer(disabled && disabledReason,
    <SelectWrapper id={mountId}>
      <Select
        style={style}
        onFocus={() => updateBranchesData(searchPattern)}
        showAction={['focus']}
        onSelect={handleSelect}
        showSearch={true}
        onSearch={handleSearch}
        value={currentBranchName}
        notFoundContent={`No branches matching '${searchPattern}' found.`}
        loading={loading}
        dropdownStyle={{
          textOverflow: 'ellipsis',
          overflowX: 'hidden',
          whiteSpace: 'nowrap'
        }}
        filterOption={false}
        getPopupContainer={() => document.getElementById(mountId) || document.body}
        disabled={disabled}
        data-test="branch-picker"
      >
        {
          data.branches.length > 0 ? (
            <Select.OptGroup
              label={branchHeaderLabel}
            >
              {
                data.branches.map(branchName => (
                  <Select.Option
                    key={branchName}
                    data-test={`branch-picker-option-${branchName}`}
                  >
                    {branchName}
                  </Select.Option>
                ))
              }
            </Select.OptGroup>
          ) : null
        }
      </Select>
    </SelectWrapper>
  ));
};
BranchPicker.displayName = 'BranchPicker';

export default BranchPicker;
