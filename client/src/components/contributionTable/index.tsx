import React, {  useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';
import type {  TableProps } from 'antd';
import ContributionDetail from '../contributionDetali';

import {apiReqs} from '@/api'
import './contributionTable.css'

 
type ColumnsType<T> = TableProps<T>['columns'];

interface DataType {
    name: string;
    contribution_id: string;
    action: string;
    date: string;
    detail: object
}


const ContributionTable: React.FC = () => {
const [contributionsData, setcontributionsData] = useState<DataType[]>([]);
const [showContributionDetail, setShowContributionDetail] = useState(false);
const [contribution, setContribution] = useState<any[]>([]);

useEffect(() => {
    getContributions();
}, []);

    const getContributions = async () => {
        try {
            apiReqs.getContrubutions({
                method: 'get',
                success(res) {
                  
                    const contributions = res.map((item:any) => ({
                        name: item.user.firstname + ' ' + item.user.lastname,
                        action: item.action === 'AddCharacter' ? 'Add Character' : 'Edit Character',
                        date: item.date.split('T')[0],
                        details: {...item.data, ...(item.character ? { name: item.character.name } : { name: item.data.name })},
                        contribution_id: item.contribution_id,
                    }))
                    setcontributionsData(contributions);            
                },
            } )
    
        } catch (error) {
            console.log(error)
    
        }
    }
    const approve = async (record: DataType) => {
        console.log('test',record)
        try {
            apiReqs.resolveContribution({
                method: 'post',
                data: {
                    contributionid: record.contribution_id,
                    status: 'Approved'
                },
                success() {
                    Modal.success({
                        title: 'Success',
                        content: 'Contribution Approved'
                    })
                    getContributions();
                }
            })
        } catch (error) {
            console.log(error)
        }

    }
    const reject = async (record: DataType) => {
        console.log('test',record)
        try {
            apiReqs.resolveContribution({
                method: 'post',
                data: {
                    contributionid: record.contribution_id,
                    status: 'Rejected'
                },
                success() {
                    Modal.success({
                        title: 'Success',
                        content: 'Contribution Rejected'
                    })
                    getContributions();
                }
            })
        } catch (error) {
            console.log(error)
        }

    }
    const showContributionDetailModel = (record: any) => {
        setShowContributionDetail(true);
        setContribution(record);
    }
    const closeDetailModel = () => {
        setShowContributionDetail(false);
        setContribution([]);
    }


   
    const columns: ColumnsType<DataType> = [
        {
          title: 'User',
          dataIndex: 'name',
          
        },
        {
            title: 'Action',
            dataIndex: 'action',

        },
        {
            title: 'Date',
            dataIndex: 'date',
            
          },
          {
            title: 'Details',
            dataIndex: 'details',
            render: (_, record) => {return <Button type='link' onClick={() => showContributionDetailModel(record)}>Details</Button>;}

            
          },
       {
        
        render: (_, record) => (
            <div>
                <Button type='primary' onClick={() => approve(record)}>Approve</Button>
                <Button danger onClick={() => reject(record)} className='reject-button'>Reject</Button>
            </div>
       
        )
    }
      ];
      


return (
    <div className='table-container'>
         
            <Table
            className='table-body'
            columns={columns}
            dataSource={contributionsData}
                scroll={{  y: 330 }}
                pagination={false}
         
            />
            <ContributionDetail showModel={showContributionDetail} onClose={closeDetailModel} contribution={contribution}></ContributionDetail>

    </div>
    
);
};

export default ContributionTable;