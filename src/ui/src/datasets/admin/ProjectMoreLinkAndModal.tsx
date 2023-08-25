import * as React from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import Modal from '../../components/Modal';
import { Label, ModalTitle, NoMarginLink, SeparatorSpan, Title } from '../../data/data-sources/CommonStyles';
import DataIcon from '../../icons/DataIcon';
import LabelAndValue from '../../components/LabelAndValue';
import { projectBase } from '../../core/routes';
import FlexLayout from '../../components/Layouts/FlexLayout';

const SourceProjectContentWrapper = styled.div`
  padding: 0 30px 8px;
`;

const SharedProjectsContentWrapper = styled.div`
  padding: 0 30px 10px;
`;

type ProjectMoreLinkAndModalProps = {
  count: number,
  sourceProjectName: string;
  sharedProjectNames: string[];
  sourceProjectOwnerUsername: string;
  sharedProjectOwnerUsernames: string[];
}

const ProjectMoreLinkAndModal = (
  {
    count,
    sourceProjectName,
    sharedProjectNames,
    sourceProjectOwnerUsername,
    sharedProjectOwnerUsernames,
  }: ProjectMoreLinkAndModalProps) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const mapIndexed = R.addIndex(R.map);

  return (
    <>
      <NoMarginLink onClick={showModal}>{count} more</NoMarginLink>
      <Modal
        title={<ModalTitle justifyContent={'flex-start'}>
          <DataIcon height={21} width={18}/>
          <Title>Projects using this dataset</Title>
        </ModalTitle>}
        visible={visible}
        onCancel={hideModal}
        closable={true}
        noFooter={true}
      >
        <>
          <SourceProjectContentWrapper>
            <LabelAndValue
              label={<Label>Project owning this dataset</Label>}
              value={
                <NoMarginLink
                  href={projectBase(sourceProjectOwnerUsername, sourceProjectName)}
                  openInNewTab={true}
                  key={sourceProjectName}
                >
                  {sourceProjectName}
                </NoMarginLink>}
            />
          </SourceProjectContentWrapper>
          <SharedProjectsContentWrapper>
            <LabelAndValue
              label={<Label>Projects using this dataset</Label>}
              value={
                <FlexLayout justifyContent="flex-start" alignItems="center">
                  {R.intersperse(<SeparatorSpan>,</SeparatorSpan>, mapIndexed((project: string, idx: number) =>
                    <NoMarginLink
                      href={projectBase(sharedProjectOwnerUsernames[idx], project)}
                      openInNewTab={true}
                      key={project}
                    >
                      {project}
                    </NoMarginLink>, sharedProjectNames)) as React.ReactNode
                  }
                </FlexLayout>}
            />
          </SharedProjectsContentWrapper>
        </>
      </Modal>
    </>
  );
};

export default ProjectMoreLinkAndModal;
