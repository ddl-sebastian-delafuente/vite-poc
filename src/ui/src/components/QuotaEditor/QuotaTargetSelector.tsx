import * as React from 'react';
import Input from '../TextInput/Input';

import {
  BaseQuota,
  QuotaTargetSelectorProps,
} from './QuotaEditor.types';

/**
 * This is just a placeholder default Component it should always be replaced
 */
export const QuotaTargetSelector = <T extends BaseQuota>({ 
  onChange 
}: QuotaTargetSelectorProps<T>) => {
  const [targetName, setTargetName] = React.useState('');
  const [targetId, setTargetId] = React.useState('');

  const handleTargetIdChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetId(e.target.value);
  }, [setTargetId]);
  
  const handleTargetNameChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetName(e.target.value);
  }, [setTargetName]);

  React.useEffect(() => {
    if (targetId && targetName) {
      onChange([{ targetId, targetName }]);
    }
  }, [onChange, targetId, targetName])

  return (
    <>
      <Input onChange={handleTargetNameChange} placeholder="Target Name"/>
      <Input onChange={handleTargetIdChange} placeholder="Target ID"/>
    </>
  )
}
