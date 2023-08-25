import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { Modal, Tag } from 'antd';
import ModalWithButton from '../components/ModalWithButton';
import {
  DominoDatasetrwApiDatasetRwDto
} from '@domino/api/dist/types';
import { error as toastError, success as toastSuccess } from '../components/toastr';
import { colors } from '../styled';
import { themeHelper } from '../styled/themeUtils';
import { InputValues } from '../components/ValidatedForm';
import FormattedForm, { InputSpec, InputType } from '../components/FormattedForm';
import InvisibleButton from '../components/InvisibleButton';
import Button from '../components/Button/Button';
import { getDataset } from '@domino/api/dist/Datasetrw';
import { addTag as addTagRw, removeTag as removeTagRw } from '@domino/api/dist/Datasetrw';
import { WarningFilled } from '@ant-design/icons';

const TagList = styled.div`
    margin: 0;
    button {
      font-size: ${themeHelper('fontSizes.tiny')};
      height: 22px;
      top: 1px;
      position: relative;

      i.anticon.anticon-plus {
        font-size: ${themeHelper('fontSizes.tiny')};
      }
    }
`;
const Wrapper = styled.div`
  text-align: center;
`;
const DangerButtonWrapper = styled.span`
  .ant-btn {
    background-color: ${colors.cabaret};
  }
  margin-left: ${themeHelper('margins.medium')};
`;
const Header = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  color: ${colors.mineShaftColor};
  margin-bottom: ${themeHelper('paddings.small')};
`;
const Description = styled.div`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.boulder};
  margin-bottom: ${themeHelper('margins.medium')};
`;

const TagSnapshotButton = styled(InvisibleButton)`
  &.ant-btn {
    color: ${colors.basicLink};
    font-size: 14px;
    :hover,:focus {
      color: ${colors.basicLink};
    }
    &::after {
      border: 0;
    }
  }
