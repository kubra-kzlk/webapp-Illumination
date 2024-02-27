//Mk n apart bstnd aan wrin je de i. defi vr de data die je hebt aangmkt.
//Zorg ervr dat alle i. zn geexp zdt je ze kan gebruiken in andere bestanden.
export interface lamps {
  id: number;
  naam: string;
  beschrijving: string;
  prijs: number;
  actief: boolean;
  datum: string;
  foto: string;
  kleur: string;
  stijlen: string[];
  fabrikant: {
    id: number;
    naam: string;
    adres: string;
    telefoon: number;
    website: string;
  };
}
