import app from './App';
import * as mongoDB from "mongodb";
import { connectToDatabase } from './connect/database';

const port = process.env.PORT || 3001;

connectToDatabase()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        return console.log(err)
      }

      return console.log(`server is listening on ${port}`)
    })
  })

export const collections: { manga?: mongoDB.Collection } = {}
