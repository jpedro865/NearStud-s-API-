import  { MongoClient } from 'mongodb';
import env_vars from '../utils/environment';

const user = env_vars.DB_USER;
const password = env_vars.DB_PASSWORD;

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

const db = client.db(env_vars.DB_NAME)

export { db, client };
