import express, { Express } from 'express';
import { Lamp } from './interface';
import { Fabrikant } from './interface';

//import { connectToDatabase } from './database';

const app: Express = express();

app.set('view engine', 'ejs'); // EJS als view engine
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); //tell express to serve the content of public dir, the express.static middleware is used to serve static files from the public directory. The middleware should be added before any other routes or middleware.
app.use(express.static('public', { extensions: ['html'] }));
app.set('port', 3000);

// Parse JSON data
let lampsData: Lamp[] = [];
let fabricsData: Fabrikant[] = [];

app.get('/', async (req, res) => {
  res.render('index');
});

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
  });
});

app.get('/lampDetail/:id', async (req, res) => {
  const id = req.params.id;
  const lamp = lampsData.find(lamp => lamp.id === parseInt(id));
  res.render('lampDetail', {
    lampDetails: lamp,
  });
});

app.get('/fabrics', async (req, res) => {
  res.render('fabrics', {
    fabrics: fabricsData,
  });
});

app.get('/lampDetail', async (req, res) => {
  res.render('lampDetail', {
    lampDetails: lampsData,
  });
});

app.get('/fabricDetail', async (req, res) => {
  res.render('fabricDetail', {
    fabrics: fabricsData,
  });
});

// Database // MongoDB

/*async function main() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB Atlas from index.ts!');

    // Perform your database operations here (if needed in index.ts)
  } catch (error) {
    console.error(error);
  }
}*/

//start server
app.listen(app.get('port'), async () => {
  const lampResponse = await fetch(
    'https://raw.githubusercontent.com/kubra-kzlk/lamps/main/lamps.json'
  );
  const data = await lampResponse.json();
  data.forEach((lamp: Lamp) => {
    lampsData.push(lamp);
  });

  const fabricResponse = await fetch(
    'https://raw.githubusercontent.com/kubra-kzlk/lamps/main/fabrikant.json'
  );
  const fabricdata = await fabricResponse.json();
  fabricdata.forEach((fabric: Fabrikant) => {
    fabricsData.push(fabric);
  });

  console.log('[server] http://localhost:' + app.get('port'));
});
