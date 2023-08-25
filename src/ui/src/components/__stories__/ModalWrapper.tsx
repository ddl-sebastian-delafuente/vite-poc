import * as React from 'react';
import Button from '../Button/Button';
import Modal, { DominoModalProps } from '../Modal';

const ModalWrapper = ({titleText, ...rest}: DominoModalProps) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <div>
      <Button btnType="primary" onClick={showModal}>Modal</Button>
      <Modal
        {...rest}
        titleText={titleText}
        titleIconName="ClockCircleOutlined"
        visible={visible}
        onCancel={hideModal}
        closable={true}
      />
    </div>
  );
};

export default ModalWrapper;
