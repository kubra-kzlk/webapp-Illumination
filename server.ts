import express from "express";
import ejs from "ejs";

const app = express();

//tell express to serve the content of public dir
app.use(express.static("public"));

app.set("view engine", "ejs"); // EJS als view engine
app.set("port", 3000);

//default app route
app.get("/", (req, res) => {
  res.type("text/html");
  res.render("index"); //renderen: omzetten van EJS naar HTML
});

//start server
app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);
