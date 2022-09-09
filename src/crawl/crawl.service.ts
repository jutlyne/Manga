import cheerio from 'cheerio';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { imgurClient } from '../config';
import { collections } from '..';
import { AlbumData } from 'imgur/lib/common/types';

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

class CrawlService {
  async *crawlListMangas(url: string) {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const links = $('.ModuleContent .items .item').get();

    for (let link of links) {
      const href: any = $(link).find('figure.clearfix .image a').attr('href');
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
    const imageUrl: any = $('.detail-info .col-image img').attr('src');
    const albumHash: any = await this.findOrCreateAlbumImgur('list-manga');
    const image = await this.scrapeImage(imageUrl, url, albumHash);

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

  protected async scrapeImage(url: string, baseUrl: string, album: string) {
		const imageUrl = new URL(url, baseUrl).toString();
		const imagePath = await this.uploadFileImgur(imageUrl, 'manga', album);

		return imagePath;
	}

  protected async uploadFileImgur(url: string, dir: string, album: string) {
    const filePath = path.join(dir, path.basename(url));

    const response = await imgurClient.upload({
      image: url,
      album: album,
      type: 'stream',
      title: 'manga',
      description: filePath
    });

    return response?.data.link;
  }

  protected async findOrCreateAlbumImgur(title: string) {
    try {
      const query = {title};
      const albumImgur: any = await collections?.albumImgur?.findOne(query);

      if (albumImgur) {
        return albumImgur?.deletehash;
      }

      const newAlbumImgur = await imgurClient.createAlbum(title);
      const result = await collections?.albumImgur?.insertOne(newAlbumImgur?.data as AlbumData);

      if (result) {
        return newAlbumImgur?.data?.deletehash;
      }

    } catch (error: any) {
      console.error(error);

      return error?.message
    }
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

export default new CrawlService();
