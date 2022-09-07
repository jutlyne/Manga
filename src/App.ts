import 'dotenv/config'
import * as express from 'express';
import { collections } from '.';
import Crawl from './crawl/index.controller';
import Manga from './manga';

class App {
  public express;

  readonly defaultPageUrl = process.env.CRAWL_DOMAIN;

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes(): void {
    const router = express.Router();

    router.get('/', async (req: express.Request, res: express.Response) => {
      const dataRes = [];

      for await (let url of Crawl.crawlListMangas(this.defaultPageUrl)) {
        let manga = await Crawl.scrapeManga(url);

        dataRes.push(manga);
      }
      try {
        const result = await collections.manga.insertMany(dataRes);

        result
            ? res.status(201).send('Successfully created a new manga')
            : res.status(500).send('Failed to create a new manga.');
      } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
      }
    });
    this.express.use('/', router)
  }
}

export default new App().express
