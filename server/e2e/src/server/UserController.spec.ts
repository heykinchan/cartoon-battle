import axios from 'axios';

import { deleteUserByEmail } from '../../../src/models/user';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

describe('POST /api/users/registerUser', () => {
  it('should respond with a greeting message and a timestamp', async () => {
    const response = await axios.post(`http://${host}:${port}/api/users/registerUser`,
    {
        "email":"test123@uni.sydney.edu.au",
        "name":"test user",
        "password":"password"
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
    expect(response.data).toHaveProperty('user');

    // delete the user
    deleteUserByEmail("test123@uni.sydney.edu.au");
    
  });
});