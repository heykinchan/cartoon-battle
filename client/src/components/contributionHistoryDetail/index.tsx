import React, { useEffect, useState } from 'react';
import { Modal, Avatar , Descriptions, Button } from 'antd';
import type { DescriptionsProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './contributionHistoryDetail.css'


interface DataType {
    action: string;
    status: string;
    reviewer: string;
    old_data: editDataType;
    new_data: editDataType;
    id: string;
}
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
    wealth: number,
    image_url:string
}
const ContributionHistoryDetail: React.FC<{showModel:boolean, onClose: () => void, editingCharacter : DataType }> = ({showModel, onClose,editingCharacter}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function getImageUrl(imageUrl : string) {
    if (!imageUrl) {
      return 'src/assets/images/unknown.png'; 
    }
    return imageUrl.startsWith('http') ? imageUrl : `src/assets/${imageUrl}`;
  }
  
  useEffect(()=>{
    if(showModel === true){
        setIsModalOpen(true)
    } else {
        setIsModalOpen(false)
    }
  },[ showModel])

  const olditems: DescriptionsProps['items'] = [
    {
        key: '1',
        label: 'avatar',
        children: <Avatar size={64} src={getImageUrl(editingCharacter?.new_data?.image_url)}  />,
        span: 3,
      },
    {
      key: '2',
      label: 'Name',
      children:  editingCharacter?.old_data?.name ?? '' ,
      span: 3,
    },
    {
      key: '3',
      label: 'Subtitle',
      children:  editingCharacter?.old_data?.subtitle ?? '',
      span: 3,
    },
    {
      key: '4',
      label: 'Description',
      children:  editingCharacter?.old_data?.description ?? '',
      span: 3,
    },
    {
      key: '5',
      label: 'Strength',
      children:  editingCharacter?.old_data?.strength ?? '',
      span: 3,
    },
    {
      key: '6',
      label: 'Speed',
      children:  editingCharacter?.old_data?.speed ?? '',
      span: 3,
    },
    {
      key: '7',
      label: 'Skill',
      children:  editingCharacter?.old_data?.skill ?? '',
      span: 3,
    },
    {
      key: '8',
      label: 'Fear Factor',
      children:  editingCharacter?.old_data?.fear_factor ?? '',
      span: 3,
    },
    {
      key: '9',
      label: 'Power',
      children:  editingCharacter?.old_data?.power ?? '',
      span: 3,
    },
    {
      key: '10',
      label: 'Intelligence',
      children:  editingCharacter?.old_data?.intelligence ?? '',
      span: 3,
    },
    {
        key: '11',
        label: 'Wealth',
        children:  editingCharacter?.old_data?.wealth ?? '',
        span: 3,
      },
  ]

  const newitems: DescriptionsProps['items'] = [
    {
        key: '1',
        label: 'avatar',
        children: <Avatar size={64} src={`src/assets/${editingCharacter?.new_data?.image_url ?? 'images/unknown.png'}`} />,
        span: 3,
      },
    {
      key: '2',
      label: 'Name',
      children:  editingCharacter?.new_data?.name ?? '' ,
      span: 3,
    },
    {
      key: '3',
      label: 'Subtitle',
      children:  editingCharacter?.new_data?.subtitle ?? '',
      span: 3,
    },
    {
      key: '4',
      label: 'Description',
      children:  editingCharacter?.new_data?.description ?? '',
      span: 3,
    },
    {
      key: '5',
      label: 'Strength',
      children:  editingCharacter?.new_data?.strength ?? '',
      span: 3,
    },
    {
      key: '6',
      label: 'Speed',
      children:  editingCharacter?.new_data?.speed ?? '',
      span: 3,
    },
    {
      key: '7',
      label: 'Skill',
      children:  editingCharacter?.new_data?.skill ?? '',
      span: 3,
    },
    {
      key: '8',
      label: 'Fear Factor',
      children:  editingCharacter?.new_data?.fear_factor ?? '',
      span: 3,
    },
    {
      key: '9',
      label: 'Power',
      children:  editingCharacter?.new_data?.power ?? '',
      span: 3,
    },
    {
      key: '10',
      label: 'Intelligence',
      children:  editingCharacter?.new_data?.intelligence ?? '',
      span: 3,
    },
    {
        key: '11',
        label: 'Wealth',
        children:  editingCharacter?.new_data?.wealth ?? '',
        span: 3,
      },
  ]
  

  

  return (
    <>
      <Modal className="character-detail-modal" title="" open={isModalOpen} footer={null} closable={false} width={"90%"}> 
        <Button className='close-button' type="link" onClick={onClose} icon={<CloseOutlined />}></Button>
        <div className='history-container'>
            <div className='history-container-table'>
            <Descriptions title="Old character" bordered items={olditems} />

            </div>
            <div className='history-container-table'>
            <Descriptions className='new-history-table' title="New character" bordered items={newitems} />
        
            </div>

               

        </div>
        
      </Modal>
    </>
  );
};

export default ContributionHistoryDetail;