import { Lamp, Fabrikant } from './types';
import dotenv from "dotenv";
import { Collection, MongoClient } from "mongodb";
dotenv.config();

export const uri =
  'mongodb+srv://flowerpowerrr33:flowerpower@webontw.xhfyyfc.mongodb.net/'; //verander username en wachtwoord
export const client = new MongoClient(uri);
export const collection : Collection<Lamp> = client.db("db").collection<Lamp>("lamp");

export async function getGuestBookEntries() {
    return await collection.find({}).sort({id: -1}).toArray();
}

export async function createLamp(l: Lamp) {
    await collection.insertOne(l);
}

// Database MongoDB
async function connect() {
    try {
      await client.connect();
      console.log('Connected to MongoDB Atlas from index.ts!');
      const db = client.db("db_lamps");
      //controleren of collectie leeg is of niet
      const lampsCheck = await db.collection("Lamps").findOne({});
      const fabrikantCheck = await db.collection("Fabrikant").findOne({});
  
      if (!lampsCheck) {
        //deel 3: Data naar MongoDB schrijven
        //fetch from API
        //Zorg ervoor dat je alle data dat je via de fetch API ophaalt in MongoDB naar mongoDB schrijft. Kijk bij de opstart van de applicatie altijd eerst of er data in de database zit. Als er geen data in de database zit, dan moet je de data ophalen via de fetch API en in de database schrijven. Als er data inzit gebruik je de data die afkomstig is uit de MongoDB database.
        const lampResponse = await fetch('https://raw.githubusercontent.com/kubra-kzlk/lamps/main/lamps.json');
        const lampsdata = await lampResponse.json();
        lampsData.push(...lampsdata);
  
        await db.collection("Lamps").insertMany(lampsdata); //json van github nr mongodb schrijven
      }
      if (!fabrikantCheck) {
        const fabrikantResponse = await fetch('https://raw.githubusercontent.com/kubra-kzlk/lamps/main/fabrikant.json');
        const fabrikantdata = await fabrikantResponse.json();
        fabricsData.push(...fabrikantdata);
        //objecten nr db toevoegen
        await db.collection("Fabrikant").insertMany(fabrikantdata);
      }
      //deel 3:Data ophalen uit MongoDB
      //Zorg ervoor dat alle endpoints worden aangepast zodat de data uit de MongoDB database wordt gehaald ipv de data die je via de fetch API ophaalt.
      //fetch from db
      lampsData = await db.collection("Lamps").find<Lamp>({}).toArray();
      fabricsData = await db.collection("Fabrikant").find<Fabrikant>({}).toArray();
  
   
  
    } catch (error) {
      console.error(error);
    }
  }