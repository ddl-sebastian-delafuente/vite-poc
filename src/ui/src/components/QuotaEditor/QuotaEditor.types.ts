export interface QuotaTarget {
  /**
   * Human friendly name used to identify the entity ex Username or Project Name
   */
  targetName?: string;

  /**
   * The ID of the entity that you wish to apply a quota to
   */
  targetId?: string;
}

export interface BaseQuota extends QuotaTarget {
  /**
   * Dimensionless value for the quota 
   */
  limit?: number;
}

export interface QuotaTargetSelectorProps<T extends BaseQuota> {
  /**
   * A list of existing records passed to allow input to filter items out if required
   */
  existingRecords?: T[];
  onChange: (selectedTargets: QuotaTarget[]) => void;
}

export type TransformPrefix2Abs = (prefixValue: number) => number;
export type TransformAbs2Prefix = (absValue: number) => number;
