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
var countryURL = "http://api.coronastatistics.live/countries?sort={parameter}";
var recoveredURL =
  "http://api.coronastatistics.live/countries?sort={parameter}";
var deathsURL = "http://api.coronastatistics.live/countries?sort={parameter}";
var casesURL = "http://api.coronastatistics.live/countries?sort={parameter}";
var todayCases = "http://api.coronastatistics.live/countries?sort={parameter}";
var todayDeaths = "http://api.coronastatistics.live/countries?sort={parameter}";

app.get("/", (req, res) => {
  axios
    .all([
      axios.get(baseURL),
      axios.get(countryURL),
      axios.get(recoveredURL),
      axios.get(deathsURL),
      axios.get(casesURL),
      axios.get(todayCases),
      axios.get(todayDeaths)
    ])
    .then(
      axios.spread(
        (
          corona,
          countries,
          recovered,
          deaths,
          cases,
          todayCases,
          todayDeaths
        ) => {
          var corona = corona.data;
          var countries = countries.data.reverse().map(ctr => ctr.country);
          var recovered = recovered.data.reverse().map(i => i.recovered);
          var deaths = deaths.data.reverse().map(d => d.deaths);
          var cases = cases.data.reverse().map(c => c.cases);
          var tc = todayCases.data.reverse().map(tc => tc.todayCases);
          var td = todayDeaths.data.reverse().map(c => c.todayDeaths);

          res.render("index", {
            corona: corona,
            countries: countries,
            recovered: recovered,
            deaths: deaths,
            cases: cases,
            tc: tc,
            td: td,
            moment: moment
          });
        }
      )
    )
    .catch(error => {
      console.log(error);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
