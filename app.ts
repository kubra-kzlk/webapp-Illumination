import axios from "axios";
import * as readline from "readline-sync";
import { Lamp } from "./types";

const sunPattern: string[] = [
  "      *       ",
  "     ***     ",
  "    *****    ",
  "   *******   ",
  "  *********  ",
  " *********** ",
  "  *********  ",
  "   *******   ",
  "    *****    ",
  "     ***     ",
  "      *       ",
];

let logo = () => {
  console.log(sunPattern);
};

const api = async (): Promise<Lamp[]> => {
  try {
    const response = await axios.get(
      "https://kubra-kzlk.github.io/lamps/lamps.json"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const showAllLamps = async () => {
  const lamps = await api();

  lamps.forEach((lamp) => {
    console.log(`${lamp.naam} (ID: ${lamp.id})`);
  });
};

const filterById = async () => {
  const lamps = await api();
  let filterId: number = readline.questionInt(
    `Please enter the ID you want to filter by: `
  );
  const filteredLamp = lamps.find((lamp) => lamp.id === filterId);
  if (filteredLamp) {
    console.log(filteredLamp);
  } else {
    console.log(`Lamp with ID ${filterId} not found`);
  }
};
console.log();

//mk n console app aan die de data uit je json inlst en wrgft in de cons. zrg rvr dat je adhv n menu
//de gb de mog gft om de data te filteren op n id. als de gb n id ingft die nt bstt in de data, gf n gepaste melding.
const application = async () => {
  logo();
  let exit: boolean = false;
  console.log(`welcome to the JSON data viewer!`);

  while (!exit) {
    let option: number = readline.questionInt(
      `1. View all data \t 2. Filter by ID \t 3. Exit \t Please enter your choice: `
    );
    console.log();
    switch (option) {
      case 1:
        await showAllLamps();
        break;
      case 2:
        await filterById();
        break;
      case 3:
        exit = true;
        break;
      default:
        console.log("invalid option.");
        break;
    }
  }
};
application();
