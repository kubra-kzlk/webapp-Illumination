import { Collection, MongoClient } from "mongodb"; //mongodb package: toelaat te connecteren op n MongoDB server en db calls uit te voeren
import { Fabrikant, Lamp, User } from "./types";
import * as bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
                //connectie string (in .env)    ophalen in je code met process.env...
export const uri = process.env.MONGO_URI ?? 'mongodb+srv://flowerpowerrr33:flowerpower@webontw.xhfyyfc.mongodb.net/';
export const client = new MongoClient(uri);//nieuwe MongoClient aan met deze connectie string
//10 11 12: connection to a MongoDB collection
export const userCollection: Collection<User> = client.db("db_lamps").collection<User>("Users");
export const lampsCollection: Collection<Lamp> = client.db("db_lamps").collection<Lamp>("Lamps");
export const fabricsCollection: Collection<Fabrikant> = client.db("db_lamps").collection<Fabrikant>("Fabrikant");

export async function updateLampById(id:number,actief:string,prijs:number,kleur:string,beschrijving:string){
    return await lampsCollection.updateOne({id:id},{$set: {actief: actief === "ja" ? true : false,prijs:prijs,kleur:kleur,beschrijving:beschrijving}});
}   //om n doc te updaten. n filter meegeven om h doc te selec dat je wil updaten en n obj met de nieuwe waarden
export async function findLampById(id: number) {
    return await lampsCollection.findOne({ id })
}           //findOne geeft ons 1 element terug, nl. het 1e element dat matcht met de query:
export async function findLampByName(name: string) {
    return await lampsCollection.findOne({ name })
}
export async function findFabricById(id: number) {
    return await fabricsCollection.findOne({ id })
}
export async function findUserByEmail(email: string) {
    return await userCollection.findOne({ email: email })
}
//D4: f zkt gb in db met gegeven email.gevonden, w h w8w gecontr met de gegeven w8w.
//w8w correct:gb w gereturned. nt gevndn/w8w onjst:error gegooid. bcrypt.compare functie om h w8w te controleren.*/
export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("E-mailadres en wachtwoord verplicht");
    }
    let user: User | null = await findUserByEmail(email);
    if (user) {
        if (user.password && await bcrypt.compare(password, user.password)) {
            return user;
        } else {
            throw new Error("wachtwoord onjuist");
        }
    } else {
        throw new Error("gebruiker niet gevonden");
    }
}

//D4 Bij h opstarten vd app voeg je 2 gb: admin + user. w8w opslaan met bcrypt. 
export async function createInitialUser() {
    if (await userCollection.countDocuments() > 0) {
        return;
    }
    let email: string | undefined = process.env.ADMIN_EMAIL;
    let password: string | undefined = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({ //tvgn v 1 element aan db aan col user, krgt auto _id
        email: email,
        password: await bcrypt.hash(password, 10), //10 x hashen
        role: "ADMIN"
    });
}

export async function register(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("E-mailadres and wachtwoord zijn nodig");
    }
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("deze E-mailadres bestaat al");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
        email: email,
        password: hashedPassword,
        role: "USER"
    };
    const result = await userCollection.insertOne(newUser);
    return result.insertedId;
}

export async function getAllLamps() {
    return await lampsCollection.find().toArray();          
} //find(): meerdere objecten willen ophalen.find gft nt n rsl trg, mr n cursor. 
  //Je kan dit cursor obj gebruiken om de rsl op te halen, dr toArray() te gebruiken (gft promise terug)
export async function getAllFabricss() {
    return await fabricsCollection.find().toArray();
}
export async function loadDataToDb() {
    const lamps: Lamp[] = await getAllLamps();
    const fabrics: Fabrikant[] = await getAllFabricss();
    //D3 Data nr MongoDB schrijven: fetch from API
    //alle data dat je via de fetch API ophaalt in MongoDB nr mongoDB schrijft.it. 
    if (lamps.length === 0) {//zit er al data in db: dan gbrk je de data uit de mongodb db
        console.log('db van lamps is leeg, alle data inladen');
        const response = await (await fetch("https://raw.githubusercontent.com/kubra-kzlk/lamps/main/lamps.json")).json() as Lamp[];
        await lampsCollection.insertMany(response)//insertmany: versch el tvgn aan db
    }
    if (fabrics.length === 0) {
        console.log('db van fabrics leef, alle data inladen');
        const response = await (await fetch("https://raw.githubusercontent.com/kubra-kzlk/lamps/main/fabrikant.json")).json() as Fabrikant[];
        await fabricsCollection.insertMany(response);
    }
    return;    
   }

//D3: sluit connectie wnnr app stopt
async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

//D3 DB MongoDB: connectie met db opzetten
export async function connect() {
    try {
        await client.connect(); //Connect to the MongoDB cluster
        console.log('Connected to MongoDB Atlas from index.ts!');
        const db = client.db("db_lamps");
        process.on("SIGINT", exit); //gebruiken de process.on methode om n event listener toe te voegen vr SIGINT event. 
        //Dit event w getriggerd als je CTRL+C drukt in de terminal. 
        //D4: nieuwe gb enkel tvgn wnnr er nog geen gb in db zitten
        await createInitialUser();
        console.log('nieuwe gb aangemaakt');
        await loadDataToDb();

    } catch (error) {
        console.error('er is een error bij het inloggen: ' + error);
    }
}