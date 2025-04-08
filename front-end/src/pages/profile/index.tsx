import {  Breadcrumb, Card ,Typography } from 'antd';
import FavoriteCharacters from '@/components/favoriteCharacters';
import ComparisonHistory from '@/components/comparisonHistory';
import ContributionStatus from '@/components/contributionStatus';
import { Link } from 'react-router-dom';
import './profile.css'


const { Title } = Typography;

const UserProfile = () => {
    return (
        <>
        <div className='profile-title-container'> 
                <h1>User Profile</h1>
        </div >
        <Breadcrumb style={{ margin: '16px 0px 16px 10px' }}>
            <Breadcrumb.Item><Link to="/home">Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item>User Profile</Breadcrumb.Item>
        </Breadcrumb>
        <div className="profile-layout-content">
        <Card className='profile-favourite-characters'>
            <Title level={4}>Favourite Characters</Title>
            <FavoriteCharacters />
        </Card>
        <Card className='profile-comparison-history'>
            <Title level={4}>Comparison History</Title>
            <ComparisonHistory />
        </Card>
        <Card className='profile-contribution-status'>

            <Title level={4}>Contribution Status</Title>
            <ContributionStatus />

        </Card>
        </div>
        </>

           
                
       
    );
};

export default UserProfile;