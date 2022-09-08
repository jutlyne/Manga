import 'dotenv/config'
import * as express from 'express';
import apiRoutes from './routes/api';

const routes = (server:express.Application): void => {
  server.use('/api', new apiRoutes().router)
}

export default routes
