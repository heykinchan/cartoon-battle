import React from 'react';
import type { FormInstance } from 'antd';
import { Button, Form, Input, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom'
import {apiReqs} from '@/api'
import './signin.css'

interface SubmitButtonProps {
    form: FormInstance;
  }

  const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ form, children }) => {
    const [submittable, setSubmittable] = React.useState<boolean>(false);
  
 
    const values = Form.useWatch([], form);
    const navigate = useNavigate();
    React.useEffect(() => {
      form
        .validateFields({ validateOnly: true })
        .then(() => setSubmittable(true))
        .catch(() => setSubmittable(false));
    }, [form, values]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log(values)
            apiReqs.signIn({
                data: values,
                method: 'post',
                success() {
                    navigate('/home')
                },
            } )

        } catch (error) {
            console.log(error)

        }
    }

  
    return (
      <Button type="primary" htmlType="submit" disabled={!submittable} onClick={handleSubmit}>
        {children}
      </Button>
    );
  };
  
  const Signin: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    return (
        <div className='signin-form-container'>
            <Card className='signin-form-card'>
                <Form form={form} name="signin-form" layout="vertical" >
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input your email!' } , { type: 'email', message: 'Please enter a valid email!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Space className='signin-btn'>
                            <SubmitButton form={form}>sign in</SubmitButton>
                            <Button htmlType="reset" className='reset-btn'>Reset</Button>
                        </Space>
                    </Form.Item>
                    <p className='link-to-signup'>Don't have an account yet?</p>
                    <Form.Item className='link-to-signup'>
                        <Button type='link' onClick={() => {navigate('/signup')}}>
                            Click here
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
  };
  
  export default Signin;