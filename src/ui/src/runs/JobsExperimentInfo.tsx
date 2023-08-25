import * as React from 'react';
import * as R from 'ramda';
import { InfoBox } from '@domino/ui/dist/components/Callout/InfoBox';
import Link from '@domino/ui/dist/components/Link/Link';
import { getExperimentRunsPath, getExperimentsBasePath } from '@domino/ui/dist/core/routes';
import { searchExperiments, searchRuns } from '@domino/ui/dist/experiments/api';
import { Experiment, Run } from '@domino/ui/dist/experiments/types';

export interface Props {
  projectId: string;
  baseJobId: string;
  targetJobId: string;
  ownerName: string;
  projectName: string;
}

const JobsExperimentInfo = (props: Props) => {
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
  }, [projectId]);

  React.useEffect(() => {
    fetchAllExperimentRuns();
  }, [experiments, baseJobId, targetJobId]);

  const isEmptyData = () =>
    (R.isEmpty(baseJobRuns) || R.isNil(baseJobRuns)) && (R.isEmpty(targetJobRuns) || R.isNil(targetJobRuns));

  const experimentIds = new Set();
  baseJobRuns.map((run) => experimentIds.add(run.info.experiment_id));
  targetJobRuns.map((run) => experimentIds.add(run.info.experiment_id));

  return !isEmptyData() && (
    <InfoBox>
      To see a more detailed comparison, compare runs from the&nbsp;
      <Link href={
        experimentIds.size > 1 ?
          getExperimentsBasePath(ownerName, projectName) :
          getExperimentRunsPath(ownerName, projectName, experimentIds.values().next().value)
      }>
        Experiment
      </Link>
      &nbsp;page.
    </InfoBox>
  );
};

export default JobsExperimentInfo;
