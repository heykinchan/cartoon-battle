import React from 'react';
import type { FormInstance } from 'antd';
import { Button, Form, Input, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom'
import {apiReqs} from '@/api'

interface SubmitButtonProps {
    form: FormInstance;
  }

  const SubmitButton: React.FC<React.PropsWithChildren<SubmitButtonProps>> = ({ form, children }) => {
    const [submittable, setSubmittable] = React.useState<boolean>(false);
  
    // Watch all values
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
            const apiData = {
                email: values.email,
                firstname: values.firstName,
                lastname: values.lastName,
                password: values.confirmPassword
            }
            apiReqs.signUp({
                data: apiData,
                method: 'post',
                success: (res) => {
                    console.log(res)
                    navigate('/signin');
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
  
  const Signup: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    return (
        <div className='signin-form-container'>
        <Card className='signin-form-card'>
            <Form form={form} name="signin-form" layout="vertical" autoComplete="off">
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="firstName"  label="First Name" rules={[{ required: true, message: 'Please input your first name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="lastName"  label="Last Name" rules={[{ required: true, message: 'Please input your last name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true,message: 'Please confirm your password!' },
                ({getFieldValue}) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password') === value){
                            return Promise.resolve()
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    }
                })
                ]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Space className='signin-btn'>
                        <SubmitButton form={form}>create</SubmitButton>
                        <Button htmlType="reset" className='reset-btn'>Reset</Button>
                    </Space>
                </Form.Item>
                <p className='link-to-signup'>Already have an account?</p>
                <Form.Item className='link-to-signup'>
                    <Button type='link' onClick={() => {navigate('/signin')}}>
                        Click here
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    </div>
    );
  };
  
  export default Signup;