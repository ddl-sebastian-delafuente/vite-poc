import React, { PropsWithChildren } from 'react'
import { useGetRegisteredModelVersion } from '../modelRegistryHooks'
import styled from 'styled-components'
import { colors, themeHelper } from '../../styled'
import FlexLayout from '../../components/Layouts/FlexLayout'

const MODEL_VERSION_EMPTY_MESSAGE = 'This model version has no tags.'
type Props = {
  modelName: string,
  version: number | undefined,
}
const ModelVersionTagsInfo: React.FC<Props> = ({modelName, version}) => {
  const { isLoading, error, data: modelVersion } = useGetRegisteredModelVersion({
    modelName,
    version: version!,
  }, { enabled: Boolean(version)})

  if (isLoading) return <EmptyState>Loading...</EmptyState>
  if (error) return <EmptyState>Error: {error.status} - {error.name}</EmptyState>
  if (!modelVersion) return <EmptyState>{MODEL_VERSION_EMPTY_MESSAGE}</EmptyState>

  const tags = Object.entries(modelVersion.tags)
  //drop tags that start with mlflow., mlflow.domino., and domino.
  .filter(([key]) => !/^(mlflow(\.domino)?|domino)?\./.test(key))

  if (tags.length === 0) return <EmptyState>{MODEL_VERSION_EMPTY_MESSAGE}</EmptyState>

  return (
    <>
      <TagsLayout>
        <Header>Tags</Header>
        <StyledDl>
          {tags.map(([key, value]) => (
            <Pill key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </Pill>
          ))}
        </StyledDl>
      </TagsLayout>
    </>
  )
}

const EmptyState: React.FC<PropsWithChildren> = ({children}) => (
  <div style={{paddingTop: 12}}>
    <Header>Tags</Header>
    <TagsLayout>
      <EmptyStateInternal>
        {children}
      </EmptyStateInternal>
    </TagsLayout>
  </div>
)

const StyledDl = styled.dl`
  margin: 12px 0 0 12px;
  display: flex;
  column-gap: 8px;
  row-gap: 9px;
  flex-wrap: wrap;
  font-size: 12px;

  dt, dd {
    display: inline;
  }
`

const Pill = styled.div.attrs({className: 'Pill'})`
  background-color: ${colors.neutral300};
  padding: 3px 8px;

  dt::after {
    content: ':';
    margin-right: 0.25em;
  }
`

const TagsLayout = styled.div`
  padding-top: 10px;
  padding-bottom: 60px;
  border-bottom: 1px solid ${colors.neutral300};
`

const Header = styled.div`
  font-size: ${themeHelper('fontSizes.medium')};
  color: ${colors.mineShaftColor};
  line-height: 22px;
  padding-bottom: 20px;
  display: flex;
  padding: 0 12px;
`

const EmptyStateInternal = styled(FlexLayout)`
  font-size: ${themeHelper('fontSizes.small')};
  color: ${colors.neutral500};
  margin-top: 24px;
  padding-bottom: 32px;
`

export default ModelVersionTagsInfo
