import * as React from 'react';
import Button from '../../Button/Button';
import ConfirmationModal, { ConfirmationModalProps } from '../ConfirmationModal';

const ConfirmationModalWrapper = (props: ConfirmationModalProps) => {
  const [visible, setVisible] = React.useState<boolean>(false);

  const handleOnClick = () => setVisible(true);

  return (
    <>
      <Button btnType={'secondary'} isDanger={true} onClick={handleOnClick}>Action</Button>
      <ConfirmationModal {...props} isVisible={visible} setVisible={setVisible}/>
    </>
  );
};

export default ConfirmationModalWrapper;
