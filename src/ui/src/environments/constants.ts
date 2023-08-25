export const dominoManagedInfoMessage = {
  SPARK: `Selecting this indicates that this environment can be used for
  the nodes of a Domino-managed Spark cluster. This environment should use a Spark-ready base image.`,
  RAY: `Selecting this indicates that this environment can be used for
  the nodes of a Domino-managed Ray cluster. This environment should have Ray installed`,
  DASK: `Selecting this indicates that this environment can be used for the nodes in a Domino-managed Dask cluster.
  This Environment should have Dask installed.`,
  MPI: `Selecting this indicates that this environment can be used for
  the workers of a Domino-managed MPI cluster. This environment should have MPI installed.`
};

const commonText = `Domino managed`;
export const labels = {
  SPARK: `${commonText} Spark`,
  RAY: `${commonText} Ray`,
  DASK: `${commonText} Dask`,
  MPI: `${commonText} MPI`
};

export default dominoManagedInfoMessage;
