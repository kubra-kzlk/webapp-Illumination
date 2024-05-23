import dotenv from "dotenv";

import { Collection, MongoClient } from "mongodb";
import { User } from "./types";
import bcrypt from "bcrypt";
import { client } from "./index";

dotenv.config();



//D4: f zkt gb in db met gegeven email. 
export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("E-mailadres en wachtwoord verplicht");
    }
    let user: User | null = await client.db("db_lamps").collection("Lamps").findOne<User>({ email: email });
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("wachtwoord onjuist");
        }
    } else {
        throw new Error("gebruiker niet gevonden"
        );
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
        throw new Error("Email and password required");
    }
    
    // const existingUser = await findUserByEmail(email);
    // if (existingUser) {
    //     throw new Error("User already exists");
    // }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser: User = {
        email: email,
        password: hashedPassword,
        role: "USER"
    };
    
    const result = await client.db("db_lamps").collection<User>("Users").insertOne(newUser);
    return result.insertedId;
}
