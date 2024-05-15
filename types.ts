import { ObjectId } from "mongodb";

//Mk n apart bstnd aan wrin je de i. defi vr de data die je hebt aangmkt.
//Zorg ervr dat alle i. zn geexpo zdt je ze kan gebruiken in andere bestanden.
export interface Lamp {
  _id?: ObjectId;
  id: number;
  naam: string;
  beschrijving: string;
  prijs: number;
  actief: boolean;
  datum: string;
  foto: string;
  kleur: string;
  stijlen: string[];
  fabrikant: Fabrikant;
}

export interface Fabrikant {
  _id?: ObjectId;
  id: number;
  foto: string;
  naam: string;
  adres: string;
  telefoon: string;
  website: string;
}

export interface User {
  _id?: ObjectId;
  email: string;
  password?: string;
  role: "ADMIN" | "USER";
}