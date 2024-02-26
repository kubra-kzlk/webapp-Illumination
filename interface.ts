//Mk n apart bstnd aan wrin je de i. defi vr de data die je hebt aangmkt.
//Zorg ervr dat alle i. zn geexp zdt je ze kan gebruiken in andere bestanden.
export interface lamps {
  id: number;
  name: string;
  description: string;
  price: number;
  active: boolean;
  date: string;
  product_image: string;
  color: string;
  style: string[];
  factory: {
    id: number;
    name: string;
    address: string;
    telefone: number;
    website: string;
  };
}
