import React, {ReactNode, useContext} from 'react'
import { createContext } from 'react'
import { ModelRegistryRouteProvider, ModelRegistryGlobalRouteProvider, ModelRegistryProjectRouteProvider } from './routes'

const defaultRoutes = new ModelRegistryGlobalRouteProvider()

// Context is private to this file
const Context = createContext<ModelRegistryRouteProvider>(defaultRoutes)

type Props = {
  projectOwner?: string
  projectName?: string
  children?: ReactNode
}
const ModelRegistryRouteContextProvider: React.FC<Props> = ({projectOwner, projectName, children}) => {
  const routes: ModelRegistryRouteProvider = (projectOwner && projectName) ?
    new ModelRegistryProjectRouteProvider(projectOwner, projectName)
    : defaultRoutes

  return <Context.Provider value={routes}>{children}</Context.Provider>
}

const useModelRegistryRoutes = () => useContext(Context)

export { ModelRegistryRouteContextProvider, useModelRegistryRoutes }
export type { Tab as ModelDetailsTab } from './routes'
