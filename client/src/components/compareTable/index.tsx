import React from 'react';
import { Table } from 'antd';
import './compareTable.css'; 

interface DataType {
    id: string;
    idName: string;
    active: boolean;
    name: string;
    subtitle: string;
    description: string;
    image_url: string;
    strength: number;
    speed: number;
    skill: number;
    fear_factor: number;
    power: number;
    intelligence: number;
    wealth: number;
    [key: string]: number | string | boolean;
}

interface TableRowData {
    key: string;
    label: string;
    character1: number | string | boolean;
    character2: number | string | boolean;
    winner: string;
}

const CompareTable: React.FC<{ charactersData: DataType[] }> = ({ charactersData }) => {
    if (charactersData.length !== 2) {
        return <div></div>;
    }

    const results = {
        character1Wins: 0,
        character2Wins: 0,
        attributesResult: {} as Record<string, string>,
    };

    const attributes = ['strength', 'speed', 'skill', 'fear_factor', 'power', 'intelligence', 'wealth'];

    attributes.forEach(attribute => {
        if (charactersData[0][attribute] > charactersData[1][attribute]) {
            results.character1Wins++;
            results.attributesResult[attribute] = 'Character 1';
        } else if (charactersData[0][attribute] < charactersData[1][attribute]) {
            results.character2Wins++;
            results.attributesResult[attribute] = 'Character 2';
        } else {
            results.attributesResult[attribute] = 'Tie';
        }
    });

    const columns = [
        
        { 
  
            dataIndex: 'character1', 
            key: 'character1', 
            render: (value: number, record: TableRowData) => (
                record.winner === 'Character 1' ? `✔` : ''
            )
        },
        {  dataIndex: 'label', key: 'label' },
        { 
             
            dataIndex: 'character2', 
            key: 'character2', 
            render: (value: number, record: TableRowData) => (
                record.winner === 'Character 2' ? ` ✔` : ''
            )
        },
    ];

    const data = attributes.map(attr => ({
        key: attr,
        label: attr.charAt(0).toUpperCase() + attr.slice(1),
        character1: charactersData[0][attr],
        character2: charactersData[1][attr],
        winner: results.attributesResult[attr],
    }));

    const overallWinnerClass = results.character1Wins > results.character2Wins ? 'winner1' : (results.character1Wins < results.character2Wins ? 'winner2' : '');

    return (
        <div className={`compare-table-container ${overallWinnerClass}`}>
            <Table columns={columns} dataSource={data} pagination={false} showHeader={false} />
        </div>
    );
};

export default CompareTable;
