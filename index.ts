import express, { } from 'express'; //index.tx = express.js app
import { Lamp, Fabrikant } from './types';
import dotenv from 'dotenv';
import { checkLogin, secureMiddleware } from './secureMiddleware';
import { loginRouter } from "./routes/loginRouter";
import { registerRouter } from "./routes/registerRouter";
import session from "./session";
import { connect, findLampById, findFabricById,findLampByName, updateLampById, getAllLamps, getAllFabricss } from './database';
dotenv.config();//D4 Load environment variables from .env file
const app = express();// Get the default connection
let lampsData: Lamp[] = [];
let fabricsData: Fabrikant[] = [];

//view engine setup ==> niet aanraken
app.set("view engine", "ejs"); // EJS als view engine
app.set("port", process.env.PORT || 3000);

app.use(express.static('public'));// Serve static files from the 'public' directory. tell express to serve the content of public dir, the express.static middleware is used to serve static files from the public directory. The middleware should be added before any other routes or middleware.
app.use(express.json());// Parse JSON bodies for this app
app.use(express.urlencoded({ extended: true }));// Parse URL-encoded bodies for this app
app.use(session); //eigen session middleware toe aan de Express applicatie

//routering
app.use(loginRouter());//D4
app.use(registerRouter());//D4

app.get("/", secureMiddleware, async (req, res) => {
  if (req.session.user) {
    //zoekbalk producten obv naam 
    const searchQuery = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    let lampslatest: Lamp[] = await getAllLamps();
    let filteredLamps = lampslatest;

    if (searchQuery) {
      filteredLamps = lampslatest.filter(lamp =>
        lamp.naam.toLowerCase().includes(searchQuery)
      );
    }

    //sorteer gedeelte met mongodb (zie db)
    const sortField = typeof req.query.sortField === 'string' ? req.query.sortField : 'naam';
    const sortDirection = typeof req.query.sortDirection === 'string' ? req.query.sortDirection : 'asc';

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
    console.log("Lamps data: ", sortedLamps);

    res.render('index', {
      user: req.session.user,
      lamps: sortedLamps,
      sortFields: sortFields,
      sortDirections: sortDirections,
      sortField: sortField,
      sortDirection: sortDirection,
      searchQuery,
      page: 'index'
    });
  }
  else {
    res.redirect("/");
  }
});

app.get('/lampDetail/:id',secureMiddleware, async (req, res) => {
  const lampName = req.query.name as string;
  const selectedLamp = await findLampByName(lampName);
  res.render('lampDetail', {
    lamp: selectedLamp,
    page: 'lampDetail'
  });

});

app.get('/fabrics', secureMiddleware,async (req, res) => {
  res.render('fabrics', {
    fabrics: fabricsData,
    lampData: lampsData,
    page: 'fabrics'
  });
});

app.get('/fabricDetail/:id', secureMiddleware,async (req, res) => {
  const id = parseInt(req.params.id);
  const fabric = await findFabricById(id);

  res.render('fabricDetail', {
    fabric: fabric,
    page: 'fabricDetail'
  });
});

//editpag
app.get('/:id',async (req, res) => {
  const id: number = parseInt(req.params.id);
  const lamp = await findLampById(id);
  if (!lamp) {
    res.status(404).send('geen lamp gevonden')
  } else {
    res.render('lampEdit', {
      lamp: lamp,
      page: 'lampEdit'
    });
  }
});

app.post('/lampEdit/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const lamp = await findLampById(id);
  if (!lamp) {
    return res.status(400).json({ message: "Lamp niet gevonden" });
  }

  let actief: string = req.body.actief;
  let prijs: number = req.body.prijs;
  let kleur: string = req.body.kleur;
  let beschrijving: string = req.body.beschrijving;
  await updateLampById(id, actief, prijs, kleur, beschrijving);
  res.redirect(`/`);
});

//start server
app.listen(app.get('port'), async () => {
  try {
    await connect();
    console.log("Server is running on port 3000");
    fabricsData = await getAllFabricss();
    lampsData = await getAllLamps();
    console.log('Server started on http://localhost:' + app.get('port'));
  } catch (e) {
    console.log(e);
    process.exit(1); //app stopt wnr er error is, app kan nt zndr db con dus server mag nt blijven draaien wnnr er error is
  }
});
