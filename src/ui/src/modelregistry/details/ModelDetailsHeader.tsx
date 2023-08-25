import React from 'react'
import styled from 'styled-components'
import Breadcrumbs, { Route as BreadcrumbSegment } from '../../components/Breadcrumbs/Breadcrumbs'
import { projectBase } from '../../core/routes'
import { colors, themeHelper } from '../../styled'
import { useModelRegistryRoutes } from '../ModelRegistryRouteContext'
import { useGetRegisteredModelByName } from '../modelRegistryHooks'
import { GlobalOutlined } from '@ant-design/icons'
import ModelDiscoverabilitySwitch from './ModelDiscoverabilitySwitch'
import { Tooltip } from 'antd'

const NameWrapper = styled.div.attrs({className: 'nameWrapper'})`
  display: flex;
  margin: ${themeHelper('paddings.small')} 0 ${themeHelper('paddings.large')};
  align-items: baseline;
  padding: 0 32px 0 0;
`

const Name = styled.h1.attrs({className: 'modelName'})`
  font-size: ${themeHelper('sizes.large')};
  color: ${colors.mineShaft};
  flex-grow: 1;
`

export type Props = {
  modelName: string
  project?: {
    owner: {
      userName: string
    }
    name: string
  }
}

/**
 * Header of the model details view.
 * Contains breadcrumbs and the name of the model
 */
const ModelDetailsHeader = ({ modelName, project }: Props) => {
  const routes = useModelRegistryRoutes()
  const { data: model } = useGetRegisteredModelByName({ modelName })

  const breadcrumbs: BreadcrumbSegment[] = [
    {
    path: routes.listPage(),
    breadcrumbName: 'Models',
    },
    {
      path: '',
      breadcrumbName: modelName
    }
  ]

  // include project as first breadcrumb if it exists
  if (project) {
    breadcrumbs.unshift({
      path: projectBase(project.owner.userName, project.name),
      breadcrumbName: project.name
    })
  }

  return (
    <header className="ModelDetailsHeader">
      <Breadcrumbs routes={breadcrumbs} />
      <NameWrapper>
        <Name>{modelName} {model?.discoverable &&
          <Tooltip title="All users in this Domino deployment can find this model">
            <span style={{fontSize: 20}}><GlobalOutlined /></span>
          </Tooltip>
          }
          </Name>
        <ModelDiscoverabilitySwitch modelName={modelName} />
      </NameWrapper>
    </header>
  )
}

export default ModelDetailsHeader
