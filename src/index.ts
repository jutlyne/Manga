import routes from './App';
import * as http from 'http';
import express from 'express';
import * as mongoDB from 'mongodb';
import cors from 'cors';
import { corsOptions } from './config';
import { connectToDatabase } from './database';
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

  async config(): Promise<void> {
    const port = process.env.PORT || 3000;
    const redisName: string = process.env.REDIS_STORE_NAME || 'session';
    const redisStoreSecret: any = process.env.REDIS_STORE_SECRET;
    const redisStoreHost: any = process.env.REDIS_STORE_HOST;
    const redisStorePort: any = process.env.REDIS_STORE_PORT || 6379;
    const redisStoreTtl: any = process.env.REDIS_STORE_TTL || 260;
    const redisStore = connectRedis(session);
    const client  = redis.createClient({ name: redisName });

    await client.connect()
      .then(() => {
        // Session data is stored server-redis-side
        this.app.use(session({
          store: new redisStore({
            host: redisStoreHost,
            port: redisStorePort,
            ttl: redisStoreTtl,
            client: client
          }),
          secret: redisStoreSecret,
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: false,  // if true only transmit cookie over https
            httpOnly: false, // if true prevent client side JS from reading the cookie
            maxAge: 1000 * 60 * 10, // session max age in milliseconds
          },
        }))
      })
      .catch(() => {
        // Session data is stored server-side
        this.app.use(
          session({
            secret: redisStoreSecret,
            resave: false,
            saveUninitialized: false,
          })
        );
      });

    // config passport
    this.app.use(passport.initialize())
    this.app.use(passport.session())

    this.app.set('port', port);
    this.app.use(cors(corsOptions));

    // config body parse using express
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    routes(this.app)
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
