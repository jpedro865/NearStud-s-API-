
async function authDatabase() {
  try {
    
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function migrate() {

}

async function migrateForce() {
}

if (process.argv[2] === 'dbcheck') {
  authDatabase();
} else if (process.argv[2] === '-f'){
  authDatabase();
  migrateForce();
} else {
  authDatabase();
  migrate();
}
