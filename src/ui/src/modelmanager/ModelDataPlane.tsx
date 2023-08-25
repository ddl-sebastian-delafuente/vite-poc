import * as React from 'react';
import * as R from 'ramda';
import Tag from '@domino/ui/dist/components/Tag/Tag';
import useStore from '@domino/ui/dist/globalStore/useStore';
import { getDataPlane } from '@domino/api/dist/Dataplanes';
import { getErrorMessage } from '@domino/ui/dist/components/renderers/helpers';
import {
  DominoDataplaneDataPlaneDto
} from '@domino/api/dist/types';
import { error as errorToast } from '../components/toastr';

interface Props {
  dataPlaneId: string;
}

const ModelDataPlane = ({ dataPlaneId }: Props) => {
  const [dataPlane, setDataPlane] = React.useState<DominoDataplaneDataPlaneDto>();
  const { formattedPrincipal } = useStore();

  const fetchDataPlaneById = async () => {
    try {
      const dataPlane = await getDataPlane({ dataPlaneId });
      setDataPlane(dataPlane);
    } catch (err) {
      errorToast(await getErrorMessage(err, 'Something went wrong while fetching dataplane details'));
    }
  };

  React.useEffect(() => {
    if (!R.isNil(dataPlaneId)) {
      fetchDataPlaneById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPlaneId]);

  return (formattedPrincipal?.hybridModelApisEnabled && dataPlane) ? <Tag>{dataPlane.name}</Tag> : <></>;
};

export default ModelDataPlane;
