import routes from './App';
import * as http from 'http';
import * as express from 'express';
import * as mongoDB from 'mongodb';
import { connectToDatabase } from './connect/database';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  public config(): void {
    const port = process.env.PORT || 3001;

    this.app.set('port', port);
    this.app.use(express.json());
    routes(this.app)
  }

  public start(): void {
    connectToDatabase()
      .then(() => {
        const server = http.createServer(this.app);

        server.listen(this.app.get('port'), () => {
          console.log('Server listening in port 3000');
        });
      })
  }
}

const server = new Server();
server.start();

export const collections: { manga?: mongoDB.Collection } = {}
