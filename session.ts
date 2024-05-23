/* sessies gebruiken om gb ingelogd te houden */
//user obj bijhouden
import mongoDbSession, { MongoDBStore }from "connect-mongodb-session";
import { uri } from "./index";
import session, { MemoryStore, Store } from "express-session";
import { User,FlashMessage } from "./types";

const mongoDBStore = mongoDbSession(session);

const mongoStore = new mongoDBStore({
    uri: uri,
    collection: "sessions",
    databaseName: "db_lamps"
})

mongoStore.on('error', function(error) {
    console.error('SESSION STORE ERROR:', error);
  });

declare module 'express-session'{
    export interface SessionData{
        message?: { type: string, message: string };
        user?: User,
    }
}

// export default session({
//     secret : process.env.SESSION_SECRET ?? "mijn geheim",
//     store: mongoStore,
//     resave : true,
//     saveUninitialized : true,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
//     }
// })
export interface SessionData {
    user?: User;
    message?: FlashMessage;
    //is n bericht dat we mr 1 x willen tonen, en dan verwijderen
}