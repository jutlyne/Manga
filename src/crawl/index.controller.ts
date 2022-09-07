import cheerio from 'cheerio';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

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

class Crawl {
  readonly defaultPageUrl = process.env.CRAWL_DOMAIN;

  async scrape(req, res) {
    const dataRes = [];

		for await (let url of this.crawlListMangas(this.defaultPageUrl)) {
      let manga = await this.scrapeManga(url);
      dataRes.push(manga);
    }

    return res.json(dataRes);
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
    const content = $('.detail-content .shortened').text();
    const totalVotes = $('.col-info .mrt5 span span:last-child').text();
    const rate = $('.col-info .mrt5 span span:first-child').text();

    //crawl image and upload this
    const imageUrl = $('.detail-info .col-image img').attr('src');
    const image = await this.scrapeImage(imageUrl, url);
    // const categories = $('.list-info .kind p').get();
    const manga: Manga = {
      name: mangaName,
      updatedAt,
      status,
      author,
      views,
      image,
      content,
      totalVotes,
      rate
    }

    return manga;
  }

  protected async scrapeImage(url: string, baseUrl: string) {
		const imageUrl = new URL(url, baseUrl).toString();
		const imagePath = await this.downloadFile(imageUrl, 'image');

		return imagePath;
	}

	protected async downloadFile(url: string, dir: string) {
		const response = await axios.get(url, {
			responseType: 'arraybuffer'
		});

		fs.mkdirSync(dir, { recursive: true });

		const filePath = path.join(dir, path.basename(url));
		fs.writeFileSync(filePath, response.data);

		return filePath;
	}
}

export default new Crawl()
