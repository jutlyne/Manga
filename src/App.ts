import 'dotenv/config'
import * as express from 'express';
import cheerio from 'cheerio';
import axios from 'axios';

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

class App {
  public express;

  readonly defaultPageUrl = process.env.CRAWL_DOMAIN;

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router();
    const arr = [];
    router.get('/', async (req, res) => {
      for await (let url of this.crawlListMangas(this.defaultPageUrl)) {
        let a = await this.scrapeManga(url);
        arr.push(a);
      }
      res.json(arr);
    })
    this.express.use('/', router)
  }

  async *crawlListMangas(url: string) {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const links = $('.ModuleContent .items .item').get();

    for (let link of links) {
      const href = $(link).find('figure.clearfix .image a').attr('href');
      const mangaPageUrl = new URL(href, url).toString();

      if (mangaPageUrl) {
        yield mangaPageUrl;
      }
    }
  }

  async scrapeManga(url: string) {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const mangaName = $('h1.title-detail').text();
    const updatedAt = $('#item-detail time.small').text();
    const status = $('.list-info .status p').text();
    const author = $('.list-info .author p').text();
    const views = $('.list-info li:last-child p.col-xs-8').text();
    const image = $('.detail-info .col-image img').attr('src');
    const content = $('.detail-content .shortened').text();
    const totalVotes = $('.col-info .mrt5 span span:last-child').text();
    const rate = $('.col-info .mrt5 span span:first-child').text();
    // const categories = $('.list-info .kind p').get();
    const manga: Manga = {
      name: mangaName,
      updatedAt,
      status,
      author,
      views,
      image: image.slice(2),
      content,
      totalVotes,
      rate
    }

    return manga;
  }
}

export default new App().express
