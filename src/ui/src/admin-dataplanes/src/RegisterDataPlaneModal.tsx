import React, { useCallback, useState, useEffect } from 'react';
import { Form, FormInstance } from 'antd';
import { Checkbox } from '@domino/ui/dist/components';
import Input from '../../components/TextInput/Input';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { createDataPlane, updateDataPlane } from '@domino/api/dist/Dataplanes';
import { DominoDataplaneDataPlaneDto, DominoDataplaneDataPlaneConfiguration } from '@domino/api/dist/types';
import InvisibleButton from '../../components/InvisibleButton';
import { EditOutlined } from '@ant-design/icons';
import { themeHelper } from '@domino/ui/dist/styled/themeUtils';
import FlexLayout from '@domino/ui/dist/components/Layouts/FlexLayout';
import * as toastr from '@domino/ui/dist/components/toastr';
import DataplaneSetupModal from './DataplaneSetupModal';
import Accordion from '@domino/ui/dist/components/Accordion/Accordion';
import WarningBox from '@domino/ui/dist/components/WarningBox';
import Link from '@domino/ui/dist/components/Link/Link';

const modalWidth = '560px';

const StyledForm = styled(Form)`
padding: 40px 40px 0px;
.ant-form-item {
  margin-bottom: 22px;
}
.ant-form-item-label {
  line-height: 17px;
  margin-bottom: 8px;
}
`;

const StyledWarningBox = styled(WarningBox)`
margin: 10px 40px 0px 40px;
`;

export const StyledEditOutlined = styled(EditOutlined)`
  margin-right: ${themeHelper('margins.tiny')};
`;

const StyledDiv = styled.div`
  padding: 0px 40px 100px;
`;

type RegisterDataplaneProps = {
  register: boolean;
  dataplane?: DominoDataplaneDataPlaneDto;
  onDataplaneChange: () => void;
  dataplanes: DominoDataplaneDataPlaneDto[];
}

type DetailsContentFormProps = {
  onNameChange: (val?: string) => void;
  setForm: (val: FormInstance) => void;
  onNameSpaceChange: (val: string) => void;
  register: boolean;
  dataplaneName?: string;
  namespace?: string;
  nameError: boolean;
  nameSpaceError:boolean;
  dataplanes: DominoDataplaneDataPlaneDto[];
}

//TODO: remove this once DominoDataplaneDataPlaneConfiguration has all its felds
type tempConfiguration = { hostname?: string } & DominoDataplaneDataPlaneConfiguration

type AdvancedDetailsFormProps = {
  setForm: (val: FormInstance) => void;
  setConfiguration: (val: tempConfiguration) => void;
  dataPlaneConfiguration?: tempConfiguration;
}

