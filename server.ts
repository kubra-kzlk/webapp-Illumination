import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import ejs from "ejs";
import { Lamp } from "./interface";
import { Fabrikant } from "./interface";
import path from "path";
//import lampsDataJson from "JSON/lamps.json";
//import fabricsDataJson from "./JSON/fabrikant.json";

const app: Express = express();

dotenv.config();

app.set("view engine", "ejs"); // EJS als view engine
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));  //tell express to serve the content of public dir
app.set('views', path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);


// Parse JSON data
const lampsData: Lamp[] = [];
const fabricsData: Fabrikant[] = [];

//als je / intypt dan word je nr de home pag verwezen
app.get("/", (req: Request, res: Response) => {
  res.render("index", {
    title: "Home",
    message: "Welcome !"
  });
});

app.get("/lamps", (req: Request, res: Response) => {
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

  res.render("lamps", {
    lamps: sortedLamps,
    sortFields: sortFields,
    sortDirections: sortDirections,
    sortField: sortField,
    sortDirection: sortDirection,
    searchQuery
  });
});

app.get("lamps/:id", (req: Request, res: Response) => {

  const lamp = lampsData.find((c: Lamp) => c.id.toString() === req.params.id);
  if (!lamp) {
    return res.status(404).send("lamp not found");
  }
  res.render("lampDetail", { lamp });
});

app.get("/fabrics", (req: Request, res: Response) => {
  //zoeken
  const searchQuery = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";
  const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "naam";
  const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
  let filteredData = fabricsData;

  let sortedFAbrics = [...lampsData].sort((a, b) => {
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
    filteredData = filteredData.filter((fabric) =>
      fabric.naam.toLowerCase().includes(searchQuery)
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

  res.render("fabrics", {
    fabrics: sortedFAbrics,
    sortFields: sortFields,
    sortDirections: sortDirections,
    sortField: sortField,
    sortDirection: sortDirection,
    searchQuery
  });
});

app.get("/fabrics/:id", async (req, res) => {
  const fabricId = parseInt(req.params.id);
  const fabric = fabricsData.find(fabric => fabric.id === fabricId);

  if (!fabric) {
    return res.status(404).send("Fabric not found");
  }

  const relatedLamps = lampsData.filter(lamp => lamp.id === fabricId);
  res.render("fabricDetail", { fabric, relatedLamps });
});

//start server
app.listen(app.get("port"), async () => {
  let response = await fetch(
    "https://raw.githubusercontent.com/kubra-kzlk/lamps/main/lamps.json"
  );
  console.log("[server] http://localhost:" + app.get("port"));
});
