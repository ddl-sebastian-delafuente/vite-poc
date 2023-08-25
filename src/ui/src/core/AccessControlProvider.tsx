import { isDataAnalystUser } from '@domino/api/dist/Users';
import * as R from 'ramda';
import * as React from 'react';

import { EntityType, getPermissions, Permission } from '../proxied-api/Auth';
import { ResponseCache } from '../proxied-api/utils';
import { AccessControlResourceMapping } from './accessControlResourceMappings';

export interface AccessControlProviderProps {
  children: React.ReactNode;
}

type EntityIds = { [key in EntityType]?: string };

export interface AccessControl {
  hasAccessToResource: (resourceId: string, entityIds?: EntityIds) => boolean | null;
  hasAccess: () => boolean;
  isDataAnalystUser?: boolean;
  resolvedPermissionsMap?: { [key: string]: boolean | null };
}

export interface WithAccessControlProps {
  accessControl: AccessControl,
}

export const isDataAnalystUserDevTest = (obj: {}): Promise<boolean> => new Promise((resolve) => {
  void obj;
  setTimeout(() => resolve(false), 1000);
});

const DEFAULT_ACCESS_CONTROL: AccessControl = {
  hasAccessToResource: () => false,
  hasAccess: () => false,
}

const AccessControlContext = React.createContext<AccessControl | null>(null);

/**
 * Used in conjunction with AccessControlProvider supplies a hook
 * that returns the AccessControl context.
 */
export const useAccessControl = (): AccessControl => {
  const accessControl = React.useContext(AccessControlContext);

  if (accessControl === null) {
    console.error('useAccessControl needs to be used within a AccessControlProvider');
    return DEFAULT_ACCESS_CONTROL;
  }

  return accessControl;
};

/**
 * Used in conjunction with AccessControlProvider supplies a high order component 
 * that can wrap Class based components and give them access to the AccessControl
 * context. If using functional components use the useAccessControl hook instead.
 */
export const withAccessControl = <P,>(WrappedComponent: React.ComponentType<P & WithAccessControlProps>): React.ComponentType<P> => {
  return (props: P) => {
    const accessControl = useAccessControl();

    return <WrappedComponent {...props} accessControl={accessControl} />;
  }
}

export interface AccessControlWrapperProps {
  children: React.ReactNode,
}

/**
 * Provides a simple semantic way to provide access control to a component
 * Note this must be imported from '@domino/ui/dist/core/AccessControlProvider'
 * even if the you are importing from within the package. This is due to issues
 * with the build system in develop mode and how the context is different
 * @example
 * // replaces using a hook
 * const SomeComponent = () => {
 *  const accessControl = useAccessControl();
 *  return (
 *    <>
 *      {accessControl.hasAccess() && <div>Hello World</div>}
 *    </>
 *  )
 * }
 *
 * // Use this instead
 * const SomeComponent = () => (
 *  <AccessControlWrapper>
 *    <div>Hello World</div>
 *  </AccessControlWrapper>
 * )
 */
export const AccessControlWrapper = ({ children }: AccessControlWrapperProps) => {
  const accessControl = useAccessControl();

  if (!accessControl.hasAccess()) {
    return null;
  }

  return children;
}

const getResourcePermission = async ({
  resource,
  resourceId,
  entityIds,
}: {
  resource: { [key in EntityType]?: Permission[] },
  resourceId: string,
  entityIds: EntityIds
}) => {
  const permissions = {};
  const resourceKeys = Object.keys(resource);

  for (let i = 0; i < resourceKeys.length; i++) {
    const keyName = resourceKeys[i];
    if (!keyName) {
      break;
    }

    switch(keyName) {
      case EntityType.Dataset:
        permissions[keyName] = [Permission.ReadDatasetRwV2, Permission.ListDatasetRwV2];
        break;
      case EntityType.DatasetInstance: {
        // Check if it has a entity id
        const datasetEntityId = entityIds[keyName];
        if (!datasetEntityId) {
          throw new ReferenceError(`Missing dataset entity id for resource ${resourceId}`)
        }

        permissions[keyName] = await getPermissions('test-user-id', datasetEntityId, keyName);
        break;
      }
      default:
        permissions[keyName] = [];
        break;
    }
  }

  return permissions;
}

export const resolvedPermissions = ResponseCache<boolean>({});

export const resolvePermissionsForResource = async (resourceId: string, entityIds = {}, setResolvedPermissionsMap: (map: Pick<AccessControl, 'resolvedPermissionsMap'>) => void) => {
  // Check if resource is defined in mapping
  const resource = AccessControlResourceMapping[resourceId];

  if (!resource) {
    console.warn(`Unable to determine permissions: Missing ResourceID for "${resourceId}"`);
    return;
  }
  
  const key = JSON.stringify({ resourceId, entityIds });
  resolvedPermissions.startResolvingValue(key);

  // loop through resources needed to check for entity and fetch data if needed
  try {
    const permissions = await getResourcePermission({
      resource,
      resourceId,
      entityIds,
    });

    // If permissions match the resource
    const hasPermissions = Object.keys(resource).reduce((memo, resourceId) => {
      if (!memo) {
        return memo;
      }

      const requiredPermissions = resource[resourceId].sort();
      const availablePermissions = permissions[resourceId];

      return R.equals(requiredPermissions, R.intersection(requiredPermissions, availablePermissions).sort());
    }, true);
    resolvedPermissions.setValue(key, hasPermissions);
    setResolvedPermissionsMap({ ...resolvedPermissions.getAll() });
    return hasPermissions;
  } catch (e) {
    resolvedPermissions.abortResolvingValue(key);
    return false;
  }
};


/**
 * AccessControlProvider supplies a AccessControl context which contains some useful
 * methods and properties to understand if the current user is allowed to access a 
 * given UI. With this we can programmatically show/hide UI.
 */
export const AccessControlProvider = ({ children }: AccessControlProviderProps) => {
  const [ contextValue, setContextValue ] = React.useState<AccessControl>(DEFAULT_ACCESS_CONTROL);
  const [ data, setData ] = React.useState<Pick<AccessControl, 'isDataAnalystUser'>>({});
  const [ resolvedPermissionsMap, setResolvedPermissionsMap] = React.useState({});
  const checkAnalystUser = React.useCallback(async () => {
    try {
      const response = await isDataAnalystUser({});
      setData({
        ...data,
        isDataAnalystUser: response,
      });
    } catch(e) {
      console.warn('[AccessControlProvider] Failed to fetch data', e);
    }
  }, [data, setData]);

  const hasAccessToResource = React.useCallback((resourceId: string, entityIds = {}) => {
    const key = JSON.stringify({ resourceId, entityIds });

    try {
      return resolvedPermissions.getValue(key);
    } catch (e) {
      // Only attempt to resolve if there is a cache miss (ReferenceError)
      // otherwise there is a request inflight already 
      if (e instanceof ReferenceError) {
        resolvePermissionsForResource(resourceId, entityIds, setResolvedPermissionsMap);
      }
      return null;
    }
  }, []);

  const hasAccess = React.useCallback(() => {
    if (data.isDataAnalystUser) {
      return false;
    }

    return true;
  }, [data]);

  React.useEffect(() => {
    checkAnalystUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setContextValue({
      ...data,
      hasAccess,
      hasAccessToResource,
      resolvedPermissionsMap,
    })
  }, [data, hasAccess, hasAccessToResource, resolvedPermissionsMap]);

  return (
    <AccessControlContext.Provider value={contextValue}
    >
      {children}
    </AccessControlContext.Provider>
  );
}
