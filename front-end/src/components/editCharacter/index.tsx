import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Slider, message } from 'antd';
import {apiReqs} from '@/api'



const formItemLayout = {
    labelCol: {
      xs: { span: 30 },
      sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 40 },
        sm: { span: 14 },
      },
  };
  interface editDataType {
    id: string;
    name: string;
    subtitle: string;
    description:string;
    strength: number,
    speed: number,
    skill: number,
    fear_factor: number,
    power: number,
    intelligence: number,
    wealth: number
}

const EditCharacter: React.FC<{showModel:boolean, onClose: () => void, editingCharacter : editDataType }> = ({showModel, onClose, editingCharacter}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [modifiedValues, setModifiedValues] = useState<Partial<editDataType>>({});


  useEffect(()=>{
    if(showModel === true){
        setIsModalOpen(true)
    } else {
        setIsModalOpen(false)
    }
  },[showModel])

  useEffect(()=>{
    if(editingCharacter){
        form.setFieldsValue(editingCharacter);
    } else {
        form.resetFields();
    }
  },[editingCharacter, form])

  const handleValuesChange = (changedValues: any) => {
    setModifiedValues(prev => ({ ...prev, ...changedValues }));
  };



  const handleOk = () => {
    form.validateFields().then(
        values => {
            const data = {
                data:{
                    action:'EditCharacter',
                data :{
                    id: editingCharacter.id,
                    ...modifiedValues
                }
                },
            }
            apiReqs.Character({
                data: data,
                method: 'post',
                success() {
                    message.success('Request to edit a character has been sent');
                },
                fail(err) {
                    message.error(err.message.response.data.error)
                }

            })
            form.resetFields();
            setModifiedValues({});
            setIsModalOpen(false);
            onClose();
        }
    )
    
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    onClose();
    setModifiedValues({});
  };

  return (
    <>
      <Modal title="Add a new character" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} closable={false}> 
        <Form {...formItemLayout} form={form} onValuesChange={handleValuesChange}>
            <Form.Item label='Name' name='name' key='name'> 
                <Input></Input>
            </Form.Item>
            <Form.Item label='Subtitle' name='subtitle'> 
                <Input></Input>
            </Form.Item>
            <Form.Item label='Description' name='description'> 
                <Input></Input>
            </Form.Item>
            <Form.Item label='Strength' name='strength'> 
                <Slider   />
            </Form.Item>
            <Form.Item label='Speed' name='speed'> 
                <Slider  />
            </Form.Item>
            <Form.Item label='Skill' name='skill'> 
                <Slider  />
            </Form.Item>
            <Form.Item label='Fear Factor' name='fear_factor'> 
                <Slider   />
            </Form.Item>
            <Form.Item label='Power' name='power'> 
                <Slider   />
            </Form.Item>
            <Form.Item label='Intelligence' name='intelligence'> 
                <Slider   />
            </Form.Item>
            <Form.Item label='Wealth' name='wealth'> 
            <   Slider   />
            </Form.Item>

        </Form>
      </Modal>
    </>
  );
};

export default EditCharacter;