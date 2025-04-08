import React, { useState, useEffect } from 'react';
import { Slider, Form, Button, Card, Row, Avatar, List} from 'antd';
import { apiReqs } from '@/api';
import './dataDisplay.css';
import CharactersTable from '../charactersTable';
import CompareTable from '../compareTable';
interface FilterValues {
  strength: number[];
  speed: number[];
  skill: number[];
  fear_factor: number[];
  power: number[];
  intelligence: number[];
  wealth: number[];
}
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

const initValues: FilterValues = {
    strength: [0, 100],
  speed: [0, 100],
  skill: [0, 100],
  fear_factor: [0, 100],
  power: [0, 100],
  intelligence: [0, 100],
  wealth: [0, 100],
}

const DataDisplay: React.FC = () => {
    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<FilterValues>(
        initValues
    );
    const [charactersData, setCharactersData] = useState<DataType[]>([]);
    const [selectedCharacters, setSelectedCharacters] = useState<DataType[]>([]);
    const [storedCharacterPairs, setStoredCharacterPairs] = useState<DataType[]>([]);

    const handleSelectedKeys = (data:DataType[]) => {
        setSelectedCharacters(data);
        
      };

    const resetSelectedCharacters = () => {
        setSelectedCharacters([])
    }

    useEffect(() => {
        loadStoredCharacterPairs();
      },[])

      useEffect(() => {
        if (selectedCharacters.length === 2) {
          const storedSelections = JSON.parse(localStorage.getItem('selectedCharacterPairs') || '[]');
      
          const alreadyExists = storedSelections.some((storedPair:any)  => 
            isSamePair(storedPair, selectedCharacters)
          );
      
          if (!alreadyExists) {
            storedSelections.push(selectedCharacters);
            localStorage.setItem('selectedCharacterPairs', JSON.stringify(storedSelections));
            loadStoredCharacterPairs();
          }
        }
      }, [selectedCharacters]);

      function isSamePair(pair1 : any, pair2 : any) {
        return (pair1[0].idName === pair2[0].idName && pair1[1].idName === pair2[1].idName) ||
               (pair1[0].idName === pair2[1].idName && pair1[1].idName === pair2[0].idName);
      }


    const fetchData = async () => {
        try {
        const data = {
            rule:{
                strength: {
                    min: filterValues.strength[0],
                    max: filterValues.strength[1]
                },
                speed: {
                    min: filterValues.speed[0],
                    max: filterValues.speed[1]
                },
                skill: {
                    min: filterValues.skill[0],
                    max: filterValues.skill[1]
                },
                fear_factor: {
                    min: filterValues.fear_factor[0],
                    max: filterValues.fear_factor[1]
                },
                power: {
                    min: filterValues.power[0],
                    max: filterValues.power[1]
                },
                intelligence: {
                    min: filterValues.intelligence[0],
                    max: filterValues.intelligence[1]
                },
                wealth: {
                    min: filterValues.wealth[0],
                    max: filterValues.wealth[1]
                }
            }
        }
        apiReqs.getCharacters({
            data: data,
            method:'post',
            success: (res) => {

                setCharactersData(res);
                console.log('charactersData',charactersData)
                resetSelectedCharacters();
              },
        })
            

            
        } catch (error) {
            console.log(error)
        }
    };




    const handleSliderChange = (value: number[], filterName: keyof FilterValues) => {
    setFilterValues(prevValues => ({
        ...prevValues,
        [filterName]: value,
    }));
    };
    const handleApply = () => {
        fetchData(); // Call fetchData when apply is clicked
      };
    
      const handleReset = () => {
        form.resetFields(); // Reset Ant Form
        setFilterValues(initValues); // Reset filterValues state
        resetSelectedCharacters();
      };

      function getImageUrl(imageUrl : string) {
        if (!imageUrl) {
          return 'src/assets/images/unknown.png'; 
        }
        return imageUrl.startsWith('http') ? imageUrl : `src/assets/${imageUrl}`;
      }

      const loadStoredCharacterPairs = () => {
        const storedSelections = JSON.parse(localStorage.getItem('selectedCharacterPairs') || '[]');
        setStoredCharacterPairs(storedSelections);
      };
      const showCompare = (pair: any) => {
        setSelectedCharacters(pair);
      }


  return (
    <>
        <Row className='filter-table-container'>
            
            <Card title="Filters" className='filters-card' style={{ margin:30, width:'25vw', height:370}}>
                    <Form form={form} >
                        {Object.entries(filterValues).map(([filterName, value]) => (
                        <Form.Item key={filterName} label={filterName} labelAlign='left' labelCol={{style:{width: '120px'}}}  className='fliters-item'>
                            <Slider
                            range
                            value={value}
                            onChange={(val: number[]) => handleSliderChange(val, filterName as keyof FilterValues)}
                            />
                        </Form.Item>
                        ))}
                    </Form>
                    <div className='apply-characters'>
                        <Button onClick={handleApply}>apply</Button>
                        <Button onClick={handleReset}>reset</Button>
                    </div>
                </Card>
            <CharactersTable charactersData={charactersData} onSelectedKeysChange={handleSelectedKeys} selectedCharacters={selectedCharacters} refresh={fetchData}></CharactersTable>
            <Card title="Previous" className='previous-card' style={{ margin:30, width:'25vw', height:370, overflow:'auto'}}>
                <List>
                {storedCharacterPairs.map((pair: any, index: number) => (
                    <List.Item key={index} >
                    <a onClick={() => showCompare(pair)}> 
                        {pair[0].name} vs {pair[1].name}
                    </a>
                    </List.Item>
                ))}


                </List>
                
                </Card>      
        </Row>
        <div className='avatar-container'>     
            <div className='avatar-container-item'>
                <h1 className='ava-name'>{selectedCharacters[0]?selectedCharacters[0].name : 'Unknown'}</h1>
                <Avatar className='avatar'  src={getImageUrl(selectedCharacters[0]?.image_url)} size={200} />
            </div>
            <div className='avatar-container-item'>
                <h1 className='ava-name'>{selectedCharacters[1]?selectedCharacters[1].name : 'Unknown'}</h1>
                <Avatar className='avatar'  src={getImageUrl(selectedCharacters[1]?.image_url)} size={200} />
            </div>
        </div>
        <div className='compare-table-container'>
            <CompareTable className='compare-table-container' charactersData={selectedCharacters}></CompareTable>
        </div>
       
    </>

   
    
    
        

        

        
        
   
      
  );
};
  
  export default DataDisplay;