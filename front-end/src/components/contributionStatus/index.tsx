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
    reviewer: string;
    old_data: object;
    new_data: object;
    id: string;
}


const ContributionStatus: React.FC = () => {
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
            apiReqs.getContribution({
                method: 'get',
                success(res) {
                    const responseData = Array.isArray(res) ? res : [];
                    const formattedContributions = responseData.map((item:any) => ({
                        action: item.action === 'AddCharacter' ? 'Add Character' : 'Edit Character',
                        status: item.status,
                        reviewer: item.reviewer ? item.reviewer.firstname + ' ' + item.reviewer.lastname : 'Not reviewed yet',
                        old_data: item.old_data,
                        new_data: item.new_data,
                        id: item.contribution_id,
                        date: item.date.split('T')[0],
                        details: {...item.data, ...(item.character ? { name: item.character.name } : { name: item.data.name })},
     

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
    const cancelContribution = (record: DataType) => {
        Modal.confirm({
            title: 'Are you sure you want to cancel this contribution?',
            content: `Action: ${record.action}`,
            okText: 'Yes, cancel it',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                performCancel(record);
            },
            onCancel() {
                
            },
        });
    };
    const performCancel = async (record: DataType) => { 
        try {
            apiReqs.resolveSelfContribution({
                method: 'post',
                data: {
                    contributionid: record.id,
                    status:"Cancelled"
                },
                success() {
                    Modal.success({
                        title: 'Success',
                        content: 'Contribution Cancelled'
                    });
                    getSelfContribution();
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
          title: 'Reviewer',
          dataIndex: 'reviewer',
          
        },
        {
            title:'History',
            render: (_, record) => (
                <React.Fragment>
                    {record.old_data && record.new_data ? <Button type='link' onClick={() => showContributionHistoryDetailModel(record)}>History</Button> : <Button disabled={true} type='link' onClick={() => showContributionDetailModel(record)}>History</Button>}
                </React.Fragment>
            )
         },
        {
            title: 'Action',
            render: (_, record) => (
                <React.Fragment>
                    {record.status === 'Pending' ? <Button danger type='link' onClick={() => cancelContribution(record)}>Cancel</Button> : <Button disabled danger type='link' onClick={() => cancelContribution(record)}>Cancel</Button>}
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
export default ContributionStatus;