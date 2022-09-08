import routes from './App';
import * as http from 'http';
import express from 'express';
import * as mongoDB from 'mongodb';
import cors from 'cors';
import { corsOptions } from './config/cors';
import { connectToDatabase } from './connect/database';
import passport from 'passport';
import session from 'express-session';
import connectRedis from 'connect-redis';
import * as authentication from './app/authenticate';
import * as redis from 'redis';

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  public config(): void {
    const port = process.env.PORT || 3000;
    const redisStoreSecret: any = process.env.REDIS_STORE_SECRET;
    const redisStoreHost: any = process.env.REDIS_STORE_HOST;
    const redisStorePort: any = process.env.REDIS_STORE_PORT || 6379;
    const redisStoreTtl: any = process.env.REDIS_STORE_TTL || 260;
    const redisStore = connectRedis(session);
    const client  = redis.createClient();

    this.app.use(session({
      store: new redisStore({
        host: redisStoreHost,
        port: redisStorePort,
        ttl: redisStoreTtl,
        client: client
      }),
      secret: redisStoreSecret,
      resave: false,
      saveUninitialized: false
    }))

    this.app.use(passport.initialize())
    this.app.use(passport.session())

    this.app.set('port', port);
    this.app.use(express.json());
    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({extended: true}));
    routes(this.app)
    authentication.init();
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
