import { ObjectId } from 'mongodb';

export default class Manga {
  constructor(
    public name: string,
    public status: number,
    public author: string,
    public views: string,
    public image: string,
    public content: string,
    public totalVotes: string,
    public rate: string,
    public updatedAt: string,
    public id?: ObjectId
  ) {

  }
}
