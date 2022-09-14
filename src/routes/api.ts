import { Router, Request, Response } from 'express';
import { Crawl } from '../crawl/index.controller';

export default class apiRoutes {
  public router: Router;

  private controller: Crawl = new Crawl();

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.get('/', this.controller.scrape);
  }
}
