const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const ejs = require("ejs");

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(
  bodyparser.urlencoded({
    extended: false
  })
);

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  var baseURL = "https://covid19.mathdro.id/api";
  var countryURL = "https://covid19.mathdro.id/api/countries";
  request(baseURL, (error, response, body) => {
    var data = JSON.parse(body);
    var coronavirus = {
      confirmed: data.confirmed.value,
      recovered: data.recovered.value,
      deaths: data.deaths.value
    };

    var coronavirus_data = { coronavirus: coronavirus };
    res.render("index", coronavirus_data);
  });

  request(countryURL, (error, response, body) => {
    var data = JSON.parse(body);
    console.log(data.country);
    var countries = {
      country: data.countries
    };

    var countries_data = { countries: countries };
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
