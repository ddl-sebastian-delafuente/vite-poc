import React from 'react'
import styled from 'styled-components'
import Card from '../components/Card/Card'
import CreateModelButton from './CreateModelButton'

type Props = {
  projectId?: string
  canCreateModelApis: boolean
}
/**
 * Shown to users in place of a table when they don't have any models to see
 */
const ModelsTableEmptyState: React.FC<Props> = ({projectId, canCreateModelApis}) => {

  return (
    <CardWrapper>
      <Card className="empty-state-card">
        <h3>It looks like you don't have any models.</h3>
        {canCreateModelApis ?
          <CreateModelButton projectId={projectId} btnType="primary" testId="create-model-button-empty-state" />
          : <p data-test="no-permissions-message">Your role does not have permission to create new Model APIs.</p>
        }
      </Card>
    </CardWrapper>
  )
}

const CardWrapper = styled.div`
  margin: 40px auto 0;
  width: 90%;

  & .empty-state-card {
    width: 100% !important;
    text-align: center;
  }
`

export default ModelsTableEmptyState
