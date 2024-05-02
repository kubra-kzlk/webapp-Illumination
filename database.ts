import { Lamp, Fabrikant } from "./interface";
import { Collection, MongoClient, MongoClientOptions, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
export const uri =
  'mongodb+srv://flowerpowerrr33:flowerpower@webontw.xhfyyfc.mongodb.net/'; //verander username en wachtwoord
export const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");





async function loadLampsToDatabase() {
  let lamp = await lampCollection.find({}).toArray();
  if (lamp.length === 0) {
    console.log("Loading lamp to database");
    let lampList: Lamp[] = [];
    for (let i = 1; i < 11; i++) {
      let response = await fetch('https://raw.githubusercontent.com/kubra-kzlk/lamps/main/lamps.json' + i);
      let lamp: Lamp = await response.json();
      let lamp: Lamp = {
        id = lamp._id,
        naam = lamp.naam,
        beschrijving = lamp.beschrijving,
        prijs = lamp.prijs,
        actief = lamp.actief,
        datum = lamp.datum,
        foto = lamp.foto,
        kleur = lamp.kleur,
        stijlen = lamp.stijlen,
        fabrikant = lamp.fabrikant,
        
      };
    }
  }
  /*try {
    const database = client.db('webontwerp33');
    const lampsCollection = database.collection('lamps');
    const lamps = await lampsCollection.find().toArray();
    console.log('Lamps loaded to database');
    lampsData = lamps;
  } catch (error) {
    console.error(error);
  }*/
}

async function exit() {
  try {
    await client.close();
    await loadLampsToDatabase();
    console.log('Disconnected from database');
  } catch (error) {
    console.error(error);
  }
  process.exit(0);
}

export async function connectToDatabase() {
  try {
    await client.connect();
    await loadLampsToDatabase();
    await loadFabricsToDatabase();
    console.log('Connected to MongoDB Atlas!');
    process.on('SIGINT', exit);
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err);
    throw err;
  }
}
