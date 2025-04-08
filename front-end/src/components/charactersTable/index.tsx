import React, {  useState, useEffect } from 'react';
import { Table, Input, Modal, Button } from 'antd';
import type {  TableProps } from 'antd';
import './charactersTable.css'
import { PlusCircleOutlined  } from '@ant-design/icons';
import AddCharacter from '../addCharacter'; 
import EditCharacter from '../editCharacter';
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




const CharactersTable: React.FC<{selectedCharacters: DataType[],charactersData: DataType[],onSelectedKeysChange: (selectedCharacters: DataType[]) => void, refresh: () => void}> = ({selectedCharacters,charactersData,onSelectedKeysChange,refresh}) => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(charactersData);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [showAddModel, setShowAddModel] = useState(false);
    const [showEditModel, setShowEditModel] = useState(false);
    const [showDetailModel, setShowDetailModel] = useState(false);
    const [editingCharacter, setEditCharacter] = useState<editDataType[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    
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
          title:'Action',
        render: (_, record) => (
            <React.Fragment>
                <Button type='link' onClick={() => editCharacter(record)}>Edit</Button>
                {isAdmin && <Button danger type='link' onClick={() => removeCharacter(record)}>remove</Button>}
            </React.Fragment>
        )
       },
       {
        title:'Detail',
        render: (_, record) => <Button type='primary' onClick={() => showCharacterDetail(record)}>Detail</Button>
     }
      ];

      const removeCharacter = (record: DataType) => {
        Modal.confirm({
            title: 'Are you sure you want to remove this Character?',
            content: `Name: ${record.name}`,
            okText: 'Yes, remove it',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                performRemoveCharacter(record);
            },
            onCancel() {
                
            },
        });
    };

      const performRemoveCharacter = (record:DataType) => {
        try {
            apiReqs.removeCharacter({
            data: {
                id:record.idName
            },

            method: 'delete',
            success() {
                Modal.success({
                    title: 'Success',
                    content: 'Character Removed'
                });
                refresh()
    
                
            },
        } )

    } catch (error) {
        console.log(error)

    }
      }
      
 
    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: DataType[]) => {
             
          if (newSelectedRowKeys.length <= 2) {
            setSelectedRowKeys(newSelectedRowKeys);
            console.log(selectedRows)
            onSelectedKeysChange(selectedRows);
          } else {
            Modal.error({
                title: 'Sorry',
                content: "You can only select up to two characters.",
            });
          }
        },
       
      };

    useEffect(() => {
        if (searchText) {
          const filtered = charactersData.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
          setFilteredData(filtered);
        } else {
          setFilteredData(charactersData);
        }
      }, [searchText, charactersData]
      
      
      );
      useEffect(() => {
        if (selectedCharacters.length === 0){
            setSelectedRowKeys([]);
        }
      },[selectedCharacters])

      const editCharacter = (record:DataType) => {
        const editData = {
            id:record.idName,
            name:record.name,
            subtitle:record.subtitle,
            description:record.description,
            strength: record.strength,
            speed:record.speed,
            skill:record.skill,
            fear_factor:record.fear_factor,
            power:record.power,
            intelligence:record.intelligence,
            wealth:record.wealth,
            image_url:record.image_url

        }
        setEditCharacter([editData]); 
        setShowEditModel(true)
      }
      const showCharacterDetail = (record:DataType) => {

        const editData = {
            id:record.idName,
            name:record.name,
            subtitle:record.subtitle,
            description:record.description,
            strength: record.strength,
            speed:record.speed,
            skill:record.skill,
            fear_factor:record.fear_factor,
            power:record.power,
            intelligence:record.intelligence,
            wealth:record.wealth,
            image_url:record.image_url
        
        }
        setEditCharacter([editData]); 
        setShowDetailModel(true)
      }
      const addCharacter = () => {
        setShowAddModel(true)
      }
      const colseAddModel = () => {
        
        setShowAddModel(false)

        setTimeout(() => {
            refresh();
        }, 3000);
        

      }
      const colseEditModel = () => {
        
        setShowEditModel(false)
        setTimeout(() => {
            refresh();
        }, 3000);
        
      }
      const colseDetailModel = () => {
        setShowDetailModel(false)
      }


  return (
    <div className='table-container'>
        <Input
        
        placeholder="Search by name..."
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
      />
        <Table
        className='table-body'
        columns={columns}
        dataSource={filteredData.map(item => ({ ...item, key: item.idName }))}

        // loading={loading}
        rowSelection={{
            ...rowSelection,
            selectedRowKeys: selectedRowKeys, 
          }}
          scroll={{  y: 330 }}
          pagination={false}
       
        />
        <div className='add-character'>
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => addCharacter()} >Create a new character</Button>
        </div>
        <AddCharacter showModel={showAddModel} onClose={colseAddModel} ></AddCharacter>
        <EditCharacter showModel={showEditModel} onClose={colseEditModel} editingCharacter={editingCharacter[0]}></EditCharacter>
         <CharacterDetail showModel={showDetailModel} onClose={colseDetailModel} editingCharacter={editingCharacter[0]}></CharacterDetail>

    </div>
    
  );
};

export default CharactersTable;