import * as R from 'ramda';
import * as React from 'react';
import { EditInlineContainer, EditInlineContainerProps } from '../EditInlineContainer';
import InfoBox from '../../Callout/InfoBox';
import DangerBox from '../../Callout/DangerBox';
import { FIELD_WIDTH } from '../../TextInput/__stories__/TextInputWrapper';

const ERROR_TEXT = 'Value cannot be empty. Please type in some value.';
const UPDATE_TEXT = 'Value updated. This is some more text explaining the update.';

const renderCallout = (msg: string) => (Callout: React.FC<{ children?: React.ReactNode }>) => <Callout>{msg}</Callout>;

const EditInlineWrapper = (args: EditInlineContainerProps) => {
  const [callout, setCallout] = React.useState<JSX.Element | null>(null);
  const errRef = React.useRef(false);
  
  const handleFailableSubmit = async (val: string) => {
    await new Promise(_ => setTimeout(_, 1000));
    if (!R.isNil(val) && R.isEmpty(val)) {
      errRef.current = true;
      setCallout(renderCallout(ERROR_TEXT)(DangerBox));
      return false;
    }
    errRef.current = false;
    setCallout(renderCallout(UPDATE_TEXT)(InfoBox));
    return true;
  }

  const onStart = () => setCallout(null);
  const onCancel = () => {
    if (errRef.current) {
      errRef.current = false;
      setCallout(null);
    }
  };

  return (
    <h2 style={{ width: FIELD_WIDTH }}>
      <EditInlineContainer
        {...args}
        onStart={onStart}
        onCancel={onCancel}
        handleFailableSubmit={handleFailableSubmit}
      />
      {callout}
    </h2>
  );
}

export default EditInlineWrapper;
