const express = require("express");
const app = express();
const path=require("path");
const routes = require("./routes");
const bodyParser = require("body-parser");

let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ecom", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection
  .once("open", () => {
    console.log("Connected to MongoDB database");
  })
  .on("error", err => {
    console.log(err);
  });

app.use(express.static(path.join(__dirname,"pages")));
app.use(routes);
app.use(bodyParser.json());

app.listen(80);
