import React, {  useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import type {  TableProps } from 'antd';
import './favoriteCharacters.css'

import CharacterDetail from '../characterDetail';
import {apiReqs} from '@/api'

 
type ColumnsType<T> = TableProps<T>['columns'];

interface DataType {
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
interface detailDataType {
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


const FavoriteCharacters: React.FC = () => {
    const [showDetailModel, setShowDetailModel] = useState(false);
    const [favoriteCharacters, setFavoriteCharacters] = useState<DataType[]>([]);
    const [CharactersDetail, setCharactersDetail] = useState<detailDataType[]>([]);
    useEffect(() => {
        getFavouriteCharacters()
    }, [])
  
    
    const getFavouriteCharacters = async () => {
        try {
            apiReqs.getFavouriteCharacters({
                method: 'get',
                success(res) {
                    setFavoriteCharacters(res.characterResult)
                },
                fail(err) {
                    console.log(err)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const columns: ColumnsType<DataType> = [
        {
          title: 'Name',
          dataIndex: 'name',
          
        },
        {
          title: 'Strength',
          dataIndex: 'strength',
          
        },
        {
          title: 'Speed',
          dataIndex: 'speed',
          
        },
        {
          title: 'Skill',
          dataIndex: 'skill',
         
        },
        {
          title: 'Fear Factor',
          dataIndex: 'fear_factor',
         
        },
        {
          title: 'Power',
          dataIndex: 'power',
          
        },
        {
          title: 'Intelligence',
          dataIndex: 'intelligence',
         
        },
        {
          title: 'Wealth',
          dataIndex: 'wealth',
         
        },
       {
        title:'Detail',
        render: (_, record) => <Button type='primary' onClick={() => showCharacterDetail(record)}>Detail</Button>
     }
      ];

      const showCharacterDetail = (record: DataType) => {
        
        const detail: detailDataType = {
            id: record.idName,
            name: record.name,
            subtitle: record.subtitle,
            description: record.description,
            strength: record.strength,
            speed: record.speed,
            skill: record.skill,
            fear_factor: record.fear_factor,
            power: record.power,
            intelligence: record.intelligence,
            wealth: record.wealth,
            image_url: record.image_url
        }
        console.log(detail)
        setCharactersDetail([detail])
        setShowDetailModel(true)

        }
    
      const colseDetailModel = () => {
          setShowDetailModel(false)
          getFavouriteCharacters()
      }


  return (
    <div className='table-container'>
        <Table
        className='table-body'
        columns={columns}
        dataSource={favoriteCharacters.map(item => ({ ...item, key: item.id }))}
        scroll={{  y: 330 }}
        pagination={false}
       
        />
        <CharacterDetail showModel={showDetailModel} onClose={colseDetailModel} editingCharacter={CharactersDetail[0]}></CharacterDetail>

    </div>
    
  );
}
export default FavoriteCharacters;