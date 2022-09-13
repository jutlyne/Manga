import { ImgurClient } from 'imgur';

const imgurClient = new ImgurClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

export { imgurClient };
