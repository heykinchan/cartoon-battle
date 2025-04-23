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

const AddCharacter: React.FC<{showModel:boolean, onClose: () => void, }> = ({showModel, onClose}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(()=>{
    if(showModel === true){
        setIsModalOpen(true)
    } else {
        setIsModalOpen(false)
    }
  },[showModel])

  const handleOk = () => {
    form.validateFields().then(
        values => {
            const data = {
                data:{
                    action:'AddCharacter',
                data :{
                    id: values.name.toLowerCase().replace(/ /g, '_'),
                    name: values.name,
                    subtitle: values.subtitle,
                    description: values.description,
                    strength: values.strength,
                    speed: values.speed,
                    skill: values.skill,
                    fear_factor: values.fear_factor,
                    power: values.power,
                    intelligence: values.intelligence,
                    wealth: values.wealth,
                    image_url: values.image_url
                }
                },
            }

            apiReqs.Character({
                data: data,        
                method: 'post',
                success() {
                    message.success('Request to add a new character has been sent');
                },
                fail(err) {
                    message.error(err.message.response.data.error)
                }

            })
            form.resetFields();
            setIsModalOpen(false);
            onClose();
        }
    )
    
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    onClose();
  };

  return (
    <>
      <Modal title="Add a new character" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} closable={false}> 
        <Form {...formItemLayout} form={form} initialValues={{
        name: '',
        subtitle: '',
        description: '',
        strength: 0,
        speed: 0,
        skill: 0,
        fear_factor: 0,
        power: 0,
        intelligence: 0,
        wealth: 0
      }}>
            <Form.Item label='Name' name='name' key='name'> 
                <Input></Input>
            </Form.Item>
            <Form.Item label='Subtitle' name='subtitle'> 
                <Input></Input>
            </Form.Item>
            <Form.Item label='Description' name='description'> 
                <Input></Input>
            </Form.Item>
            <Form.Item label='Avater URL PLZ' name='image_url'> 
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

export default AddCharacter;