import React from 'react'
import Button, { componentType as ButtonTypes } from '@domino/ui/dist/components/Button/Button'

type Props = {
  projectId?: string
  title?: string
  btnType?: ButtonTypes
  testId?: string
}

/**
 * Renders a link (in the style of a button) to the Create Model workflow
 * @param projectId optional - the project that the new model should be associated with
 * @param title optional - title/label of the button. Defaults to "Create Model API"
 * @param btnType optional - type of the button (primary/secondary). Defaults to "secondary"
 */
const CreateModelButton: React.FC<Props> = ({projectId, testId, title = 'Create Model API', btnType="secondary"}) => {
  const NEW_MODEL_BASE_URL = '/models/getBasicInfo'
  const newModelUrl = projectId ? NEW_MODEL_BASE_URL + `?projectId=${projectId}` : NEW_MODEL_BASE_URL

  return (
    <a href={newModelUrl}>
      <Button title={title} btnType={btnType} testId={testId}>
        {title}
      </Button>
    </a>
  )
}

export default CreateModelButton
