import { collections } from "..";
import CrawlService from "./crawl.service";

interface Manga {
	name: string;
	updatedAt: string;
	status?: string;
	author?: string;
	categories?: object;
	views?: string;
	image?: string;
	content?: string;
	totalVotes?: string;
	rate?: string;
}

export class Crawl {
  async scrape(req, res) {
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

      const result = await collections.manga.insertMany(dataRes);

      result
          ? res.status(201).json(dataRes)
          : res.status(500).send('Failed to create a new manga.');
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
	}
}
