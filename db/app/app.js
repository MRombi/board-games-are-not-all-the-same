const express = require("express");
const {getCategories}  = require("./controllers/categories.c");
const app = express();

app.use(express.json())

app.get("/api/categories", getCategories);

app.use("*", (req, res) => {
  res.status(404).send({ message: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Something went wrong, sorry :(" });
});

module.exports = app;