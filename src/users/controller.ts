import bcrypt from 'bcrypt';
import { collections } from '..';
import { Manga, User } from 'src/database';
import { Request, Response } from 'express';

export class userController {
  async login(req: Request, res: Response) {
    const error = req.flash().error || [];

    res.render('auth/login', {
      layout: 'auth',
      error: error
    });
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect('/');
    });
  }

  async formRegister(req: Request, res: Response) {
    const error = req.flash().error || [];

    res.render('auth/register', {
      layout: 'auth',
      error: error,
    });
  }

  async register(req: Request, res: Response) {
    const query = { username: req.body?.username };

    const user = (await collections?.user?.findOne(query)) as User | undefined;

    if (user) {
      req.flash('error', 'User already exists!');

      return res.redirect('/register');
    }

    const saltRounds = 10;
    const myPlaintextPassword = req.body.password;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(myPlaintextPassword, salt);
    const newUser = {
      username: req.body?.username,
      password: passwordHash
    } as User;

    const result = await collections?.user?.insertOne(newUser);

    result
      ? res.redirect('/login')
      : res.redirect('/register')
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
