import express, { Express } from 'express';
import { Lamp, Fabrikant } from './types';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from "path";
import { createInitialUser } from "./database"
// import session from "./session"; //D4
import { loginRouter } from "./routes/loginRouter";
import { homeRouter } from "./routes/homeRouter";
import { registerRouter } from "./routes/registerRouter";
import { flashMiddleware } from "./flashMiddleware";//D4


//D3: 
export const uri = process.env.MONGO_URI ?? 'mongodb+srv://flowerpowerrr33:flowerpower@webontw.xhfyyfc.mongodb.net/';
export const client = new MongoClient(uri);

const app: Express = express();// Get the default connection

dotenv.config(); // D4 Load environment variables from .env file
app.set('view engine', 'ejs'); // EJS als view engine, Set the view engine for the app
app.use(express.json());// Parse JSON bodies for this app
app.use(express.urlencoded({ extended: true }));// Parse URL-encoded bodies for this app
app.use(express.static('public', { extensions: ['html'] }));// Serve static files from the 'public' directory. tell express to serve the content of public dir, the express.static middleware is used to serve static files from the public directory. The middleware should be added before any other routes or middleware.
// app.use(session);//D4
app.set('views', path.join(__dirname, 'views'));// Set the views directory for the app
app.set('port', 3000);// Set the port for the app
app.use(loginRouter());//D4
app.use(homeRouter());//D4
app.use(registerRouter());//D4
app.use(flashMiddleware);//D4
             
// Parse JSON data
let lampsData: Lamp[] = [];
let fabricsData: Fabrikant[] = [];

//D4: middlew alleen aan index route tvgn
// app.get('/', secureMiddleware, async (req, res) => {

//   res.render("index");
//   //checken of gb is ingelogd of nt
//   //PROBLEEM: vr elke route controleren of gb is ingelogd => veel werk, foutgevoelig ==> OPL: middleware: contro of gb is ingelogd
// //   if (req.session.user) {
// //     res.render("index", {user: req.session.user});
// // } else {
// //     res.redirect("/login");
// // }
// })

app.get('/lamps', async (req, res) => {
  //zoekbalk producten
  const searchQuery =
    typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
  let filteredLamps = lampsData;

  if (searchQuery) {
    filteredLamps = lampsData.filter(lamp =>
      lamp.naam.toLowerCase().includes(searchQuery)
    );
  }

  //sorteer gedeelte
  const sortField =
    typeof req.query.sortField === 'string' ? req.query.sortField : 'naam';
  const sortDirection =
    typeof req.query.sortDirection === 'string'
      ? req.query.sortDirection
      : 'asc';

  let sortedLamps = [...filteredLamps].sort((a, b) => {
    if (sortField === 'naam') {
      return sortDirection === 'asc'
        ? a.naam.localeCompare(b.naam)
        : b.naam.localeCompare(a.naam);
    } else if (sortField === 'prijs') {
      return sortDirection === 'asc' ? a.prijs - b.prijs : b.prijs - a.prijs;
    } else if (sortField === 'id') {
      return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
    } else if (sortField === 'kleur') {
      return sortDirection === 'asc'
        ? a.kleur.localeCompare(b.kleur)
        : b.kleur.localeCompare(a.kleur);
    } else if (sortField === 'actief') {
      return sortDirection === 'asc'
        ? Number(a.actief) - Number(b.actief)
        : Number(b.actief) - Number(a.actief);
    } else {
      return 0;
    }
  });

  const sortFields = [
    {
      value: 'naam',
      text: 'Naam',
      selected: sortField === 'naam' ? 'selected' : '',
    },
    {
      value: 'prijs',
      text: 'Prijs',
      selected: sortField === 'prijs' ? 'selected' : '',
    },
    {
      value: 'id',
      text: 'Id',
      selected: sortField === 'id' ? 'selected' : '',
    },
    {
      value: 'kleur',
      text: 'Kleur',
      selected: sortField === 'kleur' ? 'selected' : '',
    },
    {
      value: 'actief',
      text: 'Actief',
      selected: sortField === 'actief' ? 'selected' : '',
    },
  ];

  const sortDirections = [
    {
      value: 'asc',
      text: 'Ascending',
      selected: sortDirection === 'asc' ? 'selected' : '',
    },
    {
      value: 'desc',
      text: 'Descending',
      selected: sortDirection === 'desc' ? 'selected' : '',
    },
  ];

  res.render('lamps', {
    lamps: sortedLamps,
    sortFields: sortFields,
    sortDirections: sortDirections,
    sortField: sortField,
    sortDirection: sortDirection,
    searchQuery,
    page:'lamps'
  });
});

