import { Request, Response } from "express";

export class userController {
  async login(req: Request, res: Response) {
    res.render('auth/login');
  }

  async homePage(req: Request, res: Response) {
    console.log(req);

    res.render('home', {
      sessionID: req.sessionID,
      sessionExpireTime: 12312312,
      // sessionExpireTime: new Date(req.session.cookie.expires) - new Date(),
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
    })
  }
}
