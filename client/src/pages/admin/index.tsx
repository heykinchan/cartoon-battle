import React from 'react';
import {  Card,Breadcrumb } from 'antd';
import ContributionTable from '@/components/contributionTable'
import AdminTable from '@/components/adminTable';
import AdminReviewerHistory from '@/components/adminReviewerHistory';
import './admin.css'
import { Link } from 'react-router-dom';


  
  const Admin: React.FC = () => {

    return (
        <div className='admin-container'>
            <div className='admin-title-container'> 
                <h1>Admin Panel</h1>
               
            </div >
            <Breadcrumb style={{ margin: '16px 0', marginLeft: '10px' }}>
            <Breadcrumb.Item><Link to="/home">Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item>Admin Panel</Breadcrumb.Item>
        </Breadcrumb>
            
   
            <div className='admin-table-card-container'>
                <Card className='admin-table-card'>
                    <div className='admin-table-title'>
                        <h1>User Application </h1>
                    </div>
                    <div className='admin-contribution-table-container'>
                        <ContributionTable/>
                    </div>

                </Card>
            </div>
            <div className='admin-table-card-container'>
                <Card className='admin-table-card'>
                    <div className='admin-table-title'>
                        <h1>Admin Management</h1>
                    </div>
                    <div className='admin-contribution-table-container'>
                        <AdminTable/>
                    </div>

                </Card>
            </div>
            <div className='admin-table-card-container'>
                <Card className='admin-table-card'>
                    <div className='admin-table-title'>
                        <h1>Review History</h1>
                    </div>
                    <div className='admin-contribution-table-container'>
                        <AdminReviewerHistory/>
                    </div>

                </Card>
            </div>
           
          
            
           
           
        </div>
    );
  };
  
  export default Admin;