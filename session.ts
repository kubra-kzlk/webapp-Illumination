//sessies gebruiken om gb ingelogd te houden ,user obj bijhouden
import mongoDbSession from "connect-mongodb-session";//de sessie data bijhouden in n mongodb db.
import { uri } from "./database";
import session, { MemoryStore } from "express-session";//package n sessie aangemaakt vr elke client die server bezoekt
import { User } from "./types";

const mongoDBStore = mongoDbSession(session);
const mongoStore = new mongoDBStore({//externe db die sessiegegevens opslt, mongodb gebruiken als session store
  uri: uri,
  collection: "sessions",
  databaseName: "db_lamps"
})

declare module 'express-session' {
  export interface SessionData {
    user?: User;
  }//kunnen we data opslaan in de sessie door de req.session object te gebruiken:
}  //req.session.username = "JohnDoe";

export default session({
  secret: process.env.SESSION_SECRET ?? "my-super-secret-secret", //de sessie te beveiligen
  store: mongoStore,//object dat de sessie data opslaat
  resave: true, // bepaalt of de sessie opnieuw w opgeslagen als er gn veranderingen zn. standaardwrde = true
  saveUninitialized: true, //bepaalt of de sessie mt w opgeslagen als er gn data in zit. De standaardwaarde is true.
  cookie: { //bplt hoelang de sessie geldig is.
    maxAge: 1000 * 60 * 60 * 24 * 7, //sessie 1 week geldig.
  }
});
