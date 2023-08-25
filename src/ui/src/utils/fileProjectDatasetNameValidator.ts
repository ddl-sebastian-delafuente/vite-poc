export const correctDirNamespacePattern = /^([a-z]|[A-Z]|[0-9]){1}[\w-]*$/;
const correctNamespacePattern = /^([a-z]|[A-Z]|[0-9]){1}[\w-]*$/;
const correctFilePattern = /^([.]|[a-z]|[A-Z]|[0-9]|_){1}[\w-.]*$/;

export function fileProjectDatasetNameValidator(newName: string, entityType?: string): boolean {
  if (entityType === 'file') {
    return correctFilePattern.test(newName);
  }
  return correctNamespacePattern.test(newName);
}

export function getInvalidNamespaceMessage(nameSpaceType: string, name?: string): string {
  const entityType = nameSpaceType.toLowerCase();
  if (entityType === 'file') {
    if (name) {
      return `Invalid ${nameSpaceType} name "${name}". Use letters, numbers, underscores, periods, or hyphens and a letter, number, underscore, or period to start.`;
    }

    return `Invalid ${nameSpaceType} name. Use letters, numbers, underscores, periods, and hyphens and a letter, number, underscore, or period to start.`;
  }

  if (name) {
    return `Invalid ${nameSpaceType} name "${name}". Use letters, numbers, underscores, and hyphens and a letter or a number to start.`;
  }

  return `Invalid ${nameSpaceType} name. Use letters, numbers, underscores, and hyphens and a letter or number to start.`;
}
