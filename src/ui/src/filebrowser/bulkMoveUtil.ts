import { BulkMoveTreeNode } from './types';
import { getFileDirName } from '../utils/shared-components/validateFileNameFormUtil';

/**
 * @typedef any
 * @name BulkMoveTreeNode
 * @param {string} dirName
 * @param {bool} isOpen
 * @param {[]BulkMoveTreeNode} childDirs
 */

function getSubPath(index: number, path: string[]) {
  return path.slice(1, index + 1).join('/');
}

/**
 * Opens target node, specified by newPath. Gets new nodes if not already in tree.
 * Just updates flag in tree structure if already gotten.
 *
 * @function
 * @name openNode
 * @memberOf BulkMoveDialog
 * @param {[]string} newPath - path to parent node just opened
 * @param {[]BulkMoveTreeNode} tree - current level of tree
 * @param {number} index - current depth of newPath
 * @return {[]BulkMoveTreeNode} the updated tree
 */
export function openNode(newPath: string[], tree: BulkMoveTreeNode[], defaultIndex?: number): BulkMoveTreeNode[] {
  const index = defaultIndex || 0;
  return tree.map(node => {
    if (node.dirName === getSubPath(index, newPath)) {

      if (index < newPath.length - 1) {
        return Object.assign(
          {},
          node,
          { childDirs: openNode(newPath, node.childDirs, index + 1) }
        );
      } else {
        // on last node
        return Object.assign(
          {},
          node,
          {
            isOpen: true,
          },
        );
      }
    }

    return node;
  });
}

/**
 * Formats new found directories
 * @function
 * @nameformatDirectories
 * @param {[]string} directories
 * @return {[]{BulkMoveTreeNode}
 */
export function formatDirectories(directories: string[]): BulkMoveTreeNode[] {
  return directories.map((dirName: string) => ({
    dirName,
    childDirs: [],
    isOpen: false,
  }));
}

/**
 * Updates bulk move tree data structure in repsonse to a close event from the user
 * Closes all open nodes at and below end specified path
 *
 * @function
 * @name closeNode
 * @param {[]string} newPath - path to parent of nodes to close
 * @param {[]BulkMoveTreeNode} tree - tree structure to update
 * @param {number} index - level of tree we're currently at
 * @return {BulkMoveTreeNode} - updated tree
 */
export function closeNode(newPath: string[], tree: BulkMoveTreeNode[], defaultIndex?: number): BulkMoveTreeNode[] {
  const index = defaultIndex || 0;
  return tree.map(node => {
    if (index < newPath.length - 1) {
      // before you start closing things, just traverse
      if (node.dirName === getSubPath(index, newPath)) {
        return Object.assign(
          {},
          node,
          {
            childDirs: closeNode(newPath, node.childDirs, index + 1),
            isOpen: true,
          },
        );
      }
    } else if (index === newPath.length - 1) {
      // at parent to close
      if (node.dirName === getSubPath(index, newPath)) {
        return Object.assign(
          {},
          node,
          {
            childDirs: closeNode(newPath, node.childDirs, index + 1),
            isOpen: false,
          },
        );
      }
    } else if (node.isOpen) {
      // close remaining open children
      return Object.assign(
        {},
        node,
        {
          childDirs: closeNode(newPath, node.childDirs, index + 1),
          isOpen: false,
        },
      );
    }
    return node;
  });
}

/**
 * Formats directory name path as an array of entity names that maps to the
 * bulk move tree
 *
 * @function
 * @name formatNodePathAsBulkTreePath
 * @param {string} path - path to format
 * @return {[]string} - formatted path
 */
export function formatNodePathAsBulkTreePath(path: string): string[] {
  const cleanedPath = cleanPath(path);
  const splitPath = cleanedPath.split('/');

  if (path !== '') {
    return [''].concat(splitPath);
  }
  return splitPath;
}

export function filterChildDirectories(directories: string[], selectedEntities: { path: string }[]): string[] {
  return directories.filter(dirPath => {
    return !selectedEntities.find(e => e.path === dirPath);
  });
}

export function cleanPath(path: string): string {
  return path.split('/').filter(x => !!x).join('/');
}

/**
 * Checks if children at path exist
 * @name checkIfChildrenExist
 * @param {[]string} newPath - path to check if children exist at end of
 * @param {[]BulkMoveTreeNode} tree - current tree data
 * @param {number} index - current level in path
 */
export function checkIfChildrenExist(
  newPath: string[], tree: BulkMoveTreeNode[], defaultIndex?: number
): boolean | undefined {
  const index = defaultIndex || 0;
  let i = 0;
  let node;
  for (; i < tree.length; i++) {
    node = tree[i];
    if (node.dirName === newPath[index]) {
      if (index < newPath.length - 1) {
        return checkIfChildrenExist(newPath, node.childDirs, index + 1);
      }
      return !!node.childDirs.length;
    }
  }
  return;
}

export function formatInitialDataAsFileTree(
  defaultData: any[], relativePath: string
) {
  function formatChildren(data: any[]): BulkMoveTreeNode[] {
    return data.map(child => {
      const dirName = child[0];
      const children = child[1];
      // is open if name is subset of path
      const isOpen = relativePath.indexOf(dirName) === 0 && dirName !== relativePath;

      return {
        dirName,
        isOpen,
        childDirs: formatChildren(children),
      };
    });
  }

  return [{
    dirName: '',
    isOpen: true,
    childDirs: formatChildren(defaultData[1]),
  }];
}

export function getTargetPath(originPath: string, targetPath: string): string {
  const entityName = getFileDirName(originPath);

  if (!targetPath) {
    return entityName || '';
  }

  return `${targetPath}/${entityName}`;
}
