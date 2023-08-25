/* eslint max-len: 0 */
/* Form label help text */

// Workspace Launcher Modal Help Text
export const HARDWARE_TIER_HELP_TEXT = 'The size of compute resource (CPU cores and memory) you would like to use for this workspace.';
export const COMPUTE_ENVIRONMENT_HELP_TEXT = 'The environment (the set of tools, packages, libraries, and other dependencies) you would like to run in this workspace.';
export const WORKSPACE_DEFINITION_SELECT_HELP_TEXT = 'The tool you would like to use in this workspace.';
export const DATASETS_HELP_TEXT = 'The Domino Datasets you would like to be able to use in this workspace.';
export const SPARK_CLUSTER_HELP_TEXT = 'The configuration of an on-demand Spark cluster you would like to be able to use in this workspace. This cluster is spun up alongside this workspace and spun down when you finish.';

// Workspace Launcher Modal Error Text
export const COMPUTE_ENVIRONMENT_ERROR_TEXT = 'Please select another environment.';
export const WORKSPACE_DEFINITION_SELECT_ERROR_TEXT = 'Please select an IDE';

// Job Launcher Modal Help Text
export const HARDWARE_TIER_HELP_TEXT_FOR_JOB = 'The size of compute resource (CPU cores and memory) you would like to use for this job.';
export const COMPUTE_ENVIRONMENT_HELP_TEXT_FOR_JOB = 'The environment (the set of tools, packages, libraries, and other dependencies) you would like to run in this job.';
export const DATASETS_HELP_TEXT_FOR_JOB = 'The Domino Datasets you would like to be able to use in this job.';
export const SPARK_CLUSTER_HELP_TEXT_FOR_JOB = 'The configuration of an on-demand Spark cluster you would like to be able to use in this job.  This cluster is spun up alongside this job and spun down when it finishes.';

// Common Cluster Constants
export const COMPUTE_CLUSTER_LABEL_TEXT = 'Cluster Compute Environment';
export const QUOTA_MAX_HELP_TEXT = 'Max is calculated based on safe number of instances within the overall quota limit and hardware tier specific limits set by your administrator.';

// Spark Cluster Modal Help Text
export const EXECUTOR_HARDWARE_TIER_HELP_TEXT = 'The size of compute resource (CPU cores and memory) you would like to use for the executors in this on-demand cluster.';
export const MASTER_HARDWARE_TIER_HELP_TEXT = 'The size of compute resource (CPU cores and memory) you would like to use for the master executor in this on-demand cluster.';
export const CLUSTER_COMPUTE_ENVIRONMENT_HELP_TEXT = 'The environment to be run on the compute nodes of the on-demand cluster.';

// Ray Cluster Help Text
export const WORKER_HARDWARE_TIER_HELP_TEXT = 'The size of compute resource (CPU cores and memory) you would like to use for the workers in this on-demand cluster.';
export const HEAD_HARDWARE_TIER_HELP_TEXT = 'The size of compute resource (CPU cores and memory) you would like to use for the head worker in this on-demand cluster.';

// Spark Cluster Label Text
export const EXECUTOR_COUNT_LABEL_TEXT = 'Number of Executors';
export const EXECUTOR_HARDWARE_TIER_LABEL_TEXT = 'Executor Hardware Tier';
export const MASTER_HARDWARE_TIER_LABEL_TEXT = 'Master Hardware Tier';
export const EXECUTOR_STORAGE_LABEL_TEXT = 'Dedicated local storage per executor';

// Ray Cluster Label Text
export const WORKER_COUNT_LABEL_TEXT = 'Number of Workers';
export const WORKER_HARDWARE_TIER_LABEL_TEXT = 'Worker Hardware Tier';
export const HEAD_HARDWARE_TIER_LABEL_TEXT = 'Head Hardware Tier';
export const SCHEDULER_HARDWARE_TIER_LABEL_TEXT = 'Scheduler Hardware Tier';
export const WORKER_STORAGE_LABEL_TEXT = 'Dedicated local storage per worker';

// Job Launcher Modal Help Text
export const JOBS_FILE_NAME_HELP_TEXT = 'The file or command you would like this job to execute.';

// Scheduled Job Launcher Modal Help Text
export const SCHEDULED_JOB_FILE_NAME_HELP_TEXT = 'The file or command you would like this scheduled job to execute.';
export const SCHEDULED_JOB_HARDWARE_TIER_HELP_TEXT = 'The size of compute resource (CPU cores and memory) you would like to use for this scheduled job.';
export const SCHEDULED_JOB_ENVIRONMENT_HELP_TEXT = 'The environment (the set of tools, packages, libraries, and other dependencies) you would like to run in this scheduled job.';
export const SCHEDULED_JOB_DATASETS_HELP_TEXT = 'The Domino Datasets you would like to be able to use in this scheduled job.';

// Exports constants
export const NEW_VERSION_TOOLTIP_TEXT = `To change this value, you must push a new version. 
This action is located in the actions menu in the upper right of the page.`;
export const NEW_EXPORTS_TOOLTIOP_TEXT = 'To change this value, you must create a new export.';
