const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(
  bodyparser.urlencoded({
    extended: false
  })
);

app.use("/public", express.static("public"));

var baseURL = "https://covid19.mathdro.id/api";
var countryURL = "https://covid19.mathdro.id/api/countries";
var countryDetail = `https://covid19.mathdro.id/api/countries/ROMANIA`;

app.get("/", (req, res) => {
  axios
    .all([axios.get(baseURL), axios.get(countryURL), axios.get(countryDetail)])
    .then(
      axios.spread((corona, countries, detail) => {
        console.log(corona.data);
        var corona = corona.data;
        var countries = countries.data.countries.map(item => item.name);
        var detailCountry = detail.data;
        console.log(detail);

        res.render("index", {
          corona: corona,
          countries: countries,
          detailCountry: detailCountry
        });
      })
    )
    .catch(error => {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
