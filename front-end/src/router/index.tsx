import { createHashRouter, Navigate} from 'react-router-dom'
import { ReactElement } from 'react';
import Signin from '@/pages/login';
import Signup from '@/pages/signup';
import Home from '@/pages/home';
import Admin from '@/pages/admin';
import UserProfile from '@/pages/profile'
import OtherUserProfile from '@/pages/profileByid';



type RouteObject = {
    path: string;
    element: ReactElement;
  };
  
  export const globalRouters = createHashRouter([
    {
        path: '/signin',
        element: <Signin />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/home',
        element: <Home />,
    },
    {
        path: '/profile',
        element: <UserProfile />,
    },
    {
        path: '/admin',
        element: <Admin />,
    },
    {
        path: '/profile/:id',
        element: <OtherUserProfile />,
    },
    {
        path: '*',
        element: <Navigate to="/signin" />,
    },
] as RouteObject[]);