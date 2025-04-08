import React,{useEffect, useState} from 'react';
import type { FormInstance } from 'antd';
import { Dropdown, Space  } from 'antd';
import { DownOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd';
import {apiReqs} from '@/api'
import './home.css'
import DataDisplay from '@/components/dataDisplay';

interface character {
    id: string;
    idName: string;
    active: boolean;
    name: string;
    subtitle: string;
    description:string;
    image_url:string
    strength: number,
    speed: number,
    skill: number,
    fear_factor: number,
    power: number,
    intelligence: number,
    wealth: number
}





  
  const Home: React.FC = () => {
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState(false);
    const handleSignout =  () => {
        window.localStorage.removeItem('authToken')
        window.localStorage.removeItem('id')
        window.localStorage.removeItem('name')
        window.localStorage.removeItem('selectedCharacterPairs')
        navigate('/login')
    }
    const checkAdmin = async () => {
        const id = window.localStorage.getItem('id')
        try {
            apiReqs.isAdmin({
                data: {
                    id
                },
    
                method: 'get',
                success(res) {
                    if(res.isAdmin === true){
                        setIsAdmin(true)
                    }
                    
                },
            } )
    
        } catch (error) {
            console.log(error)
    
        }
    }
    useEffect(()=>{
        checkAdmin()
    },[])



    const items: MenuProps['items'] = [
        
            {
                key: '1',
                label: (
                  <a target="_blank" rel="noopener noreferrer" onClick={() => navigate('/profile')}>
                    Profile
                </a>
            ),
        },
        ...(isAdmin ? [{
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={() => navigate('/admin')}>
                    Admin Panel
                </a>
            ),
        }] : []),
        {
            key: '3',
            label: (
                <a target="_blank" rel="noopener noreferrer" onClick={handleSignout}>
                    Sign Out
                </a>
            ),
        },
    ];


    const name = window.localStorage.getItem('name')
    
    return (
        <>
            <div className='container'>
            </div>
            <div className='header-container'>
                <div className='home-title'>
                    <div>
                        <h1>Cartoonopia</h1>
                        <h3>The home of characters and cartoons!</h3>
                    </div>
                    <div className='user-menu'>
                        <Dropdown menu={{items}}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    {name}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                </div>
                
            </div>
            <div className='characters-table'>
                <DataDisplay ></DataDisplay>
            </div >
            
        
        </>
       
        
       

        
        
    );
  };
  
  export default Home;