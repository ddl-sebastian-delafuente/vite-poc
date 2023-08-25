import * as React from 'react';
import DataplanesTable from './DataplanesTable';
import { listDataPlanes } from '@domino/api/dist/Dataplanes';
import { DominoDataplaneDataPlaneDto } from '@domino/api/dist/types';
import RegisterDataPlaneModal from './RegisterDataPlaneModal';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';


const DataplanesView: React.FC = () => {
	const [dataplanes, setDataplanes] = React.useState<DominoDataplaneDataPlaneDto[]>([]);
	
	const getDataPlanes = React.useCallback(
		async () => {
			const allDataPlanesList = await listDataPlanes({'showArchived': true});
			setDataplanes(allDataPlanesList);
		},
		[],
	);

	React.useEffect(() => {
		if(dataplanes.length === 0){
			getDataPlanes();
		}
		const intervalId = setInterval(() => {
			getDataPlanes();
		}, 10000);
		return () => clearInterval(intervalId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [getDataPlanes]);

	return <>
		<FlexLayout justifyContent='space-between'>
			<h1>Data Planes</h1>
			<RegisterDataPlaneModal register={true} onDataplaneChange={getDataPlanes} dataplanes={dataplanes} />
		</FlexLayout>
		<DataplanesTable dataplanes={dataplanes} onDataplaneChange={getDataPlanes} />
	</>
}

export default DataplanesView;
