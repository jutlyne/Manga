import { Request, Response } from "express";
import { mutipleMongooseToOject } from "../util";
import { collections } from '..';
import { Manga } from "src/database";

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
    const manga = (await collections?.manga?.find({}).toArray()) as any;

    return res.render('home', {
      manga: manga
    })
  }
}
