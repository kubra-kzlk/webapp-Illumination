import { Collection, MongoClient } from "mongodb";
import { User } from "./types";
import * as bcrypt from "bcrypt";

export const uri = process.env.MONGO_URI ?? 'mongodb+srv://flowerpowerrr33:flowerpower@webontw.xhfyyfc.mongodb.net/';
export const client = new MongoClient(uri);
export const usersCollection = client.db("db_lamps").collection<User>("Users");

//D4: f zkt gb in db met gegeven email. 
export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("E-mailadres en wachtwoord verplicht");
    }
    let user: User | null = await usersCollection.findOne<User>({ email: email });
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
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
    if (await client.db("db_lamps").collection("Users").countDocuments() > 0) {
        return;
    }
    let email: string | undefined = process.env.ADMIN_EMAIL;
    let password: string | undefined = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await client.db("db_lamps").collection("Users").insertOne({
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
    const result = await usersCollection.insertOne(newUser);
    return result.insertedId;
}

export async function findUserByEmail(email: string): Promise<User | null> {
    return await client.db("db_lamps").collection<User>("Users").findOne({ email });
}