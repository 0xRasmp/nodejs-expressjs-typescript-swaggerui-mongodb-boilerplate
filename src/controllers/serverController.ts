import { Request, Response } from 'express';
import Item from '../models/itemModel';

// Controller to check if the server is running
export const getServerStatus = (req: Request, res: Response) => {
  res.send('Server is running!');
};
