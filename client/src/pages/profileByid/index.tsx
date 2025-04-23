import {  Breadcrumb, Card ,Typography } from 'antd';
import OtherFavoriteCharacters from '@/components/otherFavoriteCharacyers';
import OtherContributionStatus from '@/components/otherContributionStatus';
import { Link } from 'react-router-dom';
import './profileByid.css'


const { Title } = Typography;

const OtherUserProfile = () => {
    return (
        <div>
        <Breadcrumb style={{ margin: ' 16px 0px 16px 10px' }}>
            <Breadcrumb.Item><Link to="/home">Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item>User Profile</Breadcrumb.Item>
        </Breadcrumb>
        <div className="profile-layout-content">
        <Card className='profile-favourite-characters'>
            <Title level={4}>Favourite Characters</Title>
            <OtherFavoriteCharacters />
        </Card>
        <Card className='profile-contribution-status'>

            <Title level={4}>Contribution Status</Title>
            <OtherContributionStatus />

        </Card>
        </div>
        </div>

           
                
       
    );
};

export default OtherUserProfile;