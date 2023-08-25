import React, { useEffect, useState } from 'react'
import { useGetRegisteredModelByName } from '../modelRegistryHooks'
import { Col, Row } from 'antd'
import { colors, margins, paddings, themeHelper } from '../../styled'
import ModelOverviewSidebar from './ModelOverviewSidebar'
import { Markdown } from '../../components/Markdown'
import Button from '../../components/Button/Button'
import { EditOutlined, EyeOutlined, EyeInvisibleOutlined, SaveOutlined, StopOutlined } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'
import styled from 'styled-components'
import { RegisteredModelV1 } from '../types'
import { updateModelDescription } from '../api'
import { success as toastrSuccess, error as toastrError } from '../../components/toastr'
import { getErrorMessage } from '../../components/renderers/helpers'
import FlexLayout from '../../components/Layouts/FlexLayout'

type ModelOverviewProps = {
  modelName: string
}
const ModelOverview: React.FC<ModelOverviewProps> = ({modelName}) => {
  const { isLoading, error, data: model } = useGetRegisteredModelByName({ modelName });

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.status} - {error.name}</p>
  if (!model) return <p>No data!</p>

  return (
    <Row style={{marginTop: margins.LARGE_INT}}>
      <Col className="modelOverviewBody" span={16} style={{paddingRight: paddings.LARGE}}>
        <EditableModelDescription model={model} />
      </Col>
      <Col className="modelOverviewSidebar" span={8}>
        <ModelOverviewSidebar model={model} />
      </Col>
    </Row>
  )
}

const EmptyState = styled(FlexLayout)`
  font-size:  ${themeHelper('fontSizes.small')};
  color: ${colors.neutral500};
  margin-top: 36px;
  padding-bottom: 60px;
`

const Actions = styled.div`
  position: absolute;
  top: 3px;
  right: 10px;
  z-index: 1;
`

type Mode = 'viewing' | 'editing' | 'previewing'
type EditableModelDescriptionProps = {
  model: RegisteredModelV1
}
const EditableModelDescription: React.FC<EditableModelDescriptionProps> = ({model}) => {
  const [mode, setMode] = useState<Mode>('viewing')
  const [content, setContent] = useState<string>(model.description)
  
  // if model changes, update "content"
  useEffect(() => setContent(model.description), [model])

  const isDirty = content !== model.description

  const cancel = () => {
    setMode('viewing')
    setContent(model.description)
  }

  const save = async () => {
    try {
      const res = await updateModelDescription({ modelName: model.name, description: content })
      toastrSuccess('Model description updated.')
      model.description = res.registered_model?.description
      setContent(res.registered_model?.description)
      setMode('viewing')
    } catch (ex) {
      console.warn(ex);
      toastrError('Failed to update model description.', await getErrorMessage(ex))
    }
  }

  const ViewingActions =
    <Actions>
      <Button
        btnType="icon"
        icon={<EditOutlined />}
        title="Edit Description"
        onClick={() => setMode('editing')}
      />
    </Actions>

  const EditingActions =
    <Actions>
      <Button
        btnType="icon"
        icon={<EyeOutlined />}
        title="Preview"
        onClick={() => setMode('previewing')}
      />
      <Button
        btnType="icon"
        icon={<SaveOutlined />}
        title="Save"
        disabled={!isDirty}
        onClick={save}
      />
      <Button
        btnType="icon"
        icon={<StopOutlined />}
        title="Cancel"
        onClick={cancel}
      />
    </Actions>

  const PreviewingActions =
    <Actions>
      <Button
        btnType="icon"
        icon={<EyeInvisibleOutlined />}
        title="Hide Preview"
        onClick={() => setMode('editing')}
      />
      <Button
        btnType="icon"
        icon={<SaveOutlined />}
        title="Save"
        onClick={save}
      />
      <Button
        btnType="icon"
        icon={<StopOutlined />}
        title="Cancel"
        onClick={cancel}    
      />
    </Actions>

  switch (mode) {
    case 'editing':
      return (
        <div style={{position: 'relative'}}>
          {EditingActions}
          <TextArea
            autoSize={{minRows: 5}}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      )
    case 'previewing':
    case 'viewing':
      return (
        <div style={{position: 'relative'}}>
          {mode === 'previewing' ? PreviewingActions : ViewingActions}
          <div style={{paddingTop: 3}}>
            {content && <Markdown shouldExecuteHtmlInMarkdown={false}>
              {content}
            </Markdown>}
            {!content && <EmptyState>This model has no description. Use the edit button to add one.</EmptyState>}
          </div>
        </div>
      )    
  }
}

export default ModelOverview
