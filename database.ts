import { Collection, MongoClient } from "mongodb";
import { Fabrikant, Lamp, User } from "./types";
import * as bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const uri = process.env.MONGO_URI ?? 'mongodb+srv://flowerpowerrr33:flowerpower@webontw.xhfyyfc.mongodb.net/';
export const client = new MongoClient(uri);

export const userCollection: Collection<User> = client.db("db_lamps").collection<User>("Users");
export const lampsCollection: Collection<Lamp> = client.db("db_lamps").collection<Lamp>("Lamps");
export const fabricsCollection: Collection<Fabrikant> = client.db("db_lamps").collection<Fabrikant>("Fabrikant");

export async function updateLampById(id:number,actief:string,prijs:number,kleur:string,beschrijving:string){
    return await lampsCollection.updateOne({id:id},{$set: {actief: actief === "ja" ? true : false,prijs:prijs,kleur:kleur,beschrijving:beschrijving}});
}
export async function findLampById(id: number) {
    return await lampsCollection.findOne({ id })
}
export async function findLampByName(name: string) {
    return await lampsCollection.findOne({ name })
}
export async function findFabricById(id: number) {
    return await fabricsCollection.findOne({ id })
}
export async function findUserByEmail(email: string) {
    return await userCollection.findOne({ email: email })
}
//D4: f zkt gb in db met gegeven email. 
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
//De admin gb heeft een ADMIN role, user een USER role.
export async function createInitialUser() {
    if (await userCollection.countDocuments() > 0) {
        return;
    }
    let email: string | undefined = process.env.ADMIN_EMAIL;
    let password: string | undefined = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({
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
}
export async function getAllFabricss() {
    return await fabricsCollection.find().toArray();
}
export async function loadDataToDb() {
    //controleren of collectie leeg is of nt
    // const lampsCheck = await db.collection("Lamps").findOne({});
    // const fabrikantCheck = await db.collection("Fabrikant").findOne({});
    const lamps: Lamp[] = await getAllLamps();
    const fabrics: Fabrikant[] = await getAllFabricss();
    //D3 Data naar MongoDB schrijven
    //fetch from API
    //Zorg ervoor dat je alle data dat je via de fetch API ophaalt in MongoDB naar mongoDB schrijft. Kijk bij de opstart van de applicatie altijd eerst of er data in de database zit. Als er geen data in de database zit, dan moet je de data ophalen via de fetch API en in de database schrijven. Als er data inzit gebruik je de data die afkomstig is uit de MongoDB database.
    if (lamps.length === 0) {
        console.log('db van lamps is leeg, alle data inladen');
        const response = await (await fetch("https://raw.githubusercontent.com/kubra-kzlk/lamps/main/lamps.json")).json() as Lamp[];
        await lampsCollection.insertMany(response)
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
        await client.connect();
        console.log('Connected to MongoDB Atlas from index.ts!');
        const db = client.db("db_lamps");
        process.on("SIGINT", exit);
        //D4: nieuwe gb enkel tvgn wnnr er nog geen gb in db zitten
        await createInitialUser();
        console.log('nieuwe gb aangemaakt');
        await loadDataToDb();

    } catch (error) {
        console.error('er is een error bij het inloggen: ' + error);
    }
}