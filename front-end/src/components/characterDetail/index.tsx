import React, { useEffect, useState } from 'react';
import { Modal, Avatar , Descriptions, Button, message } from 'antd';
import {apiReqs} from '@/api'
import type { DescriptionsProps } from 'antd';
import { CloseOutlined, HeartOutlined, HeartFilled  } from '@ant-design/icons';
import './characterDetail.css'
import { useNavigate } from 'react-router-dom'

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
    wealth: number
    image_url:string
}
interface ContributorType {
    name: string;
    id: string;
}

const CharacterDetail: React.FC<{showModel:boolean, onClose: () => void, editingCharacter : editDataType  }> = ({showModel, onClose,editingCharacter}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [contributor, setContributor] = useState<ContributorType[]>([]);
  const navigate = useNavigate()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getContributor = async () => {
    try {
        apiReqs.getContributor({
            method: 'get',
            data: {
                id: editingCharacter.id
            },
            success(res) {
                const responseData = Array.isArray(res) ? res : [];
                const contributor = responseData.map((item: any) => {
                    return {
                        name: item.user.firstname + ' ' + item.user.lastname,
                        id: item.user.id
                    }
                })
                setContributor(contributor)
            }
        })
    } catch (error) {
        console.log(error)
    }

  }

  const addToFavourite = async () => {
    try {
        apiReqs.addFavourite({
            method: 'post',
            data: {
                favourites: editingCharacter.id,
            },
            success() {
                message.success('Character added to favourites');
                setIsLiked(true)
            },
            fail(err) {
                message.error(err.message.response.data.error)
            }
        })
    } catch (error) {
        console.log(error)
    }
  };
  const removeFromFavourite = async () => {
    try {
        apiReqs.removeFavourite({
            method: 'delete',
            data: {
                favourites: editingCharacter.id,
            },
            success() {
                message.success('Character remove from favourites');
                setIsLiked(false)
            },
            fail(err) {
                message.error(err.message.response.data.error)
            }
        })
    } catch (error) {
        console.log(error)
    }
  };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const checkIfLiked = async () => {
        const id = editingCharacter.id;
        try {
            apiReqs.checkFavourite({
                method: 'get',
                data: {
                    id
                },
                success(res) {
                    console.log(res)
                    if(res.isFavourite){
                        setIsLiked(true)
                    } else {
                        setIsLiked(false)
                    }   
                },
                fail(err) {
                    message.error(err.message.response.data.error)
                }
            })
        } catch (error) {
            console.log(error)
        }
  };
  
  useEffect(()=>{
    if(showModel === true){
        setIsModalOpen(true)
        checkIfLiked();
        getContributor();
    } else {
        setIsModalOpen(false)
    }
  },[showModel])

  function getImageUrl(imageUrl : string) {
    if (!imageUrl) {
      return 'src/assets/images/unknown.png'; 
    }
    return imageUrl.startsWith('http') ? imageUrl : `src/assets/${imageUrl}`;
  }

  const items: DescriptionsProps['items'] = [
    {
        key: '1',
        label: 'avatar',
        children: <Avatar size={64} src={getImageUrl(editingCharacter?.image_url)} />,
        span: 3,
      },
    {
      key: '2',
      label: 'Name',
      children: editingCharacter ? editingCharacter.name : '' ,
      span: 3,
    },
    {
      key: '3',
      label: 'Subtitle',
      children: editingCharacter ? editingCharacter.subtitle : '',
      span: 3,
    },
    {
      key: '4',
      label: 'Description',
      children: editingCharacter ? editingCharacter.description : '',
      span: 3,
    },
    {
      key: '5',
      label: 'Strength',
      children: editingCharacter ? editingCharacter.strength: '',
      span: 3,
    },
    {
      key: '6',
      label: 'Speed',
      children: editingCharacter ? editingCharacter.speed : '',
      span: 3,
    },
    {
      key: '7',
      label: 'Skill',
      children: editingCharacter ? editingCharacter.skill: '',
      span: 3,
    },
    {
      key: '8',
      label: 'Fear Factor',
      children: editingCharacter ? editingCharacter.fear_factor : '',
      span: 3,
    },
    {
      key: '9',
      label: 'Power',
      children: editingCharacter ? editingCharacter.power : '',
      span: 3,
    },
    {
      key: '10',
      label: 'Intelligence',
      children: editingCharacter ? editingCharacter.intelligence: '',
      span: 3,
    },
    {
        key: '11',
        label: 'Wealth',
        children: editingCharacter ? editingCharacter.wealth : '',
        span: 3,
      },
      {
        key: '12',
        label: 'Contributor',
        children: contributor.map((item) => {
            return <Button type='link' key={item.id} onClick={() => navigate(`/profile/${item.id}`)}>{item.name}</Button>
        }),
        span: 3,
      },
  ]

  

  return (
    <>
      <Modal className="character-detail-modal" title="" open={isModalOpen} footer={null} closable={false}> 
        <Button className='close-button' type="link" onClick={onClose} icon={<CloseOutlined />}></Button>
        
        <Descriptions title="Character Detail" bordered items={items} />
        <div className='model-footer'>
            {isLiked ? 
            <Button className='dislike-button' type='link' icon={<HeartFilled />} onClick={removeFromFavourite}></Button> : 
            <Button className='like-button' type='link' icon={<HeartOutlined />} onClick={addToFavourite}></Button>
            }
        </div>
      </Modal>
    </>
  );
};

export default CharacterDetail;