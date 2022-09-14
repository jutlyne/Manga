import session from 'express-session';
import connectRedis from 'connect-redis';
import { createClient } from 'redis';
import { Application } from 'express';

export default async (server: Application) => {
  const redisName: string = process.env.REDIS_STORE_NAME || 'session';
  const redisStoreSecret: any = process.env.REDIS_STORE_SECRET;
  const redisStoreHost: any = process.env.REDIS_STORE_HOST;
  const redisStorePort: any = process.env.REDIS_STORE_PORT || 6379;
  const redisStoreTtl: any = process.env.REDIS_STORE_TTL || 260;
  const redisStore = await connectRedis(session);
  const client  = createClient({ name: redisName, legacyMode: true });

  await client.connect()
    .then(() => {
      // Session data is stored server-redis-side
      server.use(
        session({
          store: new redisStore({
            host: redisStoreHost,
            port: redisStorePort,
            ttl: redisStoreTtl
          }),
          secret: redisStoreSecret,
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: false,  // if true only transmit cookie over https
            httpOnly: false, // if true prevent client side JS from reading the cookie
            maxAge: 1000 * 60 * 10, // session max age in milliseconds
          },
        })
      )
    })
    .catch(() => {
      // Session data is stored server-side
      server.use(
        session({
          secret: redisStoreSecret,
          resave: false,
          saveUninitialized: false,
        })
      );
    });
}
