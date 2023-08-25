export enum projectStatus {
  Blocked = 'block',
  Completed = 'complete',
  Active = 'active'
}

export const isBlocked = (status: string) => status === projectStatus.Blocked;
export const isComplete = (status: string) => status === projectStatus.Completed;
export const isActive = (status: string) => status === projectStatus.Active;
