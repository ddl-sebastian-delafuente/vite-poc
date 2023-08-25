import * as React from 'react';
import { InputValues } from '../components/ValidatedForm';
import FormattedForm, {
  FormattedFormInputValues,
  InputOptions,
  InputSpec,
  InputType,
  TextAreaOptions
} from '../components/FormattedForm';
import { getError } from './util';

const getFields: ({nameLabel, additionalFields}: { nameLabel: string, additionalFields?: InputSpec[][] })
  => InputSpec[][] = ({nameLabel, additionalFields}) => {
  let fields = [
    [
      {
        inputType: 'input' as InputType,
        inputOptions: {
          key: 'name',
          className: 'name',
          label: `${nameLabel}`,
          validated: true,
          validators: [
            {
              checker: (value: string) => Boolean(getError(value)),
              errorCreator: (value: string) => getError(value),
            },
          ],
        } as InputOptions,
      } as InputSpec,
    ], [
      {
        key: 'description',
        inputType: 'textarea' as InputType,
        inputOptions: {
          validated: false,
          label: 'Description',
          key: 'description',
          className: 'description',
          placeholder: 'Dataset description',
        } as TextAreaOptions,
      } as InputSpec,
    ],
  ];
  if (additionalFields) {
    fields = [...fields, ...additionalFields];
  }
  return fields;
};

export interface Props {
  asModal?: boolean;
  onSubmit: (values: InputValues) => Promise<any> | void;
  onCancel: () => void;
  nameLabel?: string;
  submitLabel?: string;
  defaultValues?: InputValues;
  submitErrors?: FormattedFormInputValues;
  additionalFields?: InputSpec[][];
  fields?: InputSpec[][];
}

const AddDataSetContent: React.FC<Props> = ({
    asModal = true,
    onCancel = () => undefined,
    submitLabel = 'Create',
    submitErrors,
    nameLabel = 'Name',
    defaultValues,
    additionalFields,
    fields,
    ...props
  }) => {

  return (
    <FormattedForm
      onSubmit={props.onSubmit}
      onCancel={onCancel}
      asModal={asModal}
      fieldMatrix={fields ? fields : getFields({nameLabel, additionalFields })}
      submitLabel={submitLabel}
      dataTest={'create-dataset-'}
      submitErrors={submitErrors}
      defaultValues={defaultValues}
    />
  );
};

export default AddDataSetContent;
