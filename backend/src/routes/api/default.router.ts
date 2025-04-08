import express from 'express';

export const defaultRouter = express.Router();

defaultRouter.get('/', (req, res) => {
  res.send({ message: 'hello world!',timeStamp: new Date().toISOString()});
});
