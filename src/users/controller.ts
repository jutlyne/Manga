import { Request, Response } from 'express';
import { Manga } from 'src/database';
import { collections } from '..';

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
    // https://www.npmjs.com/package/mongoose-paginate-v2
    let perPage = 12;
    let page: any = req.query?.page;
    let currentPage = Math.max(0, page);
    let skipPage = perPage * currentPage;

    const manga = (
      await collections?.manga
        ?.find({})
        .limit(perPage)
        .skip(skipPage)
        .toArray()
    ) as Manga[];

    return res.render('home', {
      manga: manga
    })
  }
}
