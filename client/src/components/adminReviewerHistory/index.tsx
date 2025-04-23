import React, {  useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';
import type {  TableProps } from 'antd';
import {apiReqs} from '@/api'
import ContributionDetail from '../contributionDetali';
import ContributionHistoryDetail from '../contributionHistoryDetail';

 
type ColumnsType<T> = TableProps<T>['columns'];

interface DataType {
    action: string;
    status: string;
    old_data: object;
    new_data: object;
    id: string;
    user: string;
}


const AdminReviewerHistory: React.FC = () => {
    const [contributions, setContributions] = useState<DataType[]>([]);
    const [showContributionDetail, setShowContributionDetail] = useState(false);
    const [contribution, setContribution] = useState<DataType[]>([]);
    const [showDetailModel, setShowDetailModel] = useState(false);
    const [contributionHistory, setContributionHistory] = useState<any[]>([]);
    

    useEffect(() => {
        getSelfContribution()
    }, [])
  
    
    const getSelfContribution = async () => {
        try {
            apiReqs.getAllContribution({
                method: 'get',
                success(res) {
                    const responseData = Array.isArray(res) ? res : [];
                    const formattedContributions = responseData.map((item:any) => ({
                        action: item.action === 'AddCharacter' ? 'Add Character' : 'Edit Character',
                        status: item.status,
                        old_data: item.old_data,
                        new_data: item.new_data,
                        id: item.contribution_id,
                        date: item.date.split('T')[0],
                        details: {...item.data, ...(item.character ? { name: item.character.name } : { name: item.data.name })},
                        user: item.user.firstname + ' ' + item.user.lastname,
     

                    }));

                    setContributions(formattedContributions);
                    console.log('contributions',contributions)
                   
                },
                fail(err) {
                    console.log(err)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const showContributionDetailModel = (record: any) => {
        setShowContributionDetail(true);
        setContribution(record);
        console.log(record)
    }
    const closeDetailModel = () => {
        setShowContributionDetail(false);
        setContribution([]);
    }

    const colseDetailModel = () => {
        setShowDetailModel(false)
      }

    const showContributionHistoryDetailModel = (record: any) => {
        setShowDetailModel(true);
        setContributionHistory(record);
        console.log(contributionHistory)
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Date',
            dataIndex: 'date',
            
          },
          {
            title: 'User',
            dataIndex: 'user',

          },
        {
          title: 'Action',
          dataIndex: 'action',
          
        },
        {
            title:'Details',
            render: (_, record) => (
                <React.Fragment>
                    <Button type='link' onClick={() => showContributionDetailModel(record)}>Details</Button> 
                </React.Fragment>
            )
         },
        {
          title: 'Status',
          dataIndex: 'status',
          
        },
        {
            title:'History',
            render: (_, record) => (
                <React.Fragment>
                    {record.old_data && record.new_data ? <Button type='link' onClick={() => showContributionHistoryDetailModel(record)}>History</Button> : <Button disabled={true} type='link' onClick={() => showContributionDetailModel(record)}>History</Button>}
                </React.Fragment>
            )
         },
     
      ];

      
      
  return (
    <div className='table-container'>
        <Table
        className='table-body'
        columns={columns}
        dataSource={contributions.map(item => ({ ...item, key: item.id }))}
        scroll={{  y: 330 }}
        pagination={false}
       
        />
        <ContributionDetail showModel={showContributionDetail} onClose={closeDetailModel} contribution={contribution}></ContributionDetail>
        <div className='contribution-history-detail-model'>
        <ContributionHistoryDetail showModel={showDetailModel} onClose={colseDetailModel} editingCharacter={contributionHistory}></ContributionHistoryDetail>
        </div>
        
       
    </div>
    
  );
}
export default AdminReviewerHistory;