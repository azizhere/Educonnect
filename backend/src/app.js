const express = require("express");
const app = express();
const path = require("path");
const routes = require("./routes/index");

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Set pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Use routes
app.use("/", routes);

module.exports = app;
