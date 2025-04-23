import React, {  useState, useEffect } from 'react';
import { Table, Modal, Button, Input, message } from 'antd';
import type {  TableProps } from 'antd';
import {apiReqs} from '@/api'
import './adminTable.css'

 
type ColumnsType<T> = TableProps<T>['columns'];

interface DataType {
    name: string;
    date: string;
    id: string;
}


const AdminTable: React.FC = () => {
const [admin, setAdmin] = useState<DataType[]>([]);
const [searchText, setSearchText] = useState('');

useEffect(() => {
    getAllAdmins();
}, []);

    const getAllAdmins = async () => {
        try {
            apiReqs.getAllAdmins({
                method: 'get',
                success(res) {
                    const admins = res
                    .filter((item: any) => item.user && item.user.firstname && item.user.lastname && item.user.email)
                    .map((item: any) => ({
                        name: `${item.user.firstname} ${item.user.lastname}`,
                        email: item.user.email,
                        id: item.user.id,
                                            }));
                    setAdmin(admins);                      
                },
            } )
    
        } catch (error) {
            console.log(error)
    
        }
    }
    const removeAdmin = (record: DataType) => {
        Modal.confirm({
            title: 'Are you sure you want to remove this admin?',
            content: `Name: ${record.name}`,
            okText: 'Yes, remove it',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                performRemove(record);
            },
            onCancel() {
                
            },
        });
    };
    const performRemove = async (record: DataType) => { 
        try {
            apiReqs.admin({
                method: 'delete',
                data: {
                    admin: record.id
                },
                success() {
                    Modal.success({
                        title: 'Success',
                        content: 'Admin Removed'
                    });
                    getAllAdmins();
                },
                fail(err) {
                    message.error(err.message.response.data.error)
                }
            } )
    
        } catch (error) {
            console.log(error)
    
        }
    }

  
   
    const columns: ColumnsType<DataType> = [
        {
          title: 'User',
          dataIndex: 'name',
          
        },
        {
            title: 'Email',
            dataIndex: 'email',

        },
      
        
       {
        title: 'Action',
        render: (_, record) => (
            <div>
                <Button type='primary' danger onClick={() => removeAdmin(record)}>remove</Button>
            </div>
       
        )
    }
      ];
      
const addAdmin = () => {
    try {
        apiReqs.admin({
            method: 'post',
            data: {
                email: searchText   
            },
            success() {
                Modal.success({
                    title: 'Success',
                    content: 'Admin Added'
                });
                getAllAdmins();
                setSearchText('')
            },
            fail(err) {
                message.error(err.message.response.data.error)
            }
        } )

    } catch (error) {
        console.log(error)

    }
}

return (
    <div className='table-container'>
        <div className='add-admin-container'>
        <Input
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Add admin by email..."
        value={searchText}
      />
      <Button  className='add-admin-button' type='primary' onClick={() => addAdmin()}>Add</Button>

        </div>
         
         
            <Table
            className='table-body'
            columns={columns}
            dataSource={admin}
                scroll={{  y: 330 }}
                pagination={false}
         
            />

    </div>
    
);
};

export default AdminTable;