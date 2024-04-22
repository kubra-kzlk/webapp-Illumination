import express, { Express } from "express";
import { Lamp } from "./interface";
import { Fabrikant } from "./interface";

const app: Express = express();

app.set("view engine", "ejs"); // EJS als view engine
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));  //tell express to serve the content of public dir
app.set("views", __dirname + "/views");
app.set("port", process.env.PORT || 3000);


// Parse JSON data
let lampsData: Lamp[] = [];
let fabricsData: Fabrikant[] = [];


app.get("/", (req, res) => {
  //zoeken
  const searchQuery = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";
  const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "naam";
  const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
  let filteredLamps = lampsData;

  let sortedLamps = [...lampsData].sort((a, b) => {
    if (sortField === "naam") {
      return sortDirection === "asc"
        ? a.naam.localeCompare(b.naam)
        : b.naam.localeCompare(a.naam);
    } else if (sortField === "prijs") {
      return sortDirection === "asc" ? a.prijs - b.prijs : b.prijs - a.prijs;
    } else if (sortField === "id") {
      return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
    } else if (sortField === "kleur") {
      return sortDirection === "asc"
        ? a.kleur.localeCompare(b.kleur)
        : b.kleur.localeCompare(a.kleur);
    } else if (sortField === "actief") {
      return sortDirection === "asc"
        ? Number(a.actief) - Number(b.actief)
        : Number(b.actief) - Number(a.actief);
    }
    else {
      return 0;
    }
  });

  if (searchQuery) {
    filteredLamps = filteredLamps.filter((lamp) =>
      lamp.naam.toLowerCase().includes(searchQuery)
    );
  }
  const sortFields = [
    {
      value: "naam",
      text: "Naam",
      selected: sortField === "naam" ? "selected" : "",
    },
    {
      value: "prijs",
      text: "Prijs",
      selected: sortField === "prijs" ? "selected" : "",
    },
    {
      value: "id",
      text: "Id",
      selected: sortField === "id" ? "selected" : "",
    },
    {
      value: "kleur",
      text: "Kleur",
      selected: sortField === "kleur" ? "selected" : "",
    },
    {
      value: "actief",
      text: "Actief",
      selected: sortField === "actief" ? "selected" : "",
    }
  ];

  const sortDirections = [
    {
      value: "asc",
      text: "Ascending",
      selected: sortDirection === "asc" ? "selected" : "",
    },
    {
      value: "desc",
      text: "Descending",
      selected: sortDirection === "desc" ? "selected" : "",
    },
  ];

  res.render("index", {
    lamps: sortedLamps,
    sortFields: sortFields,
    sortDirections: sortDirections,
    sortField: sortField,
    sortDirection: sortDirection,
    searchQuery
  });
});

app.get('/fabrics', (req, res) => {
  res.render('fabrics');
});

//start server
app.listen(app.get("port"), async () => {
  let response = await fetch(
    "https://raw.githubusercontent.com/kubra-kzlk/lamps/main/lamps.json"
  );
  lampsData = await response.json();
  console.log("[server] http://localhost:" + app.get("port"));
});
