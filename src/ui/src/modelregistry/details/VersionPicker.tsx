import React from 'react'
import styled from 'styled-components'
import { Select } from 'antd'
import { Link } from 'react-router-dom'
import type { LabeledValue } from 'antd/lib/select'
import { RegisteredModelV1 } from '../types'
import { useGetRegisteredModelVersions } from '../modelRegistryHooks'
import { useModelRegistryRoutes } from '../ModelRegistryRouteContext'

type Props = {
  model: RegisteredModelV1
  version?: number,
}

type VersionPickerProps = Props & {
  setVersion: (version: number) => void;
}

 /**
 * Version picker section of model card
 */
 const VersionPicker: React.FC<VersionPickerProps> = ({model, version: selectedVersion, setVersion}) => {
  const { isLoading, error, data } = useGetRegisteredModelVersions({ modelName: model.name })

  if (error) return (<p>Error: {error.toString()}</p>)

  const versions: number[] = data ? data.items.map(v => v.modelVersion) : []
  // include selectedVersion even if it wasn't returned from the api
  if (selectedVersion && versions.indexOf(selectedVersion) < 0) {
    versions.unshift(selectedVersion)
  }

  const selectedValueAndLabel: LabeledValue | null = selectedVersion ? {
    value: selectedVersion,
    label: toLabel(model, selectedVersion),
  } : null
  const options = versions.map(version => ({
    value: version,
    label: <ClickableVersionLabel model={model} version={version} />
  }))

  return (
    <Select
      style={{minWidth: '160px', width: 'auto'}}
      loading={isLoading}
      placeholder="Select version"
      labelInValue={true}
      value={selectedValueAndLabel}
      options={options}
      onChange={({value}) => setVersion(value as number)}
    />
  )
}

export default VersionPicker


/**
 * An invisible span that fills the space inside of <Link>, making the whole row clickable rather than just the letters
 */
 const Hitbox = styled.span.attrs({className: 'Hitbox', 'aria-hidden': true})`
 position: absolute;
 inset: -0;
`

/**
* A <Link> but it uses `color: inherit` instead of blue
*/
const LinkWithInheritedColor = styled(Link)`
 color: inherit;
 &:hover {
   color: inherit;
 }
 &:active {
   color: inherit;
 }
`

/**
* Convert a version number string, e.g. '99' to a label, 'Version 99'
* If the version is the model's latest, version, appends (Latest) to the string
* @param model the model
* @param version the version number string, example: '99'
* @returns a string, example: 'Version 99'
*/
const toLabel: (model: RegisteredModelV1, version: number) => string = (model, version) => {
 const label = `Version ${version}`
 if (model.latestVersion === version) {
   return `${label} (Latest)`
 }
 return label
}

/**
* A clickable row for the <Select>. The whole row is clickable, and it's a link to the model card at that version.
*/
const ClickableVersionLabel: React.FC<Required<Props>> = ({model, version}) => {
 const router = useModelRegistryRoutes()
 const href = router.modelCardTab(model.name, version)
 return (
   <LinkWithInheritedColor to={href}><Hitbox />{toLabel(model, version)}</LinkWithInheritedColor>
 )
}
