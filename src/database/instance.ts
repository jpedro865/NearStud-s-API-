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
    console.log('Connected successfully to Database');
  } catch (err) {
    console.log('Connection to Database refused/failed');
    console.log('Error de connection:\n', err);
  } finally {
    client.close();
  }
}

if (process.argv[2] === 'dbcheck') {
  connectdb();
}

const db = client.db(process.env.DB_NAME)

export { db, client };
