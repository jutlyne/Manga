import * as express from 'express';
import { Crawl } from '../crawl/index.controller';

export default class apiRoutes {
  public router: express.Router;

  private controller: Crawl = new Crawl();

  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.get('/', this.controller.scrape);
  }
}
