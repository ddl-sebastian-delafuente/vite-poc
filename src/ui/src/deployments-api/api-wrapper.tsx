
import React, {
  useState, useEffect
} from 'react';

interface Tag {
 tagId: string,
 tagName: string
}

interface Publisher {
  publisherId: string,
  publisherName: string
}

interface Deployment {
  id: string,
  name: string,
  projectId: string,
  projectName: string,
  modelType: string,
  predictions: number,
  driftMeasure: number,
  qualityMeasure: number,
  deploymentLocation: string,
  lastModified: Date,
  deploymentType: string,
  source: string,
  tags: [Tag],
  createdAt: Date,
  publisher: Publisher,
}

const tag1 = {
  tagId: "t00001",
  tagName: "First tag"
}

const tag2 = {
  tagId: "t00002",
  tagName: "Second tag"
}

const publisher1 = {
  publisherId: "p00001",
  publisherName: "First Publisher"
}

const publisher2 = {
  publisherId: "p00002",
  publisherName: "Second Publisher"
}

const deployment1 = {
  id: "d00001",
  name: "Deployment 1",
  projectId: "p00001",
  projectName: "Project 1",
  modelType: "API",
  predictions: 1,
  driftMeasure: 1,
  qualityMeasure: 1,
  deploymentLocation: "Location 1",
  lastModified: new Date(),
  deploymentType: "AWS",
  source: "Source 1",
  tags: [tag1, tag2],
  createdAt: new Date(),
  publisher: publisher1,
}

const deployment2 = {
  id: "d00002",
  name: "Deployment 2",
  projectId: "p00001",
  projectName: "Project 1",
  modelType: "APP",
  predictions: 2,
  driftMeasure: 2,
  qualityMeasure: 2,
  deploymentLocation: "Location 2",
  lastModified: new Date(),
  deploymentType: "AWS",
  source: "Source 2",
  tags: [tag1, tag2],
  createdAt: new Date(),
  publisher: publisher2,
}

const deployment3 = {
  id: "d00002",
  name: "Deployment 3",
  projectId: "p00001",
  projectName: "Project 1",
  modelType: "LAUNCHER",
  predictions: 3,
  driftMeasure: 3,
  qualityMeasure: 3,
  deploymentLocation: "Location 3",
  lastModified: new Date(),
  deploymentType: "AWS",
  source: "Source 3",
  tags: [tag1, tag2],
  createdAt: new Date(),
  publisher: publisher2,
}

// @ts-ignore
const getDeployments = (projectId) => {
  const deployments = [
      deployment1,
      deployment2,
      deployment3
    ]
  return deployments
}


interface Props {
  projectId?: string,
  overrideDeployments?: [Deployment] | any
}

const defaultProps: Props = {
  projectId: '123'
}


const DeploymentsAPIWrapper = ({projectId, overrideDeployments} = defaultProps) => {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [error, setError] = useState<any>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!overrideDeployments) {
          const fetchedDeployments = getDeployments({projectId});
          setDeployments(fetchedDeployments);
        } else {
          setDeployments(overrideDeployments);
        }

      } catch (e) {
        setError(e)
      }
    };
    fetchData();
  }, [projectId]);

  return (
    !error ? (<ul>
      {deployments.map(item => (
        <div key={item.id}>{item.id}</div>
      ))}
    </ul>) : (<div>{error}</div>)
  );
}

export default DeploymentsAPIWrapper;
