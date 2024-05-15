import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
import { User } from "./types";
import bcrypt from "bcrypt";
import {client} from "./index";

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await client.db("db_lamps").collection("Lamps").findOne<User>({email: email});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}
async function createInitialUser() {
    if (await client.db("db_lamps").collection("Users").countDocuments() > 0) {
        return;
    }
    let email : string | undefined = process.env.ADMIN_EMAIL;
    let password : string | undefined = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await client.db("db_lamps").collection("Users").insertOne({
        email: email,
        password: await bcrypt.hash(password, 10), //10 x hashen
        role: "ADMIN"
    });
}