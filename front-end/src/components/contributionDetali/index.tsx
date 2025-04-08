import React, { useEffect, useState } from 'react';
import { Modal, Button, Descriptions } from 'antd';
import {apiReqs} from '@/api'
import './contributionDetail.css'






const ContributionDetail: React.FC<{showModel:boolean, onClose: () => void, contribution : any }> = ({showModel, onClose, contribution}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(()=>{
    if(showModel === true){
        setIsModalOpen(true)
    } else {
        setIsModalOpen(false)
    }
  },[showModel])

  
  const renderDetailItems = () => {
    if (!contribution || !contribution.details) {
      return null; 
    }
    const { name, ...otherDetails } = contribution.details;
    const items = [];
    if (name) {
      items.push(
        <Descriptions.Item label="Name" span={3} key="name">
          {name}
        </Descriptions.Item>
      );
    }
    Object.entries(otherDetails).filter(([key, _]) => key !== 'id' && key !== 'image_url').forEach(([key, value]) => {
      items.push(
        <Descriptions.Item label={key} span={3} key={key}>
          {value}
        </Descriptions.Item>
      );
    });
  
    return items;
  };

  return (
    <>
        <Modal  open={isModalOpen}  footer={null} closable={false}> 

            <Descriptions title="Character change Details" bordered >
                 {renderDetailItems()} 
            </Descriptions>
            <div className='contribution-detail-close-btn'>
                <Button onClick={onClose}>Close</Button>
            </div>
        </Modal>
    </>
  );
};

export default ContributionDetail;