`;

const openAddTagModalButtonProps = {
  componentType: 'add',
  themeType: 'dark',
};

const fields = (collectionTags: string[], dataset?: DominoDatasetrwApiDatasetRwDto) => [
  [
    {
      inputType: 'input' as InputType,
      inputOptions: {
        key: 'tagName',
        className: 'name',
        label: 'Tag Name',
        validated: true,
        validators: [
          {
            checker: (value: InputValues) => value === undefined || value.trim() === '',
            errorCreator: () => 'Tag name cannot be blank.',
          },
          {
            checker: (value: string) => !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value),
            errorCreator: () =>
              'Tags must start with a letter and contain only alphanumeric, dashes, and hyphen characters.',
          },
          {
            checker: (value: string) => value === 'metadata',
            errorCreator: () => 'Tag name cannot be "metadata."'
          },
          {
            checker: (value: string) => {
              const cleanedValue = value.trim();
              return !!collectionTags.find(tag => tag === cleanedValue);
            },
            errorCreator: (value: string) => {
              if(dataset){
                const tagSnapshotId = dataset.tags[value.trim()];
                const snapshot = R.findIndex(snapshotId => snapshotId === tagSnapshotId, dataset.snapshotIds);
                return `This tag is already in use for Snapshot ${snapshot} in this Dataset. Please select a different name.`;
              }else{
                return 'This tag is already in use in this Dataset';
              }
            },
          },
        ],
      },
    } as InputSpec,
  ],
];

function filterTags(tags: { [label: string]: string }, dataSetId: string): string[] {
  return Object.keys(tags).reduce((keptTags: string[], nextTag: string) => {
    if (tags[nextTag] === dataSetId) {
      return [...keptTags, nextTag];
    }
    return keptTags;
  }, []);
}

export type Props = {
  disabled?: boolean;
  showTags: boolean;
  dataSetCollectionId: string;
  dataSetId: string;
  isAllowedToManageDatasetRw?: boolean;
  isAllowedToAddTags?: boolean;
};

export type State = {
  collectionTags: string[],
  tags: string[],
  showDeleteConfirmModal: boolean,
  selectedTag?: string
  dataset?: DominoDatasetrwApiDatasetRwDto;
};

class AddDataSetTagButton extends React.PureComponent<Props, State> {
  static defaultProps = {
    disabled: false,
  };

  state: State = {
    collectionTags: [],
    tags: [],
    showDeleteConfirmModal: false,
  };

  UNSAFE_componentWillMount() {
    this.getInitialTags();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      dataSetCollectionId,
      dataSetId,
    } = prevProps;
    if (dataSetCollectionId !== this.props.dataSetCollectionId || dataSetId !== this.props.dataSetId) {
      this.getInitialTags();
    }
  }

  getInitialTags() {
    const {
      dataSetId,
      dataSetCollectionId
    } = this.props;

    getDataset({ datasetId: dataSetCollectionId })
      .then((response: DominoDatasetrwApiDatasetRwDto) => {
        this.setState({
          collectionTags: R.keys(response.tags),
          tags: filterTags(response.tags, dataSetId),
          dataset: response
        });
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  onSubmit = (values: InputValues) => {
    const {
      dataSetCollectionId,
      dataSetId
    } = this.props;
    const {
      tagName = ''
    } = values;
      return addTagRw({ datasetId: dataSetCollectionId, body: { snapshotId: dataSetId, tag: tagName.trim() } }).then(
        () => {
          getDataset({ datasetId: dataSetCollectionId })
            .then((response: DominoDatasetrwApiDatasetRwDto) => {
              this.setState({
                collectionTags: R.keys(response.tags),
                tags: filterTags(response.tags, dataSetId),
                dataset: response
              });
            })
            .catch((err: any) => {
              console.error(err);
            });
        },
        error => {
          toastError(error.response.data);
        });
  }

  getModal = () => {
    const { disabled, isAllowedToAddTags, isAllowedToManageDatasetRw } = this.props;
    return (
      <ModalWithButton
        modalProps={{
          title: 'Add Tag to Dataset Snapshot'
        }}
        openButtonProps={{
          ...openAddTagModalButtonProps,
          disabled,
        }}
        ModalButton={ TagSnapshotButton }
        openButtonLabel="+ Tag Snapshot"
        handleFailableSubmit={this.onSubmit}
        showFooter={false}
        disabled={(!isAllowedToAddTags || !isAllowedToManageDatasetRw)}
      >
        {(modalContext: ModalWithButton) => (
          <FormattedForm
            submitOnEnter={true}
            asModal={true}
            fieldMatrix={fields(this.state.collectionTags,this.state.dataset)}
            onSubmit={modalContext.handleOk}
            onCancel={modalContext.handleCancel}
            submitLabel="Add"
            {...this.props}
          />
        )}
      </ModalWithButton>
    );
  }

  onDeleteDataSetTag = () => {
    const { selectedTag } = this.state;
    if (selectedTag) {
      const {
        dataSetCollectionId
      } = this.props;
      removeTagRw({ datasetId: dataSetCollectionId, tagName: selectedTag }).then(
        () => {
          toastSuccess(`Tag '${selectedTag}' has been removed successfully!`);
          this.setState({
            collectionTags: this.state.collectionTags.filter(tag => tag !== selectedTag),
            tags: this.state.tags.filter(tag => tag !== selectedTag),
            showDeleteConfirmModal: false,
            selectedTag: undefined
          }, () => {
            // @ts-ignore
            if (window.UserAlert) {
              // @ts-ignore
              window.UserAlert.success(`Deleted tag '${selectedTag}'`);
            }
          });
        },
        error => {
          console.error(error);
          // @ts-ignore
          if (window.UserAlert) {
            // @ts-ignore
            window.UserAlert.success(`Failed to delete tag '${selectedTag}'`);
          }
        });

    }
  }

  showDeleteConfirmModal = (tagName: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.setState({
      showDeleteConfirmModal: true,
      selectedTag: tagName
    });
  }

  closeModal = () => {
    this.setState({showDeleteConfirmModal: false});
  }

  getModalWithTags = () => {
    const { tags } = this.state;
    const { isAllowedToManageDatasetRw } = this.props;
    return (
      <TagList>
        {tags.map(tagName => (
          <Tag
            key={tagName}
            closable={isAllowedToManageDatasetRw}
            onClose={this.showDeleteConfirmModal(tagName)}
          >
            {tagName}
          </Tag>
        ))}
        <Modal
          visible={this.state.showDeleteConfirmModal}
          footer={null}
          closable={false}
        >
          <Wrapper>
            <WarningFilled style={{ fontSize: '22px', color: colors.mauvelous }} />
            <Header>
              Are you sure you want to Remove the tag “{this.state.selectedTag}”?
            </Header>
            <Description>
              This tag may have been used by one or more projects. Removing this
              tag could impact the execution of any tasks using it.
            </Description>
            <div>
              <InvisibleButton onClick={this.closeModal}>Cancel</InvisibleButton>
              <DangerButtonWrapper>
                <Button isDanger={true} onClick={this.onDeleteDataSetTag}>Remove</Button>
              </DangerButtonWrapper>
            </div>
          </Wrapper>
        </Modal>
        {this.getModal()}
      </TagList>
    );
  }

  render() {
    const {
      showTags,
    } = this.props;
    return R.ifElse(R.equals(true), this.getModalWithTags, this.getModal)(showTags);
  }
}

export default AddDataSetTagButton;
