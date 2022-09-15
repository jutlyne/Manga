import path from 'path';
import cors from 'cors';
import routes from './App';
import express from 'express';
import passport from 'passport';
import { createServer } from 'http';
import { engine } from 'express-handlebars';
import { connectToDatabase } from './database';
import { corsOptions, redisSession } from './config';
import { Collection as mongoCollection } from 'mongodb';
import { initPassport, middleware } from './app/authenticate';

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

    // setting the view engine
    this.app.engine('.hbs', engine({
      extname: '.hbs',
      partialsDir: path.join(__dirname, 'resources/views/layouts/partials')
    }));
    this.app.set('view engine', '.hbs');
    // setting for the root path for views directory
    this.app.set('views', path.join(__dirname, 'resources/views'));

    // middleware user
    // const allowUrl: any = new Array('/home');
    // this.app.use(middleware(allowUrl));

    // add route
    routes(this.app);

    // init passport
    initPassport();
  }

  public start(): void {
    connectToDatabase()
      .then(() => {
        const server = createServer(this.app);

        server.listen(this.app.get('port'), () => {
          console.log('Server listening in port 3000');
        });
      })
  }
}

const server = new Server();
server.start();

export const collections: { manga?: mongoCollection, albumImgur?: mongoCollection } = {}
