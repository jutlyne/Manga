import 'dotenv/config'
import * as express from 'express';
import Crawl from './crawl/index.controller';

class App {
  public express;

  readonly defaultPageUrl = process.env.CRAWL_DOMAIN;

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes(): void {
    const router = express.Router();
    const dataRes = [];
    router.get('/', async (req: express.Request, res: express.Response) => {
      for await (let url of Crawl.crawlListMangas(this.defaultPageUrl)) {
        let manga = await Crawl.scrapeManga(url);
        dataRes.push(manga);
      }
      res.json(dataRes);
    });

    this.express.use('/', router)
  }
}

export default new App().express