const DetailsContentForm = (props: DetailsContentFormProps) => {
  const { onNameChange, setForm, register, dataplaneName, nameError, nameSpaceError, namespace, onNameSpaceChange } = props;
  const [form] = Form.useForm();
  useEffect(() => {
    setForm(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledForm form={form} layout="vertical" name="Dataplane-name-form">
      <Form.Item
        name="dataPlaneName"
        validateStatus={nameError ? 'error' : undefined}
        help={nameError && !dataplaneName ? 'Dataplane name can’t be blank' : undefined}
        label="Data Plane name"
        rules={
          [
            {
              required: true,
              message: 'Data Plane name can’t be blank',
            },
          ]
        }
      >
        <Input
          placeholder="Enter Data Plane Name"
          onKeyUp={() => onNameChange(form.getFieldValue('dataPlaneName'))}
          defaultValue={register ? "" : dataplaneName}
        />
      </Form.Item>
      <Form.Item
        name="namespace"
        label="Namespace"
        validateStatus={nameSpaceError ? 'error' : undefined}
        help={nameSpaceError ? 'Namespace can’t be blank' : undefined }
        rules={
          [
            {
              required: true,
              message: 'Namespace can’t be blank',
            },
          ]
        }
      >
        <Input
          placeholder="Enter Namespace"
          onKeyUp={() => onNameSpaceChange(form.getFieldValue('namespace'))}
          defaultValue={register ? "" : namespace}
        />
      </Form.Item>
    </StyledForm>
  );
}

const AdvancedDetailsForm = (props: AdvancedDetailsFormProps) => {
  const { setForm, dataPlaneConfiguration, setConfiguration } = props;

  const [form] = Form.useForm();
  useEffect(() => {
    setForm(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form form={form} layout="vertical" name="Dataplane-advanced-details">
      <Form.Item
        name="storageClass"
        label="Storage Class"
      >
        <Input
          placeholder="Customize Storage Class"
          onKeyUp={() => setConfiguration({ ...dataPlaneConfiguration, storageClass: form.getFieldValue('storageClass') || undefined })}
          defaultValue={dataPlaneConfiguration ? dataPlaneConfiguration.storageClass : ""}
        />
      </Form.Item>
      <Form.Item
        name="dataPlaneHostname"
        label="Data Plane Hostname (optionally with port)"
        rules={
          [
            {
              validator(_, value) {
                try {
                  if (value) {
                    const url = new URL("http://" + value)
                    if (url.host != value.toLowerCase()) {
                      return Promise.reject(new Error('Data Plane Hostname invalid.'));
                    }
                  }
                  return Promise.resolve();
                } catch(err) {
                  return Promise.reject(new Error('Data Plane Hostname invalid.'));
                }
              },
            },
          ]
        }
      >
        <Input
          placeholder="Enter Data Plane Hostname (optionally with port)"
          onKeyUp={() => setConfiguration({ ...dataPlaneConfiguration, address: form.getFieldValue('dataPlaneHostname') || undefined })}
          defaultValue={dataPlaneConfiguration ? dataPlaneConfiguration.address : ""}
        />
      </Form.Item>
      <Form.Item
        name="fileSyncDisabled"
        label="Disable File Sync"
        valuePropName="checked"
        initialValue={dataPlaneConfiguration?.fileSyncDisabled ? dataPlaneConfiguration.fileSyncDisabled : false}
      >
        <Checkbox
          onChange={() => setConfiguration({ ...dataPlaneConfiguration, fileSyncDisabled: form.getFieldValue('fileSyncDisabled') })}
        />
      </Form.Item>
      <Form.Item
        name="istioEnabled"
        label="Enable Istio"
        valuePropName="checked"
        initialValue={dataPlaneConfiguration?.istioEnabled ? dataPlaneConfiguration.istioEnabled : false}
      >
        <Checkbox
          onChange={() => setConfiguration({ ...dataPlaneConfiguration, istioEnabled: form.getFieldValue('istioEnabled') })}
        />
      </Form.Item>
      <Form.Item
        name="s3EndpointUrl"
        label="Override S3 Endpoint URL"
      >
        <Input
          placeholder="Enter S3 Endpoint URL"
          onKeyUp={() => setConfiguration({ ...dataPlaneConfiguration, s3EndpointUrl: form.getFieldValue('s3EndpointUrl') || undefined })}
          defaultValue={dataPlaneConfiguration ? dataPlaneConfiguration.s3EndpointUrl : ""}
        />
      </Form.Item>
    </Form>
  );
}

const RegisterDataPlaneModal = (props: RegisterDataplaneProps) => {
  const { dataplane, onDataplaneChange, dataplanes } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [nameError, setErrOnNameValidation] = useState<boolean>(false);
  const [nameSpaceError, setErrOnNameSpaceValidation] = useState<boolean>(false);
  const [dataplaneName, setName] = useState<string>(dataplane ? dataplane.name : '');
  const [namespace, setNamespace] = useState<string>(dataplane ? dataplane.namespace : '');
  const [regesteredDP, setRegesteredDP] = useState<any>();
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const [configuration, setConfiguration] = useState(dataplane ? {...dataplane.configuration} : {});
  const [detailsForm, setDetailsForm] = useState<FormInstance>();

  const showModal = useCallback(() => {
    // Boolean flags cannot be undefined. Initializing to false every time the form is open for a new DR.
    if (register) {
      setConfiguration({...configuration, fileSyncDisabled: false, istioEnabled: false});
    }
    setVisible(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hideModal = useCallback(() => {
    detailsForm?.resetFields();
    setErrOnNameValidation(false);
    setErrOnNameSpaceValidation(false);
    setName(dataplane ? dataplane.name : '');
    setNamespace(dataplane ? dataplane.namespace : '');
    setVisible(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onNameChange = useCallback((val: string) => {
    if (val.length > 0) {
      setErrOnNameValidation(false);
      setName(val);
    }
  }, [setErrOnNameValidation, setName]);

  const onNameSpaceChange = useCallback((val: string) => {
    if(val.length > 0){
      setErrOnNameSpaceValidation(false);
      setNamespace(val);
    }
  }, [setErrOnNameSpaceValidation, setNamespace]);

  const registerDataplane = async (dataplaneName: string, namespace: string, configuration:tempConfiguration) => {
    try{
      await createDataPlane({
        body: {
          name: dataplaneName,
          namespace: namespace,
          configuration: {...configuration}
        }
      }).then(newDP => {
        setRegesteredDP(newDP);
        setShowSetup(true);
        toastr.success('Dataplane registered');
      });
      onDataplaneChange();
      hideModal();
    }catch(err){
      try {
				const body = await err.body.json()
				if (body.message) {
					toastr.error(body.message)
				}
			} catch (err) {
				console.error(err)
				toastr.error("An error occurred.")
			}
    }
  }

  const handleSubmit = () => {
    dataplaneName.length === 0 && setErrOnNameValidation(true);
    namespace.length === 0 && setErrOnNameSpaceValidation(true);
    if (dataplaneName.length > 0 && namespace.length > 0) {
      if (register) {
        registerDataplane(dataplaneName, namespace, configuration);
      } else {
        //TODO: update updateDataplane with storageClass, hostname when method is ready to acccept them
        dataplane && updateDataplane(dataplane.id, dataplaneName, namespace, configuration);
      }
    }
  }

  const resetRegister = () => {
    setShowSetup(false);
  }

  const updateDataplane = async (id: string, dataplaneName: string, namespace: string, configuration: tempConfiguration) => {
    try{
      await updateDataPlane({
        dataPlaneId: id,
        body: {
          name: dataplaneName,
          namespace: namespace,
          configuration: { ...configuration }
        }
      })
      onDataplaneChange();
      hideModal();
      toastr.success('Data Plane updated');
    }catch(err){
      try {
				const body = await err.body.json()
				if (body.message) {
					toastr.error(body.message)
				}
			} catch (err) {
				console.error(err)
				toastr.error("An error occurred.")
			}
    }
  }

  const { register } = props;
  const editWarning = !register && 
    <StyledWarningBox>
      Please consult the {<Link href="https://docs.dominodatalab.com/en/5.5/admin_guide/f2877a/edit-a-data-plane/" openInNewTab={true}>documentation</Link>} regarding the nuances of editing a data plane.
    </StyledWarningBox>

  return (
    <>
      {register ? <Button btnType="primary" onClick={showModal}><PlusOutlined /> Register Data Plane</Button> :
        <InvisibleButton onClick={showModal}>
          <FlexLayout padding={0}>
            <StyledEditOutlined />
            <span>Edit</span>
          </FlexLayout>
        </InvisibleButton>}
      {
        showSetup ? <DataplaneSetupModal status={"disconnected"} dataplane={regesteredDP} initialView={true} resetRegister={resetRegister} /> :
          <Modal
            titleText={register ? "Register Data Plane" : "Edit Data Plane"}
            isDanger={!register}
            titleIconName="PlusCircleFilled"
            visible={visible}
            closable={true}
            noFooter={false}
            bodyStyle={{ padding: 0 }}
            width={modalWidth}
            style={{ height: '420px' }}
            destroyOnClose={true}
            onOk={handleSubmit}
            okText="Done"
            onCancel={hideModal}
            okButtonProps={{ disabled: nameSpaceError || nameError }}
          >
            {editWarning}
            <DetailsContentForm
              onNameChange={onNameChange}
              setForm={setDetailsForm}
              onNameSpaceChange={onNameSpaceChange}
              register={register}
              dataplaneName={dataplaneName}
              namespace={namespace}
              nameError={nameError}
              nameSpaceError={nameSpaceError}
              dataplanes={dataplanes}
            />
            <StyledDiv>
              <Accordion isCollapsed={true} title={"Advanced"}>
                <AdvancedDetailsForm
                setForm={setDetailsForm}
                dataPlaneConfiguration={configuration}
                setConfiguration={setConfiguration}
                />
              </Accordion>
            </StyledDiv>
          </Modal>
      }
    </>
  )
}

export default RegisterDataPlaneModal;
