import { Switch, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import React from 'react'
import { useGetRegisteredModelByName, useMutateModelDiscoverability } from '../modelRegistryHooks'

type Props = {
  modelName: string
}

// FUTURE: this component should be invisible except to project owners and model owners. DOM-49368
const ModelDiscoverabilitySwitch: React.FC<Props> = ({ modelName }) => {
  const { isLoading, error, data: model } = useGetRegisteredModelByName({ modelName });
  const mutation = useMutateModelDiscoverability()

  const onChange = (checked: boolean) => {
    mutation.mutate({
      modelName,
      discoverable: checked
    })
  }

  if (isLoading || error || !model) return <></>

  return (
    <label>
      <Switch
        checked={model.discoverable}
        onChange={onChange}
        style={{marginRight: 5}}
      />
      Globally discoverable
      <Tooltip title="All users in this Domino deployment can find this model. Users will need access to the model's origin project in order to reuse it.">
        <InfoCircleOutlined style={{marginLeft: 4}}/>
      </Tooltip>
    </label>
  )
}
export default ModelDiscoverabilitySwitch
