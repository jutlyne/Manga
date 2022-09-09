import routes from './App';
import * as http from 'http';
import express from 'express';
import * as mongoDB from 'mongodb';
import cors from 'cors';
import { corsOptions, redisSession } from './config';
import { connectToDatabase } from './database';
import passport from 'passport';
import * as authentication from './app/authenticate';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  async config(): Promise<void> {
    const port = process.env.PORT || 3000;

    // config redis session
    await redisSession(this.app);

    // config passport
    this.app.use(passport.initialize())
    this.app.use(passport.session())

    this.app.set('port', port);
    this.app.use(cors(corsOptions));

    // config body parse using express
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // add route
    routes(this.app);

    // init passport
    authentication.initPassport();
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

export const collections: { manga?: mongoDB.Collection, albumImgur?: mongoDB.Collection } = {}
