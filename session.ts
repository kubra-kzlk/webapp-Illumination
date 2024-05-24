/* sessies gebruiken om gb ingelogd te houden */
//user obj bijhouden
import mongoDbSession from "connect-mongodb-session";
import { uri } from "./index";
import session, { MemoryStore } from "express-session";
import { User } from "./types";

const mongoDBStore = mongoDbSession(session);

const mongoStore = new mongoDBStore({
    uri: uri,
    collection: "sessions",
    databaseName: "db_lamps"
})


declare module 'express-session' {
    export interface SessionData {
      user?: User;
      message?: { type: string, message: string };
    }
  }
export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});