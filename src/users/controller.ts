import { Request, Response } from "express";

export class userController {
  async login(req: Request, res: Response) {
    res.render('auth/login');
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect('/');
    });
  }

  async homePage(req: Request, res: Response) {
    let dateNow: number = Number(new Date());
    let cookieExpresAt: any = req.session?.cookie?.expires || null;
    let dateCookieExpires: number = Number(new Date(cookieExpresAt));

    res.render('home', {
      sessionID: req.sessionID,
      sessionExpireTime: dateCookieExpires - dateNow,
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
    })
  }
}
