import React, { useEffect, useState } from 'react';
import { List} from 'antd';
import './comparisonHistory.css';

const ComparisonHistory: React.FunctionComponent = () => {
        
    const [storedCharacterPairs, setStoredCharacterPairs] = useState<any[]>([]);
    useEffect(() => {
        loadStoredCharacterPairs();
    }, []);


    const loadStoredCharacterPairs = () => {
        const storedSelections = JSON.parse(localStorage.getItem('selectedCharacterPairs') || '[]');
        setStoredCharacterPairs(storedSelections);
    };
    return(

        <div>
            <List className='profile-compare-history'>
                {storedCharacterPairs.map((pair: any, index: number) => (
                    <List.Item key={index} className="profile-compare-history-item">
                    <a > 
                        {pair[0].name} 
                    </a>
                    <a > 
                        vs 
                    </a>
                    <a > 
                         {pair[1].name}
                    </a>
                    </List.Item>
                ))}


                </List>
            
        </div>
    )

        
}

export default ComparisonHistory;