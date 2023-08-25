import * as React from 'react';

import XButton from '../components/XButton';

export type Props = {
  id: string;
  projectUser: string;
  importedProjectName: string;
  handleRemove: (depName: string, id: string) => () => void;
};

const RemoveProjectButton = ({
  id,
  projectUser,
  importedProjectName,
  handleRemove,
}: Props) => {
  const depName = `${projectUser}/${importedProjectName}`;
  return (
    <XButton
      onClick={handleRemove(depName, id)}
      type="submit"
      title="Remove dependency"
    />
  );
};

export default RemoveProjectButton;
