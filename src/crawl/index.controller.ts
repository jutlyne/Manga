import { collections } from '..';
import { Request, Response } from 'express';
import CrawlService from './crawl.service';

export class Crawl {
  async login(req: Request, res: Response) {
    res.json(req.body);
  }

  async scrape(req: Request, res: Response) {
    const dataRes = [];
    const defaultPageUrl = process.env.CRAWL_DOMAIN;

    if (!defaultPageUrl) {
      return res.json('Domain required!');
    }

    try {
      for await (let url of CrawlService.crawlListMangas(defaultPageUrl)) {
        let manga = await CrawlService.scrapeManga(url);
        dataRes.push(manga);
      }

      const result = await collections.manga?.insertMany(dataRes);

      result
        ? res.status(201).json(dataRes)
        : res.status(500).json('Failed to create a new manga.');
    } catch (error: any) {
      console.error(error);
      res.status(400).send(error?.message);
    }
	}
}
