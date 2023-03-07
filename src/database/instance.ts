import  { MongoClient } from 'mongodb';

require('dotenv').config();

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${user}:${password}@cluster0.amzseaz.mongodb.net/?retryWrites=true&w=majority`;

const client:MongoClient = new MongoClient(uri);

async function connectdb() {
  try {
    await client.connect();
    await  client.db("admin").command({ping: 1});
    console.log('Connected successfully to server');
  } catch (err) {
    console.log('Connected to server refused/failed')
  } finally {
    client.close();
  }
  
  // MongoClient.connect(`mongodb+srv://${user}:${password}@cluster0.amzseaz.mongodb.net/?retryWrites=true&w=majority`)
  //   .then( client => {
  //     dbConnection = client.db(process.env.DB_NAME);
  //     console.log("connection ok");
  //     return callback;
  //   })
  //   .catch( error => {
  //     console.log(error);
  //     return callback(error);
  //   });
}

connectdb();

export default client.db(process.env.DB_NAME);