app.get('/lampDetail/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const lamp = lampsData.find(l => l.id === id);
  if (lamp) {
    res.render('lampDetail', {
      lamp: lamp,
      page:'lampDetail'
    });
  } else {
    res.status(404).send('Geen lamp gevonden')
  }
});

app.get('/fabrics', async (req, res) => {
  res.render('fabrics', {
    fabrics: fabricsData,
    page:'fabrics'
  });
});

app.get('/fabricDetail/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const fabric = fabricsData.find(f => f.id === id);
  if (fabric) {
    res.render('fabricDetail', {
      fabric: fabric,
      page:'fabricDetail'
    });
  } else {
    res.status(404).send('Geen lamp gevonden')
  }
});

app.get('/lampEdit/:id', async (req, res) => {
  const id: number = parseInt(req.params.id);
  const lamp = lampsData.find(l => l.id === id);
  if (lamp) {
    res.render('lampEdit', {
      lamp: lamp,
      page:'lampEdit'
    });
  } else {
    res.status(404).send('geen lamp gevonden')
  }
});

app.post('/lampEdit/:id', async (req, res) => {
  const lamp = lampsData.find(l => l.id === parseInt(req.params.id));
  if (lamp) {
    let actief: string = req.body.actief;
    let prijs: number = req.body.prijs;
    let kleur: string = req.body.kleur;
    let beschrijving: string = req.body.beschrijving;

    await client
      .db('db_lamps')
      .collection('Lamps')
      .updateOne(
        { id: lamp.id },
        {
          $set: {

            actief: actief === "ja" ? true : false,
            prijs: prijs,
            kleur: kleur,
            beschrijving: beschrijving,
          },
        }
      );
    lampsData = await client
      .db('db_lamps')
      .collection('Lamps')
      .find<Lamp>({})
      .toArray();
    res.redirect(`/lampEdit/${lamp.id}`);
  } else {
    res.status(404).send('Lamp niet gevonden');
    //PROBLEEM: vr elke route controleren of gb is ingelogd => veel werk, foutgevoelig ==> OPL: middleware: contro of gb is ingelogd');
  }
});

//D3: sluit connectie wnnr app stopt
async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

//D3 DB MongoDB: connectie met db opzetten
async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas from index.ts!');
    const db = client.db("db_lamps");
    process.on("SIGINT",exit);
    //D4: nieuwe gb enkel tvgn wnnr er nog geen gb in db zitten
    await createInitialUser(); 
    console.log('nieuwe gb aangemaakt');

    //controleren of collectie leeg is of nt
    //PROBLEEM: vr elke route controleren of gb is ingelogd => veel werk, foutgevoelig ==> OPL: middleware: contro of gb is ingelogd
    const lampsCheck = await db.collection("Lamps").findOne({});
    const fabrikantCheck = await db.collection("Fabrikant").findOne({});

    if (!lampsCheck) {
      //D3 Data naar MongoDB schrijven
      //fetch from API
      //Zorg ervoor dat je alle data dat je via de fetch API ophaalt in MongoDB naar mongoDB schrijft. Kijk bij de opstart van de applicatie altijd eerst of er data in de database zit. Als er geen data in de database zit, dan moet je de data ophalen via de fetch API en in de database schrijven. Als er data inzit gebruik je de data die afkomstig is uit de MongoDB database.
      const lampResponse = await fetch('https://raw.githubusercontent.com/kubra-kzlk/lamps/main/lamps.json');
      const lampsdata = await lampResponse.json();
      lampsData.push(...lampsdata);

      await db.collection("Lamps").insertMany(lampsdata); //json van github nr mongodb schrijven
    }
    if (!fabrikantCheck) {
      const fabrikantResponse = await fetch('https://raw.githubusercontent.com/kubra-kzlk/lamps/main/fabrikant.json');
      const fabrikantdata = await fabrikantResponse.json();
      fabricsData.push(...fabrikantdata);
      //objecten nr db toevoegen
      await db.collection("Fabrikant").insertMany(fabrikantdata);
    }
    //D3 Data ophalen uit MongoDB: Zorg ervoor dat alle endpoints worden aangepast zodat de data uit de MongoDB database wordt gehaald ipv de data die je via de fetch API ophaalt.
    //fetch from db
    lampsData = await db.collection("Lamps").find<Lamp>({}).toArray();
    fabricsData = await db.collection("Fabrikant").find<Fabrikant>({}).toArray();

  } catch (error) {
    console.error(error);
  }
}

//start server
app.listen(app.get('port'), async () => {
  try{
    await connect();
    console.log('Server started on http://localhost:' + app.get('port'));
  }catch(e){
    console.log(e);
        process.exit(1); //app stopt wnr er error is, app kan nt zndr db con dus server mag nt blijven draaien wnnr er error is
  } 
});
