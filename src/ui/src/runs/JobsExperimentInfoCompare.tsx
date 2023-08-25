import * as React from 'react';
import * as R from 'ramda';
import Link from '@domino/ui/dist/components/Link/Link';
import {
  getExperimentsBasePath,
  getExperimentRunDetailsPath,
  getExperimentRunsPath
} from '@domino/ui/dist/core/routes';
import { searchExperiments, searchRuns } from '../experiments/api';
import { Experiment, Run } from '../experiments/types';

export interface Props {
  projectId: string;
  baseJobId: string;
  targetJobId: string;
  ownerName: string;
  projectName: string;
}

const JobsExperimentInfoCompare = (props: Props) => {
  const {projectId, baseJobId, targetJobId, ownerName, projectName} = props;
  const [experiments, setExperiments] = React.useState<Experiment[]>([]);
  const [baseJobRuns, setBaseJobRuns] = React.useState<Run[]>([]);
  const [targetJobRuns, setTargetJobRuns] = React.useState<Run[]>([]);

  const fetchExperiments = async () => {
    try {
      const response = await searchExperiments({
        projectId: projectId
      });
      setExperiments(response.experiments);
    } catch (e) {
      console.warn(e);
    }
  };

  const fetchExperimentRuns = (jobId: string) => {
    return searchRuns({
      experiment_ids: experiments.map(R.prop('experiment_id')),
      filter: `tags."mlflow.domino.run_id"="${jobId}" and tags."mlflow.source.type"="JOB"`
    });
  };

  const fetchAllExperimentRuns = async () => {
    if (!R.isEmpty(experiments)) {
      try {
        const [baseJobRunsResponse, targetJobRunsResponse] = await Promise.all([
          fetchExperimentRuns(baseJobId),
          fetchExperimentRuns(targetJobId)
        ]);
        setBaseJobRuns(baseJobRunsResponse?.runs || []);
        setTargetJobRuns(targetJobRunsResponse?.runs || []);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  React.useEffect(() => {
    fetchExperiments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  React.useEffect(() => {
    fetchAllExperimentRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiments, baseJobId, targetJobId]);

  const isEmptyData = () =>
    (R.isEmpty(baseJobRuns) || R.isNil(baseJobRuns)) && (R.isEmpty(targetJobRuns) || R.isNil(targetJobRuns));

  const renderExperimentView = (experimentIdsLength: number, experiment?: Experiment) => {
    return R.cond([
      [() => experimentIdsLength > 1, () => (
        <>
          {experimentIdsLength} experiments&nbsp;
          <Link href={getExperimentsBasePath(ownerName, projectName)}>
            View
          </Link>
        </>
      )],
      [() => experimentIdsLength === 1, () => (
        <Link href={getExperimentRunsPath(ownerName, projectName, experiment?.experiment_id)}>
          {experiment?.name}
        </Link>
      )],
      [R.T, () => '-']
    ])();
  };

  const renderExperimentRunView = (runs: Run[], experimentIdsLength: number) => {
    const runsLength = runs.length;
    const runIds = runs.map((run: Run) => run.info.run_id, experiments);
    return R.cond([
      [() => experimentIdsLength > 1, () => runsLength + ' runs'],
      [() => runsLength > 1, () => (
        <>
          {runsLength} runs&nbsp;
          <Link
            href={
              getExperimentRunsPath(ownerName, projectName, runs[0].info.experiment_id,) +
              `?search=attributes.run_id IN ('${R.join('\', \'', runIds)}')`
            }
          >
            View
          </Link>
        </>
      )],
      [() => runsLength === 1, () => (
        <Link
          href={getExperimentRunDetailsPath(ownerName, projectName, runs[0].info.experiment_id, runs[0].info.run_id)}
        >
          {runs[0].info.run_name || runs[0].info.run_id}
        </Link>
      )],
      [R.T, () => '-']
    ])();
  };

  if (isEmptyData()) {
    return null;
  }

  const baseJobExperimentIds = baseJobRuns.reduce((acc, run) =>
    R.contains(run.info.experiment_id, acc) ? acc : R.concat(acc, [run.info.experiment_id]), []);
  const targetJobExperimentIds = targetJobRuns.reduce((acc, run) =>
    R.contains(run.info.experiment_id, acc) ? acc : R.concat(acc, [run.info.experiment_id]), []);
  const baseJobExperimentsLength = baseJobExperimentIds.length;
  const targetJobExperimentsLength = targetJobExperimentIds.length;
  const baseExperiment = baseJobExperimentsLength === 1 ? (experiments.find(R.propEq('experiment_id', baseJobExperimentIds[0]))) : undefined;
  const targetExperiment = targetJobExperimentsLength === 1 ? (experiments.find(R.propEq('experiment_id', targetJobExperimentIds[0]))) : undefined;

  return (
    <>
      <tr>
        <td>Experiment Run</td>
        <td>{renderExperimentRunView(baseJobRuns, baseJobExperimentsLength)}</td>
        <td>{renderExperimentRunView(targetJobRuns, targetJobExperimentsLength)}</td>
      </tr>
      <tr>
        <td>Experiment</td>
        <td>{renderExperimentView(baseJobExperimentsLength, baseExperiment)}</td>
        <td>{renderExperimentView(targetJobExperimentsLength, targetExperiment)}</td>
      </tr>
    </>
  );
};

export default JobsExperimentInfoCompare;
