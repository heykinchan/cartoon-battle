import axios from 'axios';

describe('GET /', () => {
  it('should respond with a greeting message and a timestamp', async () => {
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    const response = await axios.get(`http://${host}:${port}/`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('message', 'hello world!');
    expect(response.data).toHaveProperty('timeStamp');
  });
});