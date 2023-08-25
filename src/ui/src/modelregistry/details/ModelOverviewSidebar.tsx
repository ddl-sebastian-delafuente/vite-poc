import React from 'react'
import { RegisteredModelV1 } from '../types'
import styled from 'styled-components'
import { colors, fontSizes } from '../../styled'
import { UserOutlined } from '@ant-design/icons'

const ModelOverviewSidebarWrapper = styled.section.attrs({className: 'ModelSummary'})`
  color: ${colors.neutral500};

  .description {
    color: ${colors.black}
  }
`

const OwnerInfo = styled.div.attrs({className: 'OwnerInfo'})``

const UserName = styled.span.attrs({className: 'UserName'})`
  color: ${colors.black}
`

const CreatedOn = styled.div.attrs({className: 'CreatedOn'})`
  font-size: ${fontSizes.TINY}
`

export type Props = {
  model:  RegisteredModelV1
}

/**
 * Sidebar for the "overview" section of the model card.
 * Contains the model description, created date, and owner username.
 */
const ModelOverviewSidebar: React.FC<Props> = ({model}) => (
  <ModelOverviewSidebarWrapper>
    <OwnerInfo>
      <UserIcon />
      <UserName>{model.ownerUsername}</UserName> is the model owner
    </OwnerInfo>
    <CreatedOn>
      Model created on {formatDate(model.createdAt)}
    </CreatedOn>
  </ModelOverviewSidebarWrapper>
)

export default ModelOverviewSidebar

function formatDate(apiDate: string) {
  const dateFormatter = new Intl.DateTimeFormat('en-us', {
    year: "numeric",
    month: "short",  
    day: "numeric",
  })
  const timeFormatter = new Intl.DateTimeFormat('en-us', {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: 'short'
  })
  const date = Date.parse(apiDate)
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`
}

const UserIconWrapper = styled.div.attrs({className: 'UserIcon'})`
  width: 24px;
  height: 24px;
  margin-right: 0.25em;
  background-color: ${colors.antgrey4};
  border-radius: 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`
const UserIcon: React.FC<{}> = () => (
  <UserIconWrapper>
    <UserOutlined style={{color: colors.downRiver || 'white', fontSize: '16px'}} />
  </UserIconWrapper>
)
