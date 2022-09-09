import { Router, Request, Response } from 'express';
import { Crawl } from '../crawl/index.controller';
import multer from 'multer';
import { login as validationLogin } from '../validator';
import passport from 'passport';

export default class apiRoutes {
  public router: Router;

  private controller: Crawl = new Crawl();
  private formData = multer();

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.get('/', this.controller.scrape);
    this.router.post(
      '/login',
      this.formData.none(),
      validationLogin,
      passport.authenticate('local'), (req: Request, res: Response) => {
        res.json(req.user)
      }
    );
  }
}
