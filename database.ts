const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://<username>:<wachtwoord>@wpl-project.1v5hog1.mongodb.net/'; //verander username en wachtwoord
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas!');
    // Perform your database operations here (e.g., insert, find, update, delete)
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err);
    throw err;
  }
}
