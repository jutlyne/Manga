import { ObjectId } from 'mongodb';

export default class AlbumImgur {
  constructor(
    public title?: string,
    public description?: number,
    public deletehash?: string,
    public id?: ObjectId
  ) {

  }
}
