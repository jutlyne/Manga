import 'dotenv/config'
import { Application } from 'express';
import apiRoutes from './routes/api';
import userRoutes from './routes/user';

const routes = (server:Application): void => {
  server.use('/api', new apiRoutes().router)
  server.use('/', new userRoutes().router)
}

export default routes
