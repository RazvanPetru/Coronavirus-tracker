const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const axios = require("axios");
const moment = require("moment");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(
  bodyparser.urlencoded({
    extended: false
  })
);

app.use("/public", express.static("public"));

var baseURL = "http://api.coronastatistics.live/all";
var countryURL = "http://api.coronastatistics.live/countries?sort={data.cases}";
var recoveredURL =
  "http://api.coronastatistics.live/countries?sort={parameter}";
var deathsURL = "http://api.coronastatistics.live/countries?sort={cases}";
var casesURL = "http://api.coronastatistics.live/countries?sort={cases}";

app.get("/", (req, res) => {
  axios
    .all([
      axios.get(baseURL),
      axios.get(countryURL),
      axios.get(recoveredURL),
      axios.get(deathsURL),
      axios.get(casesURL)
    ])
    .then(
      axios.spread((corona, countries, recovered, deaths, cases) => {
        var corona = corona.data;
        var countries = countries.data.map(ctr => ctr.country);
        var recovered = recovered.data.map(i => i.recovered);
        var deaths = deaths.data.map(d => d.deaths);
        var cases = cases.data.map(c => c.cases);

        countries.sort((a, b) => a - b);

        res.render("index", {
          corona: corona,
          countries: countries,
          recovered: recovered,
          deaths: deaths,
          cases: cases,
          moment: moment
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
